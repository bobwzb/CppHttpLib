#!/usr/bin/env bash

PROTO_MODIFIED=false
GRPC_STUB_MODIFIED=false

if git diff --cached --name-only |  grep --quiet '.*.proto'; then
    PROTO_MODIFIED=true
fi

if git diff --cached --name-only |  grep --quiet 'go/'; then
    GRPC_STUB_MODIFIED=true
fi

if [ "$PROTO_MODIFIED" = true ] && [ "$GRPC_STUB_MODIFIED" = false ]; then
    echo "Proto changed but grpc stub unchanged. Do you forget to compile pb?"
    exit 1
fi
