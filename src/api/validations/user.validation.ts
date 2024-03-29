import { body, ValidationChain } from "express-validator";
import { userTypes } from "../utilities/constants/types";

export default class UserValidation {
  register: ValidationChain[] = [
    body("fullName").not().isEmpty().withMessage("Full Name is required!"),
    body("email")
      .not()
      .isEmpty()
      .withMessage("Email is required!")
      .isEmail()
      .withMessage("Wrong Email Format!"),
    body("phone")
      .not()
      .isEmpty()
      .withMessage("Phone Number is required!")
      .isMobilePhone("any")
      .withMessage("Wrong Number Format"),
    body("password")
      .not()
      .isEmpty()
      .withMessage("Password is required!")
      .isLength({ min: 8 })
      .withMessage("Password must contain at least 8 characters")
      .matches(
        /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+={}[\]\\|:;"'<>,.?/~`]).*$/
      )
      .withMessage(
        "Password must contain at least 1 Uppercase, 1 Number, and 1 Symbol"
      ),
  ];

  login: ValidationChain[] = [
    body("password").not().isEmpty().withMessage("Password is required!"),
    body("email").not().isEmpty().withMessage("Email is required!"),
  ];

  addUser: ValidationChain[] = [
    body("firstName").not().isEmpty().withMessage("First Name is required!"),
    body("lastName").not().isEmpty().withMessage("Last Name is required!"),
    body("userType")
      .not()
      .isEmpty()
      .withMessage("User Type is required!")
      .isIn(userTypes)
      .withMessage("Invalid User Type!"),
    body("email")
      .not()
      .isEmpty()
      .withMessage("Email is required!")
      .isEmail()
      .withMessage("Wrong Email Format!"),
    body("phone")
      .not()
      .isEmpty()
      .withMessage("Phone Number is required!")
      .isMobilePhone("any")
      .withMessage("Wrong Number Format"),
  ];

  passwordRequest: ValidationChain[] = [
    body("email")
      .not()
      .isEmpty()
      .withMessage("Email is required!")
      .isEmail()
      .withMessage("Wrong Email Format"),
  ];

  passwordUpdate: ValidationChain[] = [
    body("password")
      .not()
      .isEmpty()
      .withMessage("Password is required!")
      .isLength({ min: 8 })
      .withMessage("Password must contain at least 8 characters")
      .matches(
        /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+={}[\]\\|:;"'<>,.?/~`]).*$/
      )
      .withMessage(
        "Password must contain at least 1 Uppercase, 1 Number, and 1 Symbol"
      ),
  ];
}
