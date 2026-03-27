# **UoB Sustainable Transport – Smart taxi & chauffeur booking Platform**

<img src="uob_transport_app/public/logo.png" alt="logo text with image of a car" width="400"></img>

[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=Next.js&color=black)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=React&color=white)](https://react.dev)
[![Typescript](https://img.shields.io/badge/Typescript-06B6D4?style=for-the-badge&logo=Typescript&logoColor=white&color=blue)](https://www.typescriptlang.org)
[![Tailwind](https://img.shields.io/badge/Tailwind-06B6D4?style=for-the-badge&logo=Tailwind%20CSS&color=blue)
](https://tailwindcss.com)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=PostgreSQL&logoColor=white&color=blue)
](https://www.postgresql.org)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=Docker&logoColor=white)](https://www.docker.com/)
[![Neon](https://img.shields.io/badge/Neon-00E599?style=for-the-badge&logo=neon&logoColor=white)](https://neon.tech)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=Prisma)
](https://www.prisma.io/)
[![Jest](https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=Jest)](https://jestjs.io/)


## Table of Contents

- [Project Overview](#project-overview)
- [Project Structure](#project-structure)
- [Stakeholders](#stakeholders)
  - [Primary Users](#primary-users)
  - [Secondary Users](#secondary-users)
- [User Stories](#user-stories)
- [Project Architecture](#project-architecture)
- [Team Members](#team-members)

## Project Overview

A booking and account management platform to streamline how the University of Bristol (UoB) books and manages taxi and chauffeur services with Proline Taxi. The goal is to replace manual processes through emails and phone calls with a digital experience that is faster, more transparent, and easier to manage at scale while providing an intuitive and user-friendly interface suitable for non-technical individuals.

### Key Features

- Streamlined booking: enter pick-up/drop-off, time, name, email, instant confirmation through Mail.
- Automated data handling: routing important booking details to the corresponding head/finance team of the relevant University department for approval.
- Real-time journey visibility: live status changes and booking visibility.
- Informative dashboards: data dashboards with numeric data and charts for analysis.
- Centralised invoicing: booking history and faculty-specific invoices.

## Project Structure

<pre>
*2025-UoBsustainableTransport*
│
├── *.aws*
│    └── task-definition.json                  # Task definition used by ECS Tasks / Container
│
├── *.github*                                 
│    ├── ISSUE_TEMPLATE                        # Issue template files
│    ├── workflows                             # Continuous Integration & Deployment Workflow files
│    └── pull_request_template.md    
│
├── *docs*                                     # Documentation directory  
│    ├── clientMeetings/                       # All client meeting materials
│    │    ├── clientMeetingAgenda1.md
│    │    └── clientMeetingNotes1.md
│    ├── design/                               # All design documentation/Figma 
│    │
│    └── ...
│
├── *uob_transport_app*                        # Main application directory
│    │
│    ├── *__test__*                            # Jest tests 
│    │    ├── api                              # API tests
│    │    │    └── ...                              
│    │    ├── backend_functions                # Backend function tests
│    │    │    └── ... 
│    │    │
│    │    └── pages                            # Page rendering tests
│    │         └── ...                               
│    │
│    ├── *app*                                 # Next.js App directory (main application/pages)
│    │    ├── api/                             # API routes
│    │    │    └── ...
│    │    ├── book/                            # Booking page route
│    │    │    └── page.tsx                    # Booking form component
│    │    ├── confirmed/                       # Booking confirmation page route
│    │    │    └── page.tsx
│    │    ├── ...
│    │    │
│    │    ├── globals.css                      # Global styles and Tailwind imports
│    │    ├── layout.tsx                       # Root layout 
│    │    └── page.tsx                         # Landing page
│    │
│    ├── *backend*                             # Prisma functions
│    │    └── ...
│    │
│    ├── *components*                          # Reusable React components
│    │    ├── Dropdown_info_box.tsx
│    │    ├── Landing_page.tsx                
│    │    ├── Navbar.tsx
│    │    └── ...
│    │
│    ├── *generated*                           # Prisma generated files
│    │    └── prisma/                          
│    │
│    ├── *model*                               # Data models
│    │    └── ...
│    │
│    ├── *prisma*
│    │    └── schema.prisma                    # Prisma schema for database
│    │
│    ├── *public*                              # Public assets
│    │    └── ...
│    │
│    ├── *utils*                               # Utility functions
│    │    └── ...
│    │
│    ├── *Configuration Files*
│    ├── Dockerfile                            # Docker configuration
│    ├── docker-compose.yml                    # Docker Compose configuration
│    ├── eslint.config.mjs                     # ESLint configuration file
│    ├── jest.config.ts                        # Jest testing configuration
│    ├── next.config.ts                        # Next.js configuration file
│    ├── package.json                          # Project dependencies and scripts
│    ├── postcss.config.mjs                    # PostCSS configuration file
│    ├── prisma.config.ts                      # Prisma configuration
│    └── tsconfig.json                         # TypeScript configuration file
│
└── README.md                                  # Project documentation
</pre>

## Stakeholders

### Primary Users

#### Proline Taxi Company
Maintains the platform and utilises the automated booking process to provide efficient taxi and chauffeur services for University of Bristol staff.

#### University of Bristol Faculty/Department
Receives details regarding bookings and approves or rejects them to allow or disallow PO number creation for invoicing.

### Secondary Users

#### Service Providers (Drivers)
Reach the pick-up location promptly and provide regular updates to the passenger for transparency and clear communication.

#### University of Bristol Staff
Benefit from a streamlined booking process, clear driver communication, and straightforward approval process from the University Department.

## User Stories

- As a passenger, I want the approval process for my booking to be done faster and establish transparent communication with the appointed driver to save time.
- As the client, we want to optimise and automate the current laborious back-and-forth booking process to save time and resources for both the company and our customers.
- As the Head/Finance Manager of a UoB Department, I want to see the important details of the booking instantly and approve/reject it in a timely fashion and receive bundled invoices to make the payment easier.
- As a driver, I want to receive the necessary details I need to provide quality service to the passenger.

## Project Architecture

<img src="/docs/Tech_stack.jpg" alt="tech stack diagram"/>

## CI/CD Workflow Diagram
<img src="/docs/CI_CD.png" alt="ci and cd workflow diagram"/>

## User Instructions
### Passenger / booker flow
  1. Navigate to the register page from the login page which will be prompted when visiting the website landing page.
  2. Enter your credentials and select "Register as normal user" card from the three account type selection.
  3. Click register and you will see a message confirming the sign up success.
  4. Enter your mail address and password and click login.
  5. When successful, you will be in the home page that will contain your bookings with their corresponding information.
  6. To make a new booking, click on the "+ New Booking" button on the top right.
  7. Enter the required information about the passenger and the location details.
  8. Click "Confirm booking".
  9. You will see a confirmation message saying the booking was successful.
  10. Navigate back to the home page by clicking on the "Go to Home" button.
  11. In the My bookings table, you can edit, cancel and check the status of your bookings using the buttons.
  12. An email will be sent to both the passenger and the person who booked when the booking status gets changed by the approver.

### Finance staff of UOB flow
  1. Navigate to the sign up page and enter details using an official university email.
  2. Select "Register as Finance Staff" option.
  3. Click register and wait for account approval by the corresponding department manager.
  4. An email is sent when the staff registration request is responded.
  5. When approved, enter the credentials in to the login fields.
  6. After logging in, navigate to the "Dashboard" tab.
  7. The table contains the bookings made under the specific department you are registered in.
  8. The bookings can be Rejected, Approved and Viewed.
  9. When approving, attach the PO number to the booking using the pop-up dialog window.

### ProLine Staff flow
  1. Navigate to the sign up page and enter details using the company email address.
  2. Select "Register as Proline Staff" option.
  3. Click register and wait for approval by the super-admin (George)
  4. An email is sent when the registration request is responded.
  5. The account will have certain permissions that is granted by the super-admin.
  6. When approved, login and navigate to the dashboard page.
  7. Depending on your account permissions, you can manage proline staff registration requests or edit bookings.

## Developer Instructions
For development, you can get started by cloning the repository, navigating to the root directory of it in the command line, and then do the following to get it running locally.

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

**Installing dependencies**

You'll need node.js installed on your server to run our poject in a development environment (https://nodejs.org/en/download).
Once it's installed (test with `npm --version`), you can install the rest of the dependencies with:
```sh
npm install
```
\
**OPTION 1:** Retrieving and generating the Prisma database (If you have an existing database)
> [!IMPORTANT]
> You'll need access to a database with `DATABASE_URL` specified in `.env`. If you do not have a .env file or URL, go to **OPTION 2**.
```sh
npx prisma db pull
npx prisma generate
```
\
**OPTION 2:** Creating an empty database and pushing it to your own remote (If you do not have an existing database)
```sh
npx prisma migrate dev
npx prisma generate
```
\
**Generating NextAuth Secret Key**\
This will be used for NextAuth session JWTs on the website, effectively to keep track of who's who.
```sh
npx auth secret
```
<br/>

> [!IMPORTANT]
> You may need to move the secret key from the .env.local file it generates into .env, allowing the project and docker containers to access it.

#### Running the Application

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

## Team Members

| **Name**                     | **Email**             |
| ---------------------------- | --------------------- |
| Ioan Moir (Project Manager)  | ok24616@bristol.ac.uk |
| Otgon-Erdene Otgonsukh       | ww23805@bristol.ac.uk |
| Yidi Ai                      | nb23869@bristol.ac.uk |
| Alan Yang                    | ng24695@bristol.ac.uk |
| Erik Maltby (Client Liaison) | bg24935@bristol.ac.uk |
