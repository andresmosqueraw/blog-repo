import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { getPosts, deletePost } from '../redux/posts/postSlice';
import { motion } from 'framer-motion';
import PostCard from '../components/posts/PostCard';
import Spinner from '../components/ui/Spinner';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const { posts } = useSelector((state) => state.posts);
  const { user } = useSelector((state) => state.auth);
  const { loading } = useSelector((state) => state.ui);
  const dispatch = useDispatch();
  
  const [userPosts, setUserPosts] = useState([]);
  
  useEffect(() => {
    dispatch(getPosts());
  }, [dispatch]);
  
  useEffect(() => {
    if (posts.length > 0 && user) {
      // Filter posts by the current user
      const filteredPosts = posts.filter(
        (post) => post.author._id === user.id
      );
      setUserPosts(filteredPosts);
    }
  }, [posts, user]);
  
  const handleDeletePost = (id) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      dispatch(deletePost(id))
        .unwrap()
        .then(() => {
          toast.success('Post deleted successfully');
        })
        .catch((err) => {
          toast.error(err);
        });
    }
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  return (
    <div className="container-wide py-12">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Manage your posts and profile
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Link to="/create-post" className="btn-primary">
            Create New Post
          </Link>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
          <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 text-2xl font-bold">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <h2 className="text-xl font-semibold">{user?.name}</h2>
            <p className="text-gray-500">{user?.email}</p>
          </div>
          <div className="md:ml-auto">
            <Link to="/profile" className="btn-outline">
              Edit Profile
            </Link>
          </div>
        </div>
      </div>
      
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Posts</h2>
      
      {loading['posts/getAll'] ? (
        <Spinner />
      ) : userPosts.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <h3 className="text-xl font-semibold mb-2">No posts yet</h3>
          <p className="text-gray-600 mb-6">
            You haven't created any posts yet. Start sharing your thoughts with the world!
          </p>
          <Link to="/create-post" className="btn-primary">
            Create Your First Post
          </Link>
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {userPosts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              onDelete={handleDeletePost}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default Dashboard;