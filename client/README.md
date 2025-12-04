# CrowsNest Mobile Client

The React Native mobile application for CrowsNest, a project management tool built with Expo.

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm start
   ```

3. **Run on your device**:
   - Scan the QR code with the Expo Go app
   - Or run `npm run android` / `npm run ios` for emulators

## Project Structure

- `app/`: Screen components using Expo Router file-based routing
  - `index.tsx`: Home screen with project list
  - `profile.tsx`: User profile management
  - `notifications.tsx`: Notifications screen
  - `support.tsx`: Support and help
  - `refresh.tsx`: Data refresh functionality
  - `_layout.tsx`: Root layout component
- `assets/`: Images and static resources
- `package.json`: Dependencies and scripts

## Key Features

- **Project Management**: View, create, and delete projects
- **Search**: Integrated search functionality
- **QR Scanning**: Barcode/QR code scanning capabilities
- **Navigation**: Tab-based navigation with custom header

## Development

This app uses:
- **Expo Router**: For navigation and routing
- **TypeScript**: For type safety
- **React Native**: For cross-platform mobile development
- **Expo SDK**: For enhanced native features

## Learn More

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [Expo Router Guide](https://docs.expo.dev/router/introduction/)
