# GeoTrail — Testing Evidence

## Overview

This folder contains screenshots collected during the development, testing, and validation of GeoTrail for the Week 14 Mobile Programming assignment.

The screenshots document the application's behavior in a web browser and an Android emulator. They provide visual evidence of hardware integration, authentication, connectivity, error handling, and responsive design.

## Evidence Coverage

The screenshots may include the following validation scenarios:

- **Android execution:** Successful installation and execution of GeoTrail using Android Studio.
- **Authentication:** User login through the application and access to protected features using JWT.
- **GPS integration:** Location coordinates retrieved through the Capacitor Geolocation plugin.
- **Location permissions:** Successful permission authorization and appropriate handling of denied access.
- **Protected API operations:** Successful checkpoint creation and retrieval using an authenticated API request.
- **Connectivity handling:** Error messages displayed when the backend becomes unavailable.
- **Unauthorized access:** Session termination after receiving an HTTP 401 response.
- **Responsive interface:** Interface adaptation to different screen sizes.
- **Automated testing:** Successful execution of unit tests, backend tests, and production build validation.

## Testing Environment

- **Frontend:** Ionic React and TypeScript
- **Native integration:** Capacitor
- **Hardware plugin:** Capacitor Geolocation
- **Connectivity plugin:** Capacitor Network
- **Development environment:** Visual Studio Code and Android Studio
- **Platform:** Android Emulator and web browser
- **Backend:** Local REST API with JWT authentication
- **Testing tools:** Vitest, Node.js Test Runner, and Android Debug Bridge (ADB)

## Evidence Organization

Screenshots are stored directly in this directory without a required naming convention or chronological order.

Each image represents an actual test or observation performed during development. Screenshots are intended to complement the project's source code, automated tests, and main README documentation.

The evidence focuses on demonstrating the implemented functionality rather than prescribing a specific execution sequence.

## Privacy and Security

GPS coordinates used during Android testing were simulated through the Android emulator.

Screenshots should not expose real authentication tokens, private credentials, sensitive user information, or personal location data.

The local HTTP configuration is used exclusively for development and emulator testing. Production deployments should use HTTPS and appropriate security restrictions.

## Conclusion

The collected evidence supports the verification of GeoTrail's main requirements, including native hardware access, permission management, authenticated API communication, connectivity error handling, responsive navigation, and automated quality checks.

For installation instructions, architecture details, and test execution commands, refer to the main project README.