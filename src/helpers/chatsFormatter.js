const userFormatter = (user) => {
  const formatter = {
    id: user.id,
    name: user.name,
    avatar: user?.avatar || null,
  };
  return formatter;
};

const usersFormatter = (users) => {
  return users.map((user) => userFormatter(user));
};

module.exports = {
  userFormatter,
  usersFormatter,
};
