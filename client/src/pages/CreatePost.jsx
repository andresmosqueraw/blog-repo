import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createPost } from '../redux/posts/postSlice';
import PostForm from '../components/posts/PostForm';
import { toast } from 'react-toastify';

const CreatePost = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (postData) => {
    dispatch(createPost(postData))
      .unwrap()
      .then(() => {
        toast.success('Post created successfully');
        navigate('/dashboard');
      })
      .catch((err) => {
        toast.error(err);
      });
  };

  return (
    <div className="container-narrow py-12">
      <PostForm onSubmit={handleSubmit} />
    </div>
  );
};

export default CreatePost;