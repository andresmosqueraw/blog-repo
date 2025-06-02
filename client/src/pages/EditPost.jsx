import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getPostById, clearPost, updatePost } from '../redux/posts/postSlice';
import PostForm from '../components/posts/PostForm';
import Spinner from '../components/ui/Spinner';
import { toast } from 'react-toastify';

const EditPost = () => {
  const { id } = useParams();
  const { post } = useSelector((state) => state.posts);
  const { user } = useSelector((state) => state.auth);
  const { loading } = useSelector((state) => state.ui);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  useEffect(() => {
    dispatch(getPostById(id));
    
    return () => {
      dispatch(clearPost());
    };
  }, [dispatch, id]);
  
  useEffect(() => {
    // Check if post exists and user is the author
    if (post && user && post.author._id !== user.id) {
      toast.error('No estás autorizado para editar este post');
      navigate('/dashboard');
    }
  }, [post, user, navigate]);
  
  const handleSubmit = (postData) => {
    dispatch(updatePost({ id, postData }))
      .unwrap()
      .then(() => {
        toast.success('Post actualizado exitosamente');
        navigate(`/post/${id}`);
      })
      .catch((err) => {
        toast.error(err);
      });
  };
  
  if (loading['posts/getById']) {
    return (
      <div className="container-narrow py-12">
        <Spinner />
      </div>
    );
  }
  
  if (!post) {
    return (
      <div className="container-narrow py-12">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Post not found</h2>
          <p className="text-gray-600">
            The post you are trying to edit does not exist or has been removed.
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container-narrow py-12">
      <PostForm post={post} onSubmit={handleSubmit} isEdit={true} />
    </div>
  );
};

export default EditPost;