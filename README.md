## Link to the API:

https://eyal-ncnews.herokuapp.com/api

## Project Info:

## Setup instruction:

## Creating the .env files:

In order to connect the database locally, after cloning the repo you must create 2 .env files.
The first file connects to the test data and should be named .env.test - inside this file you should copy the following line:

```
PGDATABASE=nc_news_test
```

The second file connects to the development data and should be named .env.development - inside this file you should copy the following line:

```
PGDATABASE=nc_news
```

## Node.js and Postgress mimimum verison required:
