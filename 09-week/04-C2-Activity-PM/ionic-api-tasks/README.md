# Ionic React + Express Task Manager

This project was developed for the Mobile Programming course as part of the Week 9 graded activity.

The application allows users to list tasks, create new tasks, and navigate to a detail screen for each task. The frontend was developed with Ionic React and TypeScript, while the backend was developed with Node.js and Express.

## Technologies

- Ionic React
- React
- TypeScript
- Node.js
- Express
- Fetch API
- React Router
- Vite

## Project Structure

```text
ionic-api-tasks/
├── api/
│   ├── server.js
│   ├── package.json
│   └── package-lock.json
│
├── app/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.tsx
│   │   │   └── TaskDetail.tsx
│   │   ├── services/
│   │   │   └── taskApi.ts
│   │   ├── types/
│   │   │   └── Task.ts
│   │   └── App.tsx
│   ├── package.json
│   └── package-lock.json
│
├── .gitignore
└── README.md
```

## API Endpoints

### GET /api/tasks

Returns the complete list of tasks.

Example response:

```json
[
  {
    "id": 1,
    "title": "Study Ionic React",
    "description": "Practice useState, fetch and Ionic components."
  }
]
```

### GET /api/tasks/:id

Returns a specific task using its ID.

Example:

```text
GET /api/tasks/1
```

### POST /api/tasks

Creates a new task.

Example request:

```json
{
  "title": "Finish activity",
  "description": "Complete the Ionic React assignment."
}
```

A successful request returns HTTP status `201 Created`.

## Architecture

The application follows a client-server architecture where the Ionic React frontend communicates with an Express REST API through HTTP requests. The backend exposes `GET /api/tasks` to retrieve all tasks and `POST /api/tasks` to create a new task using JSON data. The API also provides `GET /api/tasks/:id` to retrieve the information required by the detail screen. The frontend consumes these endpoints using the Fetch API through the `taskApi.ts` service. React `useState` is used to manage the task list, form fields, loading state, and error messages. React Router is used to navigate from the main task screen to the task detail screen. Network and HTTP errors are handled with `try/catch` blocks and are displayed to the user when a request fails.

## Error Handling

The application handles network and HTTP errors when communicating with the API.

If the backend is unavailable, the frontend displays an error message instead of failing silently.

The API also validates the information received by the POST endpoint. If the title or description is missing, the API returns:

```text
400 Bad Request
```

## Run the API

Open a terminal inside the `api` directory:

```bash
npm install
npm start
```

The API runs at:

```text
http://localhost:3001
```

## Run the Ionic React Application

Open another terminal inside the `app` directory:

```bash
npm install
npm run dev
```

The application runs at:

```text
http://localhost:5173
```

## Features

- List tasks from the Express API.
- Create new tasks using a form.
- Manage application state with `useState`.
- Consume REST endpoints using `fetch`.
- Display loading indicators.
- Handle network and HTTP errors.
- Navigate to a task detail screen.
- Validate required information in the REST API.