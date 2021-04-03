const formatUserAuthentication = (user, token) => {
  const { id, name, username, roleId, avatar } = user;
  return { avatar, id, name, username, role_id: roleId, token };
};

module.exports = { formatUserAuthentication };
