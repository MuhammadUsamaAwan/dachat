// handle unread messages
let unreadMessages = 0
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) {
    unreadMessages = 0
    document.title = 'Dachat - The Ultra Pro Max Chat App'
  }
})

// handle emojis
const emojiBtn = document.getElementById('emoji-btn')
const emojiPicker = document.getElementById('emoji-picker')
const message = document.getElementById('message')

emojiBtn.addEventListener('click', () => {
  emojiPicker.classList.toggle('hidden')
})

document.addEventListener('click', () => {
  if (!emojiPicker.classList.contains('hidden'))
    emojiPicker.classList.add('hidden')
})

emojiPicker.addEventListener('click', e => {
  e.stopPropagation()
})

emojiBtn.addEventListener('click', e => {
  e.stopPropagation()
})

document
  .querySelector('emoji-picker')
  .addEventListener(
    'emoji-click',
    e => (message.value = message.value + e.detail.emoji.unicode)
  )

// joining the room
const roomName = document.getElementById('room')

const socket = io()
const url = new URL(location.href)
const username = url.searchParams.get('username')
const room = url.searchParams.get('room')
if (!username && !room) window.location.replace('/')
socket.emit('join-room', username, room)
roomName.innerText = `Room: ${room}`

// receiving room users
const participants = document.getElementById('participants')

socket.on('room-users', users => {
  participants.replaceChildren()
  users.forEach(user => {
    const participant = document.createElement('li')
    participant.className =
      'flex items-center gap-2 text-light px-4 py-2 hover:text-white hover:bg-bg-dark cursor-pointer'
    participant.innerHTML = `<div
    class="bg-bg-dark w-8 h-8 rounded-full grid place-content-center text-sm uppercase">
    ${user.username[0]}
  </div>
  <div class="text-base">${user.username}</div>`
    participants.append(participant)
  })
})

// user join message
const chat = document.getElementById('chat')
const typingText = document.getElementById('typing-text')

socket.on('user-joined', (username, date) => {
  const newMessage = document.createElement('div')
  newMessage.className = 'flex gap-2 items-center'
  newMessage.innerHTML = `<div class="text-green w-10 flex justify-center">&rarr;</div>
  <div class="flex-1">
  <div class="flex items-baseline gap-2">
  <div class="text-base">${username}</div>
  <div class="text-light text-sm">Has Joined The Chat!</div>
  <div class="text-light text-xs">${moment(date).format('h:mm a')}</div>
  </div>
  </div>`
  chat.insertBefore(newMessage, typingText)
  chat.scrollTop = chat.scrollHeight
  if (document.hidden)
    document.title = `(${++unreadMessages}) Dachat - The Ultra Pro Max Chat App`
  playAudio()
})

// user left message
socket.on('user-left', (username, date) => {
  playAudio()
  const newMessage = document.createElement('div')
  newMessage.className = 'flex gap-2 items-center'
  newMessage.innerHTML = `<div class="text-red w-10 flex justify-center">&larr;</div>
  <div class="flex-1">
    <div class="flex items-baseline gap-2">
      <div class="text-base">${username}</div>
      <div class="text-light text-sm">Has Left The Chat!</div>
      <div class="text-light text-xs">${moment(date).format('h:mm a')}</div>
    </div>
  </div>`
  chat.insertBefore(newMessage, typingText)
  chat.scrollTop = chat.scrollHeight
  if (document.hidden)
    document.title = `(${++unreadMessages}) Dachat - The Ultra Pro Max Chat App`
})

// post message
const messageForm = document.getElementById('message-form')

messageForm.addEventListener('submit', e => {
  e.preventDefault()
  if (message.value !== '') {
    socket.emit('new-message', message.value, username, room)
    message.value = ''
  }
  socket.emit('user-typing-false', room)
})

// play audio
const playAudio = () => {
  const audio = new Audio('./notification.mp3')
  audio.play()
}

// receive messages
socket.on('receive-message', (username, date, message) => {
  playAudio()
  const newMessage = document.createElement('div')
  newMessage.className = 'flex gap-2 items-start'
  newMessage.innerHTML = `<div
  class="bg-bg-dark w-10 h-10 rounded-full grid place-content-center text-sm uppercase">
  ${username[0]}
  </div>
  <div class="flex-1">
    <div class="flex items-baseline gap-2">
      <div class="text-base">${username}</div>
      <div class="text-light text-xs">${moment(date).format('h:mm a')}</div>
    </div>
  <p>${message}</p>
  </div>`
  chat.insertBefore(newMessage, typingText)
  chat.scrollTop = chat.scrollHeight
  if (document.hidden)
    document.title = `(${++unreadMessages}) Dachat - The Ultra Pro Max Chat App`
})

// user typing event
message.addEventListener('keyup', e => {
  if (e.target.value !== '') socket.emit('user-typing', username, room)
  else socket.emit('user-typing-false', room)
})

// user typing message
socket.on('typing-message', username => {
  typingText.innerText = `${username} is Typing...`
  typingText.classList.remove('hidden')
})

// user finish typing
socket.on('typing-message-remove', () => {
  typingText.classList.add('hidden')
})