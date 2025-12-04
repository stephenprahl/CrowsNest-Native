# CrowsNest Native

A mobile project management application built with Expo React Native and TypeScript. CrowsNest allows users to manage construction and renovation projects with features like project creation, search, QR code scanning, and more.

**Built by P&R Tech**

## Features

- **Project Management**: Create, view, and delete projects with details like name, address, and last updated time
- **Search Functionality**: Integrated search that replaces the navbar for focused project discovery
- **QR Code Scanning**: Scan QR codes for quick project access or data entry
- **User Profile**: Manage user settings and account information
- **Notifications**: Stay updated with project notifications
- **Support**: Access help and support resources
- **Modern UI**: Clean, dark-themed interface optimized for mobile devices

## Project Structure

- `client/`: Expo React Native app using `expo-router` for navigation
  - `app/`: File-based routing screens (index, profile, notifications, support, refresh)
  - `assets/`: Images and other static assets
- `server/`: Minimal TypeScript server (example setup with Bun)
- `README.md`: This file

## Prerequisites

- Node.js (v16 or later)
- Expo CLI: `npm install -g @expo/cli`
- Bun (recommended for server): https://bun.sh

## Quick Start

1. **Install dependencies**:
   ```bash
   # Client
   cd client && npm install

   # Server (optional)
   cd ../server && npm install
   ```

2. **Start the development server**:
   ```bash
   cd client
   npm start
   ```

3. **Run on device/emulator**:
   - Press `a` for Android emulator
   - Press `i` for iOS simulator
   - Scan QR code with Expo Go app for physical device

4. **Optional: Run the server**:
   ```bash
   cd server
   bun index.ts
   ```

## App Navigation

- **Home**: Project list with search and create functionality
- **Profile**: User account management
- **Notifications**: Project updates and alerts
- **Support**: Help and contact information
- **Refresh**: Data synchronization

## Key Interactions

- **Search**: Tap search icon in navbar to replace header with search input
- **Create Project**: Tap the red FAB button to open project creation modal
- **Delete Project**: Long press on a project card to open delete confirmation
- **QR Scanner**: Access via search bar or other integrated features

## Development

This project uses:
- **Expo Router**: File-based routing for React Native
- **TypeScript**: Type-safe development
- **React Native**: Cross-platform mobile development
- **Expo SDK**: Enhanced native capabilities

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test on multiple platforms
5. Submit a pull request

## License

This project is proprietary software developed by P&R Tech.

