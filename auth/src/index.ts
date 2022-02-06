import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import mongoose from 'mongoose';
import { currentUserRouter } from './router/current-user';
import { signinRouter } from './router/signin';
import { signoutRouter } from './router/signout';
import { signupRouter } from './router/signup';
import { errorHandler } from './middlewares/error-handler';
import { NotFoundError } from './errors/not-found-error';


const app = express();
app.use(json());

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

app.all('*', async() => {
	throw new NotFoundError();
});

app.use(errorHandler);

const start = async() => {
	try {
		await mongoose.connect('mongodb://auth-mongo-srv:27017/auth');
    console.log('Connected to db');
	} catch(err){
    console.error(err);
  }

  app.listen(3005, () => {
    console.log('lasd');
    console.log('listening on port 3005!!!');
  });
}

start();