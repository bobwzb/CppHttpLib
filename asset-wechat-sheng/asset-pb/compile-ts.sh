#!/usr/bin/env bash

error() {
   local sourcefile=$1
   local lineno=$2
   printf "Error: ${sourcefile}:${lineno}\n\n"
}

trap 'error "${BASH_SOURCE}" "${LINENO}"' ERR

TS_DEFAULT_OUTDIR=ts
PBTS_VERSION=
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PB_VERSION="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && git rev-parse --short HEAD)"

USAGE=$(cat <<'EOF'
Usage compile-ts.sh [OUTPUT_DIR]

Compile gRPC protos and output typescript stub files to OUTPUT_DIR.
EOF
)

if [ -z "$1" ] ; then
    OUTPUT_DIR="${SCRIPT_DIR}/${TS_DEFAULT_OUTDIR}"
elif [ "$1" == "-h" ] || [ "$1" == "--help" ]; then
    echo ${USAGE}
    exit 0
else
    OUTPUT_DIR="$1"
fi

OUTPUT_FILE="${OUTPUT_DIR}/asset.pb.js"
mkdir -p "${OUTPUT_DIR}"
pbjs --force-long -t static-module -w commonjs -p /usr/local/include -p $SCRIPT_DIR/protos $(find "${SCRIPT_DIR}/protos" -name '*.proto') -o "${OUTPUT_FILE}"
pbts -o "${OUTPUT_DIR}/asset.pb.d.ts" "${OUTPUT_FILE}"

echo "Proto compile completed, updated to ${PB_VERSION}"
