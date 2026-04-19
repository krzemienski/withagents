# PromptForge - Project Requirements Document (PRD)

**Version:** 1.0
**Date:** April 30, 2025

## 1. Introduction

PromptForge is a web application designed to empower users to leverage Artificial Intelligence (AI) for software project generation. It provides a platform where users can draft detailed AI prompts, generate complete software projects based on those prompts with a single click, manage their generated projects, preview the output, and iterate on the process. The application aims to replicate the core functionality and user experience observed on `codeguide.dev`.

## 2. Goals

*   Provide an intuitive interface for drafting and managing AI prompts specifically tailored for code generation.
*   Enable one-click generation of full software projects (code, assets, basic documentation) using advanced AI models (OpenAI GPT-4-o/GPT-4-1).
*   Offer a dashboard for users to organize, track, and manage their generated projects.
*   Allow users to easily preview generated code and documentation within the application.
*   Facilitate iteration by allowing users to modify prompts and regenerate projects.
*   Ensure a scalable and reliable backend infrastructure to handle potentially long-running AI generation tasks.
*   Provide a secure environment for user data and generated code.
*   Deliver an elegant and user-friendly interface with robust theming capabilities.

## 3. Target Audience

*   Developers (individual, team members) looking to accelerate project scaffolding and boilerplate generation.
*   Product Managers / Designers wanting to quickly prototype ideas.
*   Students / Learners exploring different tech stacks and project structures.
*   Anyone interested in leveraging AI for code generation tasks.

## 4. Functional Requirements

This section outlines the core features and functionalities of PromptForge.

### 4.1 User Authentication (Clerk)

*   **FR-AUTH-01:** Users must be able to sign up for a new account using Email/Password, Google OAuth, or GitHub OAuth.
*   **FR-AUTH-02:** Users must be able to sign in to their existing account using Email/Password, Google OAuth, or GitHub OAuth.
*   **FR-AUTH-03:** Users must be able to sign out of their account.
*   **FR-AUTH-04:** Application routes requiring authentication (e.g., dashboard, project details) must be protected and redirect unauthenticated users to the sign-in page.
*   **FR-AUTH-05:** Backend API endpoints must be protected, requiring a valid authentication token (Clerk JWT) for access.
*   **FR-AUTH-06:** User session management shall be handled by Clerk.

### 4.2 Project Dashboard

*   **FR-DASH-01:** Authenticated users must see a dashboard displaying a list of their created projects.
*   **FR-DASH-02:** Each project listed on the dashboard must display its Title, Creation Date, and current Status (e.g., Queued, Running, Done, Error).
*   **FR-DASH-03:** Users must be able to filter the project list by project title (search).
*   **FR-DASH-04:** Users must be able to filter the project list by status.
*   **FR-DASH-05:** Users must be able to sort the project list (e.g., by creation date, last updated date, title).
*   **FR-DASH-06:** The dashboard must provide a clear action (e.g., "+ New Project" button) to initiate the creation of a new project.
*   **FR-DASH-07:** The dashboard must handle pagination or infinite scrolling for large numbers of projects.
*   **FR-DASH-08:** Each project card on the dashboard must provide quick actions: Open Detail, Regenerate, Delete.

### 4.3 Prompt Editor

*   **FR-EDIT-01:** The application must provide a rich-text editor supporting Markdown syntax for drafting AI prompts.
*   **FR-EDIT-02:** Users must be able to initiate project generation by submitting the prompt from the editor.
*   **FR-EDIT-03:** When regenerating an existing project, the editor must be pre-filled with the project's previously used prompt.
*   **FR-EDIT-04:** (Optional/Stretch) The editor should provide an estimated token count or cost based on the prompt content and selected AI model.
*   **FR-EDIT-05:** (Optional/Stretch) The editor may offer AI-assisted refinement suggestions for the prompt.

### 4.4 Project Generation

