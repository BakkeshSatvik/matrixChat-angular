# Matrix Chat - Angular

This is an Angular-based Matrix protocol chat application, converted from the React version at [BakkeshSatvik/matrixChat](https://github.com/BakkeshSatvik/matrixChat).

## Features

- **Authentication**: Login and registration with Matrix homeserver support
- **Real-time Messaging**: Send and receive messages in real-time
- **Room Management**: Create and join chat rooms
- **Session Persistence**: Automatic login with saved sessions
- **WebRTC Calls**: Voice and video calling support
- **Notifications**: Browser notifications for new messages
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Angular 19**: Modern standalone components with security patches
- **TypeScript 5**: Type-safe development
- **Matrix JS SDK v40.3**: Matrix protocol integration
- **Tailwind CSS 3**: Utility-first styling
- **RxJS**: Reactive state management

## Prerequisites

- Node.js 18+ and npm
- A Matrix account (or you can register on matrix.org)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/BakkeshSatvik/matrixChat-angular.git
cd matrixChat-angular
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open your browser and navigate to `http://localhost:4200`

## Usage

### Login

1. Navigate to the login page
2. Enter your homeserver URL (e.g., `https://matrix.org`)
3. Enter your Matrix username and password
4. Click "Sign in"

### Registration

1. Navigate to the registration page
2. Enter your desired homeserver URL
3. Choose a username and password
4. Click "Create account"

### Sending Messages

1. After logging in, you'll see your room list in the sidebar
2. Click on a room to open the chat
3. Type your message in the input field at the bottom
4. Press Enter or click "Send" to send the message

## Build

To build the application for production:

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Development

### Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── auth/          # Login and registration
│   │   ├── chat/          # Chat components
│   │   ├── modals/        # Modal dialogs
│   │   ├── drawers/       # Side drawers
│   │   └── shared/        # Shared components
│   ├── services/          # Angular services
│   │   ├── matrix-client.service.ts  # Matrix SDK wrapper
│   │   ├── session.service.ts        # Session management
│   │   ├── notification.service.ts   # Browser notifications
│   │   └── call.service.ts          # WebRTC calls
│   ├── models/            # TypeScript interfaces
│   ├── guards/            # Route guards
│   └── utils/             # Utility functions
├── assets/                # Static assets
└── styles/                # Global styles
```

### Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm run watch` - Build in watch mode
- `npm test` - Run unit tests
- `npm run lint` - Run linter

## Configuration

The application uses the following environment variables:

- `defaultHomeserver`: Default Matrix homeserver URL (default: `https://matrix.org`)

Edit `src/environments/environment.ts` for development and `src/environments/environment.prod.ts` for production.

## Testing

Run the test suite:

```bash
npm test
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Acknowledgments

- Original React version: [BakkeshSatvik/matrixChat](https://github.com/BakkeshSatvik/matrixChat)
- Matrix protocol: [matrix.org](https://matrix.org)
- Matrix JS SDK: [matrix-org/matrix-js-sdk](https://github.com/matrix-org/matrix-js-sdk)
