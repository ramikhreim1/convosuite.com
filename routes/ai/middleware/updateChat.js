const { chat: Chat } = require("../../models");

const getAndUpdateChat = async (id, user, brain_id, messages) => {
    let chat = await Chat.findOne({ _id: id, user })
    if (chat) {
        chat.messages.push(...messages);
        chat.save()
        return chat.toJSON()
    } else {
        chat = await (new Chat({
            user,
            brain_id,
            messages
        })).save()
        return chat.toJSON();
    }
}
module.exports = getAndUpdateChat