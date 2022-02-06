import express, {Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { body } from 'express-validator';
import { validateRequest } from '../middlewares/validate-request';
import { BadRequestError } from '../errors/bad-request-error';
import { User } from '../models/user';

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
], validateRequest, async (req: Request, res: Response) => {

  const { email, password } = req.body;
  
  const existingUser = await User.findOne({ email });

  if(existingUser) {
    throw new BadRequestError('User already exists');
  }

  const user = User.build({ email, password });
  await user.save();

  //generate a JWT
  const userJWT = jwt.sign({
    id: user.id,
    email: user.email
  }, process.env.JWT_KEY!
  );
  //store it in a session object(cookie)
  req.session = {
    jwt: userJWT
  };

  res.status(201).send(user);
});

export { router as signupRouter };