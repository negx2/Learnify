#!/bin/bash

set -e

bucketName=$(cat ../configs/aws_resources.json | grep -o '"s3_webiste_bucket_name": *"[^"]*"' | cut -d '"' -f 4)
appDirectory="../react-app"

cd "$appDirectory" || exit

npm test -- --watchAll=false --passWithNoTests || exit 1
npm run AWSbuild --prefix "$appDirectory" || exit 1

aws s3 sync "$appDirectory/public/" "s3://$bucketName" || exit 1
