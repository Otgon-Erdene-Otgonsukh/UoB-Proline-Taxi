# UoB Sustainable Transport Handover Documentation

## Description

This document provides a concise overview of the project codebase, outlining the tools and technologies used to give developers a comprehensive understanding of the project's structure. In addition to the technical guide, a website guide is included to explain how to interact with and use the application.

## Setup and Prerequisites

### Node.js

The project is implemented using the Next.js framework which requires Node.js and its corresponding package manager `npm`. You can install node.js on your machine by navigating to <a href="https://nodejs.org/en/download">this</a> link and following the instructions.

After download, you can verify the installation by running `npm --version` and `node -v`.

### Source Code

To acquire the source code of the project for local development, navigate to the project repository releases tab in github by following <a href="https://github.com/spe-uob/2025-UoBsustainableTransport/releases">this</a> link.

When in the Releases tab, select the final version release and click on assets section to download the source code in .zip or tar.gz format and extract it. You can open the source code folder with any IDE you prefer that supports Typescript.

### Environment Variables

The following is all the environment variables that is required to run the project. You must replace the placeholder variables with your legitimate ones.

```env
DATABASE_URL="YOUR_DATABASE_CONNECTION_STRING"
AUTH_SECRET="NEXT_AUTH_SECRET_KEY"
AUTH_TRUST_HOST="TRUE_OR_NONE"
AWS_SES_REGION="SES_REGION"
SES_FROM_EMAIL="SES_VERIFIED_EMAIL"
NODE_ENV="DEVELOPMENT_OR_PRODUCTION"
AUTH_URL="YOUR_DOMAIN"
OSRM_SECRET="OSRM_KEY_FOR_ROUTING"

# AWS SES user credentials (Only for development)
AWS_ACCESS_KEY="YOUR_AWS_ACCESS_KEY"
AWS_SECRET_KEY="YOUR_AWS_SECRET_KEY"
```

### Installing Dependencies

After opening the source code in your IDE, navigate to the main application folder `uob_transport_app` and run the following command:

```sh
npm install
```

This will create a `node_modules` folder containing all the dependencies and executables needed for the project.

### Guide on some environment variables

#### `DATABASE_URL`

The project uses a postgresql database hosted on the platform Neon. You can create an account and in the Projects tab on the left, create a new project with the configurations and postgresql version you prefer. Now you have an empty postgresql database in Neon which you get the connection string by clicking on the Connect button in the dashboard tab.

After setting this variable. you can run:

```sh
npx prisma migrate dev
npx prisma generate
```

This creates the database in your Neon project by following the schema defined in `prisma/schema.prisma`. The second command creates a new Prisma Client to be used to query the database.

#### `AUTH_SECRET`

This is a key used by Auth.js for signing and validating the JWT for authentication and session management. This key variable is created by running:

```sh
npx auth secret
```

You might need to copy and paste the variable from the `.env.local` file that is created by the command to your `.env` file.

#### `OSRM_SECRET`

This variable is needed if you are hosting your own instance of the OSRM routing engine. If you are using the demo api that is made public by OSRM, you can ignore this. However the API endpoint that is used for map routing sends a request with this key in the header to the server that is hosting a separate instance of OSRM which will require changing.

### Running the Application

After setting the environment variables and installing node.js, for development server with hot reloading, run:

```sh
npm run dev
```

For a stable and compiled version, run:

```sh
npm run build # build/compile the code
npm start # start a server using the compiled code
```

You can access the website by visiting `http://localhost:3000` on the browser.

Further runnable script information is available at the scripts section in the `/package.json` file.

#### Running with Docker

If you want to run the application with docker, make sure to install docker <a href="https://docs.docker.com/get-started/introduction/get-docker-desktop/">here</a>. After installing and starting the docker engine by launching docker desktop, in the main application folder, run:

```sh
docker compose up
```

This will build the image and run the container and you can access the application in the browser on `http://localhost:3000`.

## Project Structure and Architecture

The following is a architectural diagram of the project that includes the key framework and external systems that comprises the application and their relations.

<img src="/docs/Tech_stack.jpg"/>

### Project Structure

Below is a layout of the most important directories of the project with a brief description and hierarchy.

<pre>
*2025-UoBsustainableTransport*
│
├── *.aws*
│    └── task-definition.json                  # Task definition used by ECS Tasks / Container
│
├── *.github*                                 
│    ├── ISSUE_TEMPLATE                        # Issue templates for Kanban Board
│    ├── workflows                             # Continuous Integration & Deployment Workflow files
│    └── pull_request_template.md              # Github Pull Request Template
│
├── *docs*                                     # Documentation directory  
│
├── *uob_transport_app*                        # Main application directory
│    │
│    ├── *__test__*                            # Jest tests 
│    │    ├── api                              # API tests
│    │    │    └── ...                              
│    │    └── pages                            # Page rendering tests
│    │         └── ...                               
│    │
│    ├── *app*                                 # Next.js App directory (page routes/api-endpoints)
|    |    ├── api                              # API Endpoints
│    │    └── ...
│    │
│    ├── *backend*                             # Backend functions
│    │    └── ...
│    │
│    ├── *components*                          # Reusable React components
|    └── ...
</pre>

