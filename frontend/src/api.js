import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://127.0.0.1:5000',
  headers: { 'Content-Type': 'application/json' }
});

export async function getComments(taskId) {
  const url = taskId ? `/comments?task_id=${encodeURIComponent(taskId)}` : '/comments';
  const { data } = await api.get(url);
  return data;
}

export async function createComment({ task_id, author, content }) {
  const { data } = await api.post('/comments', { task_id, author, content });
  return data;
}

export async function updateComment(id, { author, content }) {
  const { data } = await api.put(`/comments/${id}`, { author, content });
  return data;
}

export async function deleteComment(id) {
  await api.delete(`/comments/${id}`);
}







