import React, { useEffect, useState } from 'react';

export default function CommentEditForm({ comment, onSave, onCancel }) {
  const [author, setAuthor] = useState(comment?.author || '');
  const [content, setContent] = useState(comment?.content || '');

  useEffect(() => {
    setAuthor(comment?.author || '');
    setContent(comment?.content || '');
  }, [comment]);

  return (
    <div className="bg-white border rounded-lg p-4 shadow-sm">
      <div className="font-semibold mb-2">Edit Comment #{comment?.id}</div>
      <div className="grid gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Author</label>
          <input value={author} onChange={(e) => setAuthor(e.target.value)} className="border rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Content</label>
          <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={3} className="border rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
        </div>
        <div className="flex gap-2">
          <button onClick={() => onSave({ author, content })} className="px-3 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors">Save</button>
          <button onClick={onCancel} className="px-3 py-2 rounded-md border">Cancel</button>
        </div>
      </div>
    </div>
  );
}