> [!IMPORTANT]
>
> #### `/app` directory
>
> The most important directory which contains all the page routes and api-endpoints which acts as the entry point to the backend of the application. The backend code is written in both `/backend` and the `/app/api` directories with `backend` folder containing helper functions that helps declutter the api files.
> Each page has its own file based routing folders in the `/app` directory and each api endpoint is named clearly to explain the purpose of each one and its backend functionality.

## Continuous Integration and Continuous Deployment (CI/CD)

The integration and deployment is automated using Github actions and the workflow files that is defined in `/.github/workflows`.

### Continuous Integration

Executed on pull request or pushes to `main` and `dev` branch which the steps defined in `/.github/workflows/ci.yml`. The CI runs linting, typecheck with tsc and runs all the jest tests and finishes with building.compiling the project.

### Continuous Deployment

Executed on pushed to `main` branch which the steps defined in `/.github/workflows/cd.yml`. The steps are as follows:

- Login to AWS using the credentials defined in **github secrets**.
- Build the image using docker.
- Push the image to AWS ECR.
- Update the ECS task definition.
- Start the container as ECS task instance.

### Github Secrets

Both the CI and CD workflows require importing variables from github secrets which include:

- `DATABASE_URL` in `ci.yml`.
- `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` in `cd.yml`

You must add these variables to github secrets by navigating to the Settings tab on the top and clicking Secrets and Variables tab on the left.

## Database Structure

The below relational diagram shows the overall structure of the database and relation between entities. Some fields might not match with the actual database tables for example the data types and due to certain last minute changes. This diagram is only for providing rough visual representation of the database and should not be regarded as source of truth.

<img src="/docs/db_structure.jpg"/>

## AWS Setup

The following is a guidance on how the project can be deployed with AWS and based on the deployment strategy that was used during development.

<img src="/docs/CI_CD.png"/>

The above diagram displays the AWS Services that was used during development to deploy the application. The services consists of:

- AWS ECR
  - Contains the docker images that is pushed by github actions in the CI workflow.
- AWS ECS (Fargate)
  - Pulls the images from the ECR and runs the container on an automatically managed machine.
- ALB
  - Redirects traffic to the running ECS container tasks and can be attached a custom domain by providing stable DNS. Listens traffic on `HTTPS:443` from all IP addresses.
- AWS WAF
  - Can be attached to the ALB to protect against any application level malicious requests and filter traffic.
- AWS SES
  - Used for sending emails to the users of the application. A domain must be verified in the AWS SES console to allow any email addresses under that domain to send to any Email provider addresses.
- AWS IAM Roles
  - Total of 2 Role creation is necessary to make the application work in production which can be found at the top of the task definition file in `/.aws/task-definition.json`. One is for ECS to allow permission to pull images from ECR and access secret variables from AWS Secrets Manager to set up the environment variables for the container and one is for the actual application container that allows permission to use SES to send emails.
- AWS Secrets Manager
  - Used to store secret variables that is needed for the container and is fetched and setup by ECS before a task starts.

## Further Resources

Additional technical information is available [here](/docs/project/project_manual_guide.md) for any beginner developers who are struggling to understand some concepts regarding the tools and external systems used in the project. The document contains concise information about the tools and frameworks of the project and a step-by-step guide to start using those tools in the code base with example code snippets.

## Detailed User Instruction

The following section provides a visual guidance on how each user can interact with the web application and complete their corresponding crucial task.

### Normal User

1. Navigate to the website using the appropriate domain.
2. Click login on the landing page.

<img src="/docs/handover_pictures/landpage.png" width="1000"/>

3. Click on the sign up link in the login page.
4. Enter your details and pick normal user as the account type.

<img src="/docs/handover_pictures/normal.png" width="1000"/>

5. Click sign up and enter your details in the login page and sign in.
6. In the home page, you can view your recent bookings, edit them and cancel them.
7. Click on the new bookings button in the home page bookings table.

<img src="/docs/handover_pictures/normalhome.png" width="1000"/>

8. In the bookings page, enter your trip and passenger details and click confirm.

<img src="/docs/handover_pictures/book.png" width="1000"/>

9. When successful, a success window appears and navigate back to the home page and check the status of your booking.

10. Navigate to the Dashboard tab to see recent bookings and their route in the interactive map and some statistics.

<img src="/docs/handover_pictures/normaldash.png" width="1000"/>

### Finance Staff (UoB)

1. Navigate to the sign up page and enter details using an official university email.
2. Select "Register as Finance Staff" option.

  <img src="/docs/handover_pictures/finance.png" width="1000"/>

3. Click register and wait for account approval by the corresponding department manager.

  <img src="/docs/handover_pictures/inprogress.png" width="1000"/>

4. An email is sent when the staff registration request is responded.
5. When approved, enter the credentials in to the login fields.
6. After logging in, navigate to the "Dashboard" tab.

  <img src="/docs/handover_pictures/dashboard.png" width="1000"/>

7. The table contains the bookings made under the specific department you are registered in.
8. The bookings can be Rejected, Approved and Viewed.
9. When approving, attach the PO number to the booking using the pop-up dialog window.

  <img src="/docs/handover_pictures/attachPO.png" width="1000"/>

### Super Admin

...
