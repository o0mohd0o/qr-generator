# QR Code Generator with URL Shortening

## Overview
This is a React-based QR code generator that allows users to create QR codes from URLs. The application also includes URL shortening functionality, using the company domain (http://bonlineco.com/) to create shortened URLs that are then encoded into QR codes.

## Features
- Generate QR codes from any valid URL
- Shorten URLs using the company domain (http://bonlineco.com/)
- Copy shortened URLs to clipboard
- Download generated QR codes as PNG images
- Responsive design that works on desktop and mobile devices

## Technologies Used
- React.js
- qrcode.react for QR code generation
- CSS for styling

## Installation

1. Clone the repository:
```
git clone <repository-url>
cd qr-generator
```

2. Install dependencies:
```
npm install
```

3. Start the development server:
```
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view the application in your browser.

## Usage

1. Enter a URL in the input field (must start with http:// or https://)
2. Click the "Shorten & Generate QR" button
3. The application will generate a shortened URL and corresponding QR code
4. You can copy the shortened URL to clipboard or download the QR code as a PNG image

## Production Build

To create a production build, run:
```
npm run build
```

This will create optimized files in the `build` folder that can be deployed to any static hosting service.

## Future Enhancements

- Integration with a real URL shortening API
- Custom QR code styling options
- Analytics for tracking QR code scans
- User authentication for managing created QR codes

## License

This project is proprietary and owned by Bonline Co.

© 2025 Bonline Co. All rights reserved.
