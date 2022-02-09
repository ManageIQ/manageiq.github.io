#!/bin/bash

set -x

cd manageiq.org/dest

echo "www.manageiq.org" > CNAME

git config --global user.name "ManageIQ Bot"
git config --global user.email "noreply@manageiq.org"

git clone --bare --branch master --depth 5 https://x-access-token:${GITHUB_TOKEN}@github.com/ManageIQ/manageiq.github.io .git
git config core.bare false
git add -A

commit_message=$(
ruby << RUBY
  message =
    if ENV["PAYLOAD_PR_NUMBER"].to_s =~ /^(\d+)$/
      "#{ENV["PAYLOAD_REPOSITORY"]}##{\$1}"
    else
      "#{ENV["PAYLOAD_REPOSITORY"]}@#{ENV["PAYLOAD_SHA"]} (#{ENV["PAYLOAD_REF_NAME"]})"
    end

  puts message
RUBY
)

git commit -m "Deploy for ${commit_message}"
git push origin master
