## Project setup
First of all you need to install postgresql first, by following this [tutorial](https://www.youtube.com/watch?v=4qH-7w5LZsA) and after that, run these queries in query tool or psql 

```bash
  CREATE TABLE users (
      user_id SERIAL PRIMARY KEY,
      name VARCHAR(255),
      password VARCHAR(255)
  );
```

Then after running the queries, run this command to install all the dependencies required.

```bash
$ npm install
```

After installing, don't forget to create environment file named .env.development in the root folder. Then copy and paste these lines of code. Adjust the configuration for the database and JWT according to your needs.

```bash
  # Application Configuration
  APP_PORT=3000
  APP_ENV=development

  # Database Configuration
  DB_HOST=your_db_host 
  DB_PORT=5432 # --> or any other port, feel free to adjust
  DB_USERNAME=your_db_username
  DB_PASSWORD=your_db_password
  DB_NAME=your_db_name

  # JWT Configuration
  JWT_SECRET=your_jwt_secret
  JWT_EXPIRATION=3600 # In seconds

  # API Configuration
  API_PREFIX=api/v1

  # Logging Configuration
  LOG_LEVEL=debug # Possible values: debug, info, warn, error

  # Mail Configuration
  MAIL_HOST=smtp.example.com
  MAIL_PORT=587
  MAIL_USER=your_email@example.com
  MAIL_PASSWORD=your_email_password
  MAIL_FROM=your_email@example.com

  # External APIs
  THIRD_PARTY_API_KEY=your_api_key

  # Optional Features
  ENABLE_CORS=true
  ENABLE_SWAGGER=true
```

## Compile and run the project

```bash
$ npm run start:dev
```

Finally, feel free to test the application API with Postman or any other API testing application of your choice. I've provided the API documentation as a [link](https://documenter.getpostman.com/view/37098805/2sB2j1gXVH) and JSON (Postman collection) in the github repo