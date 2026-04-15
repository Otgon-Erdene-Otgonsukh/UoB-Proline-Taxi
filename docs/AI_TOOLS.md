# UoB Sustainable Transport AI Declaration
This document provides an overview of all AI tools utilized in the project, in accordance with the unit’s policy. Each team member has specified the large language model (LLM) used, along with representative example prompts and the specific project files in which the AI tools were applied.

## Erik Maltby
**AI Tool:** Gemini 2.5 pro  
**Used from:** 28th September 2025

**AI Tool:** Gemini 3.1 pro  
**Used from:** 19th February 2026

**Scope:** 
 - Looking up terminal commands related to NPM and Git 
 - Concept definitions about frameworks such as Next.js and Tailwind 
 - Basic styling baseground to build upon 
 - Understanding Jest/Next.js error messages
 - Searching up how to co-author a git commit 

**Example Prompts:**
 - "What is the difference between useState and useRef in React ?"
 - "How to use usePath to get the current active route in React ?"
 - "Responsive styling syntax in Tailwind ?"
 - "I stashed changes to my local branch, then my laptop ran out of charge and shut down, when I rebooted it and did git stash pop, it said "No stash entries found". How do I recover my changes?"
 - "What is the command syntax to co author a commit in git?"

**Used in the following files:**
 - `/components/Navbar.tsx`
 - `/__test__/nav_bar.test.tsx`

## Ioan Moir
**AI Tool:** Chat GPT 4.0
**Used from:** 28 September 2025

**Scope:** 
 - Fixing the Docker file issue with copying files from builder stage and environment arguments
 - Explanation of Jest error messages about mocking

**Example Prompts:**
 - How can I pass an argument like .env variables to the docker build command?
 - What are the necessary files need to copied for next.js project to run?
 - Using React in TypeScript, is there an event that triggers when a user deselects or presses enter on a form field?
 - How can I ensure that an array in TypeScript is of a pre-defined type, such as "LngLatLike", to avoid compile errors?

**AI Tool:** VSCode AI Suggestions (https://code.visualstudio.com/docs/copilot/ai-powered-suggestions)
**Used from:** 16 January 2026

**Scope:**
 - Showing and completing suggested code.
 - Faster copying/pasting of code snippets from other parts of the codebase or file.

**Examples:**
 - Typing 'Return ' and then using the suggestion it has pulled from another part of the code base for the return error message.
 - Modifying the type of a variable 'const someLocation : Location' to ': formLocation' and using it to find other usages in that page.

**Used in the following files:**
 - `Dockerfile`
 - `/uob_transport_app/app/book/page.tsx`

## Yidi Ai
**AI Tool:** Chat GPT 5.2  
**Used from:** 28th September 2025

**Scope:** 
 - Translation of Framework documents
 - Summarizing docs of tools used
 - Concluding work done and appointed work to be done with text generation
 - Remote Database setup instructions in Neon

**Example Prompts:**
 - Summarize this section of the document and point out main points.
 - Proofread the following text about my work progress and change the tone to be more cohesive.
 - How to setup a remote database in Neon ?

**Used in the following files:**
 - `/prisma/schema.prisma`

## Otgon-Erdene Otgonsukh
**AI Tool:** Claude Sonnet 4.5  
**Used from:** 5th November 2025

**AI Tool:** ImgUpscaler.AI </br>
**Used from** 23rd February 2026

**Scope:**
 - Applying repetitive styling with agentic coding
 - Formatting markdown files to be more structured 
 - Updating jest config file to find tests correctly
 - Brainstorming design ideas for email templates
 - Quick concept explanation of the tools involved
 - Generating mock data for testing
 - Writing complex raw sql query
 - Proofreading and fixing spelling or grammar mistakes in docs/md files
 - Enhancing  the quality of certain public assets like images.

**Example Prompts:**
 - Apply the same styling logic to other divs in the MUI component.
 - Format this markdown file to have correct heirarchy.
 - What gradient background fits this page ? 
 - What is the difference between JWT Session and Token ?
 - How to group bookings by department and sum and count their amount and prices?
 - Read through this file and identify and patch up the spelling or grammar mistakes.
 - Sharpen and enhance the following icons.

**Used in the following files:**
 - `jest.config.ts`
 - `/app/register/register-req`
 - `/docs/project/project_manual_guide.md`
 - `__test__/*`
 - `/app/api/super-data`
 - `/docs/handover/handover.md`
 - `/public`
