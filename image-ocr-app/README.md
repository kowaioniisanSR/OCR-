# Image OCR App

This project is a web application that allows users to upload images and extract text from them using Optical Character Recognition (OCR) technology.

## Project Structure

The project consists of the following files:

- **css/styles.css**: This file defines the styles for the website, including font, color, and layout rules.
- **js/app.js**: This file contains the main logic of the application, implementing the functionality to upload images and extract text using OCR.
- **index.html**: This is the main HTML file for the website, which structures the user interface and links the CSS and JavaScript files.

## Installation

1. Clone the repository to your local machine.
2. Open the `index.html` file in your web browser to view the application.

## Usage

1. Click on the upload button to select an image file from your device.
2. Once the image is uploaded, the application will process the image and extract any text it contains.
3. The extracted text will be displayed on the screen.

## Security and Privacy

- Image recognition runs in the browser; this app does not upload the selected image to a server.
- Images larger than 15 MB are rejected to limit browser memory use.
- The Tesseract.js browser bundle is pinned to version 5.1.1 and protected with SRI. Its worker/core and language-data URLs are version-pinned, and the CSP allows only those resource hosts and paths.
- OCR requires an internet connection. SRI verifies the initial Tesseract.js bundle, but does not verify worker scripts, WASM, or language data loaded later.
- Self-hosting would remove runtime requests to third-party CDNs and make those files independently auditable, but the worker, selected core, and Japanese/English language data total about 34 MB before adding alternative core builds for broader hardware compatibility. It also requires maintaining those files. This app currently downloads only the requested Japanese and English data as needed, so self-hosting is deferred until offline use or tighter supply-chain control is required.
- The CSP is delivered through a meta element for static hosting. If the hosting provider supports response headers, move the policy to an HTTP header for directives that meta policies cannot enforce, such as `frame-ancestors`.
- Only PNG, JPEG, and WebP files are accepted. The browser-provided MIME type is checked, but it is metadata and not a cryptographic proof of file contents.
- GitHub repositories and GitHub Pages may be public. Do not publish confidential images or secrets in the repository.

## Technologies Used

- HTML
- CSS
- JavaScript
- OCR Library (e.g., Tesseract.js)

## Contributing

Feel free to submit issues or pull requests if you would like to contribute to the project.