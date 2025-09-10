# n8nui Express.js Example

This is a minimal implementation of the n8nui pattern using Express.js.

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   # or with pnpm
   pnpm install
   ```
3. Create a `.env` file:
   ```bash
   cp .env.example .env
   ```
4. Edit the `.env` file with your n8n connection details
5. Start the server:
   ```bash
   npm run dev
   ```
6. Open your browser to http://localhost:3000

## Project Structure

- `server.js` - Express server implementation
- `public/` - Static files and client-side code
  - `views/` - HTML templates
    - `start.html` - Page for starting workflows
    - `loading.html` - Page for monitoring workflow execution
- `.env.example` - Example environment variables
- `package.json` - NodeJS dependencies