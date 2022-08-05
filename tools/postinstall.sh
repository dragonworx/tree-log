#!/usr/bin/env bash

if [ ! "$CI" == "true" ]; then
  printf "\n🔆 Installing Husky...\n"
  npm run setup:husky

  printf "\n✅ Install successfully.\n" 
  exit 0
fi

printf "CI Detected. Post install local tooling skipped."
printf "\Install successfully.\n" 
exit 0
