<div align="center">
  <img src="./Logo/logo.png" alt="VibeAnalyze Logo" width="300px" />
  <h1 align="center">VibeAnalyze</h1>
  <p align="center">
    An AI-powered platform to gain deep, actionable insights from the comments of social media posts.
    <br />
    <a href="https://vibeanalyze.erfansafari.me/"><strong>Explore the Live Demo »</strong></a>
  </p>
</div>

---

## About The Project

VibeAnalyze is a modern web application designed to provide deep, AI-driven insights into audience engagement. The primary function of the application is to analyze the sentiment, tone, and various other linguistic metrics within the **comments** of public social media posts. By leveraging a robust backend API and an intuitive React-based frontend, VibeAnalyze transforms raw user feedback into structured, actionable data, enabling content creators and marketers to better understand their audience's reception and refine their strategies.

---

## Key Features

- **Multi-Platform Analysis**: Analyze comments from major platforms like Telegram, Instagram, YouTube, and more.
- **Advanced AI Insights**: Get detailed analysis on sentiment, tone, emotions, keywords, and topics.
- **Persistent Results**: Analysis data is saved in the browser, so you can refresh the results page without losing data.
- **Professional Error Handling**: User-friendly error messages for both full-page errors (like 404s) and non-intrusive toast notifications.
- **Production-Grade Monitoring**: Integrated with **Sentry** for comprehensive error tracking, performance monitoring, and session replay.
- **Responsive Design**: A clean, modern, and fully responsive UI that works beautifully on all devices.

---

## Tech Stack

The project is built with a modern, scalable, and maintainable technology stack for both the frontend and backend.

### Frontend

| Technology       | Description                                    |
| ---------------- | ---------------------------------------------- |
| **React.js**     | For building the user interface.               |
| **Vite**         | A modern, fast build tool.                     |
| **Tailwind CSS** | A utility-first CSS framework for styling.     |
| **React Router** | For client-side routing and navigation.        |
| **Axios**        | For making HTTP requests to the backend API.   |
| **Sentry**       | For error and performance monitoring.          |
| **pnpm**         | The package manager for dependency management. |

### Backend

| Technology            | Description                                         |
| --------------------- | --------------------------------------------------- |
| **Node.js**           | The JavaScript runtime environment.                 |
| **NestJS**            | A progressive Node.js framework for the server.     |
| **Prisma**            | A next-generation ORM for database access.          |
| **PostgreSQL**        | The relational database for data persistence.       |
| **Google Gemini API** | The AI service for comment analysis.                |
| **BullMQ**            | A job queue system for handling asynchronous tasks. |

---

## Frontend Project Structure

The frontend project follows a professional, feature-colocated architecture to keep the codebase clean and maintainable.

```
src/
├── assets/         # Static assets like images
├── components/     # Shared, reusable UI components (Layout, Error, Loading)
├── contexts/       # React Context providers for global state
├── errors/         # Centralized error handling logic and components
├── features/       # Self-contained feature modules (e.g., analysis)
├── hooks/          # Shared, reusable custom hooks
├── pages/          # Top-level page components (Home, About Us)
├── services/       # All API communication functions
└── utils/          # General utility and helper functions
```

---

## Author

| Name         | Role                | GitHub Profile                                         |
| ------------ | ------------------- | ------------------------------------------------------ |
| Erfan Safari | Frontend Programmer | [@ErfanSafari0503](https://github.com/ErfanSafari0503) |
