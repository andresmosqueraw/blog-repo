import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateProfile, reset } from '../redux/auth/authSlice';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

const Profile = () => {
  const { user, error } = useSelector((state) => state.auth);
  const { loading } = useSelector((state) => state.ui);
  const dispatch = useDispatch();
  
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    avatar: '',
  });
  
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        bio: user.bio || '',
        avatar: user.avatar || '',
      });
    }
  }, [user]);
  
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(reset());
    }
  }, [error, dispatch]);
  
  const { name, bio, avatar } = formData;
  
  const onChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  
  const onSubmit = (e) => {
    e.preventDefault();
    
    dispatch(updateProfile(formData))
      .unwrap()
      .then(() => {
        toast.success('Perfil actualizado exitosamente');
      })
      .catch((err) => {
        toast.error(err);
      });
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
  };
  
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="container-narrow py-12"
    >
      <h1 className="text-3xl font-bold mb-8">Profile Settings</h1>
      
      <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
        <form onSubmit={onSubmit}>
          <div className="mb-6">
            <label htmlFor="name" className="form-label">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={onChange}
              className="form-input"
              placeholder="Your name"
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="bio" className="form-label">
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              value={bio}
              onChange={onChange}
              className="form-input h-32"
              placeholder="Tell us about yourself"
            ></textarea>
          </div>
          
          <div className="mb-6">
            <label htmlFor="avatar" className="form-label">
              Avatar URL
            </label>
            <input
              type="text"
              id="avatar"
              name="avatar"
              value={avatar}
              onChange={onChange}
              className="form-input"
              placeholder="URL to your avatar image"
            />
            <p className="mt-1 text-sm text-gray-500">
              Enter a URL to an image to use as your profile picture
            </p>
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              className="btn-primary"
              disabled={loading['auth/updateProfile']}
            >
              {loading['auth/updateProfile'] ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </span>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default Profile;