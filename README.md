# Cloud Kitchen Mirch Masala Backend Server Documentation

## Introduction

Welcome to the documentation for the Cloud Kitchen Mirch Masala Backend Server. This server is built using Node.js and Express, leveraging various packages for enhanced functionality and security.

## TO CHEAK this BACKEND SERVER VISIT ON API END POINTS `https://cloude-kitchen-backend-server.onrender.com` ON POSTMAN OR ANOTHER TESTER.

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
| `POST`   | `users/verifyOtp` | `mirchmasala-api-key`:`<your key>` | {emailId,otp} | OTP verification |
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
| `POST`   | `products`| `mirchmasala-api-key`:`<your key>` | {userId,password} | Cheak |
| `POST`   | `products/add`     | `mirchmasala-api-key`:`<your key>` & `x-admin-auth-token`:`<Yore admin token` | {ProductId, name, title, description, originalPrice, discountedPrice, rating, images, keyWords, quentity, category, deal} | new product add |
| `GET`   | `products/get`| `mirchmasala-api-key`:`<your key>` | {} | All products |
| `GET`   | `products/get/:ProductId` `mirchmasala-api-key`:`<your key>` | {} | Specific product by ProductId |
| `PUT`   | `products/update/:ProductId`| `mirchmasala-api-key`:`<your key>` & `x-admin-auth-token`:`<Yore admin token`  | {ProductId, name, title, description, originalPrice, discountedPrice, rating, images, keyWords, quentity, category, deal} | Update a product |
| `DELETE`   | `products/delete/:ProductId`| `mirchmasala-api-key`:`<your key>` & `x-admin-auth-token`:`<Yore admin token` | {} | Delete a product |

## Order

| myMethod | apiEndPoints | myHeaders | myRaw | using for |
|----------|--------------|-----------|-------|-------|
| `POST`   | `orders/`     | `mirchmasala-api-key`:`<your key>` | {} | Cheak |
| `POST`   | `orders/place`| `mirchmasala-api-key`:`<your key>` | {"products": [{"productId": "902","productAmount": 500,"quantity": 2}],"productsAmount": 500,"totalAmount": 800,"delivertAddress": {"zipCode": "12345","state": "YourState","city": "YourCity","street": "YourStreet","nearBy": "YourNearBy"},"contactNumber": "8833005008","userId": '<Your-login-user-id>'}
 | Create new order |
| `GET`   | `orders/get` |`mirchmasala-api-key`:`<your key>` & `x-admin-auth-token`:`<Yore admin token` | {} | Get all orders |
| `GET`   | `orders/get/:id`| `mirchmasala-api-key`:`<your key>` | {userId,password} | specific order show |
| `PUT`   | `orders/update/:id`| `mirchmasala-api-key`:`<your key>` | {delivertAddress:{nearBy,street,city,zipCode},contactNumber,status} | Update order |
| `PUT`   | `orders/updateStatus/:id`| `mirchmasala-api-key`:`<your key>` & `x-admin-auth-token`:`<Yore admin token` | {status} | Update order Status |
| `DELETE`   | `orders/delete/:id`| `mirchmasala-api-key`:`<your key>` & `x-admin-auth-token`:`<Yore admin token` | {} | Delete order |


## Complain

| myMethod | apiEndPoints | myHeaders | myRaw | using for |
|----------|--------------|-----------|-------|-------|
| `POST`   | `complain/`     | `mirchmasala-api-key`:`<your key>` | {} | Cheak |
| `POST`   | `complain/post`| `mirchmasala-api-key`:`<your key>` | {userId,description} | Create complaint |
| `GET`   | `complain/get` |`mirchmasala-api-key`:`<your key>` & `x-auth-token`:`<Your token session id>` | {} | Get all complaints |
| `GET`   | `complain/get/:id`| `mirchmasala-api-key`:`<your key>` | {} | Get a specific complaint |
| `PUT`   | `complain/update/:id`| `mirchmasala-api-key`:`<your key>` | {userId,description} | Update a complaint |
| `DELETE`   | `complain/delete/:id`| `mirchmasala-api-key`:`<your key>` | {} | Delete a complaint |

## Feedback


| myMethod | apiEndPoints | myHeaders | myRaw | using for |
|----------|--------------|-----------|-------|-------|
| `POST`   | `feedback/`     | `mirchmasala-api-key`:`<your key>` | {} | Cheak |
| `POST`   | `feedback/register`| `mirchmasala-api-key`:`<your key>` | {userId,description} | Create a new feedback |
| `GET`   | `feedback/get` |`mirchmasala-api-key`:`<your key>` & `x-auth-token`:`<Your token session id>` | {} | Get all feedbacks |
| `GET`   | `feedback/get/:id`| `mirchmasala-api-key`:`<your key>` | {} | Get a specific feedback |
| `DELETE`   | `feedback/delete/:id`| `mirchmasala-api-key`:`<your key>` | {} | Delete a feedback |

## Review


| myMethod | apiEndPoints | myHeaders | myRaw | using for |
|----------|--------------|-----------|-------|-------|
| `POST`   | `reviews/`     | `mirchmasala-api-key`:`<your key>` | {} | Cheak |
| `POST`   | `reviews/post`| `mirchmasala-api-key`:`<your key>` | {userId,rating,comment,product} | Create a new review by product id |
| `GET`   | `reviews/get` |`mirchmasala-api-key`:`<your key>` & `x-auth-token`:`<Your token session id>` | {} | Get all review |
| `GET`   | `reviews/get/:id`| `mirchmasala-api-key`:`<your key>` | {} | Get a specific review |
| `DELETE`   | `reviews/delete/:id`| `mirchmasala-api-key`:`<your key>` | {} | Delete a review |

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
