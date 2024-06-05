// import React, { useEffect, useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import goodplace from '../img/Preview.png';
// import mypage from '../img/user.png';
// import logout from '../img/logout.png'

// const MainPage = () => {
//   const [allPosts, setAllPosts] = useState([]);
//   const [sortOrder, setSortOrder] = useState('desc');
//   const [showCreateForm, setShowCreateForm] = useState(false);
//   const [newPost, setNewPost] = useState({
//     title: '',
//     content: '',
//     imageUrl: '',
//     regionId: 1, // 카테고리 값을 regionId로 설정
//   });
//   const navigate = useNavigate();

//   // fetchPosts 함수를 선언합니다.
//   const fetchPosts = async () => {
//     try {
//       const accessToken = localStorage.getItem('accessToken');
//       const response = await axios.get(
//         `${process.env.REACT_APP_API_URL}/posts/posts?sort=${sortOrder}`,
//         {
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//           },
//         }
//       );
//       const postsData = Array.isArray(response.data.data)
//         ? response.data.data
//         : [response.data.data];
//       setAllPosts(postsData);
//     } catch (error) {
//       console.error('Error fetching posts:', error);
//     }
//   };

//   useEffect(() => {
//     // 액세스 토큰 확인
//     const accessToken = localStorage.getItem('accessToken');

//     // 액세스 토큰이 없으면 로그인 페이지로 이동
//     if (!accessToken) {
//       navigate('/sign-in');
//       return;
//     }

//     // 게시글 데이터 가져오는 함수 호출
//     fetchPosts();
//   }, [navigate, sortOrder]);

//   const handleLogout = async () => {
//     try {
//       const refreshToken = localStorage.getItem('refreshToken');
//       await axios.delete(`${process.env.REACT_APP_API_URL}/auth/sign-out`, {
//         headers: {
//           Authorization: `Bearer ${refreshToken}`,
//         },
//       });
//       localStorage.removeItem('accessToken');
//       localStorage.removeItem('refreshToken');
//       alert('로그아웃에 성공했습니다.');
//       navigate('/sign-in');
//     } catch (error) {
//       console.error('로그아웃 중 오류 발생:', error);
//     }
//   };

//   const handleSortToggle = () => {
//     const newSortOrder = sortOrder === 'desc' ? 'asc' : 'desc';
//     setSortOrder(newSortOrder);
//   };

