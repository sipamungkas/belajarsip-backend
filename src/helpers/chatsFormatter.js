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

const recentChatFormatter = (chat) => {
  return {
    id: chat.id,
    name: chat?.name || chat?.alt_name || "No Name",
    content: chat.content,
    created_at: chat.created_at,
  };
};

const recentChatsFormatter = (chats) => {
  return chats.map((chat) => recentChatFormatter(chat));
};

const roomListFormatter = (rooms) => {
  return rooms.map((room) => room.room_id);
};

module.exports = {
  userFormatter,
  usersFormatter,
  recentChatsFormatter,
  roomListFormatter,
};
