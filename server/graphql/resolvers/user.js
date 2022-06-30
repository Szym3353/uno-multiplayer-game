const { UserInputError } = require("apollo-server-express");
const bcrypt = require("bcrypt");
const User = require("../../models/user");
const jwt = require("jsonwebtoken");

const {
  validateRegisterInput,
  validateLoginInput,
} = require("../../util/validator");

function generateToken(user) {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      username: user.username,
      password: user.password,
    },
    process.env.SECRET_KEY,
    { expiresIn: "1h" }
  );
}

module.exports = {
  Query: {
    async getUser(id) {
      console.log("test");
    },
  },
  Mutation: {
    async register(_, { username, email, password, confirmPassword }) {
      console.log(
        "creating new user",
        username,
        password,
        confirmPassword,
        email
      );
      const { valid, errors } = validateRegisterInput(
        username,
        email,
        password,
        confirmPassword
      );
      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }

      const usernameCheck = await User.findOne({ username });
      if (usernameCheck) {
        throw new UserInputError("Username is taken", {
          errors: {
            username: "Nazwa użytkownika jest już zajęta",
          },
        });
      }
      const emailCheck = await User.findOne({ email });
      if (emailCheck) {
        errors.email = "Adres e-mail jest już zajęty";
        throw new UserInputError("Adres e-mail jest już zarejestrowany", {
          errors,
        });
      }

      password = await bcrypt.hash(password, 12);

      const newUser = new User({
        email,
        password,
        username,
      });

      const res = await newUser.save();
      const token = generateToken(res);

      return {
        token,
      };
    },
    async login(_, { email, password }) {
      console.log("login user", password, email);
      const { valid, errors } = validateLoginInput(email, password);
      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }

      const checkUser = await User.findOne({ email });
      if (!checkUser) {
        errors.general = "Nieprawidłowy email lub hasło";
        throw new UserInputError("Errors", {
          errors,
        });
      }
      const match = await bcrypt.compare(password, checkUser.password);
      if (!match) {
        errors.general = "Nieprawidłowy email lub hasło";
        throw new UserInputError("Errors", {
          errors,
        });
      }

      const token = generateToken(checkUser);
      return {
        token,
      };
    },
  },
};
/* ...res._doc,
    id: res._id, */
