#!/usr/bin/env bash

error() {
   local sourcefile=$1
   local lineno=$2
   printf "Error: ${sourcefile}:${lineno}\n\n"
}

trap 'error "${BASH_SOURCE}" "${LINENO}"' ERR

PROTOC_VERSION="3.6"
GO_PACKAGE_PREFIX="gitlab.com/vectorup/asset-pb"
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PB_VERSION="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && git rev-parse --short HEAD)"
IS_CLEAN="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &&  git status -s )"

USAGE=$(cat <<'EOF'
Usage compile-go.sh [OUTPUT_DIR]

Compile gRPC protos and output go stub files to OUTPUT_DIR.
If OUTPUT_DIR is not set, the scripts compiles gRPC stub to $GOPATH/src.
EOF
)

if [ -z "$1" ] ; then
    if [ -z ${GOPATH} ]; then
        printf "GOPATH not set.\n\n"
        echo "${USAGE}"
        exit 0
    fi
    OUTPUT_DIR="${GOPATH}/src"
elif [ "$1" == "-h" ] || [ "$1" == "--help" ]; then
    echo ${USAGE}
    exit 0
else
    OUTPUT_DIR="$1"
fi


if [[ $(protoc --version | cut -f2 -d' ') != "${PROTOC_VERSION}"* ]]; then
    echo "could not find protoc ${PROTOC_VERSION}, is it installed + in PATH?"
    exit 255
fi

[[ -z "${IS_CLEAN}" ]] || echo -e "[WARNING] asset-pb directory is not clean."

for i in $(ls -1 $SCRIPT_DIR/protos); do
    protoc -I /usr/local/include -I $SCRIPT_DIR/protos $SCRIPT_DIR/protos/$i/*.proto \
    --go_out=plugins=grpc:"${OUTPUT_DIR}"
done

echo "Proto compile completed, updated to ${PB_VERSION}"
