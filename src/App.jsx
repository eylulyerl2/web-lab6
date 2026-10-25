import { useEffect, useReducer } from 'react';
import { fetchPosts } from './api/postsApi.js';
import { postsReducer, initialState } from './reducer/postsReducer.js';
import PostList from './components/PostList.jsx';

function App() {
  const [state, dispatch] = useReducer(postsReducer, initialState);

  useEffect(() => {
    const controller = new AbortController();

    async function loadPosts() {
      dispatch({ type: 'FETCH_START' });
      try {
        const data = await fetchPosts(controller.signal);
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (error) {
        if (error.name === 'AbortError') return;
        dispatch({ type: 'FETCH_ERROR', payload: error.message });
      }
    }

    loadPosts();

    return () => controller.abort();
  }, []);

  const { posts, loading, error } = state;
  const isReady = !loading && !error;

  return (
    <div className="app">
      <h1>Post Dashboard</h1>

      {loading && <p>Loading posts...</p>}
      {error && <p role="alert">Error: {error}</p>}
      {isReady && posts.length === 0 && <p>No posts found.</p>}
      {isReady && posts.length > 0 && <PostList posts={posts} />}
    </div>
  );
}

export default App;