# Single Sign-On Example

This repository contains a simple Single Sign-On (SSO) implementation using Node.js and Express. It demonstrates how to generate tokens, perform token verification, and handle redirects.

## Getting Started

Follow these steps to set up and run the SSO example on your local machine.

### Prerequisites

- Node.js (v14 or later)
- npm (Node Package Manager)

### Installation

1. Clone this repository to your local machine:

```sh
git clone https://github.com/BITS-ETC/aim-sso-mock
```

Navigate to the project directory:
```sh
cd sso-example
```
Install the required dependencies:
```sh
npm install
```

Create a .env file in the project directory and set the PORT environment variable:
```env
PORT=3000
```

Start the application:
```sh
npm start
```

The application should now be running at http://localhost:3000.

### Usage

#### Endpoints
**/sso**: This endpoint initiates the SSO process. It expects query parameters redirect_uri and user. It generates a token based on the user's name and redirects to the provided redirect_uri with the token appended as a query parameter.

**/sso/verify/:token**: This endpoint verifies the provided token. If the token matches a user's token, it responds with the corresponding user's information. Otherwise, it returns an error response.

#### Available users
```
johnston_k
hudson_b
baumbach_c
mann_t
jaskolski_c
orn_r
barton_j
kuphal_r
berge_c
kassulke_c
```

### Examples

Assuming the application is running on http://localhost:3000:

To initiate the SSO process and obtain a token:
```http request
GET http://localhost:3000/sso?redirect_uri=https://example.com/callback&user=johnston_k
```

To verify a token:
```http request
GET http://localhost:3000/sso/verify/:token
```
