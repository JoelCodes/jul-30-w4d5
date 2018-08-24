const users = [{id: 'a1234z', userName: 'Joel', email: 'joel@joel.joel', password: 'joel'}];

function getUserByEmail(email){
  const foundUser = users.find((user) => user.email === email);
  return Promise.resolve(foundUser);
}

function getUserById(id){
  const foundUser = users.find((user) => user.id === id);
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

module.exports = {
  getUserByEmail,
  getUserById,
  authenticateUser,
};