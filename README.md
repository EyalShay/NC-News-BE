## Link to the API:

The link to the hosted API can be found [here](https://eyal-ncnews.herokuapp.com/api).

## Project Info:

This is a mock News API and was as Back-End project during the Northcoders Bootcamp. It serves as a Back-End API to the Front-End project that I did later on in the Bootcamp. The hosted Front-End project can be found [here](https://eyal-ncnews-project.netlify.app/) and the repo for it can be found [here](https://github.com/EyalShay/fe-news-project).

## Setup instruction:

You can clone this project to your local machine e.g:

```sh
git clone https://github.com/EyalShay/BE-News-Project.git
```

You will need to install all the dependencies e.g:

```sh
npm install
```

To seed the database simply run the seeding script using your package manager e.g:

```sh
npm run seed
```

## Run tests:

There is a test suite written that tests all current endpoints and error handling as well as several utility functions used in the seeding process.

```sh
npm run test
```

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

The required versions of Node and PostGres to run the project are:

- Node: v18.3.0
- PostGres: 14.4
