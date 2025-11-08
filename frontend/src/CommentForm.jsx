import React, { useMemo, useState } from 'react';

export default function CommentForm({ onAdd }) {
  const [taskId, setTaskId] = useState('');
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');

  const canSubmit = useMemo(() => Number(taskId) > 0 && author.trim() && content.trim(), [taskId, author, content]);

  async function submit(e) {
    e.preventDefault();
    if (!canSubmit) return;
    await onAdd({ task_id: Number(taskId), author: author.trim(), content: content.trim() });
    setTaskId('');
    setAuthor('');
    setContent('');
  }

  return (
    <form onSubmit={submit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Task ID</label>
          <input value={taskId} onChange={(e) => setTaskId(e.target.value.replace(/[^0-9]/g, ''))} className="border rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Author</label>
          <input value={author} onChange={(e) => setAuthor(e.target.value)} className="border rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Content</label>
          <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={3} className="border rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required />
        </div>
      </div>
      <div className="mt-3 flex justify-end">
        <button disabled={!canSubmit} type="submit" className={`inline-flex items-center justify-center px-4 py-2 rounded-md text-white transition-colors ${canSubmit ? 'bg-green-600 hover:bg-green-700' : 'bg-green-600 opacity-60 cursor-not-allowed'}`}>Add Comment</button>
      </div>
    </form>
  );
}


