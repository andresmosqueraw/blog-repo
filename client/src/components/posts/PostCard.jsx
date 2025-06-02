import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { likePost, unlikePost } from '../../redux/posts/postSlice';
import { motion } from 'framer-motion';
import { FiHeart, FiMessageCircle, FiEdit, FiTrash } from 'react-icons/fi';
import { toast } from 'react-toastify';

const PostCard = ({ post, onDelete }) => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleLike = () => {
    if (!isAuthenticated) {
      toast.error('Please login to like posts');
      return;
    }
    
    const hasLiked = post.likes.some((like) => like === user.id);
    
    if (hasLiked) {
      dispatch(unlikePost(post._id));
    } else {
      dispatch(likePost(post._id));
    }
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

  return (
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
            <p className="font-medium">{post.author?.name || 'Unknown Author'}</p>
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
                onClick={() => onDelete(post._id)}
                className="text-gray-500 hover:text-error-500 transition-colors"
              >
                <FiTrash />
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default PostCard;