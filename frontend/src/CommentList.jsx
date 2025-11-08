import React from 'react';

export default function CommentList({ comments, onEdit, onDelete, recentlyAddedId, deletingId }) {
  if (!comments || comments.length === 0) {
    return <div className="text-gray-600">No comments.</div>;
  }
  return (
    <div className="grid gap-3">
      {comments.map((c) => {
        const anim = c.id === deletingId ? 'animate-fadeOut' : c.id === recentlyAddedId ? 'animate-fadeIn' : '';
        return (
          <div key={c.id} className={`bg-white border rounded-lg p-4 shadow-sm ${anim}`}>
            <div className="flex items-baseline justify-between">
              <div className="font-semibold">Task #{c.task_id} • {c.author}</div>
              <div className="text-xs text-gray-500">{new Date(c.created_at).toLocaleString()}</div>
            </div>
            <div className="mt-1 whitespace-pre-wrap">{c.content}</div>
            <div className="flex gap-2 mt-3">
              <button onClick={() => onEdit(c.id)} className="px-3 py-1 rounded-md bg-gray-900 text-white hover:bg-black transition-colors">Edit</button>
              <button onClick={() => onDelete(c.id)} className="px-3 py-1 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors">Delete</button>
            </div>
          </div>
        );
      })}
    </div>
  );
}


