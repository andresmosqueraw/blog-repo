import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getPosts } from '../redux/posts/postSlice';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PostCard from '../components/posts/PostCard';
import Spinner from '../components/ui/Spinner';

const Home = () => {
  const { posts } = useSelector((state) => state.posts);
  const { loading } = useSelector((state) => state.ui);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getPosts());
  }, [dispatch]);

  // Container variants for staggered children
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
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16 md:py-24">
        <div className="container-wide">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-5xl font-bold mb-6"
            >
              Share Your Stories With The World
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl md:text-2xl mb-8 opacity-90"
            >
              A platform for writers, thinkers, and storytellers
            </motion.p>
            {!isAuthenticated && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Link 
                  to="/register" 
                  className="bg-white text-primary-700 px-6 py-3 rounded-md font-medium shadow-lg hover:bg-gray-100 transition-colors mr-4"
                >
                  Get Started
                </Link>
                <Link 
                  to="/login" 
                  className="bg-transparent text-white border border-white px-6 py-3 rounded-md font-medium hover:bg-white hover:bg-opacity-10 transition-colors"
                >
                  Login
                </Link>
              </motion.div>
            )}
            {isAuthenticated && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Link 
                  to="/create-post" 
                  className="bg-white text-primary-700 px-6 py-3 rounded-md font-medium shadow-lg hover:bg-gray-100 transition-colors"
                >
                  Create New Post
                </Link>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Latest Posts Section */}
      <section className="py-12 md:py-16">
        <div className="container-wide">
          <h2 className="text-3xl font-bold mb-8 text-center">Latest Posts</h2>
          
          {loading['posts/getAll'] ? (
            <Spinner />
          ) : posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No posts found. Be the first to create a post!</p>
              {isAuthenticated && (
                <Link to="/create-post" className="btn-primary mt-4 inline-block">
                  Create Post
                </Link>
              )}
            </div>
          ) : (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;