*   **FR-GEN-01:** Submitting a prompt must trigger an asynchronous background task to generate the project.
*   **FR-GEN-02:** The generation task must use the OpenAI Python Agents SDK to interact with GPT-4-o (default) or GPT-4-1 models.
*   **FR-GEN-03:** The AI must be prompted to generate a complete file structure and content based on the user's prompt.
*   **FR-GEN-04:** The AI must be instructed to output the generated files in a structured format (e.g., Markdown with file paths and code blocks).
*   **FR-GEN-05:** The generation task must parse the AI response to extract individual files.
*   **FR-GEN-06:** Each generated file's content must be stored persistently (e.g., in S3-compatible storage).
*   **FR-GEN-07:** Metadata for each generated file (path, language, storage key) must be stored in the database, associated with the project.
*   **FR-GEN-08:** The system must update the project status (`queued`, `running`, `done`, `error`) in the database throughout the generation process.
*   **FR-GEN-09:** The system must handle errors during the generation process (API errors, parsing errors, storage errors) and update the project status accordingly.
*   **FR-GEN-10:** The system must generate a downloadable ZIP archive containing all generated files for a completed project and store it persistently (e.g., S3).
*   **FR-GEN-11:** The system must generate a basic `README.md` file for the project based on a predefined template and the user prompt.

### 4.5 Project Detail View

*   **FR-DETAIL-01:** Users must be able to view the details of a specific project they own.
*   **FR-DETAIL-02:** The detail view must display the project's status and other relevant metadata.
*   **FR-DETAIL-03:** The detail view must provide a mechanism (e.g., tabs) to switch between viewing generated Files, Documentation (README), and Logs.
*   **FR-DETAIL-04:** The "Files" view must display a file tree representing the generated project structure.
*   **FR-DETAIL-05:** Selecting a file in the tree must display its content in a code viewer with appropriate syntax highlighting (using Monaco Editor).
*   **FR-DETAIL-06:** The "Docs" view must render the content of the generated `README.md` file.
*   **FR-DETAIL-07:** The "Logs" view must display real-time logs streamed from the generation task via WebSockets.
*   **FR-DETAIL-08:** The detail view must provide an action to download the complete project as a ZIP archive.
*   **FR-DETAIL-09:** The detail view must provide an action to trigger regeneration of the project (opening the Prompt Editor pre-filled).

### 4.6 Real-time Logging

*   **FR-LOG-01:** The project generation worker must publish progress updates and log messages during execution.
*   **FR-LOG-02:** The backend must provide a WebSocket endpoint for clients to subscribe to log streams for specific projects.
*   **FR-LOG-03:** The frontend must connect to the WebSocket endpoint and display received log messages in real-time in the Project Detail view's "Logs" tab.

## 5. Non-Functional Requirements

### 5.1 Performance

*   **NFR-PERF-01:** The dashboard UI should load project lists quickly, even with a moderate number of projects.
*   **NFR-PERF-02:** File content preview should load promptly upon selection.
*   **NFR-PERF-03:** AI generation time is dependent on OpenAI, but the system should efficiently handle task queuing and processing.

### 5.2 Scalability

*   **NFR-SCALE-01:** The backend API and frontend must be scalable to handle increasing numbers of users.
*   **NFR-SCALE-02:** The background worker system (Celery) must be scalable horizontally to handle concurrent project generation tasks.
*   **NFR-SCALE-03:** The file storage system (S3) must handle large amounts of generated data.

### 5.3 Reliability

*   **NFR-REL-01:** The system must reliably queue and execute generation tasks.
*   **NFR-REL-02:** The system must gracefully handle errors during generation and report the status accurately.
*   **NFR-REL-03:** Core services (database, broker, storage) should have high availability (achieved through managed PaaS services).

### 5.4 Security

*   **NFR-SEC-01:** User authentication must be secure (handled by Clerk).
*   **NFR-SEC-02:** API endpoints must be protected against unauthorized access.
*   **NFR-SEC-03:** Sensitive credentials (API keys, database passwords) must be stored securely (e.g., environment variables, PaaS secrets management) and not committed to version control.
*   **NFR-SEC-04:** File downloads must use secure, time-limited mechanisms (e.g., presigned URLs).
*   **NFR-SEC-05:** Dependencies should be regularly scanned for vulnerabilities.

### 5.5 Usability & Design

*   **NFR-UX-01:** The user interface must be intuitive and easy to navigate.
*   **NFR-UX-02:** The application must be responsive and function correctly on various screen sizes (desktop, tablet, mobile).
*   **NFR-UX-03:** The application must implement a theming system (details in Section 6).

