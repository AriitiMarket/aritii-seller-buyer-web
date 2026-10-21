import React, { useState, useEffect, useCallback } from 'react';
import { AiOutlinePlusCircle, AiOutlineDelete, AiOutlinePushpin } from 'react-icons/ai';
import { toast } from 'react-toastify';
import api from '@/services/api';

const OrderNotesTab = ({ orderId }) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [posting, setPosting] = useState(false);

  const fetchNotes = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(`/order-notes?orderId=${orderId}`);
      setNotes(res.data?.data || []);
    } catch (err) {
      console.error('Failed to fetch notes:', err);
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const handleAddNote = async () => {
    if (!newNote.trim()) {
      toast.warning('Note cannot be empty');
      return;
    }
    setPosting(true);
    try {
      await api.post('/order-notes', { orderId, text: newNote, recipient: 'SELLER' });
      toast.success('Note added');
      setNewNote('');
      await fetchNotes();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to add note');
    } finally {
      setPosting(false);
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      await api.delete(`/order-notes/${noteId}`);
      toast.success('Note deleted');
      await fetchNotes();
    } catch (err) {
      toast.error('Failed to delete note');
    }
  };

  const handleTogglePin = async (noteId) => {
    try {
      await api.patch(`/order-notes/${noteId}/pin`);
      toast.success('Note updated');
      await fetchNotes();
    } catch (err) {
      toast.error('Failed to toggle pin');
    }
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4 my-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Order Notes & Messages</h3>
        <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-500 text-white text-xs font-bold rounded-full">
          {notes.length}
        </span>
      </div>

      <div className="bg-white p-4 rounded-lg mb-4 border border-gray-200">
        <textarea
          placeholder="Add a note to buyer..."
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          disabled={posting}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
        />
        <button
          onClick={handleAddNote}
          disabled={posting || !newNote.trim()}
          className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400 transition"
        >
          <AiOutlinePlusCircle /> Add Note
        </button>
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading notes...</div>
        ) : notes.length === 0 ? (
          <div className="text-center py-8 text-gray-400">No notes yet. Add one to communicate with the buyer.</div>
        ) : (
          notes.map((note) => (
            <div
              key={note._id}
              className={`bg-white p-4 rounded-lg border-l-4 ${note.isPinned ? 'border-yellow-400 bg-yellow-50' : 'border-blue-400'}`}
            >
              {note.isPinned && <div className="text-sm font-semibold text-yellow-700 mb-2">📌 Pinned</div>}
              <div className="flex justify-between items-start gap-3 mb-2">
                <span
                  className={`text-xs font-bold px-2 py-1 rounded-full ${
                    note.createdByRole === 'SELLER'
                      ? 'bg-green-100 text-green-800'
                      : note.createdByRole === 'BUYER'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {note.createdByRole}
                </span>
                <small className="text-gray-500 text-xs">
                  {new Date(note.createdAt).toLocaleString()}
                </small>
              </div>
              <p className="text-gray-700 text-sm mb-3 break-words">{note.text}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleTogglePin(note._id)}
                  className="p-2 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700 transition"
                  title="Pin/Unpin"
                >
                  <AiOutlinePushpin />
                </button>
                <button
                  onClick={() => handleDeleteNote(note._id)}
                  className="p-2 bg-gray-100 hover:bg-red-100 text-red-600 rounded-md transition"
                  title="Delete"
                >
                  <AiOutlineDelete />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OrderNotesTab;
