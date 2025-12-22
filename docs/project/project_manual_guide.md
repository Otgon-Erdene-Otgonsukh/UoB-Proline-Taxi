# Project manual & guide

## Description

This manual provides information on the tools used in the development of this project, including brief descriptions that explain the reasons for choosing these tools, as well as instructions on how to utilize them. The goal of this guide is to enable team members who are facing difficulties understanding certain architectural concepts of the tools involved to get up to speed with concise and clear documentation that addresses all these issues.

- [Next.js](#nextjs-javascript-framework)
- [Neon](#postgresql-database-hosted-with-neon)
- [Prisma](#prisma-orm)
- [Jest](#jest-for-testing)

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


