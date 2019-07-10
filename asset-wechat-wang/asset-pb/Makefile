.PHONY: fotmat check-style test

format:
	@find $(CURDIR) -mindepth 1 -maxdepth 1 -type d -not -name vendor -not -name .git -print0 | xargs -0 gofmt -s -w
	@find $(CURDIR) -maxdepth 1 -type f -name '*.go' -print0 | xargs -0 gofmt -s -w

test:
	@go test ./... -coverprofile cover.out.tmp
	@cat cover.out.tmp | grep -v "\.pb\.go" > cover.out
	@go tool cover -func cover.out

check-style:
	@golangci-lint run --disable-all -E gofmt ./...

lint:
	@golangci-lint run ./...
