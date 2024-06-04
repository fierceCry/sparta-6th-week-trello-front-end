import React, { useReducer, useEffect } from 'react';
import './sign-in.scss';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

// 초기 상태 정의
const initialState = {
  email: '',
  password: '',
  error: '',
};

// 액션 타입 정의
const SET_FIELD = 'SET_FIELD';
const SET_ERROR = 'SET_ERROR';

// 리듀서 함수 정의
const reducer = (state, action) => {
  switch (action.type) {
    case SET_FIELD:
      return { ...state, [action.field]: action.value };
    case SET_ERROR:
      return { ...state, error: action.error };
    default:
      return state;
  }
};

const SignIn = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch({ type: SET_FIELD, field: name, value });
  };

  // 일반회원가입 로직
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { email, password } = state;
      const response = await axios.post('http://127.0.0.1:3095/auth/sign-in', { email, password });
      if (response.data.message === '로그인에 성공했습니다.') {
        localStorage.setItem('accessToken', response.data.data.accessToken.accessToken);
        localStorage.setItem('refreshToken', response.data.data.accessToken.refreshToken);
        navigate('/main');
      } else {
        dispatch({ type: SET_ERROR, error: response.data.message });
      }
    } catch (error) {
      dispatch({ type: SET_ERROR, error: '로그인 중 오류가 발생했습니다.' });
    }
  };

  // 네이버 로그인 로직
  const handleNaverLogin = async () => {
    window.location.href = 'http://127.0.0.1:3095/auth/naver'
  }

  // 카카오 로그인 로직
  const handleKakaLogin = () => {
    window.location.href = 'http://127.0.0.1:3095/auth/kakao';
  };

  return (

    <div className="auth-form" id="auth-form" >
      <h1 id="log-in-Main">로그인</h1>
      {/* <button onClick={handleNaverLogin} className="social-login-button naver-login-button">네이버 로그인</button>
       */}

      {/* <button onClick={handleKakaLogin} id="kakao-login-btn" >
        <img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2Fezk6Q5%2FbtsHNv4AfU6%2Fo3GefCK5GQPeg4cQaYEWh1%2Fimg.png" width="300"
          alt="카카오 로그인 버튼" />
      </button>
      <button onClick={handleNaverLogin} id="kakao-login-btn" >
        <img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FmN7uT%2FbtsHMf2LBSD%2FOJrztVUUFLFE5QWfbxYSc1%2Fimg.png" width="300"
          alt="카카오 로그인 버튼" />
      </button> */}


      <form className="form-group-mother" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email"></label>
          <input placeholder="이메일" type="email" id="email" name="email" value={state.email} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="password"></label>
          <input placeholder="비밀번호" type="password" id="password" name="password" value={state.password} onChange={handleChange} />
        </div>
        {state.error && <div className="error">{state.error}</div>}
        <button id="login-button" type="submit">로그인</button>
      </form>

      <p>계정이 없으신가요? <Link to="/sign-up">회원가입</Link></p>
      <div class="divider">또는</div>
      <button onClick={handleKakaLogin} id="kakao-login-btn" >
        <img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2Fezk6Q5%2FbtsHNv4AfU6%2Fo3GefCK5GQPeg4cQaYEWh1%2Fimg.png" width="300"
          alt="카카오 로그인 버튼" />
      </button>
      <button onClick={handleNaverLogin} id="naver-login-btn" >
        <img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FmN7uT%2FbtsHMf2LBSD%2FOJrztVUUFLFE5QWfbxYSc1%2Fimg.png" width="300"
          alt="카카오 로그인 버튼" />
      </button>





    </div>
  );
};

export default SignIn;
