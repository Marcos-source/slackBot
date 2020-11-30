const models = require('../models');
const emailTypes  = require('../service/aws/ses/emailTypes.js');
const { emailer } = require('./email.js');

const {
  User,
} = models;

async function formUpdate(newUserData, id) {
  if (Object.keys(newUserData).length !== 0) {
    const foundUser = await User.findByPk(id);
    // New user email has to be saved in order to perform changeEmail verification process.
    const newEmail = newUserData.email;
    // Then, it has to be spliced.
    delete newUserData.email;
    try {
      await foundUser.update(newUserData);
      // Once updated, UserEmailChange is ready to be performed.
      if (newEmail !== foundUser.email) {
        emailer(emailTypes.EMAIL_CHANGE, foundUser.id, newEmail);
      }
      return foundUser;
    } catch (e) {
      throw new Error('data type is not valid');
    }
  }
  throw new Error('data type is not valid');
}

async function getBasicUserDataForForm(id) {
  const userData = await User.findByPk(id);
  if (userData) {
    const depuredUserData = {
      email: userData.email,
      fullName: userData.fullName,
      nickName: userData.nickName,
    };
    return depuredUserData;
  }
  throw new Error('user not exist');
}

module.exports = { formUpdate, getBasicUserDataForForm };
