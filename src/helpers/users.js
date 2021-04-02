const formatUserAuthentication = (user, token) => {
  const { id, name, username, role_id, avatar } = user;
  return { id, name, username, role_id, token };
};

module.exports = { formatUserAuthentication };
