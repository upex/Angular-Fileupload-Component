![screen shot 2018-09-18 at 1 14 23 am](https://user-images.githubusercontent.com/19906579/45649398-d3990500-bae8-11e8-8dcb-af34deaa4d15.png)

## Environment setup
In order to upload files into Digitalocean spaces, create a `.env` file in the project root directory with the following environment variables:
##### SPACES_ACCESS_KEY_ID = < SPACES ACCESS KEY ID >
##### SPACES_SECRET_ACCESS_KEY = < SPACES SECRET ACCESS KEY >
##### END_POINT = < SPACES END POINT>
##### BUCKET_NAME = < SPACES BUCKET NAME>


## Angular-Fileupload-Component
An Angular component to upload files anywhere.

The frontend is generated with Angular CLI. The backend is made from scratch. Whole stack in TypeScript.

## This project uses the following stack:

Express.js: backend framework

Angular 2+: frontend framework

Node.js: runtime environment

Other tools and technologies used:

Angular CLI: frontend scaffolding

Bootstrap: layout and styles

## Prerequisites

Install Node.js

Install Angular CLI: npm i -g @angular/cli

From project root folder install all the dependencies: npm i

Run
## Development mode
`npm run dev:` concurrently execute Angular build, TypeScript compiler and Express server.

A window will automatically open at localhost:4200. Angular and Express files are being watched. Any change automatically creates a new bundle, restart Express server and reload your browser.

## Production mode
`npm run prod:` run the project with a production bundle and AOT compilation listening at localhost:3000

Please open an issue if
you have any suggestion to improve this project
you noticed any problem or error

## To do

More tests

## Running frontend unit tests

Run ng test to execute the unit tests via Karma.

## Running frontend end-to-end tests
Run ng e2e to execute the end-to-end tests via Protractor. Before running the tests make sure you are serving the app via npm start.

## Running TSLint

Run ng lint (frontend) to execute the linter via TSLint.
