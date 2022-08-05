# Installation

The recommended experience is to view the website at [https://comp3900-lawnchair.herokuapp.com](https://comp3900-lawnchair.herokuapp.com). Note: Heroku sleeps the website if it is inactive and so it will take some time to wake up on the first visit.

The following instructions are for the Lubuntu Virtual Machine. Run all instructions in the base directory of the unzipped submission.

## Dependencies

### Java 11

Run `sudo apt update` then `sudo apt install default-jdk`.

Run `java --version` to check that Java 11 has been successfully installed.

### Node.js v16.x and NPM

To install Node.js v16.x and NPM, run:

```
sudo apt -y install curl
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs
```

Run `node --version` and `npm --version` to check that Node.js and NPM have been successfully installed.

### PostgreSQL 14.4

To install PostgreSQL 14.4, run:

```
sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
sudo apt-get update
sudo apt-get -y install postgresql-14
```

To setup PostgresQL run `sudo passwd postgres` and set the password to `lubuntu`. Then to create the user lubuntu run `sudo -u postgres createuser -d -P lubuntu` and set the password to `lubuntu`.

To load the database run:

```
createdb moviedb
psql moviedb -c 'CREATE EXTENSION pgcrypto;'
pg_restore -d moviedb database.dump
```

## Building the Code

To build the code run `npm run build` and then `./gradlew build`.

The website can then be run using:

```
java -jar build/libs/rest-service-0.0.1-SNAPSHOT.jar
```

Then the website should be running at [http://localhost:8080](http://localhost:8080).

### Admin Account

There is one admin account that is manually added to the database. Its details are:

- Username: `admin@email.com`
- Password: `Admin123`
