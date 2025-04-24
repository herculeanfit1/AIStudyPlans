# AIStudyPlans Landing Page

A modern, eye-catching landing page for AIStudyPlans - an AI-powered study plan generator. This landing page is built with Next.js 14 and Tailwind CSS, showcasing modern web development techniques and best practices.

## Key Features

- 🚀 Modern, responsive design optimized for all devices
- ✨ Subtle animations and interactive UI elements
- 🔍 SEO-friendly architecture
- 🧪 Comprehensive testing infrastructure (unit tests, E2E tests, performance tests)
- 🐳 Containerized development and testing environment

## Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) with App Router
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Testing**:
  - [Jest](https://jestjs.io/) and [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) for unit tests
  - [Playwright](https://playwright.dev/) for end-to-end testing
  - [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci) for performance testing
- **Containerization**: Docker & Docker Compose

## Getting Started

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/AIStudyPlans.git
   cd AIStudyPlans
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Using Docker

We provide a convenient Docker development environment:

1. Start the development environment:
   ```bash
   ./run-docker.sh start
   ```

2. Access the site at [http://localhost:3001](http://localhost:3001)

3. To stop the development environment:
   ```bash
   ./run-docker.sh stop
   ```

## Testing

### Running Unit Tests

```bash
# Local
npm run test

# With Docker
./run-docker.sh test
```

### Running E2E Tests

```bash
# Local
npm run test:e2e

# With Docker
./run-docker.sh e2e
```

### Running Performance Tests

```bash
# With Docker
./run-docker.sh lighthouse
```

## Project Structure

```
├── app/                  # Next.js App Router structure
│   ├── components/       # React components
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Homepage
├── e2e/                  # End-to-end tests
├── __tests__/            # Unit tests
├── public/               # Static assets
├── docker-compose.yml    # Docker Compose configuration
├── Dockerfile.dev        # Development Dockerfile
├── Dockerfile.test       # Testing Dockerfile
└── run-docker.sh         # Helper script for Docker operations
```

## Deployment

This landing page is designed to be deployed to platforms like Vercel, Netlify, or any other static site hosting service.

```bash
# Build for production
npm run build

# Preview the production build
npm run start
```

## License

[MIT](LICENSE)