//   const handleCreateFormToggle = () => {
//     setShowCreateForm(!showCreateForm);
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setNewPost({
//       ...newPost,
//       [name]: value,
//     });
//   };

//   const handleCreatePost = async () => {
//     try {
//       const accessToken = localStorage.getItem('accessToken');
//       const { title, content, imageUrl, regionId } = newPost;
//       console.log(title, content, imageUrl, regionId);
//       const response = await axios.post(
//         `${process.env.REACT_APP_API_URL}/posts/posts`,
//         { title, content, imageUrl, regionId },
//         {
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//           },
//         }
//       );
//       if (response.data.message === '게시글 생성에 성공하였습니다.') {
//         alert('게시글이 생성되었습니다.');
//         setShowCreateForm(false);
//         setNewPost({ title: '', content: '', imageUrl: '', regionId: 1 }); // 수도권으로 초기화
//         // 생성 후에 필요한 경우에만 조회
//         fetchPosts(); // fetchPosts 직접 호출
//       }
//     } catch (error) {
//       console.error('게시글 생성 중 오류 발생:', error);
//       alert('게시글 생성 중 오류가 발생했습니다.');
//     }
//   };

//   const handleCategoryFilter = async (regionName) => {
//     try {
//       let regionId;
//       switch (regionName) {
//         case '충청권':
//           regionId = 2;
//           break;
//         case '호남권':
//           regionId = 3;
//           break;
//         case '영남권':
//           regionId = 4;
//           break;
//         case '강원권':
//           regionId = 5;
//           break;
//         case '제주권':
//           regionId = 6;
//           break;
//         default:
//           regionId = 1; // default는 수도권
//       }
//       const accessToken = localStorage.getItem('accessToken');
//       const response = await axios.get(
//         `${process.env.REACT_APP_API_URL}/posts/category/${regionId}`,
//         {
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//           },
//         }
//       );
//       const postsData = Array.isArray(response.data.data)
//         ? response.data.data
//         : [response.data.data];
//       setAllPosts(postsData);
//     } catch (error) {
//       console.error('Error fetching posts:', error);
//     }
//   };

//   const handleImageInputChange = (e) => {
//     const files = e.target.files; // 선택된 파일 목록
//     const fileArray = Array.from(files); // 파일 목록을 배열로 변환합니다.
  
//     Promise.all(
//       fileArray.map(async (file) => {
//         const reader = new FileReader(); // 파일을 읽기 위한 FileReader 객체 생성
//         reader.onloadend = () => {
//           // 파일을 읽기가 끝나면 실행되는 콜백 함수
//           setNewPost((prevState) => ({
//             ...prevState,
//             imageUrl: [...prevState.imageUrl, reader.result], // 파일의 데이터 URL을 imageUrl 배열에 추가합니다.
//           }));
//         };
//         if (file) {
//           reader.readAsDataURL(file); // 파일을 읽기 시작합니다.
//         }
//       })
//     );
//   };
  

//   const handleCategoryChange = (e) => {
//     const { value } = e.target;
//     console.log(value);
//     // 각 카테고리에 해당하는 regionId를 설정
//     let regionId = 1; // default는 수도권
//     switch (value) {
//       case '충청권':
//         regionId = 2;
//         break;
//       case '호남권':
//         regionId = 3;
//         break;
//       case '영남권':
//         regionId = 4;
//         break;
//       case '강원권':
//         regionId = 5;
//         break;
//       case '제주권':
//         regionId = 6;
//         break;
//       default:
//         regionId = 1; // default는 수도권
//     }
//     const updatedRegionId = value;
//     setNewPost((prevState) => ({
//       ...prevState,
//       regionId: parseInt(updatedRegionId),
//     }));
//   };




//   return (<div className="main-page-container">
//     <div className="main-page-container">


//       <header className="main-header">
//         <div className="links">
//           <Link to="/mypage">
//             <img id="user-icon" src={mypage} alt="user" />
//           </Link>
//           <button id="logout-icon-btn" onClick={handleLogout}>
//             <img id="logout-icon" src={logout} alt="logout" />
//           </button>
//         </div>
//         <img id="logo" src={goodplace} alt="logo" />;
//       </header>
//       {/* <hr /> */}
//       <h1 id="site-title-first" className="site-title">뭐 먹고싶어</h1>
//       <h1 id="site-title-second" className="site-title">골라</h1>
//       <Link src="../img/Eat.jpg"></Link>


//     </div>

//     <div id='main-middle-aboutpost'>
//       <button className="common-button" onClick={handleCreateFormToggle}>글쓰기</button>
//       <hr />
//       <h2>지역별로 고르기</h2>
//       <div className="category-buttons">
//         <button className="region-button" onClick={() => handleCategoryFilter('수도권')}>수도권</button>
//         <button className="region-button" onClick={() => handleCategoryFilter('충청권')}>충청권</button>
//         <button className="region-button" onClick={() => handleCategoryFilter('호남권')}>호남권</button>
//         <button className="region-button" onClick={() => handleCategoryFilter('영남권')}>영남권</button>
//         <button className="region-button" onClick={() => handleCategoryFilter('강원권')}>강원권</button>
//         <button className="region-button" onClick={() => handleCategoryFilter('제주권')}>제주권</button>
//       </div>

//       <button className="common-button" onClick={handleSortToggle}>
//         {sortOrder === 'desc' ? '오래된순' : '최신순'}
//       </button>
//     </div>

//     <div id="posts-grid-mom">
//       <ul className="posts-grid">
//         {allPosts.map((post) => (
//           <li className="post-card" key={post.postId}>
//             <Link to={`/post/${post.postId}`} className="post-link">
//               {post.imageUrl && (
//                 <img
//                   src={
//                     Array.isArray(post.imageUrl)
//                       ? post.imageUrl[0]
//                       : post.imageUrl
//                   }
//                   alt={post.title}
//                   className="post-image"
//                 />
//               )}
//               <h3>{post.title}</h3>
//               <small>{post.nickname}</small>
//             </Link>
//           </li>
//         ))}
//       </ul>
//     </div>
//     {showCreateForm && (
//       <div className="modal">
//         <div className="modal-content">
//           <span className="close" onClick={handleCreateFormToggle}>
//             &times;
//           </span>
//           <h2 className="modal-header">맛집 추천하기😋</h2>
//           <input className="modal-title"
//             type="text"
//             name="title"
//             placeholder="제목"
//             value={newPost.title}
//             onChange={handleInputChange}
//           />
//           <textarea className="modal-content-input"
//             type="text"
//             name="content"
//             placeholder="내용을 작성해주세요"
//             value={newPost.content}
//             onChange={handleInputChange}
//           ></textarea>
//           <input
//             type="file"
//             name="imageUrl"
//             placeholder="Image URL"
//             // value={newPost.imageUrl}
//             onChange={handleImageInputChange}
//             multiple  // 다중 파일 선택을 지원하도록 multiple 속성을 추가합니다.
//           />
//           <select
//             name="category"
//             value={newPost.regionId}
//             onChange={handleCategoryChange}
//           >
//             <option value="1">수도권</option>
//             <option value="2">충청권</option>
//             <option value="3">호남권</option>
//             <option value="4">영남권</option>
//             <option value="5">강원권</option>
//             <option value="6">제주권</option>
//           </select>
//           <button className="modal-btn" onClick={handleCreatePost}>게시글 등록</button>
//         </div>
//       </div>
//     )}
//   </div>
//   );
// }


// export default MainPage;



import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import goodplace from '../img/Preview.png';
import mypage from '../img/user.png';
import logout from '../img/logout.png';

const MainPage = () => {
  const [allPosts, setAllPosts] = useState([]);
  const [sortOrder, setSortOrder] = useState('desc');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [totalPages, setTotalPages] = useState(0); // 추가: 총 페이지 수 상태 추가
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    imageUrl: '',
    regionId: 1, // 카테고리 값을 regionId로 설정
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12; // 한 페이지당 표시되는 게시물 수
  const navigate = useNavigate();

  const fetchPosts = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/posts/posts?sort=${sortOrder}&page=${currentPage}&limit=${itemsPerPage}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log(response.data)
      console.log(response.data.totalPages)
      console.log(response.data.currentPage)
      const { data, totalPages } = response.data;
      setTotalPages(totalPages);
      const postsData = Array.isArray(data) ? data : [data];
      setAllPosts(postsData);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      navigate('/sign-in');
      return;
    }
    fetchPosts();
  }, [navigate, sortOrder, currentPage]); // currentPage 추가

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      await axios.delete(`${process.env.REACT_APP_API_URL}/auth/sign-out`, {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      });
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      alert('로그아웃에 성공했습니다.');
      navigate('/sign-in');
    } catch (error) {
      console.error('로그아웃 중 오류 발생:', error);
    }
  };

  const handleSortToggle = () => {
    const newSortOrder = sortOrder === 'desc' ? 'asc' : 'desc';
    setSortOrder(newSortOrder);
  };

  const handleCreateFormToggle = () => {
    setShowCreateForm(!showCreateForm);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPost({
      ...newPost,
      [name]: value,
    });
  };

  const handleCreatePost = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const { title, content, imageUrl, regionId } = newPost;
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/posts/posts`,
        { title, content, imageUrl, regionId },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response.data.message === '게시글 생성에 성공하였습니다.') {
        alert('게시글이 생성되었습니다.');
        setShowCreateForm(false);
        setNewPost({ title: '', content: '', imageUrl: '', regionId: 1 });
        fetchPosts();
      }
    } catch (error) {
      console.error('게시글 생성 중 오류 발생:', error);
      alert('게시글 생성 중 오류가 발생했습니다.');
    }
  };

  const handleCategoryFilter = async (regionName) => {
    try {
      let regionId;
      switch (regionName) {
        case '충청권':
          regionId = 2;
          break;
        case '호남권':
          regionId = 3;
          break;
        case '영남권':
          regionId = 4;
          break;
        case '강원권':
          regionId = 5;
          break;
        case '제주권':
          regionId = 6;
          break;
        default:
          regionId = 1; // default는 수도권
      }
      const accessToken = localStorage.getItem('accessToken');
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/posts/category/${regionId}?page=${currentPage}&limit=${itemsPerPage}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const postsData = Array.isArray(response.data.data)
        ? response.data.data
        : [response.data.data];
      setAllPosts(postsData);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handleImageInputChange = (e) => {
    const files = e.target.files; // 선택된 파일 목록
    const fileArray = Array.from(files); // 파일 목록을 배열로 변환합니다.
  
    Promise.all(
      fileArray.map(async (file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setNewPost((prevState) => ({
            ...prevState,
            imageUrl: [...prevState.imageUrl, reader.result],
          }));
        };
        if (file) {
          reader.readAsDataURL(file);
        }
      })
    );
  };
  

  const handleCategoryChange = (e) => {
    const { value } = e.target;
    let regionId = 1;
    switch (value) {
      case '충청권':
        regionId = 2;
        break;
      case '호남권':
        regionId = 3;
        break;
      case '영남권':
        regionId = 4;
        break;
      case '강원권':
        regionId = 5;
        break;
      case '제주권':
        regionId = 6;
        break;
      default:
        regionId = 1;
    }
    const updatedRegionId = value;
    setNewPost((prevState) => ({
      ...prevState,
      regionId: parseInt(updatedRegionId),
    }));
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="main-page-container">
      <header className="main-header">
        <div className="links">
          <img id="logo" src={goodplace} alt="logo" />
          <Link to="/mypage">
            <img id="user-icon" src={mypage} alt="user" />
          </Link>
          <button id="logout-icon-btn" onClick={handleLogout}>
            <img id="logout-icon" src={logout} alt="logout" />
          </button>
        </div>
        <img id="logo" src={goodplace} alt="logo" />;
      </header>
      {/* <hr /> */}
      <h1 id="site-title-first" className="site-title">뭐 먹고싶어</h1>
      <h1 id="site-title-second" className="site-title">골라</h1>
      <Link src="../img/Eat.jpg"></Link>


    </div>

    <div id='main-middle-aboutpost'>
      <button className="common-button" onClick={handleCreateFormToggle}>글쓰기</button>
      <hr />
      <h2>지역별로 고르기</h2>
      <div className="category-buttons">
        <button className="region-button" onClick={() => handleCategoryFilter('수도권')}>수도권</button>
        <button className="region-button" onClick={() => handleCategoryFilter('충청권')}>충청권</button>
        <button className="region-button" onClick={() => handleCategoryFilter('호남권')}>호남권</button>
        <button className="region-button" onClick={() => handleCategoryFilter('영남권')}>영남권</button>
        <button className="region-button" onClick={() => handleCategoryFilter('강원권')}>강원권</button>
        <button className="region-button" onClick={() => handleCategoryFilter('제주권')}>제주권</button>
      </div>

      <button className="common-button" onClick={handleSortToggle}>
        {sortOrder === 'desc' ? '오래된순' : '최신순'}
      </button>
    </div>

    <div id="posts-grid-mom">
      <ul className="posts-grid">
        {allPosts.map((post) => (
          <li className="post-card" key={post.postId}>
            <Link to={`/post/${post.postId}`} className="post-link">
              {post.imageUrl && (
                <img
                  src={
                    Array.isArray(post.imageUrl)
                      ? post.imageUrl[0]
                      : post.imageUrl
                  }
                  alt={post.title}
                  className="post-image"
                />
              )}
              <h3>{post.title}</h3>
              <small>{post.nickname}</small>
            </Link>
          </li>
        ))}
      </ul>
    </div>
    {showCreateForm && (
      <div className="modal">
        <div className="modal-content">
          <span className="close" onClick={handleCreateFormToggle}>
            &times;
          </span>
          <h2 className="modal-header">맛집 추천하기😋</h2>
          <input className="modal-title"
            type="text"
            name="title"
            placeholder="제목"
            value={newPost.title}
            onChange={handleInputChange}
          />
          <textarea className="modal-content-input"
            type="text"
            name="content"
            placeholder="내용을 작성해주세요"
            value={newPost.content}
            onChange={handleInputChange}
          ></textarea>
          <input
            type="file"
            name="imageUrl"
            placeholder="Image URL"
            // value={newPost.imageUrl}
            onChange={handleImageInputChange}
            multiple  // 다중 파일 선택을 지원하도록 multiple 속성을 추가합니다.
          />
          <select
            name="category"
            value={newPost.regionId}
            onChange={handleCategoryChange}
          >
            <option value="1">수도권</option>
            <option value="2">충청권</option>
            <option value="3">호남권</option>
            <option value="4">영남권</option>
            <option value="5">강원권</option>
            <option value="6">제주권</option>
          </select>
          <button className="modal-btn" onClick={handleCreatePost}>게시글 등록</button>
        </div>
      )}
      {/* 페이지네이션 */}
      <div className="pagination">
        {[...Array(Math.ceil(allPosts.length / itemsPerPage))].map((_, index) => (
          <button key={index} onClick={() => handlePageChange(index + 1)}>
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MainPage;


