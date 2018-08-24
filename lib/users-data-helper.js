const users = [{id: 'a1234z', userName: 'Joel', email: 'joel@joel.joel', password: 'joel'}];

function rando() {
  let output = '';
  const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  for(let i = 0; i < 6; i++){
    output += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return output;
}

function getUserByEmail(email){
  const foundUser = users.find((user) => user.email === email);
  return Promise.resolve(foundUser);
}

function getUserById(id){
  const foundUser = users.find((user) => user.id === id);
  return Promise.resolve(foundUser);

}
function getUserByUserName(userName){
  const foundUser = users.find((user) => user.userName === userName);
  return Promise.resolve(foundUser);

}

function authenticateUser(email, password){
  return getUserByEmail(email)
    .then((foundUser) => {
      if(foundUser && foundUser.password === password){
        return foundUser;
      }
      return undefined;
    });
}

// Will EITHER resolve with a created user, or reject with an error object.
function createUser(userName, email, password){
  const userNameErrorsPromise = getUserNameErrors(userName);
  const emailErrorsPromise = getEmailErrors(email);
  const passwordErrorsPromise = getPasswordErrors(password);

  const errorsPromise = Promise.all([
    userNameErrorsPromise,
    emailErrorsPromise,
    passwordErrorsPromise,
  ]);

  const userOrErrorsPromise = errorsPromise
    .then((errors) => {
      // const userNameErrors = errors[0];
      // const emailErrors = errors[1];
      // const passwordErrors = errors[2];
      const [userNameErrors, emailErrors, passwordErrors] = errors;
      if(userNameErrors.length > 0 ||emailErrors.length > 0 || passwordErrors.length > 0){
        return Promise.reject({
          userName: userNameErrors,
          email: emailErrors,
          password: passwordErrors,
        });
      }

      const newUser = {
        id: rando(),
        userName,
        email,
        password
      };
      users.push(newUser);
      return newUser;
    });
  return userOrErrorsPromise;
}

function getUserNameErrors(userName){
  if(!userName || userName.trim() === '') {
    return Promise.resolve(['Username Required']);
  }
  return getUserByUserName(userName)
    .then((foundUser) => {
      if(foundUser) {
        return ['Username Taken'];
      }
      return [];
    });
}
function getEmailErrors(email){
  if(!email || email.trim() === '') {
    return Promise.resolve(['Email Required']);
  }
  if(email.indexOf('@') === -1){
    return Promise.resolve(['Email must be in email format']);
  }
  return getUserByEmail(email)
    .then((foundUser) => {
      if(foundUser) {
        return ['Email Taken'];
      }
      return [];
    });
}
function getPasswordErrors(password){
  if(!password) return Promise.resolve(['Password Required']);
  const errors = [];
  if(password.length < 8){
    errors.push('Password must be at least 8 letters long');
  }
  if(!/[0-9]/.test(password)){
    errors.push('Password must have a digit');
  }
  return Promise.resolve(errors);
}
module.exports = {
  getUserByEmail,
  getUserById,
  authenticateUser,
  createUser,
};