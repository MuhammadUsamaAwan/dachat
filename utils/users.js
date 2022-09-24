let users = []

const joinUser = (id, username, room) => users.push({ id, username, room })

const getRoomUsers = room => users.filter(user => user.room === room)

const removeUser = id => {
  const index = users.findIndex(user => user.id === id)
  if (index !== -1) {
    return users.splice(index, 1)[0]
  }
}

module.exports = {
  joinUser,
  getRoomUsers,
  removeUser,
}
