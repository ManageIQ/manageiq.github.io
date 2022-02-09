#!/usr/bin/env ruby

message =
  if ENV["PAYLOAD_PR_NUMBER"].to_s =~ /^(\d+)$/
    "#{ENV["PAYLOAD_REPOSITORY"]}#{\$1}"
  else
    "#{ENV["PAYLOAD_REPOSITORY"]}@#{ENV["PAYLOAD_SHA"]} (#{ENV["PAYLOAD_REF"]})"
  end

puts "COMMIT_MESSAGE=\"#{message}\""
