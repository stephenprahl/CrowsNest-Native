# CrowsNest Native

A comprehensive mobile project management application designed specifically for construction and renovation professionals. Built with Expo React Native and TypeScript, CrowsNest streamlines project workflows from initial planning to completion, enabling teams to collaborate efficiently on-site and remotely.

**Built by P&R Tech**

## Features

### Core Project Management
- **Project Creation & Management**: Create, view, edit, and delete construction/renovation projects with detailed information including name, address, and last updated timestamps
- **Advanced Search**: Integrated search functionality that replaces the navigation bar for focused project discovery
- **QR Code & Barcode Scanning**: Scan QR codes and barcodes for quick project access, data entry, or linking to physical documents

### Team Collaboration
- **People Management**: Invite team members by email or import from device contacts
- **Project Teams**: Assign and manage people specific to each project
- **Notifications**: Stay updated with project notifications and alerts

### Project Details & Documentation
- **Floor Plans**: Interactive floor plan viewer with zoom, search, and filtering capabilities
- **Specifications**: Manage project specifications and requirements
- **Task Management**: Create and track project tasks and milestones
- **Photo Management**: Upload and organize project photos
- **Forms**: Digital forms for inspections, checklists, and documentation
- **File Storage**: Secure storage and organization of project documents and files

### User Experience
- **User Profile**: Manage account settings and personal information
- **Support**: Access help resources and contact support
- **Data Management**: Monitor and manage app cache and storage preferences
- **Modern UI**: Clean, dark-themed interface optimized for mobile devices with haptic feedback and smooth animations

### Technical Features
- **Offline Capability**: Core functionality works offline with data synchronization
- **Cross-Platform**: Native performance on iOS and Android devices
- **Expo Integration**: Leverages Expo SDK for enhanced native capabilities

## Project Structure

- `client/`: Expo React Native app using `expo-router` for navigation
  - `app/`: File-based routing screens
    - `index.tsx`: Home screen with project list, search, and creation
    - `profile.tsx`: User account management
    - `notifications.tsx`: Project updates and alerts
    - `support.tsx`: Help and contact information
    - `people.tsx`: Team member management and invitations
    - `data.tsx`: Cache and storage preferences
    - `project/`: Project-specific screens
      - `[id].tsx`: Detailed project view with sidebar navigation
      - `floor-plan/`: Floor plan management
        - `[id].tsx`: Interactive floor plan viewer
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

- **Home**: Project list with search, create, and delete functionality
- **People**: Team member management and invitations via email or contacts
- **Profile**: User account management
- **Notifications**: Project updates and alerts
- **Support**: Help and contact information
- **Data**: Cache and storage preferences
- **Project Details**: Comprehensive project view with sections for:
  - Plans (including floor plans)
  - Specifications
  - Tasks
  - Photos
  - Forms
  - Files
  - People
  - Settings

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

