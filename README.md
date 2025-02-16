# B2B Data Catalog App

## Overview

The **B2B Data Catalog App** is a minimal web application. Built with **Next.js**, it utilizes **Prisma** for database management, **PostgreSQL** as the database, and **NextAuth** for authentication, ensuring a robust and secure user experience.

## Features

- **Next.js**: A React framework for building server-rendered applications.
- **Prisma**: An ORM that simplifies database interactions.
- **PostgreSQL**: A powerful, open-source relational database.
- **NextAuth**: A comprehensive authentication solution for Next.js applications.
- **Responsive Design**: Optimized for both desktop and mobile devices, built with Tailwind CSS and Radix UI for full accessibility.
- **Linting and Formatting**: Integrated tools for maintaining code quality, including biomejs, husky for pre-commit hooks, and lint-staged for formatting.

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- PostgreSQL (version 12 or higher) [Run PostgreSQL with Docker]:
```bash
docker run --name postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres
```
- pnpm (version 8.0 or later)

Ensure you have [pnpm](https://pnpm.io) installed. If not, you can install it using:

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/arunkumar201/b2b-data-catalog-app.git
   cd b2b-data-catalog-app
   ```

2. Install dependencies:

   ```bash
   npm install -g pnpm
   pnpm install
   ```

3. Set up your PostgreSQL database and update the `.env` file with your database connection string.

4. Run the Prisma migrations:

   ```bash
   pnpm prisma:migrate
   ```

5. Seed the database (if applicable):

   ```bash
   pnpm seed:data
   ```

6. Start the development server:

   ```bash
   pnpm run dev
   ```

### Usage

- Navigate to `http://localhost:3000` in your browser to access the application.
- Utilize the authentication features provided by NextAuth to log in and manage your data.

## Scripts

- `dev`: Start the development server.
- `build`: Build the application for production.
- `start`: Start the production server.
- `lint`: Check for linting errors.
- `format`: Format the codebase.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Prisma](https://www.prisma.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [NextAuth](https://next-auth.js.org/)

````
