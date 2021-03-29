const formatMember = (member) => {
  const formattedMember = {
    user_id: member.userId,
    name: member.name,
  };

  return formattedMember;
};

const formatMembers = (members) => {
  return members.map((member) => formatMember(member));
};

module.exports = { formatMembers };
