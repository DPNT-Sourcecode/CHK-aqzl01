#!/usr/bin/env bash

set -x
set -e
set -u
set -o pipefail

SCRIPT_CURRENT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

CHALLENGE_ID=$1
NODEJS_TEST_REPORT_JSON_FILE="${SCRIPT_CURRENT_DIR}/coverage/coverage-summary.json"
NODEJS_CODE_COVERAGE_INFO="${SCRIPT_CURRENT_DIR}/coverage.tdl"

### Guard clause to check for invalid CHALLENGE_ID

if [[ ! -e "${SCRIPT_CURRENT_DIR}/lib/solutions/${CHALLENGE_ID}" ]]; then
   echo "" > ${NODEJS_CODE_COVERAGE_INFO}
   echo "The provided CHALLENGE_ID: '${CHALLENGE_ID}' isn't valid, aborting process..."
   exit 1
fi

( cd ${SCRIPT_CURRENT_DIR} && npm install && npm run coverage || true 1>&2 )

[ -e ${NODEJS_CODE_COVERAGE_INFO} ] && rm ${NODEJS_CODE_COVERAGE_INFO}

if [ -f "${NODEJS_TEST_REPORT_JSON_FILE}" ]; then
    cat ${NODEJS_TEST_REPORT_JSON_FILE}  |\
            jq "with_entries(select([.key] | contains([\"solutions/${CHALLENGE_ID}\"])))" |\
            jq 'reduce to_entries[].value.statements as $item ({"total": 0, "covered": 0}; { "total": (.total + $item.total), "covered": (.covered + $item.covered) })' |\
            jq 'if .total == 0 then 0 else .covered * 100 / .total end' |\
            jq 'floor' |\
            tee ${NODEJS_CODE_COVERAGE_INFO}
    exit 0
else
    echo "No coverage report was found"
    exit -1
fi
