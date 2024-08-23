import Message from '../models/messageModel.js';

export const sendMessage = async (req, res) => {
  const { senderId, receiverId, messageText } = req.body;

  if (!senderId || !receiverId || !messageText) {
    return res.status(400).send({ message: 'All fields (senderId, receiverId, messageText) are required' });
  }

  try {
    const message = await new Message({ senderId, receiverId, messageText }).save();

    res.status(201).json({ message: 'Message sent successfully', message });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error sending message', error });
  }
};

export const getMessages = async (req, res) => {
  const { senderId, receiverId } = req.query;

  if (!senderId || !receiverId) {
    return res.status(400).send({ message: 'Both senderId and receiverId are required' });
  }

  try {
    const messages = await Message.find({ senderId, receiverId });
    
    if (messages.length === 0) {
      return res.status(404).send({ message: 'No messages found between the specified users' });
    }

    res.status(200).json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error fetching messages', error });
  }
};