### 5.6 Maintainability

*   **NFR-MAIN-01:** Codebase should follow best practices for the chosen frameworks (Remix, FastAPI).
*   **NFR-MAIN-02:** Code should be well-documented and organized.
*   **NFR-MAIN-03:** Automated tests (unit, integration) should be implemented.
*   **NFR-MAIN-04:** A CI/CD pipeline should automate testing and deployment.

## 6. Theming Requirements

This section details the visual design and theming requirements for the PromptForge application, aiming for an elegant, professional, and user-friendly interface inspired by platforms like OpenAI's documentation and API dashboards.

*   **NFR-THEME-01: Technology Stack:** Theming must be implemented using Shadcn UI and Tailwind CSS, leveraging their built-in capabilities for customization and consistency.
*   **NFR-THEME-02: Default Theme:** A dark theme must be implemented as the default and primary theme for the application.
*   **NFR-THEME-03: Visual Aesthetic:**
    *   The overall look and feel should be clean, minimalist, elegant, and professional.
    *   Emphasis should be placed on readability, clear information hierarchy, and intuitive navigation.
    *   Inspiration should be drawn from the user interfaces of OpenAI's platform (e.g., `platform.openai.com/docs`, API dashboard) and the initial visual reference provided (dark theme, accent-blue status chips, rounded cards, compact typography).
