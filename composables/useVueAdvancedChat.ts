import type {Room, Message, RoomUser, UserStatus, } from 'vue-advanced-chat'


export default function() {
  const userStore = useUserStore()
  const settingStore = useSettingStore()

  const userId = '1234'
  const userAvatar = userStore.getUserPhotoURL()

  const status: UserStatus = { state: 'online', lastChanged: "Never"}

  const aiAvatar = "./aiAvatar.webp"
  const aiSenderId = "1"
  const users: RoomUser[] = [
    { _id: aiSenderId, username: "AI Bot", avatar: aiAvatar, status: status },
    { _id: userId, username: userStore.getUserName(), avatar: userAvatar, status: status }
  ]
  const rooms: Ref<Room[]> = ref([
    { roomId: '1', roomName: 'Ask AI', users: users, avatar: settingStore.chatSettings.aiAvatarURL, }
  ])
  const messageActions: string[] = []

  let messageId = 1

  const formattedDate = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric'})

  const messages: Ref<Message[]> = ref([])

  function addAIMessage(content: string) {
    messageId++
    const aiMessage = { _id: messageId.toString(), senderId: aiSenderId, content: content, avatar: aiAvatar, date: formattedDate}
    messages.value = [...messages.value, aiMessage]
  }
  
  function addUserMessage(content: string) {
    messageId++
    const userMessage = { _id: messageId.toString(), senderId: userId, content: content, avatar: userAvatar, date: formattedDate}
    messages.value = [...messages.value, userMessage]
  }

  return { rooms, messages, messageActions, addAIMessage, addUserMessage, userId}
}