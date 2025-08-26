"use client"
import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  createNotification,
  getAllNotifications,
  deleteNotification,
  clearError,
} from '@/lib/redux/slices/notificationSlice';
import { AppDispatch, RootState } from '@/lib/redux/store';

const NotificationsPage = () => {
  const dispatch: AppDispatch = useDispatch();
  const {
    notifications,
    loading,
    createLoading,
    deleteLoading,
    error,
    currentPage,
    totalPages,
  } = useSelector((state: RootState) => state.notification);

  // --- Component State ---
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [image, setImage] = useState<File | null>(null); // State for the image file
  const [showSuccess, setShowSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null); // Ref to reset the file input

  // Replace with your actual token retrieval logic
  const token = 'YOUR_ADMIN_AUTH_TOKEN';

  // --- Effects ---
  useEffect(() => {
    dispatch(getAllNotifications({ page: 1, limit: 10, token }));
  }, [dispatch, token]);

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => setShowSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  // --- Handlers ---
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    } else {
      setImage(null);
    }
  };

  const handleCreateNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) {
      alert('Please provide both title and message.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title.trim());
    formData.append('message', message.trim());
    if (image) {
      formData.append('image', image);
    }

    dispatch(createNotification({ formData, token }))
      .unwrap()
      .then(() => {
        setTitle('');
        setMessage('');
        setImage(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = ''; // Reset file input
        }
        setShowSuccess(true);
      })
      .catch((err) => {
        console.error("Failed to create notification:", err);
      });
  };

  const handleDelete = (notificationId: string) => {
    if (window.confirm('Are you sure you want to delete this notification?')) {
      dispatch(deleteNotification({ notificationId, token }))
        .unwrap()
        .then(() => {
          if (notifications.length === 1 && currentPage > 1) {
            dispatch(getAllNotifications({ page: currentPage - 1, token }));
          }
        })
        .catch(err => console.error("Failed to delete:", err));
    }
  };

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
        dispatch(getAllNotifications({ page, token }));
    }
  };

  const clearErrorMessage = () => {
    dispatch(clearError());
  };

  // --- Helper Functions ---
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  };

  const truncateMessage = (msg: string, maxLength: number = 50) => {
    return msg.length > maxLength ? msg.substring(0, maxLength) + '...' : msg;
  };

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Notifications Management</h1>
        <p className="text-gray-600 mt-2">Create and manage system-wide notifications</p>
      </div>

      {showSuccess && (
        <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
          <span>Notification created and sent successfully!</span>
        </div>
      )}

      {error && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <span>{error}</span>
          <span className="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer" onClick={clearErrorMessage}>
            <span className="text-xl">&times;</span>
          </span>
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow-md mb-8 border">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Create New Notification</h2>
        <form onSubmit={handleCreateNotification} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
              Message <span className="text-red-500">*</span>
            </label>
            <textarea id="message" rows={4} value={message} onChange={(e) => setMessage(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" required ></textarea>
          </div>
          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
              Image (Optional)
            </label>
            <input type="file" id="image" accept="image/*" onChange={handleImageChange} ref={fileInputRef}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
            {image && <p className="text-xs text-gray-500 mt-1">Selected: {image.name}</p>}
          </div>
          <button type="submit" disabled={createLoading}
            className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed">
            {createLoading ? 'Sending...' : 'Create and Send Notification'}
          </button>
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md border">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Sent Notifications</h2>
        {loading && notifications.length === 0 && <p>Loading notifications...</p>}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Sent To</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {notifications.map((notification) => (
                <tr key={notification._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{notification.title}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{truncateMessage(notification.message)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{notification.sentTo}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(notification.createdAt)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => handleDelete(notification._id)} disabled={deleteLoading === notification._id}
                      className="text-red-600 hover:text-red-900 disabled:text-gray-400 disabled:cursor-not-allowed">
                      {deleteLoading === notification._id ? 'Deleting...' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-4 flex justify-between items-center">
          <p className="text-sm text-gray-700">Page {currentPage} of {totalPages}</p>
          <div>
            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage <= 1 || loading}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50">Previous</button>
            <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage >= totalPages || loading}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;