*   **NFR-THEME-04: Dark Theme Color Palette (Guideline):**
    *   **Backgrounds (Primary):** Utilize very dark, low-saturation grays or charcoals (e.g., Tailwind `zinc-900/950`, `gray-950`).
    *   **Content Backgrounds (Secondary):** Use slightly lighter dark grays for elements like cards, modals, and sidebars to create subtle depth (e.g., Tailwind `zinc-800/900`, `gray-900`).
    *   **Text (Primary):** Employ light grays or off-white for main body text to ensure high contrast and readability (e.g., Tailwind `zinc-200`, `gray-100`).
    *   **Text (Secondary):** Use slightly dimmer grays for less important text or metadata (e.g., Tailwind `zinc-400`, `gray-400`).
    *   **Accent Color:** Select a professional and accessible accent color (e.g., a shade of blue similar to the reference screenshot, or a subtle teal/green like OpenAI's accents) for interactive elements (buttons, links, focus rings), status indicators, and highlights (e.g., Tailwind `blue-500`, `teal-400`).
    *   **Borders:** Use subtle, slightly darker grays than the content backgrounds for borders and dividers (e.g., Tailwind `zinc-700`, `gray-800`).
    *   **Code Blocks:** Code viewers (Monaco Editor) should use a dedicated dark theme optimized for syntax highlighting legibility.
*   **NFR-THEME-05: Implementation:**
    *   Leverage Shadcn UI's theming system, defining theme colors primarily through CSS variables in `globals.css` as per Shadcn documentation.
    *   Ensure all Shadcn components (`Button`, `Card`, `Dialog`, `Tabs`, `Badge`, `Input`, `Select`, etc.) correctly adopt the defined theme colors and styles.
    *   Utilize Tailwind CSS utility classes for layout, spacing, typography, and other styling needs, ensuring consistency with the theme.
*   **NFR-THEME-06: Typography:**
    *   Use clean, highly readable sans-serif fonts (e.g., Tailwind CSS defaults like `Inter` or similar system fonts).
    *   Establish a clear typographic scale using Tailwind's font size, weight, and color utilities to create visual hierarchy.
*   **NFR-THEME-07: Theme Switching (Optional - Post v1.0):** While the dark theme is primary for v1.0, the implementation should ideally allow for the future addition of a light theme. If implemented, a theme provider (e.g., `next-themes` adapted for Remix) should manage theme state.
*   **NFR-THEME-08: Theme Persistence:** If theme switching is implemented, the user's preference must be persisted locally (e.g., using `localStorage`) and applied automatically on subsequent visits.

## 7. Logging Requirements

This section details the requirements for implementing a robust and comprehensive logging system across all components of the PromptForge application. Effective logging is crucial for debugging, monitoring, auditing, and understanding system behavior.

*   **NFR-LOGSYS-01: Structured Logging:** All application logs (backend, worker, potentially server-side frontend) must use a structured format, preferably JSON. This facilitates easier parsing, filtering, and analysis by log management systems.
*   **NFR-LOGSYS-02: Standard Log Levels:** Implement standard log levels: `DEBUG`, `INFO`, `WARNING`, `ERROR`, `CRITICAL`.
    *   `DEBUG`: Detailed information, typically of interest only when diagnosing problems.
    *   `INFO`: Confirmation that things are working as expected, tracking key events.
    *   `WARNING`: An indication that something unexpected happened, or indicative of some problem in the near future (e.g., ‘disk space low’). The software is still working as expected.
    *   `ERROR`: Due to a more serious problem, the software has not been able to perform some function.
    *   `CRITICAL`: A serious error, indicating that the program itself may be unable to continue running.
*   **NFR-LOGSYS-03: Contextual Information:** Every log entry must include essential contextual information:
    *   `timestamp`: Accurate timestamp of the log event (ISO 8601 format with timezone).
    *   `level`: Log level (e.g., `INFO`, `ERROR`).
    *   `component`: Name of the service/component generating the log (e.g., `fastapi`, `celery-worker`, `remix-ssr`).
    *   `message`: The main log message.
    *   `user_id`: (Where applicable) The ID of the user associated with the request/action.
    *   `project_id`: (Where applicable) The ID of the project being processed.
    *   `request_id`: (Where applicable) A unique identifier for correlating logs related to a single incoming request (especially for backend API).
    *   `task_id`: (Where applicable) The Celery task ID.
    *   `error_details`: (For `ERROR`/`CRITICAL` levels) Stack trace, error type, and relevant details.
    *   `duration_ms`: (Optional, for performance monitoring) Duration of specific operations.
*   **NFR-LOGSYS-04: Component-Specific Logging:**
    *   **FastAPI Backend:**
        *   Log all incoming API requests (method, path, user_id, request_id).
        *   Log outgoing responses (status code, request_id, duration_ms).
        *   Log database interactions (queries, errors - potentially at DEBUG level).
        *   Log interactions with external services (Celery enqueue, S3 calls, Clerk verification).
        *   Log WebSocket connection/disconnection events and subscription details.
        *   Log all unhandled exceptions with full tracebacks (`CRITICAL`).
    *   **Celery Worker:**
        *   Log task reception (`INFO`).
        *   Log task start, including parameters (`INFO`).
        *   Log key steps within the generation pipeline (prompt prep, API call start/end, parsing, file upload, ZIP creation) (`INFO`).
        *   Log interactions with external services (OpenAI API calls/responses, S3 uploads, DB updates) (`INFO`/`DEBUG`).
        *   Log errors encountered during task execution with full tracebacks (`ERROR`).
        *   Log task success or failure, including duration (`INFO`/`ERROR`).
        *   Log messages intended for user visibility via the real-time log stream (distinct handling, see FR-LOG-01).
    *   **Remix Frontend (Server-Side):**
        *   Log errors occurring during server-side rendering (SSR) or in loader/action functions.
        *   Log key server-side actions initiated by the user (e.g., form submissions handled by actions).
    *   **Remix Frontend (Client-Side - Optional):**
        *   Consider implementing selective client-side error reporting (e.g., using Sentry, LogRocket) to capture unhandled exceptions or UI issues experienced by the user. Avoid logging sensitive information client-side.
*   **NFR-LOGSYS-05: Real-time User Logs:** The logging mechanism within the Celery worker must support publishing specific, user-friendly progress updates to a separate channel (e.g., Redis Pub/Sub `logs:{project_id}`) for real-time streaming to the frontend via WebSockets (as per FR-LOG-01, FR-LOG-02, FR-LOG-03). These user-facing logs should be distinct from internal system logs.
*   **NFR-LOGSYS-06: Configuration:** Log levels must be configurable via environment variables for different deployment environments (e.g., `DEBUG` in development, `INFO` or `WARNING` in production).
*   **NFR-LOGSYS-07: Production Aggregation:** In production environments, logs from all components (backend, worker, potentially frontend SSR) must be aggregated into a centralized logging system (e.g., provided by the PaaS like Render Logs, or external services like Datadog, Sentry, Logtail, Grafana Loki).
*   **NFR-LOGSYS-08: Searchability & Alerting:** The production logging system must allow for searching, filtering, and analyzing logs. Configure alerts for critical errors or unusual patterns.
*   **NFR-LOGSYS-09: Libraries:**
    *   Utilize Python's standard `logging` module for FastAPI and Celery.
    *   Consider libraries like `structlog` to simplify structured logging in Python.
    *   FastAPI middleware can be used to inject `request_id` and log request/response details.
    *   Celery signals can be used to automatically log task events.

## 8. System Flows & Screens

This section outlines the primary user flows within the PromptForge application and maps them to the key screens (frontend routes) required.

### 8.1 Key Screens / Routes (Remix Frontend)

1.  **`/` (Root/Landing - Optional):**
    *   **Purpose:** Entry point. May display a marketing/landing page for unauthenticated users or redirect authenticated users to the dashboard.
    *   **Key Elements:** Landing page content (if applicable), Sign In/Sign Up buttons.
2.  **`/sign-in` & `/sign-up`:**
    *   **Purpose:** Handle user authentication.
    *   **Implementation:** Primarily utilize Clerk's pre-built components or hosted pages, configured within the Remix application structure (e.g., `app/routes/sign-in/$.tsx`).
3.  **`/dashboard` (e.g., `app/routes/_dashboard.tsx` or `app/routes/dashboard.index.tsx`):
    *   **Purpose:** Main workspace for authenticated users. Displays existing projects and allows creation of new ones.
    *   **Key Elements:**
        *   Header/Navigation (including UserButton for profile/sign-out).
        *   Project Filters (Search input, Status dropdown, Sort dropdown).
        *   Project List (Grid/list of Project Cards).
        *   Pagination/Infinite Scroll controls.
        *   "+ New Project" Button.
        *   Prompt Editor (likely within a Shadcn `Dialog` modal triggered by "+ New Project" or "Regenerate").
4.  **`/projects/{project_id}` (e.g., `app/routes/projects.$projectId.tsx`):
    *   **Purpose:** Detailed view of a single generated project.
    *   **Key Elements:**
        *   Header/Navigation.
        *   Project Title & Metadata (Status, Timestamps).
        *   Action Buttons ("Download ZIP", "Regenerate").
        *   Tab Navigation (Shadcn `Tabs`) for:
            *   **Files Tab:** File Tree component, Code Viewer (Monaco Editor).
            *   **Docs Tab:** Rendered Markdown view (for `README.md`).
            *   **Logs Tab:** Real-time log stream display area.

### 8.2 Primary User Flows

1.  **User Sign Up / Sign In:**
    *   User accesses `/` or a protected route.
    *   If unauthenticated, redirected to `/sign-in`.
    *   User interacts with Clerk component (enters credentials or uses OAuth).
    *   On successful authentication, Clerk redirects user (typically back to the originally requested route or `/dashboard`).
2.  **Create New Project:**
    *   User is on `/dashboard`.
    *   User clicks "+ New Project" button.
    *   Prompt Editor modal opens.
    *   User enters project title and prompt details in the editor.
    *   User clicks "Generate Project" button within the modal.
    *   Frontend sends API request to backend (`POST /api/projects`) with prompt data.
    *   Backend creates project record (status `queued`), enqueues Celery task, and returns new `project_id`.
    *   Frontend closes modal and navigates to `/projects/{new_project_id}`.
3.  **View Project Details & Logs:**
    *   User is on `/dashboard`.
    *   User clicks on a Project Card.
    *   Frontend navigates to `/projects/{project_id}`.
    *   Loader function fetches project metadata and initial file list/content.
    *   Component renders, displaying metadata and default tab (e.g., Files).
    *   If viewing Logs tab, frontend establishes WebSocket connection to backend (`/ws/logs/{project_id}`) and displays incoming messages.
4.  **Preview Generated Files:**
    *   User is on `/projects/{project_id}` (Files tab).
    *   User clicks on a file in the File Tree.
    *   Frontend fetches file content from backend (`GET /api/projects/{project_id}/files?path=...`) or uses pre-fetched data.
    *   Code Viewer displays the file content with syntax highlighting.
5.  **Download Project:**
    *   User is on `/projects/{project_id}`.
    *   User clicks "Download ZIP" button.
    *   Frontend requests download URL from backend (`GET /api/projects/{project_id}/download`).
    *   Backend generates a presigned S3 URL for the project's ZIP archive.
    *   Frontend receives the URL and initiates the download (e.g., by setting `window.location.href` or creating a temporary link).
6.  **Regenerate Project:**
    *   User is on `/projects/{project_id}` OR `/dashboard`.
    *   User clicks "Regenerate" button (either on detail page or project card).
    *   Prompt Editor modal opens, pre-filled with the existing project's prompt.
    *   User modifies the prompt as needed.
    *   User clicks "Generate Project" button.
    *   Frontend sends API request to backend (`POST /api/projects/{project_id}/regenerate`) with updated prompt.
    *   Backend updates project record (status `queued`), enqueues Celery task.
    *   Frontend closes modal. If initiated from `/dashboard`, navigates to `/projects/{project_id}`. If already on `/projects/{project_id}`, the view updates (e.g., logs start streaming, status changes).
7.  **Delete Project:**
    *   User is on `/dashboard`.
    *   User clicks "Delete" action on a Project Card (likely within a dropdown menu).
    *   Confirmation modal (Shadcn `AlertDialog`) appears.
    *   User confirms deletion.
    *   Frontend sends API request to backend (`DELETE /api/projects/{project_id}`).
    *   Backend deletes project record and associated data (files in S3 - optional cleanup).
    *   Frontend removes the project card from the dashboard list (or re-fetches the list).

*   **Frontend:** Remix v2, React 18, TypeScript, Tailwind CSS v3, ShadCN UI, Monaco Editor
*   **Backend:** FastAPI (Python), Pydantic, SQLAlchemy/SQLModel
*   **Database:** PostgreSQL
*   **Authentication:** Clerk (Email/Password, Google OAuth, GitHub OAuth)
*   **AI Orchestration:** OpenAI Python Agents SDK (GPT-4-o, GPT-4-1)
*   **Task Queue:** Celery (Python), Redis
*   **File Storage:** S3-Compatible Object Storage (e.g., AWS S3, MinIO, Render Object Storage)
*   **Real-time:** WebSockets (FastAPI, Remix)
*   **Deployment:** Docker, Docker Compose (Local), PaaS (e.g., Render.com) (Production), GitHub Actions (CI/CD)

## 10. Future Considerations (Out of Scope for v1.0)

*   Advanced AI prompt refinement features.
*   Support for other AI models (e.g., Anthropic Claude).
*   Team collaboration features (sharing projects).
*   Direct deployment integration (e.g., deploying generated projects to Vercel/Render).
*   Prompt templating and sharing.
*   Usage tracking and billing integration.

---
*This document will be further refined in subsequent steps to detail Theming, Logging, and System Flows.*


## 9. Technology Stack Summary

*   **Frontend:** Remix v2, React 18, TypeScript, Tailwind CSS v3, ShadCN UI, Monaco Editor
*   **Backend:** FastAPI (Python), Pydantic, SQLAlchemy/SQLModel
*   **Database:** PostgreSQL
*   **Authentication:** Clerk (Email/Password, Google OAuth, GitHub OAuth)
*   **AI Orchestration:** OpenAI Python Agents SDK (GPT-4-o, GPT-4-1)
*   **Task Queue:** Celery (Python), Redis
*   **File Storage:** S3-Compatible Object Storage (e.g., AWS S3, MinIO, Render Object Storage)
*   **Real-time:** WebSockets (FastAPI, Remix)
*   **Deployment:** Docker, Docker Compose (Local), PaaS (e.g., Render.com) (Production), GitHub Actions (CI/CD)

## 10. Future Considerations (Out of Scope for v1.0)

*   Advanced AI prompt refinement features.
*   Support for other AI models (e.g., Anthropic Claude).
*   Team collaboration features (sharing projects).
*   Direct deployment integration (e.g., deploying generated projects to Vercel/Render).
*   Prompt templating and sharing.
*   Usage tracking and billing integration.

---
*This document details the requirements for PromptForge v1.0.*

