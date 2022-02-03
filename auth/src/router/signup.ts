import express, {Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { RequestValidationError } from '../errors/request-validation-error';

const router = express.Router();

//use express-validator but
// try this with interface to see if it works

router.post('/api/users/signup',[
	body('email')
  .isEmail()
  .withMessage('Please enter valid email'),
  body('password')
  .trim()
  .isLength({ min: 4, max: 20})
  .withMessage('Password should be betweeen 4 to 20 characters')
],(req: Request, res: Response) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    throw new RequestValidationError(errors.array());
  }
  const { email, password } = req.body;
	console.log(`user details are: ${email} & ${password}`);
  res.send({email, password});
  
});

export { router as signupRouter };