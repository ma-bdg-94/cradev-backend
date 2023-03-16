import { body, ValidationChain } from 'express-validator'

export default class ProfileValidation {
  create: ValidationChain[] = [
    body('address').not().isEmpty().withMessage('Address is required!'),
    body('city').not().isEmpty().withMessage('City is required!'),
    body('country')
      .not()
      .isEmpty()
      .withMessage('Country is required!'),
    body('postalCode')
      .not()
      .isEmpty()
      .withMessage('Postal Code is required!'),
    body('technologies')
      .not()
      .isEmpty()
      .withMessage('Technologies are required!')
      .isArray({ min: 2 })
      .withMessage('Please mention at least two skills!')
      .isArray({ min: 5 })
      .withMessage('Do not exceed 5 skills!')
  ]
}
