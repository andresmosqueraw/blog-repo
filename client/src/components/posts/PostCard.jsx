import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { likePost, unlikePost } from '../../redux/posts/postSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { FiHeart, FiMessageCircle, FiEdit, FiTrash, FiX } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useState } from 'react';

const PostCard = ({ post, onDelete }) => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleLike = () => {
    if (!isAuthenticated) {
      toast.error('Por favor inicia sesión para dar me gusta');
      return;
    }
    
    const hasLiked = post.likes.some((like) => like === user.id);
    
    if (hasLiked) {
      dispatch(unlikePost(post._id));
    } else {
      dispatch(likePost(post._id));
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    onDelete(post._id);
    setShowDeleteModal(false);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Check if the current user is the author
  const isAuthor = user && post.author && user.id === post.author._id;

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  const modalVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  return (
    <>
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="card"
      >
        {post.image && (
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-48 object-cover"
          />
        )}
        
        <div className="p-6">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 mr-3">
              {post.author?.name ? post.author.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <p className="font-medium">{post.author?.name || 'Autor Desconocido'}</p>
              <p className="text-sm text-gray-500">{formatDate(post.createdAt)}</p>
            </div>
          </div>
          
          <Link to={`/post/${post._id}`}>
            <h2 className="text-xl font-semibold mb-2 hover:text-primary-600 transition-colors">
              {post.title}
            </h2>
          </Link>
          
          <p className="text-gray-600 mb-4">
            {post.content.length > 150
              ? `${post.content.substring(0, 150)}...`
              : post.content}
          </p>
          
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center space-x-6">
              <button
                onClick={handleLike}
                className={`flex items-center text-sm ${
                  isAuthenticated && post.likes.some((like) => like === user.id)
                    ? 'text-accent-500'
                    : 'text-gray-500 hover:text-accent-500'
                } transition-colors`}
              >
                <FiHeart className="mr-1" />
                <span>{post.likes ? post.likes.length : 0}</span>
              </button>
              
              <Link
                to={`/post/${post._id}`}
                className="flex items-center text-sm text-gray-500 hover:text-primary-500 transition-colors"
              >
                <FiMessageCircle className="mr-1" />
                <span>{post.comments ? post.comments.length : 0}</span>
              </Link>
            </div>
            
            {isAuthor && (
              <div className="flex items-center space-x-2">
                <Link
                  to={`/edit-post/${post._id}`}
                  className="text-gray-500 hover:text-primary-500 transition-colors"
                >
                  <FiEdit />
                </Link>
                
                <button
                  onClick={handleDeleteClick}
                  className="text-gray-500 hover:text-error-500 transition-colors"
                >
                  <FiTrash />
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 max-w-md w-full"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Confirmar Eliminación</h3>
                <button
                  onClick={handleCancelDelete}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>
              
              <p className="text-gray-600 mb-6">
                ¿Estás seguro de que quieres eliminar este post? Esta acción no se puede deshacer.
              </p>
              
              <div className="flex justify-end space-x-4">
                <button
                  onClick={handleCancelDelete}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 bg-error-500 text-white rounded hover:bg-error-600 transition-colors"
                >
                  Eliminar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PostCard;