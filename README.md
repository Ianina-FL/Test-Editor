

# Test Editor 100

## This project was generated by [Flatlogic Platform](https://flatlogic.com).

  - Frontend: [React.js](https://flatlogic.com/templates?framework%5B%5D=react&sort=default)

  - Backend: [NodeJS](https://flatlogic.com/templates?backend%5B%5D=nodejs&sort=default)

    <details><summary>Backend Folder Structure</summary>   

    The generated application has the following backend folder structure: 

    `src` folder which contains your working files that will be used later to create the build. The src folder contains folders as:

      - `auth` - config the library for authentication and authorization;

      - `db` - contains such folders as:

        - `api` - documentation that is automatically generated by jsdoc or other tools;

        - `migrations` - is a skeleton of the database or all the actions that users do with the database;

        - `models`- what will represent the database for the backend;

        - `seeders` -  the entity that creates the data for the database.

      - `routes` - this folder would contain all the routes that you have created using Express Router and what they do would be exported from a Controller file;

      - `services` - contains such folders as `emails` and `notifications`.   
    </details> 

  - Database: PostgreSQL

  - app-shel: Core application framework that provides essential infrastructure services
for the entire application.
  -----------------------
### We offer 2 ways how to start the project locally: by running Frontend and Backend or with Docker.
-----------------------

## To start the project:

### Backend:

> Please change current folder: `cd backend`

#### Install local dependencies:
`yarn install`

  ------------

#### Adjust local db:
##### 1.  Install postgres:

MacOS:

`brew install postgres`

    > if you don’t have ‘brew‘ please install it (https://brew.sh) and repeat step `brew install postgres`.

Ubuntu:

`sudo apt update`

`sudo apt install postgresql postgresql-contrib`

##### 2. Create db and admin user:
Before run and test connection, make sure you have created a database as described in the above configuration. You can use the `psql` command to create a user and database.

`psql postgres --u postgres`

Next, type this command for creating a new user with password then give access for creating the database.

`postgres-# CREATE ROLE admin WITH LOGIN PASSWORD 'admin_pass';`

`postgres-# ALTER ROLE admin CREATEDB;`

Quit `psql` then log in again using the new user that previously created.

`postgres-# \q`

`psql postgres -U admin`

Type this command to creating a new database.

`postgres=> CREATE DATABASE db_{your_project_name};`

Then give that new user privileges to the new database then quit the `psql`.

`postgres=> GRANT ALL PRIVILEGES ON DATABASE db_{your_project_name} TO admin;`

`postgres=> \q`

  ------------

#### Create database:
`yarn db:create`

#### Start production build:
`yarn start`

### Frontend:

> Please change current folder: `cd frontend`

## To start the project with Docker:
### Description:

The project contains the **docker folder** and the `Dockerfile`.

The `Dockerfile` is used to Deploy the project to Google Cloud.

The **docker folder** contains a couple of helper scripts:

- `docker-compose.yml` (all our services: web, backend, db are described here)
- `start-backend.sh` (starts backend, but only after the database)
- `wait-for-it.sh` (imported from https://github.com/vishnubob/wait-for-it)

    > To avoid breaking the application, we recommend you don't edit the following files: everything that includes the **docker folder** and `Dokerfile`.

## Run services:

1. Install docker compose (https://docs.docker.com/compose/install/)

2. Move to `docker` folder. All next steps should be done from this folder.

   ``` cd docker ```

3. Make executables from `wait-for-it.sh` and `start-backend.sh`:

   ``` chmod +x start-backend.sh && chmod +x wait-for-it.sh ```

4. Download dependend projects for services.

5. Review the docker-compose.yml file. Make sure that all services have Dockerfiles. Only db service doesn't require a Dockerfile.

6. Make sure you have needed ports (see them in `ports`) available on your local machine.

7. Start services:

   7.1. With an empty database `rm -rf data && docker-compose up`

   7.2. With a stored (from previus runs) database data `docker-compose up`

8. Check http://localhost:3000

9. Stop services:

   9.1. Just press `Ctr+C`

## Most common errors:

1. `connection refused`

   There could be many reasons, but the most common are:

  - The port is not open on the destination machine.

  - The port is open on the destination machine, but its backlog of pending connections is full.

  - A firewall between the client and server is blocking access (also check local firewalls).

   After checking for firewalls and that the port is open, use telnet to connect to the IP/port to test connectivity. This removes any potential issues from your application.

   ***MacOS:***

   If you suspect that your SSH service might be down, you can run this command to find out:

   `sudo service ssh status`

   If the command line returns a status of down, then you’ve likely found the reason behind your connectivity error.

   ***Ubuntu:***

   Sometimes a connection refused error can also indicate that there is an IP address conflict on your network. You can search for possible IP conflicts by running:

   `arp-scan -I eth0 -l | grep <ipaddress>`

   `arp-scan -I eth0 -l | grep <ipaddress>`

   and

   `arping <ipaddress>`

2. `yarn db:create` creates database with the assembled tables (on MacOS with Postgres database)

   The workaround - put the next commands to your Postgres database terminal:

   `DROP SCHEMA public CASCADE;`

   `CREATE SCHEMA public;`

   `GRANT ALL ON SCHEMA public TO postgres;`

   `GRANT ALL ON SCHEMA public TO public;`

   Afterwards, continue to start your project in the backend directory by running:

   `yarn start`
