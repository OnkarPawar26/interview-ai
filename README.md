# Interview.ai

Interview.ai is a web app for preparing for job interviews. A signed-in user provides a target job description and their resume/profile, then the app uses Google Gemini to build a personalized interview report. The report includes a match score, technical and behavioral questions, answer guidance, skill gaps, and a preparation roadmap. From a report, the user can also generate and download an AI-tailored resume as a PDF.

## Contents

- [Features](#features)
- [Architecture](#architecture)
- [Interview report flow](#interview-report-flow)
- [Resume PDF flow](#resume-pdf-flow)
- [Data model](#data-model)
- [API routes](#api-routes)
- [Run locally](#run-locally)
- [Environment variables](#environment-variables)
- [Project structure](#project-structure)

## Features

- Register and log in with a username, email, and password.
- Keep a signed-in session with a JWT cookie and log out by invalidating the token.
- Submit job and candidate information to generate an AI interview report.
- Review technical and behavioral questions, their intent, and suggested answers.
- Review a role match score, skill gaps, and a day-by-day preparation plan.
- Reopen recent reports saved to the signed-in user's account.
- Generate and download a tailored resume PDF.
- Use public About, Help, Privacy Policy, and Terms pages.
- Responsive dark-themed interface.

## Architecture

The repository has a React/Vite frontend and an Express/MongoDB backend. The frontend calls the backend over HTTP. Protected API calls send the authentication cookie using Axios `withCredentials`.

```mermaid
flowchart LR
    Browser[React application<br/>Vite, React Router]
    API[Express API<br/>routes, middleware, controllers]
    Mongo[(MongoDB<br/>users and interview reports)]
    Gemini[Google Gemini API]
    Chrome[Puppeteer<br/>HTML to PDF]

    Browser -->|HTTP and cookie| API
    API --> Mongo
    API -->|Candidate and job details| Gemini
    Gemini -->|Structured JSON or resume HTML| API
    API -->|Save report| Mongo
    API -->|Resume HTML| Chrome
    Chrome -->|PDF bytes| API
    API -->|JSON or PDF download| Browser
```

### Frontend

- `Frontend/src/main.jsx` starts React and imports global styles.
- `Frontend/src/App.jsx` provides the shared auth and interview contexts and the router.
- `Frontend/src/app.routes.jsx` defines the login, register, protected home/report, and public information pages.
- `Frontend/src/features/auth` contains auth state, API calls, forms, protected-route handling, and logout.
- `Frontend/src/features/interview` contains the home form, report display, interview API, report context, and page styles.
- `Frontend/src/components/LoadingState.jsx` provides the themed loading UI.

### Backend

The backend starts in `Backend/server.js`. It loads environment variables, connects to MongoDB, and starts the Express app on port `3000`. `Backend/src/app.js` installs JSON, cookie, and CORS middleware, then mounts the route modules.

Requests generally pass through these layers:

1. A route matches the HTTP method and path.
2. Protected routes run `auth.middleware.js` to validate the JWT cookie and check the token blacklist.
3. A controller handles request data and persistence.
4. A service performs work such as calling Gemini or rendering a PDF.
5. A Mongoose model reads or writes MongoDB data.

## Interview report flow

1. The user fills in a job description and profile information on the home page and selects **Generate My Interview Plan**.
2. The frontend submits a `multipart/form-data` request containing `jobDescription`, `selfDescription`, and an optional `resume` file to `POST /api/interview/`. The user must provide a job description and either a resume or a self-description.
3. The route checks the user's JWT cookie and passes an uploaded file through Multer when one is present. Multer keeps the file in memory and limits it to 3 MB.
4. When a resume PDF is attached, the interview controller extracts its text with `pdf-parse`; without a file, it proceeds using the self-description.
5. `ai.service.js` combines the available candidate information and job description into a Gemini prompt. Missing resume or self-description values are marked as not provided, and the prompt tells Gemini not to invent candidate qualifications or experience.
6. The service requests JSON output using a schema derived from Zod. It parses Gemini's response as JSON; the response is not separately validated with `interviewReportSchema.parse()`. The expected result contains:
   - `title` and `matchScore`
   - `technicalQuestions` and `behavioralQuestions`, each with a question, intention, and answer guidance
   - `skillGaps` with a low, medium, or high severity
   - `preparationPlan` with a day, focus, and tasks
7. The service tries these report model names in order: `gemini-3.8-flash`, `gemini-3.7-flash`, `gemini-3.6-flash`, then `gemini-3.5-flash`. For API errors with status `500`, `503`, or `429`, it tries the next name; other errors are rethrown immediately. These names reflect the current source configuration and may need updating to models enabled for your API key.
8. The controller saves the report and its source text in MongoDB, associated with the current user, and returns the created report.
9. The frontend navigates to `/interview/:interviewId`. The report page fetches the saved report and displays the sections, score, and skill gaps.

### Gemini model fallback flow

The report service tries configured Gemini models in sequence. If a request fails with status `500`, `503`, or `429`, it tries the next model. Other errors stop the sequence and are returned to Express. If every configured model fails with a retryable status, the service throws an error for the API request.

```mermaid
flowchart TD
    Request[HTTP request] --> Controller[Interview controller]
    Controller --> Service[generateInterviewReport]
    Service --> M1[Gemini 3.8 Flash]
    M1 -->|Success| Report[Generated report]
    M1 -->|500, 503, or 429| M2[Gemini 3.7 Flash]
    M2 -->|Success| Report
    M2 -->|500, 503, or 429| M3[Gemini 3.6 Flash]
    M3 -->|Success| Report
    M3 -->|500, 503, or 429| M4[Gemini 3.5 Flash]
    M4 -->|Success| Report
    M4 -->|500, 503, or 429| Failure[Service throws an error]
    Report --> Save[Controller saves report]
    Save --> Response[HTTP response with report]
    Failure --> Error[HTTP error response]
```

## Resume PDF flow

The **Download Resume** button generates a tailored resume PDF from the source information saved with an interview report. It does not download the interview report itself.

1. The frontend sends `POST /api/interview/resume/pdf/:interviewReportId` with the session cookie.
2. The backend loads the saved resume text, self-description, and job description for that report.
3. `generateResumePdf()` asks `gemini-3-flash-preview` for a JSON response with one `html` field. Its prompt requests a concise, professional, ATS-friendly resume tailored to the role.
4. The backend parses the JSON response and gives the HTML to Puppeteer.
5. Puppeteer creates a browser page, sets the generated HTML as its content, and renders an A4 PDF with 10 mm margins.
6. The API responds with `application/pdf` bytes and an attachment filename. The frontend receives a Blob and starts a browser download.

## Data model

### User

The `users` collection stores a unique username, unique email, and bcrypt-hashed password. Login returns a JWT in a cookie; the JWT expires after one day. Logout adds the current token to the `blacklistTokens` collection and clears the cookie.

### Interview report

The `InterviewReport` collection stores:

- The owning user and generated job title.
- The job description, extracted resume text, and self-description.
- The match score, technical and behavioral questions, skill gaps, and preparation plan.
- `createdAt` and `updatedAt` timestamps.

The report-list API omits source text and detailed report sections to keep the recent-reports response smaller. A single-report request returns the full report.

## API routes

All routes use the backend origin `http://localhost:3000`. Routes marked **Protected** require the JWT cookie.

| Method | Path | Access | Purpose |
| --- | --- | --- | --- |
| `POST` | `/api/auth/register` | Public | Create a user account. Request JSON: `username`, `email`, `password`. |
| `POST` | `/api/auth/login` | Public | Verify credentials and set the JWT cookie. Request JSON: `email`, `password`. |
| `GET` | `/api/auth/logout` | Public | Blacklist the current token and clear its cookie. |
| `GET` | `/api/auth/get-me` | Protected | Return the current user's basic details. |
| `POST` | `/api/interview/` | Protected | Generate and save a report from multipart fields `jobDescription`, optional `selfDescription`, and optional `resume` (at least one candidate source is required). |
| `GET` | `/api/interview/` | Protected | List the current user's recent reports. |
| `GET` | `/api/interview/report/:interviewId` | Protected | Fetch one report owned by the current user. |
| `POST` | `/api/interview/resume/pdf/:interviewReportId` | Protected | Generate and download a tailored resume PDF. |

## Run locally

You need Node.js/npm and a reachable MongoDB database. The backend and frontend run in separate terminals.

### 1. Configure the backend

Create `Backend/.env` and set the variables described in [Environment variables](#environment-variables). Keep this file private and do not commit it.

```powershell
cd Backend
npm install
npm run dev
```

The backend listens on `http://localhost:3000`. Its `dev` script runs `npx nodemon server.js`; if nodemon is not available, run `node server.js`.

### 2. Start the frontend

In another terminal:

```powershell
cd Frontend
npm install
npm run dev
```

Vite serves the app at `http://localhost:5173` by default. The backend CORS configuration currently allows that origin.

### 3. Build or lint the frontend

```powershell
cd Frontend
npm run build
npm run lint
```

`npm test` in the backend is currently a placeholder and does not run a test suite.

## Environment variables

Set these in `Backend/.env`:

| Variable | Purpose |
| --- | --- |
| `MONGO_URI` | MongoDB connection string. |
| `JWT_SECRET` | Secret used to sign and verify login tokens. Use a long, random value. |
| `GOOGLE_GENAI_API_KEY` | API key used by `@google/genai` to call Gemini. |

Example shape (replace each placeholder locally; do not commit real credentials):

```dotenv
MONGO_URI=mongodb://127.0.0.1:27017/interview-ai
JWT_SECRET=replace-with-a-long-random-secret
GOOGLE_GENAI_API_KEY=your-google-genai-api-key
```

## Project structure

```text
.
├── Backend/
│   ├── server.js
│   └── src/
│       ├── app.js
│       ├── config/          # MongoDB connection
│       ├── controllers/     # Auth and interview request handlers
│       ├── middlewares/     # JWT authorization and file upload
│       ├── models/          # User, report, and blacklisted-token schemas
│       ├── routes/          # Express route definitions
│       └── services/        # Gemini report and PDF generation
└── Frontend/
    ├── index.html
    └── src/
        ├── app.routes.jsx
        ├── App.jsx
        ├── components/
        └── features/
            ├── auth/
            └── interview/
```
