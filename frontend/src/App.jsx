import React, { useEffect, useState } from 'react';
import { getComments, createComment, updateComment, deleteComment } from './api';
import CommentList from './CommentList.jsx';
import CommentForm from './CommentForm.jsx';
import CommentEditForm from './CommentEditForm.jsx';

export default function App() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [filterTaskId, setFilterTaskId] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [recentlyAddedId, setRecentlyAddedId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await getComments(filterTaskId ? Number(filterTaskId) : undefined);
      setComments(data);
    } catch (e) {
      setError(e.message || 'Failed to load comments');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [filterTaskId]);

  async function handleAdd({ task_id, author, content }) {
    setError(null);
    try {
      const created = await createComment({ task_id, author, content });
      setComments((prev) => [created, ...prev]);
      setRecentlyAddedId(created.id);
      setSuccess('Comment added!');
      setTimeout(() => setRecentlyAddedId(null), 600);
      setTimeout(() => setSuccess(null), 1500);
    } catch (e) {
      setError(e.message || 'Failed to create');
    }
  }

  async function handleUpdate(id, { author, content }) {
    setError(null);
    try {
      const updated = await updateComment(id, { author, content });
      setComments((prev) => prev.map((c) => (c.id === id ? updated : c)));
      setEditingId(null);
      setSuccess('Comment updated!');
      setTimeout(() => setSuccess(null), 1500);
    } catch (e) {
      setError(e.message || 'Failed to update');
    }
  }

  async function handleDelete(id) {
    setError(null);
    try {
      setDeletingId(id);
      setTimeout(async () => {
        await deleteComment(id);
        setComments((prev) => prev.filter((c) => c.id !== id));
        setDeletingId(null);
        setSuccess('Deleted successfully!');
        setTimeout(() => setSuccess(null), 1500);
      }, 200);
    } catch (e) {
      setError(e.message || 'Failed to delete');
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <h1 className="text-2xl md:text-3xl font-bold">💬 Comment Manager (Flask + React)</h1>
        </div>
      </header>

      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="mb-6 flex flex-col sm:flex-row gap-3 sm:items-end">
            <div>
              <label className="block text-sm font-medium mb-1">Filter by Task ID</label>
              <input
                value={filterTaskId}
                onChange={(e) => setFilterTaskId(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="e.g. 1"
                className="border rounded-md px-3 py-2 w-40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button onClick={load} className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors">Refresh</button>
          </div>

          <div className="bg-white border rounded-lg p-4 shadow-sm mb-4">
            <CommentForm onAdd={handleAdd} />
          </div>

          {success && (
            <div className="mb-4 p-3 rounded-md border border-green-200 bg-green-50 text-green-800">{success}</div>
          )}
          {error && (
            <div className="mb-4 p-3 rounded-md border border-red-200 bg-red-50 text-red-700">{error}</div>
          )}

          {loading ? (
            <div>Loading…</div>
          ) : (
            <CommentList
              comments={comments}
              onEdit={(id) => setEditingId(id)}
              onDelete={handleDelete}
              recentlyAddedId={recentlyAddedId}
              deletingId={deletingId}
            />
          )}

          {editingId != null && (
            <div className="mt-4">
              <CommentEditForm
                comment={comments.find((c) => c.id === editingId)}
                onCancel={() => setEditingId(null)}
                onSave={(fields) => handleUpdate(editingId, fields)}
              />
            </div>
          )}
        </div>
      </main>

      <footer className="bg-white border-t">
        <div className="max-w-5xl mx-auto px-4 py-4 text-sm text-gray-600">
          Built by <span className="font-medium">Asha Kommana</span> — 4th Year Engineering Student, Gokaraju Lailavathi Engineering College
        </div>
      </footer>
    </div>
  );
}


