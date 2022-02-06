import express, {Request, Response} from 'express';
import jwt from 'jsonwebtoken';
import { body } from 'express-validator';
import { Password } from '../services/password';
import { validateRequest } from '../middlewares/validate-request';
import { BadRequestError } from '../errors/bad-request-error';
import { User } from '../models/user';

const router = express.Router();

router.post('/api/users/signin',[
	body('email')
		.isEmail()
		.withMessage('Please enter valid email'),
  	body('password')
  		.trim()
  		.notEmpty()
  		.withMessage('Must provide password')
], validateRequest, async (req: Request, res: Response) => {
  const { email, password } = req.body;
  //check if email exists 
  const existingUser = await User.findOne({ email });
  if(!existingUser) {
    //give limited details to avoid attacks
    // instead of  User not found -> Invalid creds
    throw new BadRequestError('Invalid Credentials');
  }
  //compare passwords
  const isPasswordMatch = await Password.compare(existingUser.password, password);

  if(!isPasswordMatch){
    throw new BadRequestError('Invalid Credentials');
  }

  //generate a token
   //generate a JWT
   const userJWT = jwt.sign({
    id: existingUser.id,
    email: existingUser.email
  }, process.env.JWT_KEY!
  );
  //store it in a session object(cookie)
  req.session = {
    jwt: userJWT
  };

  res.status(200).send(existingUser);
});

export { router as signinRouter };