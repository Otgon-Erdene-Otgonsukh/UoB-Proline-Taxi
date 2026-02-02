# UoB Sustainable Transport AI Decleration
This document provides an overview of all AI tools utilized in the project, in accordance with the unit’s policy. Each team member has specified the large language model (LLM) used, along with representative example prompts and the specific project files in which the AI tools were applied.

## Tool 1: Gemini 2.5 pro
**Used from:** 28th September 2025 </br>
**Scope:** 
 - Looking up terminal commands related to NPM and Git 
 - Concept definitions about frameworks such as Next.js and Tailwind 
 - Basic styling baseground to build upon 
 - Understanding Jest/Next.js error messages </br>

**Example Prompts:**
 - "What is the difference between useState and useRef in React ?"
 - "How to use usePath to get the current active route in React ?"
 - "Responsive styling syntax in Tailwind ?"

**Used in the following files:**
 - `/components/Navbar.tsx`
 - `/__test__/nav_bar.test.tsx`

**Used by:** Erik Maltby

## Tool 2: Chat GPT 4.0
**Scope:** 
 - Fixing the Docker file issue with copying files from builder stage and environment arguments
 - Explanation of Jest error messages about mocking

**Example Prompt:**
 - How to pass an argument to docker build command ?
 - What are the necessary files need to copied for next.js project to run ?
 - Using React in TypeScript, is there an event that triggers when a user deselects or presses enter on a form field?
 - How can I ensure that an array in TypeScript is of a pre-defined type, such as "LngLatLike", to avoid compile errors?

**Used in the following files**
 - `Dockerfile`
 - `/uob_transport_app/app/book/page.tsx`

**Used by:** Ioan Moir

## Tool 3: Chat GPT 5.2
**Used from:** 28th September 2025 </br>
**Scope:** 
 - Translation of Framework documents
 - Summarizing docs of tools used
 - Concluding work done and appointed work to be done with text generation
 - Remote Database setup instructions in Neon

**Example Prompts:**
 - Summarize this section of the document and point out main points.
 - Proofread the following text about my work progress and change the tone to be more cohesive.
 - How to setup a remote database in Neon ?

**Used in the following file:**
 - `/prisma/schema.prisma`

**Used by:** Yidi Ai

## Tool 4: Claude Sonnet 4.5
**Used from:** 5th November 2025 </br>
**Scope:**
 - Applying repetitive styling with agentic coding
 - Formatting markdown files to be more structured 
 - Updating jest config file to find tests correctly
 - Brainstorming design ideas for email templates
 - Quick concept explanation of the tools involved

**Example Prompt:**
 - Apply the same styling logic to other divs in the MUI component.
 - Format this markdown file to have correct heirarchy.
 - What gradient background fits this page ? 
 - What is the difference between JWT Session and Token ?

 **Used in the following files:**
  - `jest.config.ts`
  - `/app/register/register-req`
  - `/docs/project/project_manual_guide.md`

**Used by:** Otgon-Erdene Otgonsukh
