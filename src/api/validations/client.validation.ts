import { body, ValidationChain } from 'express-validator'
import { clientTypes, serviceTypes } from '../utilities/constants/types'

export default class ClientValidation {
  newClientValidation: ValidationChain[] = [
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
    body('fullName').not().isEmpty().withMessage('Full Name is required!'),
    body('email').not().isEmpty().withMessage('Email is required!').isEmail().withMessage('Wrong Email Format!'),
    body('phone').not().isEmpty().withMessage('Phone Number is required!').isMobilePhone('any').withMessage('Wrong Phone Number Format!'),
    body('service').not().isEmpty().withMessage('Service is required!').isIn(serviceTypes).withMessage('Invalid Service!'),
    body('clientType').not().isEmpty().withMessage('Client Type is required!').isIn(clientTypes).withMessage('Invalid Client type!'),
  ]
}
