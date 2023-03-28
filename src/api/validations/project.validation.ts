import { body, ValidationChain } from "express-validator";
import { projectTypes } from "../utilities/constants/types";

export default class ProjectValidation {
  coreProjectValidation: ValidationChain[] = [
    body("client").not().isEmpty().withMessage("Client is required!"),
    body("title").not().isEmpty().withMessage("Title is required!"),
    body("beginDate")
      .not()
      .isEmpty()
      .withMessage("Begin Date is required!")
      .isDate()
      .withMessage("Wrong Date Format!"),
    body("endDate")
      .not()
      .isEmpty()
      .withMessage("End Date is required!")
      .isDate()
      .withMessage("Wrong Date Format!"),
    body("baseCost")
      .not()
      .isEmpty()
      .withMessage("Base Cost Amount is required!")
      .isNumeric()
      .withMessage("Base Cost Amount should be at least 5$!")
      .isLength({ min: 5 })
      .withMessage("Base Cost Amount should be at least 5$!"),
    body("database").not().isEmpty().withMessage("Database is required!"),
    body("projectType")
      .not()
      .isEmpty()
      .withMessage("Project Type is required!")
      .isIn(projectTypes)
      .withMessage("Invalid Project Type!"),
    body("technologies")
      .not()
      .isEmpty()
      .withMessage("At least one technology is required!")
      .isArray({ min: 1 })
      .withMessage("At least one technology is required!"),
  ];

  assignmentValidation: ValidationChain[] = [
    body("email")
      .not()
      .isEmpty()
      .withMessage("Email is required!")
      .isEmail()
      .withMessage("Wrong Email Format!"),
  ];

  meetingPointValidation: ValidationChain[] = [
    body("meetingPoint")
      .not()
      .isEmpty()
      .withMessage("Meeting Point is required!")
      .isDate()
      .withMessage("Wrong Date Format!"),
  ];

  updateCoreValidation: ValidationChain[] = [
    body("beginDate")
    .isDate()
    .withMessage("Wrong Date Format!"),
  body("endDate")
    .isDate()
    .withMessage("Wrong Date Format!"),
  body("baseCost")
    .isNumeric()
    .withMessage("Base Cost Amount should be at least 5$!")
    .isLength({ min: 5 })
    .withMessage("Base Cost Amount should be at least 5$!"),
    body("projectType")
    .isIn(projectTypes)
    .withMessage("Invalid Project Type!"),
  body("technologies")
    .isArray({ min: 1 })
    .withMessage("At least one technology is required!"),
  ];
}
