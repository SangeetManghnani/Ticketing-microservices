import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

export class Password {
	// static functions to facilitate Password.toHash
	static async toHash(password: string) {
		// salt to generate unique hash
		const salt = randomBytes(8).toString('hex');
		const buf = (await scryptAsync(password, salt, 64)) as Buffer;

		return `${buf.toString('hex')}.${salt}`;
	}

	// static functions to facilitate Password.compare
	static async compare(storedPassword: string, suppliedPassword: string) {
		//stored password is hashed, so we need to hash the suppliedPassword
		const  [hashedPassword, salt] = storedPassword.split('.');
		const hashedSuppliedPwd = (await scryptAsync(suppliedPassword, salt, 64)) as Buffer;
		return hashedSuppliedPwd.toString('hex') === hashedPassword;
	}
}