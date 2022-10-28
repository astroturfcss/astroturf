#!/usr/bin/env sh

# abort on errors
set -e

# build
yarn run build

# navigate into the build output directory
cd dist

# place .nojekyll to bypass Jekyll processing
echo > .nojekyll

mkdir -p introduction  && cp -R index.html "$_"
mkdir -p advanced  && cp -R index.html "$_"
mkdir -p tooling  && cp -R index.html "$_"
mkdir -p cross-file-dependencies  && cp -R index.html "$_"
mkdir -p setup  && cp -R index.html "$_"


# if you are deploying to a custom domain
# echo 'www.example.com' > CNAME

git init
git checkout -B main
git add -A
git commit -m 'deploy'

# if you are deploying to https://<USERNAME>.github.io
# git push -f git@github.com:<USERNAME>/<USERNAME>.github.io.git main

# if you are deploying to https://<USERNAME>.github.io/<REPO>
git push -f git@github.com:4Catalyzer/astroturf.git main:gh-pages

cd -