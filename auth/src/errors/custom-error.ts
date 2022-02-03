/*choose abstract class over interface as 
interface doesn't create a class in compiled js
hence 'instanceof' won't work.
*/

export abstract class CustomError extends Error {
	abstract statusCode: number;

  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, CustomError.prototype);
  }

  abstract serializeErrors(): { message:string, field?: string}[];
 }