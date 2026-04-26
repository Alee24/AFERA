import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const getMessages = async (token: string) => {
  const response = await axios.get(`${API_URL}/messages`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const sendMessage = async (token: string, receiverId: string, content: string) => {
  const response = await axios.post(`${API_URL}/messages`, {
    receiver_id: receiverId,
    content
  }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};
