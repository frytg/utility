package main

import (
	"bytes"
	"context"
	"encoding/json"
	"flag"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"strings"
	"syscall"
	"time"

	comatproto "github.com/bluesky-social/indigo/api/atproto"
	bsky "github.com/bluesky-social/indigo/api/bsky"
	"github.com/bluesky-social/indigo/atproto/repo"
	"github.com/bluesky-social/indigo/atproto/syntax"
	"github.com/bluesky-social/indigo/events"
	"github.com/bluesky-social/indigo/events/schedulers/sequential"
	lexutil "github.com/bluesky-social/indigo/lex/util"
	"github.com/gorilla/websocket"
)

const firehoseURL = "wss://relay1.us-east.bsky.network/xrpc/com.atproto.sync.subscribeRepos"

var watchWords []string

func main() {
	log.SetFlags(0)

	keywordsFile := flag.String("keywords", "", "path to JSON file containing an array of keywords (required)")
	flag.Parse()

	if *keywordsFile == "" {
		log.Fatal("missing required -keywords flag")
	}

	loaded, err := loadKeywords(*keywordsFile)
	if err != nil {
		log.Fatal(err)
	}
	watchWords = loaded

	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()

	for {
		if err := run(ctx); err != nil {
			if ctx.Err() != nil {
				log.Println("shutting down")
				return
			}
			log.Printf("firehose error: %v; reconnecting in 5s", err)
			select {
			case <-ctx.Done():
				return
			case <-time.After(5 * time.Second):
			}
		}
	}
}

func run(ctx context.Context) error {
	dialer := websocket.DefaultDialer
	con, _, err := dialer.DialContext(ctx, firehoseURL, http.Header{
		"User-Agent": []string{"utility-atproto-firehose/1.0"},
	})
	if err != nil {
		return fmt.Errorf("dial: %w", err)
	}
	defer con.Close()

	log.Printf("connected to %s", firehoseURL)
	log.Printf("watching for: %s", strings.Join(watchWords, ", "))

	rsc := &events.RepoStreamCallbacks{
		RepoCommit: func(evt *comatproto.SyncSubscribeRepos_Commit) error {
			return handleCommit(ctx, evt)
		},
	}

	sched := sequential.NewScheduler("word-filter", rsc.EventHandler)
	return events.HandleRepoStream(ctx, con, sched, nil)
}

func handleCommit(_ context.Context, evt *comatproto.SyncSubscribeRepos_Commit) error {
	if evt.TooBig || len(evt.Blocks) == 0 {
		return nil
	}

	_, rr, err := repo.LoadRepoFromCAR(context.Background(), bytes.NewReader(evt.Blocks))
	if err != nil {
		return nil
	}

	postCollection := syntax.NSID("app.bsky.feed.post")

	for _, op := range evt.Ops {
		if op.Action != "create" && op.Action != "update" {
			continue
		}

		collection, rkey, err := syntax.ParseRepoPath(op.Path)
		if err != nil || collection != postCollection {
			continue
		}

		recBytes, _, err := rr.GetRecordBytes(context.Background(), collection, rkey)
		if err != nil {
			continue
		}

		decoded, err := lexutil.CborDecodeValue(recBytes)
		if err != nil {
			continue
		}

		post, ok := decoded.(*bsky.FeedPost)
		if !ok || post.Text == "" {
			continue
		}

		// log.Printf("post: %s %s %s %s", post.CreatedAt, post.LexiconTypeID, evt.Repo, rkey)
		matched := matchingWords(post.Text)
		if len(matched) == 0 {
			continue
		}

		atURI := fmt.Sprintf("at://%s/%s/%s", evt.Repo, collection, rkey)
		log.Printf(
			"match %q bsky=%s pdsls=%s text=%q\n\n",
			matched,
			bskyPostURL(evt.Repo, rkey.String()),
			pdslsRecordURL(atURI),
			truncate(post.Text, 280),
		)
	}

	return nil
}

func matchingWords(text string) []string {
	lower := strings.ToLower(text)
	var matched []string
	for _, word := range watchWords {
		if strings.Contains(lower, strings.ToLower(word)) {
			matched = append(matched, word)
		}
	}
	return matched
}

func loadKeywords(path string) ([]string, error) {
	data, err := os.ReadFile(path)
	if err != nil {
		return nil, fmt.Errorf("read keywords file: %w", err)
	}

	var keywords []string
	if err := json.Unmarshal(data, &keywords); err != nil {
		return nil, fmt.Errorf("parse keywords file: %w", err)
	}
	if len(keywords) == 0 {
		return nil, fmt.Errorf("keywords file %q is empty", path)
	}

	return keywords, nil
}

func truncate(s string, max int) string {
	if len(s) <= max {
		return s
	}
	return s[:max] + "…"
}

func bskyPostURL(repoDID, rkey string) string {
	return fmt.Sprintf("https://bsky.app/profile/%s/post/%s", repoDID, rkey)
}

func pdslsRecordURL(atURI string) string {
	return "https://pdsls.dev/" + atURI
}
