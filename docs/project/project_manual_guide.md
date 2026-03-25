# Project manual & guide

## Description

This manual provides information on the tools used in the development of this project, including brief descriptions that explain the reasons for choosing these tools, as well as instructions on how to utilize them. The goal of this guide is to enable team members who are facing difficulties understanding certain architectural concepts of the tools involved to get up to speed or for new developers who is not familiar with the tools involved with concise and clear documentation that addresses all these issues.

- [Next.js](#nextjs-javascript-framework)
- [Neon](#postgresql-database-hosted-with-neon)
- [Prisma](#prisma-orm)
- [Jest](#jest-for-testing)
- [CI/CD](#github-actions-cicd)
- [AWS](#aws--deployment)

## Next.js (Javascript Framework)
 [![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=Next.js&color=black)](https://nextjs.org)

Next.js is a framework built on top of React which allow for backend and frontend code to live in the same project folder. Provides SSR (server side rendering) for static pages thus making them load faster and tightly integrates with other convenience tools such as ORMs and Authorization tools. If you want more information about next.js and all its perks, follow <a href="https://nextjs.org/docs">this</a> link.

### App router
The App Router allows for file based routing system, meaning that each route is connected to a folder with a page.tsx file. This feature makes it easier to create unique routes/pages that the user needs to be redirected.

### API end-points
The backend logic is implemented through api end-points located in the app/api directory. Inside it, ther necessary apis is located inside folders and in a file with a name formate route.ts. In the route file, all the bisuness logic is implemented whether it is with Prisma or else.

### Client side vs Server side pages
The pages implemented in next.js is of two types, server side and client side. The client side pages are the ones that utilizes the react hooks such as userState and useEffect. To put it simply, these are the pages that is interactable by the user. To make a page to be client side since all pages created are server side by default, we use the "use client" declaration at the very top of the file. Thus all the other pages that is located in the /api directory or ones without the "use client" tag is considered server side and not exposed to the user to interact.

## Postgresql database hosted with Neon
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=PostgreSQL&logoColor=white&color=blue)
](https://www.postgresql.org)
[![Neon](https://img.shields.io/badge/Neon-00E599?style=for-the-badge&logo=neon&logoColor=white)](https://neon.tech)

SQL database is used since the project revolves around managing bookings which require cohesive structure and consistency. The database is hosted remotely using Neon which is a convenient database hosting tool that provides auto scalability and git-like branch based development process that allows for different versions of the database to be present. 

### How to access the Neon database ?
Request an invitation link from the admin of the database (Yidi) to get permission to the shared project in which the database can be accessed at <a href="https://console.neon.tech/app/projects/shared">here</a> and select the shared project and change the branch to development on the left hand side of the console and navigate to the tables tab. There you will see all the available tables and entries. Using the Neon console, certain columns can be edited, deleted and added.

## Prisma (ORM)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=Prisma)
](https://www.prisma.io/)

Prisma provides us with an interface that we can use to query and communicate with the Neon Database. It prevents us from the annoyance of writing raw sql queries and instead allows us to write queries in a javascript like syntax which is more digestable. 

### Connecting Prisma with the Neon Database
In the prsima/schema.prisma file, the schema of the database is written in the prisma syntax that basically defines the structure and the different tables/models with their respective fields. At the top of the file exists the connection to the database using an environment variable and a connection string.

### Setting up the connection string environment variable
You must have the connection string set to a variable called DATABASE_URL in your local .env file. The connection string can be obtained by navigating to the Dashboard tab of the shared project page and on the top right, there is a Connect button. Click on it and select the branch as development and the connection string that can be copied should be at the bottom of the pop up menu. (make sure to show the password and then copy it). By doing this, now Prisma has access to the database and can proceed with queries.

### Generating Prisma Client
Prisma Client is the code/function that is used to execute the queries and need to be generated first to be used as import. To do that run the following command in the terminal: 
``` sh
npx prisma generate
```

The above command creates a "generated" folder in which the prisma client that knows the database structure is stored.

To import and create the Prisma client instance, run the following commands at the top of the file: 
``` ts
import { PrismaClient } from "@/generate/prisma/client"

const prisma = new PrismaClient();

// or alternatively for ease of testing, use the deep mocked client

import { prisma } from "@/utils/client"

```

Now we can use prisma.user.create ... as such to query the database without raw sql.

### Schema syncing
Since prisma has its own schema definition, there are commands to use to keep the Neon Database scheme and the prisma schema to be in sync. 

If Neon database schema is changed due to adding fields or deleting something using the Neon console, to update the local prisma schema, run: 

``` sh
npx prisma db pull
```

If the local prisma schema is changed and need to update the remote schema on Neon, run: 

``` sh
npx prisma db push
```
> [!IMPORTANT]
> It is essential that both Neon and Prisma to operate on the same schema or else queries would fail.

## Jest for Testing
[![Jest](https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=Jest)](https://jestjs.io/)

Jest is a javascript testing framework that provides convenient methods to test React components and Node server side code behaviours. Jest provides two main testing environments and those are:

 - Node (API testing)
 - Jsdom (default) (Component render testing)

The test files of the project is stored in a special `__test__` directory and are categorized into two sub-folders `/api` for api tests and `/pages` for component rendering tests.

### Component rendering tests
The testing library provides 5 main functions that helps with rendering tests and those are `expect`, `screen`, `render`, `describe` and `test`. The first three are used to render a component into the virtual dom which is basically a test browser that jest operates in, and `screen` is used to extract certain html elements from the dom to be tested for with `expect`. The last two are used to organize the test files to maintain structure. Use `describe` to bundle together multiple `test` functions to be displayed in a clean group when `npm test` command is executed to run all tests.
### API tests
Since the `fetch` function which is provided by node.js is needed to simulate API calls, we need to change the jest testing environment from the default jsdom to node. This can be done by declaring the test environment at the top of api test files with:
``` ts
/**
 * @jest-environment node
 */
```
Now all the features and functions provided by node is available to be used in the test. 

### Mocking for Unit tests
Since we are mainly focusing on unit tests, to test the api endpoints, we need to mock the modules or prisma functions that is needed to create fake versions of those we can control the behaviour. Thus basically, we have to provide fake versions of the modules that are imported and used by the API. Thus we use:
``` ts
jest.mock("module to be mocked", () => ({
    functions_in_the_module: jest.fn()
}))
```
The above code snippet mocks the module and replaces one of the methods in the module `functions_in_the_module` with a mock function `jest.fn()`. Thus we can now decide what the behaviour of the function should be and test it agains that.

### Using `prismaMock` for testing
To avoid the headache of mocking the prisma client and all of its functions in every test, there is a deeply mocked version of the prisma client that you can easily import and define the behaviours of each function without manual mocking as long as the backend function or the api-endpoints use the exported client and not a new instance of it. You can import the pre-mocked prisma client by including the following import statement in your test file:

```ts
import { prismaMock } from "@/utils/singleton";

prismaMock.bookings.findMany.mockResolvedValue({...})
```

## Github Actions (CI/CD)
[![Static Badge](https://img.shields.io/badge/Github%20Actions-2088FF?style=for-the-badge&logo=Github%20Actions&logoColor=white)
](https://docs.github.com/en/actions/get-started/understand-github-actions)

Github Actions is a platform that is integrated into github that allows developers to implement and automate their CI/CD workflow right in github. This is done through creating a `workflows` folder in `/.github` directory, in which the workflow `.yml` files that trigger the github actions workflow are located. Further information of the structure and format of these workflow files can be found in the github actions docs page which can be accessed by clicking on the badge above.
### CI (Continuous Integration)
The `ci.yml` we have is composed of several steps including locating cache for faster rebuilds, linting, running the jest tests and building the project. It is triggered (can be observed <a href="https://github.com/spe-uob/2025-UoBsustainableTransport/actions">here</a>) when changes are pushed or when PR is created to both `main` and `dev` branches. Basically, these workflows when triggered, creates a VM and accesses the repository and installs the dependencies and runs all the defined steps in order. It is equivalent to us just running the steps one by one in our terminals to test if the project is working as intended, github actions allows us to automate that process.

> [!IMPORTANT]
> Note that when a PR is created, the workflow file that is triggered and run is the one on the PR branch and not the one on `dev` or `main`.

### Continious Deployment
As for deployment, we used AWS and the [`cd.yml`](/.github/workflows/cd.yml) defines the steps of deployment. The rough outline of the overall flow is defined as follows:

 1. Login to AWS using the credentials stored in github secrets.
 2. Builds docker image of the application.
 3. Pushes the image to AWS ECR.
 4. Updates the [`task-definition.json`](/.aws/task-definition.json) file to use the newly pushed image.
 5. Updates the AWS ECS task to start a container with the new task-definition.

Further information on the AWS cloud architecture can be found in the [`AWS & Deployment`](#aws--deployment) section of the document.

## Auth.js
For user authentication and session management, we used Auth.js which integrates well with next.js projects and provides automatic cookie management, easy sign in and sign out functionalities. 

### `/auth.ts` file
This file contains the main function that is used to create the `signOut`, `signIn` and `auth` functions which makes the processes easier. There are also callback functions to set the jwt and session data to the necessary user details that are used to be displayed in the page for example.

### `AUTH_SECRET` environment variable
This is a must have environment variable that can be created by running:

``` sh
npx auth secret
```
This command creates a `.env.local` file with the variable in it and you should copy it and move it to your local  `.env` file. This secret key is used to encrypt the JWT to prevent people from tampering with the token and breaking active session cookies stored in the browser.

### Accessing session data
To extract information from the active session, if you want to access the session from a client-side page, the `useSession` hook from the module `next-auth/react` returns the active session object from the browser cookie storage. The actual session data is accessed by:

``` ts
const sessionObj = useSession();
const session = sessionObj.data;
// or alternatively
// const { data: session } = useSession();
const name = session.user.name; 
...
```
As for accessing session from a server side component, we can use the provided `auth` function from the file `@/auth` that was discussed above. The session is extracted as follows:

``` ts
const session = await auth(); // auth is an asynchronous function
const name = session.user.name;
```

> [!TIP]
> The object structure of the session object and what information is stored within it can be found in the file `/types/next-auth.d.ts`.

## AWS & Deployment
[![AWS](https://img.shields.io/badge/Amazon_Web_Services-FB7A24?style=for-the-badge&logoColor=white)](https://aws.amazon.com/)

The project is deployed on AWS, utilizing the following services: 

 - AWS ECR
    - Registry to store docker images for ECS to pull.
 - AWS ECS
    - Container runtime environment to run the main image container
 - AWS ALB
    - Proxy and load balancer that provides static IP and DNS which our custom domain points to. Forwards traffic to the container
 - AWS WAF
    - Firewall that filters traffic and provides safety from application level attacks.
 - AWS IAM
    - User accounts for Github Actions and local AWS SES development.
 - AWS SES
    - Email service for sending emails to the users.
 - AWS Secrets Manager
    - Storage for keeping environment variables that is needed for the application and is accessible by ECS.
 - AWS ACM
    - Used for SSL certification that allows HTTPS.

All these services come together to provide end-to-end flow from the internet to our application. 

`task-denfiniton.json` is a file that contains the configuration for the AWS ECS service that defines the system resources like cpu and ram, container information like the name and the id of the image to use (which will be set to the URI of the image in ECR), environment variables and secret the application needs and the secret links stored in AWS Secrets Manager. 

The setup of these services are straightforward, you just need to follow the steps that AWS provides to create ECR registry and ECS service.