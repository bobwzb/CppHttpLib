#!/usr/bin/env bash
# compile all proto files and put the outputs under
# $(pwd)/vendor/
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

rm -rf vendor/asset_pb

for i in $(ls -1 $SCRIPT_DIR/protos); do
    protoc -I /usr/local/include -I $SCRIPT_DIR/protos $SCRIPT_DIR/protos/$i/*.proto  --objc_out=common_compile
done
echo "Proto compile completed"
