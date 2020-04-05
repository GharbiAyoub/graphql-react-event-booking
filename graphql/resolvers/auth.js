
const User = require("../../models/user");
const bcrypt = require("bcryptjs");
const {transformUser} = require('./merge')
const jwt = require('jsonwebtoken');

module.exports = {
    
  createUser: args => {
    return User.findOne({ email: args.userInput.email })
      .then(user => {
        if (user) {
          throw new Error("user Already exist");
        }
        return bcrypt.hash(args.userInput.password, 12);
      })
      .then(hashPwd => {
        const user = User({
          email: args.userInput.email,
          password: hashPwd
        });
        return user.save();
      })
      .then(result => {
        console.log(result);
        return {
          ...result._doc,
          password: null,
          _id: result._doc._id.toString()
        };
      })
      .catch(err => {
        throw err;
      });
  },
  users: async ()  => {
   const users = await User.find();
     return users.map(user => {
       return transformUser(user)
     });
 },

 login: async ({ email, password }) => {
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error('User does not exist!');
    }
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      throw new Error('Password is incorrect!');
    }
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      'somesupersecretkey',
      {
        expiresIn: '1h'
      }
    );
    return { userId: user.id, token: token, tokenExpiration: 1 };
  }
}; 