const mongoose = require("mongoose");

const usersSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
  },
  emailId: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      message: "Invalid email format",
    },
  },
  address: {
    nearBy: {
      type: String,
    },
    street: {
      type: String,
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    zipCode: {
      type: String,
    },
  },
  phoneNumber: {
    type: String,
  },
  password: {
    type: String,
  },
  verification: [
    {
      otp: {
        type: Number,
        default: null, // Provide a default value (null or any other suitable value)
      },
      isVerified: {
        type: Boolean,
        default: false, // Provide a default value (false or any other suitable value)
      },
      registrationDate: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

const UserModel = mongoose.model("Users", usersSchema);

module.exports = UserModel;
