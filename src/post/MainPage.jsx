// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const MainPage = () => {
//   const [posts, setPosts] = useState([]);

//   useEffect(() => {
//     const fetchPosts = async () => {
//       try {
//         const apiUrl = process.env.REACT_APP_API_URL;
//         const response = await axios.get(`${apiUrl}/posts`);
//         setPosts(response.data);
//       } catch (error) {
//         console.error('Failed to fetch posts:', error);
//       }
//     };

//     fetchPosts();
//   }, []);

//   return (
//     <div className="main-page-container">
//       <h2>Community Posts</h2>
//       {posts.length === 0 ? (
//         <p>No posts available</p>
//       ) : (
//         <ul>
//           {posts.map(post => (
//             <li key={post.id}>
//               <h3>{post.title}</h3>
//               <p>{post.content}</p>
//               <small>by {post.author}</small>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default MainPage;


import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { posts } from '../data/data';
import './MainPage.scss';

const MainPage = () => {
  const [allPosts, setAllPosts] = useState([]);
  console.log(allPosts)
  useEffect(() => {
    setAllPosts(posts);
  }, []);

  return (
    <div className="main-page-container">
      <h2>Community Posts</h2>
      {allPosts.length === 0 ? (
        <p>No posts available</p>
      ) : (
        <ul>
          {allPosts.map(post => (
            <li key={post.id}>
              <h3>{post.title}</h3>
              <p>{post.content}</p>
              <small>by {post.author}</small>
            </li>
          ))}
        </ul>
      )}
      <div className="links">
        <Link to="/mypage">Go to My Page</Link>
      </div>
    </div>
  );
};

export default MainPage;
