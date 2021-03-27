const formatUserAuthentication = (user) => {
  const { id, name, username, role } = user;
  return { id, name, username, role };
};

module.exports = { formatUserAuthentication };
