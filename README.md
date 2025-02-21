# LocalChat

LocalChat is a lightweight, real-time chat application that consists of two repositories: a **client-side** application built with **Next.js**, **DaisyUI**, and **TailwindCSS**, and a **server-side** WebSocket server.

## Features

- Real-time chat functionality using WebSockets
- Clean and modern UI with TailwindCSS and DaisyUI
- Ability to purge messages from the server
- Option to show/hide the server IP address
- Reconnect functionality if disconnected from the server

## Client-Side Setup

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/)
- [Yarn](https://yarnpkg.com/) or [npm](https://www.npmjs.com/)

### Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/oded2/localchat-client.git
   cd localchat-client
   ```

2. Install dependencies:

   ```sh
   npm install
   # or
   yarn install
   ```

3. Create a `.env` file in the root directory and set the WebSocket server IP:

   ```sh
   NEXT_PUBLIC_IP=your-server-ip
   ```

4. Start the development server:
   ```sh
   npm run dev
   # or
   yarn dev
   ```

## Client-Side Configuration

The following environment variable must be set in the `.env` file:

- `NEXT_PUBLIC_IP`: The WebSocket server's IP address.

If you are running the server locally, set it as:

```sh
NEXT_PUBLIC_IP=localhost
```

## Client-Side Usage

1. Open the application in your browser.
2. Enter a message and click **Send** to broadcast it.
3. Click **Purge Server** to clear all messages.
4. Click **Reconnect** if disconnected from the server.
5. Toggle **Show Server IP** to reveal/hide the server's IP address.

## Technologies Used

- **Next.js** - React framework for SSR and static site generation
- **TailwindCSS** - Utility-first CSS framework
- **DaisyUI** - UI components for TailwindCSS
- **WebSockets** - Real-time communication

## Server-Side Repository

The LocalChat server-side repository handles WebSocket connections and message broadcasting. You can find it [here](https://github.com/oded2/localchat-server)

## License

This project is licensed under the MIT License.

---

Feel free to contribute or report issues via GitHub!
