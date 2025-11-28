# **UoB Sustainable Transport – Smart taxi & chauffeur booking Platform**

<img src="/public/logo.png" alt="logo text with image of a car" width="400"></img>

[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=Next.js&color=black)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=React&color=white)](https://react.dev)
[![Typescript](https://img.shields.io/badge/Typescript-06B6D4?style=for-the-badge&logo=Typescript&logoColor=white&color=blue)](https://www.typescriptlang.org)
[![Tailwind](https://img.shields.io/badge/Tailwind-06B6D4?style=for-the-badge&logo=Tailwind%20CSS&color=blue)
](https://tailwindcss.com)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=PostgreSQL&logoColor=white&color=blue)
](https://www.postgresql.org)
[![Mui](https://img.shields.io/badge/MUI-007FFF?style=for-the-badge&logo=MUI&color=white)
](https://mui.com)
[![Neon](https://img.shields.io/badge/Neon-00E599?style=for-the-badge&logo=neon&logoColor=white)](https://neon.tech)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=Prisma)
](https://www.prisma.io/)




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

- Streamlined booking: enter pick-up/drop-off, time, name, email, instant confirmation through SMS.
- Automated data handling: routing important booking details to the corresponding head/finance team of the relevant University department for approval.
- Real-time journey visibility: status changes and location sharing for reassurance and coordination.
- Sustainability options: Hybrid/EV vehicle prioritisation and joining-rides feature if applicable.
- Centralised invoicing: booking history and faculty-specific invoices.

## Project Structure
<pre>
*2025-UoBsustainableTransport*
|
│
├── *__test__*                                 # Jest tests 
│    ├── api                                   # API tests
│    │    └── ...                              
│    └── pages                                 # Page rendering tests
│         └── ...                               
│ 
├── *.github*                                 
│    ├── ISSUE_TEMPLATE                        # Issue template files
│    ├── workflows                             # Continuous Integration & Deployment Workflow files
│    └── pull_request_template.md    
│
├── *backend*                                  # Prisma functions
│    └── ...
│
│
├── *docs*                                     # Documentation directory  
│    ├── clientMeetings/                       # All client meeting materials
│    │    ├── clientMeetingAgenda1.md
│    │    └── clientMeetingNotes1.md
│    └── design/                               # All design documentation/Figma 
│
├── prisma
│    └── schema.prisma                         # Prisma schema for database
│
│
├── public/                                    # Public assets
|         └── ...

├── *src*                                      # Source code directory
│    ├── app/                                  # Next.js App directory (main application/pages)
│    │    ├── book/                            # Booking page route
│    │    │    └── page.tsx                    # Booking form component
│    │    ├── faq/                             # FAQ page route
│    │    │    └── page.tsx
│    │    ├── forgot/                          # Forgot password page route
│    │    │    └── page.tsx
│    │    ├── home/                            # Home page route
│    │    │    └── page.tsx
│    │    ├── login/                           # Login page route
│    │    │    └── page.tsx
│    │    ├── globals.css                      # Global styles and Tailwind imports
│    │    ├── layout.tsx                       # Root layout 
│    │    └── page.tsx                         # Landing page
│    │
│    └── components/                           # Reusable React components
│         ├── Dropdown_info_box.tsx
│         ├── Landing_page.tsx                
│         ├── Navbar.tsx
|         └── ...
│    
│    
|
├── *Configuration Files*
├── eslint.config.mjs                          # ESLint configuration file
├── next.config.ts                             # Next.js configuration file
├── next-env.d.ts                              # Next.js TypeScript declarations
├── package.json                               # Project dependencies and scripts
├── postcss.config.mjs                         # PostCSS configuration file
├── tsconfig.json                              # TypeScript configuration file
|
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

<img src="/docs/updated-teck-stack.jpg" alt="tech stack diagram"/>

## Developer Instructions
For development, you can get started by cloning the repository, navigating to the root directory of it in the command line, and then do the following to get it running locally:\
\
**Installing dependencies**\
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
And finally running the project locally:
```sh
npm run dev
```
You should be able to see the app running in your web browser by visiting http://localhost:3000

> [!TIP]
> If you'd like to run a production version of the app instead, consult the guide to building and running the Docker container in `/docs/Docker_Setup.md`.

## Team Members

| **Name** | **Email** |
|-----------|-----------|
| Ioan Moir (Project Manager) | ok24616@bristol.ac.uk |
| Otgon-Erdene Otgonsukh | ww23805@bristol.ac.uk |
| Yidi Ai | nb23869@bristol.ac.uk |
| Erik Maltby (Client Liaison) | bg24935@bristol.ac.uk |
