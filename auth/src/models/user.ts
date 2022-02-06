import mongoose from 'mongoose';
import { Password } from '../services/password';

// interaface for user attributes
interface UserAttrs {
  email: string,
  password: string,
}

// interface for User model
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

//interface for User doc
interface UserDoc extends mongoose.Document {
  email: string,
  password: string,
}


const userSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true
	},
  password: {
    type: String,
    required: true,
  }
});

// pre function makes sure to do the step
// before the 'save' action

// Do not use ()=> here as it will change the
// context of 'this' to the file!
userSchema.pre('save', async function(done) {
  if (this.isModified('password')) {
    const hashedPwd = await Password.toHash(this.get('password'));
    this.set('password', hashedPwd);
  }
  done();
});

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
}
const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };