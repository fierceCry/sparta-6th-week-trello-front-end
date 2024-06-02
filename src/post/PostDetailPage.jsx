import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './PostDetailPage.scss';

const PostDetailPage = () => {
    const { id } = useParams();
    const post = {
        'data': {
            "nickname": "이길현",
            "postId": "4",
            "title": "제목",
            "content": "내용",
            'region': '지역',
            "llkes": "좋아요 수",
            "image" : ['https://img.siksinhot.com/seeon/1716954228146074.jpg', 'https://img.siksinhot.com/seeon/1716954228146074.jpg'],
            "createdAt": "생성일시",
            "updatedAt": "수정일시",
            'connten': [
                {
                    "connentId": "3",
                    "nickname": "이길현",
                    "content": "맛있는 맛집 추천 감사합니다.",
                    "createdAt": "날짜",
                    "updatedAt": "날짜"
                },
                {
                    "connentId": "4",
                    "nickname": "김만규",
                    "content": "여기 저도 가봤는데 맛있어요.",
                    "createdAt": "날짜",
                    "updatedAt": "날짜"
                }
            ]
        }
    };

    console.log(post);
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);
    const [imagesLoaded, setImagesLoaded] = useState(false);

    const handleChange = (e) => {
        setComment(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setComments([...comments, comment]);
        setComment('');
    };

    useEffect(() => {
        const checkImagesLoaded = () => {
            const images = document.querySelectorAll('.post-image');
            const loaded = Array.from(images).every(image => image.complete);
            setImagesLoaded(loaded);
        };

        window.addEventListener('load', checkImagesLoaded); // 모든 리소스가 로드된 후 실행됨
        return () => window.removeEventListener('load', checkImagesLoaded);
    }, []);

    useEffect(() => {
        if (imagesLoaded) {
            window.scrollTo(0, 0); // 페이지 로드 시 스크롤을 상단으로 이동
        }
    }, [imagesLoaded]);

    if (!post) {
        return (
            <div className="post-detail-container">
                <h2 className="post-title">Post not found</h2>
            </div>
        );
    }

    return (
        <div className="post-detail-container">
            <div className="post-header">
                <h2 className="post-title">{post.data.title}</h2>
                <small className="post-author">by {post.data.nickname}</small>
            </div>
            <div className="post-content">
                {post.data.image.map((imageUrl, index) => (
                    <img src={imageUrl} alt={post.data.title} className="post-image" key={index} />
                ))}
                <p>{post.data.content}</p>
            </div>

            <div className="comments">
                <h3>Comments</h3>
                <ul>
                    {post.data.connten.map((comment, index) => (
                        <li key={index}>
                            <p>{comment.nickname}</p>
                            <p>{comment.content}</p>
                        </li>
                    ))}
                </ul>
                <form onSubmit={handleSubmit}>
                    <input type="text" value={comment} onChange={handleChange} />
                    <button type="submit">Add Comment</button>
                </form>
            </div>
            <button className="like-button">Like</button>
        </div>
    );
};

export default PostDetailPage;
