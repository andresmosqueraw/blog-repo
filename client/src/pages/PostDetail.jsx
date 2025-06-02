import { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getPostById, clearPost, likePost, unlikePost, deletePost } from '../redux/posts/postSlice';
import { motion } from 'framer-motion';
import { FiHeart, FiEdit, FiTrash, FiArrowLeft } from 'react-icons/fi';
import Spinner from '../components/ui/Spinner';
import { toast } from 'react-toastify';

const PostDetail = () => {
  const { id } = useParams();
  const { post } = useSelector((state) => state.posts);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { loading } = useSelector((state) => state.ui);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  useEffect(() => {
    dispatch(getPostById(id));
    
    return () => {
      dispatch(clearPost());
    };
  }, [dispatch, id]);
  
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
  
  const handleDelete = () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este post?')) {
      dispatch(deletePost(post._id))
        .unwrap()
        .then(() => {
          toast.success('Post eliminado exitosamente');
          navigate('/dashboard');
        })
        .catch((err) => {
          toast.error(err);
        });
    }
  };
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Check if the current user is the author
  const isAuthor = user && post?.author && user.id === post.author._id;
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
  };
  
  if (loading['posts/getById']) {
    return <Spinner />;
  }
  
  if (!post) {
    return (
      <div className="container-narrow py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Post not found</h2>
        <p className="text-gray-600 mb-8">The post you are looking for does not exist or has been removed.</p>
        <Link to="/" className="btn-primary">
          Back to Home
        </Link>
      </div>
    );
  }
  
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="container-narrow py-12"
    >
      <Link to="/" className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6">
        <FiArrowLeft className="mr-2" /> Back to Posts
      </Link>
      
      <article className="bg-white rounded-lg shadow-sm overflow-hidden">
        {post.image && (
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-64 md:h-96 object-cover"
          />
        )}
        
        <div className="p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 mr-3">
                {post.author?.name ? post.author.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div>
                <p className="font-medium">{post.author?.name || 'Unknown Author'}</p>
                <p className="text-sm text-gray-500">{formatDate(post.createdAt)}</p>
              </div>
            </div>
            
            {isAuthor && (
              <div className="flex items-center space-x-3">
                <Link
                  to={`/edit-post/${post._id}`}
                  className="text-gray-500 hover:text-primary-500 transition-colors"
                >
                  <FiEdit size={20} />
                </Link>
                <button
                  onClick={handleDelete}
                  className="text-gray-500 hover:text-error-500 transition-colors"
                >
                  <FiTrash size={20} />
                </button>
              </div>
            )}
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
          
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="text-sm bg-gray-100 text-gray-800 px-3 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          
          <div className="prose prose-lg max-w-none">
            {post.content.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-4">
                {paragraph}
              </p>
            ))}
          </div>
          
          <div className="flex items-center mt-8 pt-6 border-t border-gray-100">
            <button
              onClick={handleLike}
              className={`flex items-center text-sm ${
                isAuthenticated && post.likes.some((like) => like === user.id)
                  ? 'text-accent-500'
                  : 'text-gray-500 hover:text-accent-500'
              } transition-colors`}
            >
              <FiHeart className="mr-1" size={18} />
              <span>{post.likes ? post.likes.length : 0} likes</span>
            </button>
          </div>
        </div>
      </article>
    </motion.div>
  );
};

export default PostDetail;