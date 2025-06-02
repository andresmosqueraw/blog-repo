import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FiX } from 'react-icons/fi';

const PostForm = ({ post, onSubmit, isEdit = false }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState({});
  
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.ui);
  
  useEffect(() => {
    if (isEdit && post) {
      setTitle(post.title || '');
      setContent(post.content || '');
      setImage(post.image || '');
      setTags(post.tags || []);
    }
  }, [isEdit, post]);
  
  const validate = () => {
    const errors = {};
    
    if (!title.trim()) {
      errors.title = 'Title is required';
    } else if (title.length > 100) {
      errors.title = 'Title cannot be more than 100 characters';
    }
    
    if (!content.trim()) {
      errors.content = 'Content is required';
    }
    
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validate()) {
      onSubmit({
        title,
        content,
        image,
        tags,
      });
    }
  };
  
  const handleAddTag = (e) => {
    e.preventDefault();
    
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };
  
  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };
  
  // Animation variants
  const formVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
  };
  
  return (
    <motion.div
      variants={formVariants}
      initial="hidden"
      animate="visible"
      className="bg-white rounded-lg shadow-sm p-6 md:p-8"
    >
      <h2 className="text-2xl font-bold mb-6">
        {isEdit ? 'Edit Post' : 'Create New Post'}
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="form-label">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`form-input ${errors.title ? 'border-error-500' : ''}`}
            placeholder="Enter a title for your post"
          />
          {errors.title && <p className="form-error">{errors.title}</p>}
        </div>
        
        <div className="mb-4">
          <label htmlFor="content" className="form-label">
            Content
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className={`form-input min-h-[200px] ${errors.content ? 'border-error-500' : ''}`}
            placeholder="Write your post content here..."
          ></textarea>
          {errors.content && <p className="form-error">{errors.content}</p>}
        </div>
        
        <div className="mb-4">
          <label htmlFor="image" className="form-label">
            Image URL (optional)
          </label>
          <input
            type="text"
            id="image"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            className="form-input"
            placeholder="Enter an image URL for your post"
          />
          <p className="mt-1 text-sm text-gray-500">
            Provide a URL to an image that represents your post
          </p>
        </div>
        
        <div className="mb-6">
          <label htmlFor="tags" className="form-label">
            Tags (optional)
          </label>
          <div className="flex">
            <input
              type="text"
              id="tags"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              className="form-input rounded-r-none"
              placeholder="Add tags to your post"
            />
            <button
              onClick={handleAddTag}
              className="btn-primary rounded-l-none"
              type="button"
            >
              Add
            </button>
          </div>
          
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-sm flex items-center"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 text-gray-500 hover:text-error-500"
                  >
                    <FiX size={14} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
        
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn-outline"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary"
            disabled={loading['posts/create'] || loading['posts/update']}
          >
            {loading['posts/create'] || loading['posts/update'] ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </span>
            ) : (
              isEdit ? 'Update Post' : 'Create Post'
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default PostForm;