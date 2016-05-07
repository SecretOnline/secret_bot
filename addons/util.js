function getId(input) {
  return input.user.id || input.user;
}

module.exports = {
  commands: {
    getid: {
      f: getId,
      perm: 10
    }
  }
};
