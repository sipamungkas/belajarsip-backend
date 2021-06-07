const db = require("../database/dbMySql");
const { v4: uuidV4 } = require("uuid");

const getAllUser = (searchValue, offset, limitPerPage) => {
  return new Promise((resolve, reject) => {
    let total = 0;
    const query =
      "SELECT id,name,avatar FROM users WHERE name LIKE ? ORDER BY name ASC LIMIT ? OFFSET ?";
    db.query(query, [searchValue, limitPerPage, offset], (error, results) => {
      if (error) return reject(error);
      const countSql = "SELECT count(id) AS total FROM users";
      db.query(countSql, (countErr, countResults) => {
        if (countErr) return reject(countErr);
        total = countResults[0].total;
        return resolve({ data: results, total });
      });
    });
  });
};

const createNewMessage = ({
  user_id: userId,
  content,
  room_id: roomId,
  created_at: createdAt,
}) => {
  return new Promise((resolve, reject) => {
    const sqlQuery = [
      "INSERT INTO messages",
      "(user_id, content, room_id,created_at)",
      "VALUES(?, ?, ?, ?)",
    ];
    db.query(
      sqlQuery.join(" "),
      [userId, content, roomId, createdAt],
      (err, results) => {
        if (err) return reject(err);
        return resolve(results);
      }
    );
  });
};

const createRoom = (name, members) => {
  return new Promise((resolve, reject) => {
    db.beginTransaction((transactionErr) => {
      if (transactionErr) {
        db.rollback(() => {
          return reject(transactionErr);
        });
      }

      const id = uuidV4();

      const sqlQuery = "INSERT INTO rooms (id, name) VALUES(?, ?)";
      db.query(sqlQuery, [id, name], (createRoomError, createRoomResults) => {
        if (createRoomError) {
          return db.rollback(() => {
            return reject(createRoomError);
          });
        }

        const membersWithRoomId = members.map((member) => [id, member]);
        console.log(members, membersWithRoomId);
        const insertMemberQuery =
          "INSERT INTO room_user (room_id, user_id) VALUES ?";
        db.query(
          insertMemberQuery,
          [membersWithRoomId],
          (insertMemberError) => {
            if (insertMemberError) {
              return db.rollback(() => {
                return reject(insertMemberError);
              });
            }
            db.commit(() => {
              return resolve(id);
            });
          }
        );
      });
    });
  });
};

const roomInformation = (roomId, userId) => {
  return new Promise((resolve, reject) => {
    const sqlQuery = [
      "SELECT r.id as id, r.name as name,r.created_at as created_at FROM rooms r",
      "LEFT JOIN room_user ru ON r.id = ru.room_id",
      "WHERE r.id  = ? and ru.user_id = ?",
    ];
    db.query(sqlQuery.join(" "), [roomId, userId], (error, results) => {
      if (error) return reject(error);
      return resolve(results);
    });
  });
};

const getPMReceiverName = (roomId, userId) => {
  return new Promise((resolve, reject) => {
    const sqlQuery = [
      "SELECT u.id, u.name FROM room_user ru",
      "LEFT JOIN users u ON ru.user_id = u.id",
      "WHERE ru.user_id != ? AND ru.room_id = ? LIMIT 1",
    ];
    db.query(sqlQuery.join(" "), [userId, roomId], (error, results) => {
      if (error) return reject(error);
      return resolve(results);
    });
  });
};

const chatList = (userId) => {
  return new Promise((resolve, reject) => {
    const sqlQuery = [
      "SELECT r.id, r.name,",
      "(SELECT m.content from messages m where m.room_id = r.id and m.user_id = ru.user_id  ORDER BY created_at DESC limit 1) as content,",
      "(SELECT m.created_at from messages m where m.room_id = r.id and m.user_id = ru.user_id  ORDER BY created_at DESC limit 1) as created_at",
      "FROM rooms r",
      "left join room_user ru ON r.id = ru.room_id WHERE ru.user_id = ?",
      "ORDER BY created_at DESC",
    ];
    db.query(sqlQuery.join(" "), [userId], (error, results) => {
      if (error) return reject(error);
      return resolve(results);
    });
  });
};

const getMessagesByRoomId = (roomId, userId, limit, offset) => {
  return new Promise((resolve, reject) => {
    let total = 0;
    const sqlQuery = [
      "SELECT m.id, m.user_id, m.content, m.created_at FROM rooms r",
      "left join messages m on r.id = m.room_id",
      "left join room_user ru on ru.room_id = r.id",
      "WHERE r.id = ? and ru.user_id = ?",
      "order BY m.created_at DESC LIMIT ? OFFSET ?",
    ];
    db.query(
      sqlQuery.join(" "),
      [roomId, userId, limit, offset],
      (error, results) => {
        if (error) return reject(error);
        const countSql =
          "SELECT count(id) AS total FROM messages where room_id = ?";
        db.query(countSql, [roomId], (countErr, countResults) => {
          if (countErr) return reject(countErr);
          total = countResults[0].total;
          return resolve({ data: results, total });
        });
      }
    );
  });
};

module.exports = {
  getMessagesByRoomId,
  getAllUser,
  createNewMessage,
  createRoom,
  roomInformation,
  chatList,
  getPMReceiverName,
};
