# ATProto firehose keyword watcher

Small Go CLI that connects to the Bluesky relay firehose and logs posts whose text matches keywords from a JSON file.
Created for testing project ideas with the ATProto protocol.

## Usage

```bash
go run . -keywords my.json
# or
just run my.json
```

Keywords file: JSON array of strings, e.g. `["keyword", "example.com"]`.

Matches are logged with Bluesky (`bsky.app`) and [PDSls](https://pdsls.dev) links.
