import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MyPage = () => {
    const [posts, setPosts] = useState([]);
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        const fetchMyPosts = async () => {
            try {
                const apiUrl = process.env.REACT_APP_API_URL;
                const response = await axios.get(`${apiUrl}/posts`);
                const myPosts = response.data.filter(post => post.author === user.nickname);
                setPosts(myPosts);
            } catch (error) {
                console.error('Failed to fetch posts:', error);
            }
        };

        fetchMyPosts();
    }, [user]);

    return (
        <div className="my-page-container">
            <h2>My Posts</h2>
            {posts.length === 0 ? (
                <p>No posts available</p>
            ) : (
                <ul>
                    {posts.map(post => (
                        <li key={post.id}>
                            <h3>{post.title}</h3>
                            <p>{post.content}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default MyPage;
