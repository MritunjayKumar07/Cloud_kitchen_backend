const express = require("express");
const UserModel = require("../Schema/SchemaUsers.js");
const sendMail = require("../module/SendMail.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const UserRoutes = express.Router();

//Admin auth token verification.
const adminAuth = (req, res, next) => {
  const adminAuthToken = req.header("x-admin-auth-token");

  if (!adminAuthToken) {
    return res
      .status(401)
      .json({ message: "No admin token, authorization denied" });
  }

  if (adminAuthToken === process.env.ADMIN_AUTH_KEY) {
    next();
  } else {
    return res.status(401).json({ message: "Admin token is not valid" });
  }
};

// Validate name format (should only contain letters, spaces, and hyphens)
const isValidName = (name) => /^[A-Za-z\- ]+$/.test(name);

// Validate email format (should only contain letters, spaces, and hyphens)
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// Validate email format and log the result
const validateEmailFormat = (email) => {
  const isValid = isValidEmail(email);
  let valid;
  if (!isValid) {
    valid = false;
  } else {
    valid = true;
  }
  return valid;
};

// Generate Verification Code
const generateVerificationCode = () => {
  const min = 100000;
  const max = 999999;
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

//JWT token auth
const jwtMiddleware = (req, res, next) => {
  const token = req.header("x-auth-token");

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (e) {
    return res.status(401).json({ message: "Token is not valid" });
  }
};

// Product Api cheak.
UserRoutes.post("/", async (req, res) => {
  res.status(200).json({ message: "User API check successful." });
});

// User Signup
UserRoutes.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, emailId } = req.body;

    // Check if required fields are provided
    if (!firstName || !lastName || !emailId) {
      return res.status(422).json({
        message:
          "Server was unable to process the request due to invalid data.",
      });
    }

    // Validate name format
    if (!isValidName(firstName) || !isValidName(lastName)) {
      return res.status(422).json({
        message:
          "Invalid name format. Name should only contain letters, spaces, and hyphens.",
      });
    }

    // Validate email format
    const isEmailValid = validateEmailFormat(emailId);
    if (!isEmailValid) {
      return res.status(422).json({
        message: "Invalid email format.",
      });
    }

    // Check if the user already exists
    let userExist = await UserModel.findOne({ emailId: emailId });
    if (userExist) {
      return res.status(403).json({ message: "Email Id Already Exist." });
    }

    // Generate OTP
    const otp = generateVerificationCode();

    // Create user with OTP and other data
    const newVerificationData = {
      otp: otp,
      isVerified: false,
      registrationDate: new Date(),
    };

    // Save the user to the database
    const newUser = new UserModel({
      ...req.body,
      verification: newVerificationData,
    });
    const savedUser = await newUser.save();

    try {
      // Send OTP via email
      const isEmailSent = await sendMail(emailId, otp);
    
      if (!isEmailSent) {
        // Handle email sending failure
        console.log("Error in sending verification mail");
        return res.status(500).json({
          id: savedUser._id,
          message: `Unable to send OTP to your registered Email ID.`,
        });
      }

      // Email sent successfully
      return res.status(201).send({
        id: savedUser._id,
        message: `OTP has been sent successfully on ${emailId}. Please enter this OTP`,
      });
    } catch (err) {
      console.log("Error in Saving User Details", err);
      return res.status(500).json({
        message: "Internal Server Error",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// API for OTP verification
UserRoutes.post("/verifyOtp", async (req, res) => {
  let { emailId, otp } = req.body;
  otp = Number(otp);

  // Validate email format
  const isEmailValid = validateEmailFormat(emailId);
  if (!isEmailValid) {
    return res.status(422).json({
      message: "Invalid email format.",
    });
  }

  try {
    // Check if required fields are provided
    if (!emailId || !otp) {
      return res.status(400).json({
        message:
          "Server was unable to process the request due to invalid data.",
      });
    }

    // Find user by email
    let userDetails = await UserModel.findOne({ emailId: emailId }).exec();
    if (!userDetails) {
      return res.status(401).json({
        message: "Invalid Credentials! Please SignUp first.",
      });
    }

    // Check if the account is already verified
    // if (userDetails.isVerified) {
    //   return res.status(403).json({
    //     message: "Your account is already verified.",
    //   });
    // }

    // Check if OTP is still valid
    const timeDiffInSeconds =
      new Date().getMinutes() -
      userDetails.verification[0].registrationDate.getMinutes();

    // timeDiffInSeconds is greater than 5 minutes then timeout
    if (timeDiffInSeconds >= 5) {
      return res.status(408).json({
        message: `OTP has expired. Please generate a new one.`,
      });
    }

    // console.log([emailId, typeof emailId, otp, typeof otp. userDetails.verification.otp, typeof userDetails.verification.otp])

    // Check if the entered OTP is correct
    if (userDetails.verification[0].otp !== otp) {
      return res.status(402).json({
        message: "Wrong OTP entered.",
      });
    }

    // Update user as verified
    userDetails.verification[0].isVerified = true;

    //Save the data
    await userDetails.save();

    return res.status(200).json({
      data: userDetails._id,
      message: "User Verification Successful!",
    });
  } catch (error) {
    console.error("Error in Verifying OTP", error);
    return res
      .status(500)
      .json({ error: "Internal Server Error during OTP verification." });
  }
});

// API Create Password
UserRoutes.post("/password", async (req, res) => {
  try {
    let { userId, password } = req.body;
    // Validate UserId and Password
    if (!userId || !password) {
      return res.status(400).json({
        message:
          "Server was unable to process the request due to invalid data.",
      });
    }

    //Find User
    const userDetails = await UserModel.findById(userId);
    if (!userDetails) {
      return res.status(404).json({ message: "No such user found." });
    }

    //Encript the password
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);

    //Update the fields of user
    userDetails.verification[0].otp = undefined;
    userDetails.password = password;

    //Save the user
    await userDetails.save();

    //Return JWT Token
    return res.status(200).json({ message: "Password updated successfully." });
  } catch (err) {
    if (err.path === "_id") {
      return res.status(404).send({ message: "User not found" });
    } else {
      console.log(err);
      return res.status(500).send({ message: "Server Error", err });
    }
  }
});

// API add user name
UserRoutes.post("/addUserName", async (req, res) => {
  try {
    let { userId, password, userName } = req.body;
    // Validate UserId and Password
    if (!userId || !password || !userName) {
      return res.status(400).json({
        message:
          "Server was unable to process the request due to invalid data.",
      });
    }

    //Find User
    const userDetails = await UserModel.findById(userId);
    if (!userDetails) {
      return res.status(404).json({ message: "No such user found." });
    }

    // Check if UserName already exists
    const userNameExists = await UserModel.findOne({ userName });
    if (userNameExists) {
      return res.status(409).json({ message: "UserName already exists." });
    }

    //Update the fields of user
    userDetails.userName = userName;

    //Save the user
    await userDetails.save();

    //Return
    return res.status(200).json({ message: "User name add successfully." });
  } catch (err) {
    if (err.path === "_id") {
      return res.status(404).send({ message: "User not found" });
    } else {
      console.log(err);
      return res.status(500).send({ message: "Server Error", err });
    }
  }
});

// API login user.
UserRoutes.post("/login", async (req, res) => {
  try {
    let { loginBy, password } = req.body;

    // Validate UserId and Password
    if (!loginBy && !password) {
      return res.status(400).json({
        message: "Please provide emailId or userName and password.",
      });
    }

    //Checking whether it is an Email or a username
    let emailValidate = validateEmailFormat(loginBy);
    let emailId = emailValidate ? loginBy : undefined;
    let userName = emailValidate ? undefined : loginBy;

    let userDetails;

    // Find User by emailId or userName
    if (emailId) {
      userDetails = await UserModel.findOne({ emailId });
    } else if (userName) {
      userDetails = await UserModel.findOne({ userName });
    }

    //User Avelable or Not
    if (!userDetails) {
      return res.status(404).json({ message: "No such user found." });
    }

    // Is user Blocked or not from my website
    if (!userDetails.verification[0].isVerified) {
      return res.status(403).json("Your account has been blocked!");
    }

    // Checking password with hashed password.
    const isMatch = await bcrypt.compare(password, userDetails.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid Email or Password." });
    }

    // Create and sign JWT token
    const token = jwt.sign(
      { userId: userDetails._id, emailId: userDetails.emailId },
      process.env.JWT_SECRET, // replace with your secret key
      { expiresIn: "12h" } // token expires in 12 hours
    );

    // Return success message or token
    return res.status(200).json({ token, message: "Login successful." });
  } catch (err) {
    console.error("Error in handling a specific operation", error);
    return res
      .status(500)
      .json({ error: "Internal Server Error during the specific operation." });
  }
});

//API to forgot password.
UserRoutes.post("/forgotPassword", async (req, res) => {
  try {
    let { forgotBy } = req.body;
    if (!forgotBy) {
      return res.status(400).json("Please provide emailId or userName");
    }

    //Checking whether it is an Email or a username
    let emailValidate = validateEmailFormat(forgotBy);
    let emailId = emailValidate ? forgotBy : undefined;
    let userName = emailValidate ? undefined : forgotBy;

    // Find User by emailId or userName
    if (emailId) {
      userDetails = await UserModel.findOne({ emailId });
    } else if (userName) {
      userDetails = await UserModel.findOne({ userName });
    }

    // Account Blocked or not
    if (!userDetails.verification[0].isVerified) {
      return res.status(403).json("Your account has been blocked!");
    }

    // Generate OTP
    const otp = generateVerificationCode();
    userDetails.verification[0].otp = otp;

    // Save the user to the database
    const savedUser = await userDetails.save();

    //Set Mail Id to send mail
    emailId = userDetails.emailId;

    try {
      // Send OTP via email
      const isEmailSent = await sendMail(emailId, otp);

      if (!isEmailSent) {
        // Handle email sending failure
        console.log("Error in sending verification mail");
        return res.status(500).json({
          id: savedUser._id,
          message: `Unable to send OTP to your registered Email ID.`,
        });
      }

      // Email sent successfully
      return res.status(201).send({
        id: savedUser._id,
        message: `OTP has been sent successfully on ${emailId}. Please enter this OTP`,
      });
    } catch (err) {
      console.log("Error in Saving User Details", err);
      return res.status(500).json({
        message: "Internal Server Error",
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "Server Error", err });
  }
});

// API to update
UserRoutes.post("/updateUserData", jwtMiddleware, async (req, res) => {
  try {
    const { userId, firstName, lastName, userName, address, phoneNumber } =
      req.body;

    // Validate UserId and required fields
    if (!userId) {
      return res.status(400).json({
        message:
          "Server was unable to process the request due to invalid data.",
      });
    }

    // Find User
    const userDetails = await UserModel.findById(userId);
    if (!userDetails) {
      return res.status(404).json({ message: "No such user found." });
    }

    // Validate name format
    if (firstName && !isValidName(firstName)) {
      return res.status(422).json({
        message:
          "Invalid name format. Name should only contain letters, spaces, and hyphens.",
      });
    }
    if (lastName && !isValidName(lastName)) {
      return res.status(422).json({
        message:
          "Invalid name format. Name should only contain letters, spaces, and hyphens.",
      });
    }

    // Check if UserName already exists
    if (userName) {
      const userNameExists = await UserModel.findOne({ userName });
      if (userNameExists && userNameExists._id.toString() !== userId) {
        return res.status(409).json({ message: "UserName already exists." });
      }
    }

    // Validate phoneNumber format
    if (phoneNumber && !/^[0-9]{10}$/.test(phoneNumber)) {
      return res.status(409).json({ message: "Invalid phone number format." });
    }

    // Update user data
    if (firstName) userDetails.firstName = firstName || userDetails.firstName;
    if (lastName) userDetails.lastName = lastName || userDetails.lastName;
    if (userName)
      userDetails.userName = userName || userDetails.userName || undefined;
    if (phoneNumber)
      userDetails.phoneNumber =
        phoneNumber || userDetails.phoneNumber || undefined;

    // Update address fields if provided
    if (address) {
      userDetails.address.nearBy = address.nearBy || userDetails.address.nearBy;
      userDetails.address.street = address.street || userDetails.address.street;
      userDetails.address.city = address.city || userDetails.address.city;
      userDetails.address.state = address.state || userDetails.address.state;
      userDetails.address.zipCode =
        address.zipCode || userDetails.address.zipCode;
    }

    // Save the user
    await userDetails.save();

    return res.status(200).json({ message: "User data updated successfully." });
  } catch (err) {
    if (err.name === "ValidationError") {
      // Mongoose validation error
      const errors = {};
      for (const field in err.errors) {
        errors[field] = err.errors[field].message;
      }
      return res.status(422).json({ message: "Validation error", errors });
    } else if (err.path === "_id") {
      return res.status(404).send({ message: "User not found" });
    } else {
      console.log(err);
      return res.status(500).send({ message: "Server Error", err });
    }
  }
});

// API to update password
UserRoutes.post("/updatePassword", jwtMiddleware, async (req, res) => {
  try {
    let { userId, currentPassword, newPassword } = req.body;

    // Validate UserId and Passwords
    if (!userId || !currentPassword || !newPassword) {
      return res.status(400).json({
        message:
          "Server was unable to process the request due to invalid data.",
      });
    }

    // Find User
    const userDetails = await UserModel.findById(userId);
    if (!userDetails) {
      return res.status(404).json({ message: "No such user found." });
    }

    // Check if the current password is correct
    const isMatch = await bcrypt.compare(currentPassword, userDetails.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "Current password is incorrect." });
    }

    // Encrypt the new password
    const salt = await bcrypt.genSalt(10);
    newPassword = await bcrypt.hash(newPassword, salt);

    // Update the user's password
    userDetails.password = newPassword;

    // Save the user
    await userDetails.save();

    return res.status(200).json({ message: "Password updated successfully." });
  } catch (err) {
    if (err.path === "_id") {
      return res.status(404).send({ message: "User not found" });
    } else {
      console.log(err);
      return res.status(500).send({ message: "Server Error", err });
    }
  }
});

//Return User Data
UserRoutes.get("/profile/:id", jwtMiddleware, async function (req, res) {
  try {
    let userId = req.params.id;

    //Find User
    let userProfile = await UserModel.findById(userId);
    if (!userProfile) {
      return res.status(403).json({ message: "Unauthorized user!" });
    }

    // Exclude sensitive data (password and orders)
    if (userProfile) {
      userProfile = userProfile.toObject(); // Convert to plain JavaScript object
      delete userProfile.password;
      delete userProfile.__v;
      delete userProfile.verification[0].otp;
      delete userProfile.verification[0]._id;
    }
    return res.status(200).json(userProfile);
  } catch (err) {
    if (err.path === "_id") {
      return res.status(404).send({ message: "User not found" });
    } else {
      console.log(err);
      return res.status(500).send({ message: "Server Error", err });
    }
  }
});

//Return all User
UserRoutes.get("/users", jwtMiddleware, adminAuth, async function (req, res) {
  try {
    //Find User
    let userProfile = await UserModel.find();
    return res.status(200).json(userProfile);
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "Server Error", err });
  }
});

module.exports = UserRoutes;
