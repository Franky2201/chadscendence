_This project has been created as part of the 42 curriculum by ade-woel, gde-win, juhanse, mmichele and sdemey._

# ft_transcendance

<!-- TODO : Update TOC -->

- [Description](#description)
- [Instruction](#instruction)
    - [Environment variables](#environment-variables)
- [Ressources](#ressources)
    - [Documentation](#documentation)
    - [References](#references)
    - [Usage of AI](#usage-of-ai)
- [Team information](#team-information)
- [Project management](#project-management)
    - [Development](#development)
    - [Tools and infrastructure](#tools-and-infrastructure)
    - [Communication channels](#communication-channels)
- [Technical stack](#technical-stack)
- [Database schema](#database-schema)
- [Feature list](#feature-list)
- [Modules](#modules)
- [Individual contribution](#individual-contribution)
    - [`ade-woel`](#ade-woel)
    - [`gde-win`](#gde-win)
    - [`juhanse`](#juhanse)
    - [`mmichele`](#mmichele)
    - [`sdemey`](#sdemey)
- [Public API Endpoints](#public-api-endpoints)
- [Credits](#credits)

## Description

<p align="center"><img src="apps/frontend/public/game_banner.png"/></p>

**Who's the Chad ?** is a website that provides primitive minigames, around knowledge and reflection.
The objective of this project is to provide a fun way to learn things, train your brain or have fun with your friends.

## Instruction

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) must be installed on your machine.
- `make` must be available.

### Installation & Execution

To start the project, simply clone the repository and run `make`:

```bash
git clone <repository-url>
cd chadscendence
make
```

This command will:

1. Copy `.env.example` to `.env` if it doesn't exist.
2. Build the optimized production stages of the Docker images.
3. Start the application in a stable environment.

**Access the application:**

- Frontend: `http://localhost:5173` (Nginx)
- Backend API: `http://localhost:3000` (NestJS)

### Development Mode

For active development with **hot-reloading** enabled via [Docker Compose Watch](https://docs.docker.com/compose/file-watch/):

```bash
# During development, 'make' currently defaults to 'make dev'
make dev
```

### Useful Commands

- `make prod`: Start the production environment (Evaluation ready).
- `make dev`: Start the development environment with hot-reloading enabled.
- `make down`: Stop and remove the containers.
- `make logs`: Follow the container logs.
- `make fclean`: Deep clean (removes Docker images and volumes).

### Environment variables

An `.env` file must be created at the root of the repository containing the necessary environment variables, for the project.
These are detailed in the [.env.example](.env.example) file.

## Ressources

<!-- TODO : Add ressources, used to create the project -->

### Documentation

| Technology / Framework | Subject                                                                                              | Author                                                 |
| ---------------------- | ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| NestJS                 | [Official Documentation](https://docs.nestjs.com/)                                                   |                                                        |
| "                      | [Every Concept Explained in 9 Minutes](https://www.youtube.com/watch?v=IdsBwplQAMw)                  | [Tech Vision](https://www.youtube.com/@tech-vision-io) |
| "                      | [Crash Course: Learn in 25 Minutes](https://www.youtube.com/watch?v=2gtiffE3__U)                     | "                                                      |
| "                      | [Microservices](https://www.youtube.com/watch?v=I8cs8fJYF_w)                                         | "                                                      |
| "                      | [Authentication](https://www.youtube.com/watch?v=i-howKMrtCM)                                        | "                                                      |
| "                      | [Course for Beginners - Build Server-Side Applications](https://www.youtube.com/watch?v=21_I-12f5JE) | [freeCodeCamp](https://www.freecodecamp.org/)          |
| Tailwind CSS           | [Official Documentation](https://tailwindcss.com/docs/installation/using-vite)                       |                                                        |
| TypeScript             | [Official Documentation](https://www.typescriptlang.org/docs/)                                       |                                                        |
| React                  | [Official Documentation](https://react.dev/)                                                         |                                                        |

### References

<!-- TODO : Add references, justification to content used inside this document -->

### Usage of AI

<!-- TODO : Usage of AI -->

- Builtin GitHub, copilot for pull request reviews.

## Team information

| Member     | Role            | Responsibilities                                                                                  |
| ---------- | --------------- | ------------------------------------------------------------------------------------------------- |
| `ade-woel` | Project Manager | Ensuring recuring meetings and orcherstrating them.                                               |
| `gde-win`  | Technical Lead  | Maintaining the infrastructure, dependencies, and CI/CD pipelines.                                |
| `juhanse`  | Product Owner   | Maintaining clear objectives for the project, via GitHub issues mapped into kanbans and roadmaps. |
| `mmichele` | <!-- TODO -->   | <!-- TODO -->                                                                                     |
| `sdemey`   | <!-- TODO -->   | <!-- TODO -->                                                                                     |

Every member is also developer, so responsible of programming features.

## Project management

### Development

<!-- TODO : Explain how the team organized their work -->

### Tools and infrastructure

<!-- TODO : Explain the tools used to achieve this
- GitHub CI/CD
-->

### Communication channels

At first we used a Slack group, which felt not versatile enough to organize ourselves, so we moved to a Discord server, using the following features ;

- it's built-in event calendar to publish meeting apointements,
- voice and stage channels for day-to-day working and meetings,
- forum channels to save important ressources,
- an automated announcement channel using a GitHub webhook, announcing important updates of the project,
- and obviously a text channel and threads for textual communication and topic filtering.

## Technical stack

<!-- TEMPLATE : <a href="" title=""><img src=""></a> -->

|              | Framworks / Technologies                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| :----------: | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Frontend** | <a href="https://www.typescriptlang.org/" title="TypeScript"><img src="https://skillicons.dev/icons?i=ts"></a> <a href="https://react.dev/" title="React"><img src="https://skillicons.dev/icons?i=react"></a> <a href="https://vite.dev/" title="Vite"><img src="https://skillicons.dev/icons?i=vite"></a> <a href="https://tailwindcss.com/" title="Tailwind"><img src="https://skillicons.dev/icons?i=tailwind"></a>                                                                                                                                                                                                                   |
| **Backend**  | <a href="https://www.typescriptlang.org/" title="TypeScript"><img src="https://skillicons.dev/icons?i=ts"></a> <a href="https://nestjs.com/" title="NestJS"><img src="https://skillicons.dev/icons?i=nest"></a>                                                                                                                                                                                                                                                                                                                                                                                                                           |
| **Database** | <a href="https://www.postgresql.org/" title="PostgreSQL"><img src="https://skillicons.dev/icons?i=postgres"></a> <a href="https://typeorm.io/" title="TypeORM"><img src="doc/readme/typeorm.png" width="50" height="50" alt="TypeORM"></a>                                                                                                                                                                                                                                                                                                                                                                                                |
|  **Other**   | <a href="https://www.markdownguide.org/" title="Markdown"><img src="https://skillicons.dev/icons?i=markdown"></a> <a href="https://www.docker.com/" title="Docker"><img src="https://skillicons.dev/icons?i=docker"></a> <a href="https://nodejs.org/en" title="NodeJS"><img src="https://skillicons.dev/icons?i=nodejs"></a> <a href="https://www.npmjs.com/" title="NPM"><img src="https://skillicons.dev/icons?i=npm"></a> <a href="https://eslint.org/" title="ESLint"><img src="doc/readme/eslint.png" width=50 height=50></a> <a href="https://krita.org/en/" title="Krita"><img src="doc/readme/krita.png" width=50 height=50></a> |

- **TypeScript** on both frontend and backend enables shared types, safer refactors, and fewer runtime errors.
- **React** + **Vite** provide a fast development loop with component-driven UI and instant feedback.
- **Tailwind CSS** accelerates UI iteration while keeping the design system consistent.
- **NestJS** offers a modular, test-friendly architecture with dependency injection and clear separation of concerns.
- **PostgreSQL** + **TypeORM** give a reliable relational model with migrations and strong data integrity.
- **Docker** ensures reproducible environments across local development, CI, and production.
- **Node.js** + **npm** keep tooling consistent and unlock a large ecosystem of libraries.
- **ESLint** enforces code quality and consistency accross contributors while helping to catch issues early.
- **Markdown** support clear documentation.
- **Krita** allows custom-made visual assets, while being a free software, so anyone can easily open `.kra` files.

## Database schema

<!-- TODO : Visual diagram (ER diagram) of the database stucture -->

## Feature list

<!-- TODO : Complete list of the implemented features -->
<!-- TODO : Brief explanation of the feature -->
<!-- TODO : Which member worked on which feature -->

## Modules

| Module                                                                      | Status   | Points        | Contributors                                                                                              |
| --------------------------------------------------------------------------- | -------- | ------------- | --------------------------------------------------------------------------------------------------------- |
| Use a framework for both the frontend and backend.                          | Finished | Major         | [ade-woel](#ade-woel), [gde-win](#gde-win), [juhanse](#juhanse), [mmichele](#mmichele), [sdemey](#sdemey) |
| Implement real-time features ...                                            | Ongoing  | Major         |                                                                                                           |
| Allow users to interact with other users.                                   | Ongoing  | Major         |                                                                                                           |
| Public API                                                                  | Ongoing  | Major         |                                                                                                           |
| Use an ORM for the database.                                                | Finished | Minor         |                                                                                                           |
| Custom-made design system with reusable component ...                       | Finished | Minor         |                                                                                                           |
| Advanced search ...                                                         | ?        | Minor         |                                                                                                           |
| WCAG 2.1 AA                                                                 | ?        | Major         |                                                                                                           |
| Support multiples languages (at least 3)                                    | Ongoing  | Minor         |                                                                                                           |
| Support for additional browser                                              | Ongoing  | Minor         |                                                                                                           |
| Standard user management and authentication                                 | Finished | Major         |                                                                                                           |
| Game statistics and match history                                           | Ongoing  | Minor         |                                                                                                           |
| Remote authentication with OAuth 2.0                                        | Finished | Minor         |                                                                                                           |
| Advanced permissions system                                                 | ?        | Major         |                                                                                                           |
| An organization system                                                      | ?        | Major         |                                                                                                           |
| User activity analytics and insights dashboard                              | ?        | Minor         |                                                                                                           |
| Implement a complete web-based game where users can play against each other | Ongoing  | Major         |                                                                                                           |
| Remote players                                                              | Ongoing  | Major         |                                                                                                           |
| Multiplayer game (more than two players)                                    | Ongoing  | Major         |                                                                                                           |
| Add another game with user history and matchmaking                          | ?        | Major         |                                                                                                           |
| Advanced chat features                                                      | Ongoing  | Minor         |                                                                                                           |
| Tournament system                                                           | ?        | Minor         |                                                                                                           |
| Game customization                                                          | Ongoing  | Minor         |                                                                                                           |
| A gamification system to reward users for their actions                     | Ongoing  | Minor         |                                                                                                           |
| Implement spectator mode for games                                          | ?        | Minor         |                                                                                                           |
| Backend as microservices                                                    | ?        | Major         |                                                                                                           |
| Advanced analytics dashboard with data visualization                        | ?        | Major         |                                                                                                           |
|                                                                             |          |
| **TOTAL**                                                                   | 25pts    | 7 / 14 (\*19) |

<!-- TODO : List of all chosen modules -->
<!-- TODO : Point calculation -->
<!-- TODO : Module choice justification -->
<!-- TODO : How each module was implemented -->
<!-- TODO : Which member worked on which module -->

## Individual contribution

<!-- TODO : Detailed breakdown to what each member contributed to. Specific modules, or components. (Reference the subsection from #modules section) -->
<!-- TODO : Any challenge faced and how they were overcome -->

### `ade-woel`

- Created the `/profile` page.

### `gde-win`

- Maintaining the project structure and all the frameworks / technologies used.
- Maintaining continuous integration and delivery pipelines in GitHub, executing various tests before each branch merge with main.

### `juhanse`

- Maintaining the user stories, via GitHub issues.
- Authentification via email and password.
- Remote authentification with Oauth2.0 for 42 members.
- Created the `/` page.

### `mmichele`

- Maintaining the README.md file.
- Creating frontend reusable components.

### `sdemey`

- Remote authentification with Oauth2.0 for GitHub users.
- Created the `/about` page.

## Public API Endpoints

| Method | Location                |
| ------ | ----------------------- |
| `GET`  | `api/ranks`             |
| `GET`  | `api/users/leaderboard` |

## Credits

<!-- TODO : Add credits to the ENERGY font -->
