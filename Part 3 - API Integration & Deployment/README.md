## Lambda Demo
[Demo](https://d9yg4j9v9h.execute-api.ap-southeast-1.amazonaws.com/default/index)

## Project setup
Simply run the following command to install prerequisites dependencies

```bash
$ npm install
```

After installing, create environment file named .env used for authentication of the API by storing secret passkey also please set the NODE_ENV to local for local running

```bash
    PASSKEY=your_custom_passkey_here
    NODE_ENV=local
```

## Run the project

```bash
$ node index.js
```

Then run the Express project for POST /leads and GET /leads API. API Documentation is present in this Github project folder and API's can be tested with Postman