import { NextFunction, Request, Response } from "express";
import { CustomError } from "../errors/custom-error";


//errors should be of the format
/*
errors: [{
  message: '',
  field?:''
}]
*/

export const errorHandler =  (err: Error, req: Request, res: Response, next: NextFunction) => {
	console.log(`Something went wrong: ${err}`);

  if(err instanceof CustomError){
   return res.status(err.statusCode).send({error: err.serializeErrors()});
  }

  res.status(400).send({
    errors: [{ message: 'Something went wrong'}]
  });
}