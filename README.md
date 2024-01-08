# Cloud Kitchen Mirch Masala Backend Server Documentation

## Introduction

Welcome to the documentation for the Cloud Kitchen Mirch Masala Backend Server. This server is built using Node.js and Express, leveraging various packages for enhanced functionality and security.

## Table of Contents

1. [Installation](#installation)
2. [Configuration](#configuration)
3. [API Endpoints](#api-endpoints)
   - [User](#user)
   - [Product](#product)
   - [Product Order](#product-order)
   - [Complain](#complain)
   - [Feedback](#feedback)
   - [Review](#review)
4. [Security](#security)

## Installation

To install the required packages, run the following command:

```bash
npm install
```

## Configuration

### Environment Variables

Make sure to create a `.env` file in the root directory with the following variables:

```dotenv
APP_API_KEY=<App security key>
SESSION_SECRET=<Auth session key for login users>
EMAIL_USER=<You email id to send mail>
EMAIL_PASSWORD=<Your email password>
ADMIN_AUTH_KEY=<Admin auth key>
PORT=<Port>
SUPPORT_TEAM=<Support link>
JWT_SECRET=<JWT auth key>
DB_MONGODB_URL=<Database URL>
```

## Start the Server

To start the server, run:

```bash
npm start
```

This will launch the server on the specified port.

## API Endpoints

## Use fetch
```javascript
var myHeaders = new Headers();
//Place all header. According to condition.
myHeaders.append(<KEY>, <Token>);

var requestOptions = {
  method: myMethod,
  headers: myHeaders,
  body: myRaw,
};

let url = `domainName/${apiEndPoints}`

fetch(url, requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));
```

- User this in the place of variable.

## User
 
 ### Users handling
| myMethod | apiEndPoints | myHeaders | myRaw | using for |
|----------|--------------|-----------|-------|-------|
| `POST`   | `users/`     | `mirchmasala-api-key`:`<your key>` | {} | Cheak |
| `POST`   | `users/register`| `mirchmasala-api-key`:`<your key>` | {firstName,lastName,emailId} | Signup |
| `POST`   | `users/verifyOtp` `mirchmasala-api-key`:`<your key>` | {emailId,otp} | OTP verification |
| `POST`   | `users/password`| `mirchmasala-api-key`:`<your key>` | {userId,password} | Create Password |
| `POST`   | `users/addUserName`| `mirchmasala-api-key`:`<your key>` | {userId, password, userName} | add user name |
| `POST`   | `users/login`| `mirchmasala-api-key`:`<your key>` | {loginBy(emailId or userName), password} | login user |
| `POST`   | `users/forgotPassword`| `mirchmasala-api-key`:`<your key>` | {forgotBy(emailId or userName)} | forgot password |
| `POST`   | `users/updateUserData`| `mirchmasala-api-key`:`<your key>` & `x-auth-token`:`<Your token session id>` | {userId, firstName, lastName, userName, address, phoneNumber} | update |
| `POST`   | `users/updatePassword`| `mirchmasala-api-key`:`<your key>` & `x-auth-token`:`<Your token session id>` | {userId, currentPassword, newPassword} | update password |
| `GET`   | `users/profile/:userId` | `mirchmasala-api-key`:`<your key>` & `x-auth-token`:`<Your token session id>` | {} | User Data |
| `GET`   | `users/users`| `mirchmasala-api-key`:`<your key>` & `x-auth-token`:`<Your token session id>` & `x-admin-auth-token`:`<Yore admin token` | {} | all User |

## Product

| myMethod | apiEndPoints | myHeaders | myRaw | using for |
|----------|--------------|-----------|-------|-------|
| `POST`   | `users/`     | `mirchmasala-api-key`:`<your key>` | {} | Cheak |
| `POST`   | `users/register`| `mirchmasala-api-key`:`<your key>` | {firstName,lastName,emailId} | Signup |
| `POST`   | `users/verifyOtp` `mirchmasala-api-key`:`<your key>` | {emailId,otp} | OTP verification |
| `POST`   | `users/password`| `mirchmasala-api-key`:`<your key>` | {userId,password} | Create Password |
| `POST`   | `users/addUserName`| `mirchmasala-api-key`:`<your key>` | {userId, password, userName} | add user name |
| `POST`   | `users/login`| `mirchmasala-api-key`:`<your key>` | {loginBy(emailId or userName), password} | login user |
| `POST`   | `users/forgotPassword`| `mirchmasala-api-key`:`<your key>` | {forgotBy(emailId or userName)} | forgot password |
| `POST`   | `users/updateUserData`| `mirchmasala-api-key`:`<your key>` & `x-auth-token`:`<Your token session id>` | {userId, firstName, lastName, userName, address, phoneNumber} | update |
| `POST`   | `users/updatePassword`| `mirchmasala-api-key`:`<your key>` & `x-auth-token`:`<Your token session id>` | {userId, currentPassword, newPassword} | update password |
| `GET`   | `users/profile/:userId` | `mirchmasala-api-key`:`<your key>` & `x-auth-token`:`<Your token session id>` | {} | User Data |
| `GET`   | `users/users`| `mirchmasala-api-key`:`<your key>` & `x-auth-token`:`<Your token session id>` & `x-admin-auth-token`:`<Yore admin token` | {} | all User |

## Order

| myMethod | apiEndPoints | myHeaders | myRaw | using for |
|----------|--------------|-----------|-------|-------|
| `POST`   | `users/`     | `mirchmasala-api-key`:`<your key>` | {} | Cheak |
| `POST`   | `users/register`| `mirchmasala-api-key`:`<your key>` | {firstName,lastName,emailId} | Signup |
| `POST`   | `users/verifyOtp` `mirchmasala-api-key`:`<your key>` | {emailId,otp} | OTP verification |
| `POST`   | `users/password`| `mirchmasala-api-key`:`<your key>` | {userId,password} | Create Password |
| `POST`   | `users/addUserName`| `mirchmasala-api-key`:`<your key>` | {userId, password, userName} | add user name |
| `POST`   | `users/login`| `mirchmasala-api-key`:`<your key>` | {loginBy(emailId or userName), password} | login user |
| `POST`   | `users/forgotPassword`| `mirchmasala-api-key`:`<your key>` | {forgotBy(emailId or userName)} | forgot password |
| `POST`   | `users/updateUserData`| `mirchmasala-api-key`:`<your key>` & `x-auth-token`:`<Your token session id>` | {userId, firstName, lastName, userName, address, phoneNumber} | update |
| `POST`   | `users/updatePassword`| `mirchmasala-api-key`:`<your key>` & `x-auth-token`:`<Your token session id>` | {userId, currentPassword, newPassword} | update password |
| `GET`   | `users/profile/:userId` | `mirchmasala-api-key`:`<your key>` & `x-auth-token`:`<Your token session id>` | {} | User Data |
| `GET`   | `users/users`| `mirchmasala-api-key`:`<your key>` & `x-auth-token`:`<Your token session id>` & `x-admin-auth-token`:`<Yore admin token` | {} | all User |

## Complain

| myMethod | apiEndPoints | myHeaders | myRaw | using for |
|----------|--------------|-----------|-------|-------|
| `POST`   | `users/`     | `mirchmasala-api-key`:`<your key>` | {} | Cheak |
| `POST`   | `users/register`| `mirchmasala-api-key`:`<your key>` | {firstName,lastName,emailId} | Signup |
| `POST`   | `users/verifyOtp` `mirchmasala-api-key`:`<your key>` | {emailId,otp} | OTP verification |
| `POST`   | `users/password`| `mirchmasala-api-key`:`<your key>` | {userId,password} | Create Password |
| `POST`   | `users/addUserName`| `mirchmasala-api-key`:`<your key>` | {userId, password, userName} | add user name |
| `POST`   | `users/login`| `mirchmasala-api-key`:`<your key>` | {loginBy(emailId or userName), password} | login user |
| `POST`   | `users/forgotPassword`| `mirchmasala-api-key`:`<your key>` | {forgotBy(emailId or userName)} | forgot password |
| `POST`   | `users/updateUserData`| `mirchmasala-api-key`:`<your key>` & `x-auth-token`:`<Your token session id>` | {userId, firstName, lastName, userName, address, phoneNumber} | update |
| `POST`   | `users/updatePassword`| `mirchmasala-api-key`:`<your key>` & `x-auth-token`:`<Your token session id>` | {userId, currentPassword, newPassword} | update password |
| `GET`   | `users/profile/:userId` | `mirchmasala-api-key`:`<your key>` & `x-auth-token`:`<Your token session id>` | {} | User Data |
| `GET`   | `users/users`| `mirchmasala-api-key`:`<your key>` & `x-auth-token`:`<Your token session id>` & `x-admin-auth-token`:`<Yore admin token` | {} | all User |

## Feedback


| myMethod | apiEndPoints | myHeaders | myRaw | using for |
|----------|--------------|-----------|-------|-------|
| `POST`   | `users/`     | `mirchmasala-api-key`:`<your key>` | {} | Cheak |
| `POST`   | `users/register`| `mirchmasala-api-key`:`<your key>` | {firstName,lastName,emailId} | Signup |
| `POST`   | `users/verifyOtp` `mirchmasala-api-key`:`<your key>` | {emailId,otp} | OTP verification |
| `POST`   | `users/password`| `mirchmasala-api-key`:`<your key>` | {userId,password} | Create Password |
| `POST`   | `users/addUserName`| `mirchmasala-api-key`:`<your key>` | {userId, password, userName} | add user name |
| `POST`   | `users/login`| `mirchmasala-api-key`:`<your key>` | {loginBy(emailId or userName), password} | login user |
| `POST`   | `users/forgotPassword`| `mirchmasala-api-key`:`<your key>` | {forgotBy(emailId or userName)} | forgot password |
| `POST`   | `users/updateUserData`| `mirchmasala-api-key`:`<your key>` & `x-auth-token`:`<Your token session id>` | {userId, firstName, lastName, userName, address, phoneNumber} | update |
| `POST`   | `users/updatePassword`| `mirchmasala-api-key`:`<your key>` & `x-auth-token`:`<Your token session id>` | {userId, currentPassword, newPassword} | update password |
| `GET`   | `users/profile/:userId` | `mirchmasala-api-key`:`<your key>` & `x-auth-token`:`<Your token session id>` | {} | User Data |
| `GET`   | `users/users`| `mirchmasala-api-key`:`<your key>` & `x-auth-token`:`<Your token session id>` & `x-admin-auth-token`:`<Yore admin token` | {} | all User |

## Review


| myMethod | apiEndPoints | myHeaders | myRaw | using for |
|----------|--------------|-----------|-------|-------|
| `POST`   | `users/`     | `mirchmasala-api-key`:`<your key>` | {} | Cheak |
| `POST`   | `users/register`| `mirchmasala-api-key`:`<your key>` | {firstName,lastName,emailId} | Signup |
| `POST`   | `users/verifyOtp` `mirchmasala-api-key`:`<your key>` | {emailId,otp} | OTP verification |
| `POST`   | `users/password`| `mirchmasala-api-key`:`<your key>` | {userId,password} | Create Password |
| `POST`   | `users/addUserName`| `mirchmasala-api-key`:`<your key>` | {userId, password, userName} | add user name |
| `POST`   | `users/login`| `mirchmasala-api-key`:`<your key>` | {loginBy(emailId or userName), password} | login user |
| `POST`   | `users/forgotPassword`| `mirchmasala-api-key`:`<your key>` | {forgotBy(emailId or userName)} | forgot password |
| `POST`   | `users/updateUserData`| `mirchmasala-api-key`:`<your key>` & `x-auth-token`:`<Your token session id>` | {userId, firstName, lastName, userName, address, phoneNumber} | update |
| `POST`   | `users/updatePassword`| `mirchmasala-api-key`:`<your key>` & `x-auth-token`:`<Your token session id>` | {userId, currentPassword, newPassword} | update password |
| `GET`   | `users/profile/:userId` | `mirchmasala-api-key`:`<your key>` & `x-auth-token`:`<Your token session id>` | {} | User Data |
| `GET`   | `users/users`| `mirchmasala-api-key`:`<your key>` & `x-auth-token`:`<Your token session id>` & `x-admin-auth-token`:`<Yore admin token` | {} | all User |

# Security

- Authentication

  - User authentication is secured using JSON Web Tokens (JWT).

  - Passwords are hashed using bcrypt for storage.

- Data Validation

  - Input validation is implemented to prevent malicious input.
  - Express Helmet is used to secure the application against common web vulnerabilities.

- Session Management

  - Express Session is utilized for secure session management.

- Email Security
  - Nodemailer is used to send password reset emails securely.
