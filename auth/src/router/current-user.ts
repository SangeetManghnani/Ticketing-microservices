import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.get('/api/users/currentuser', (req, res) => {
	//1. check if the req.session.jwt is presemt
	const userJWT = req.session?.jwt;
	if(!userJWT){
		return res.send({ currentUser: null });
	}
	//2. check  if jwt is valid
	try{
		const payload = jwt.verify(userJWT, process.env.JWT_KEY!);
		//3. return user creds if it is valid.
		return res.send({ currentUser: payload });
	} catch(err) {
		return res.send({ currentUser: null });
	}
});

export { router as currentUserRouter };