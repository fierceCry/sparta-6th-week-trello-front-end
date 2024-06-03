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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { email, password } = state;
      const response = await axios.post('http://127.0.0.1:3095/auth/sign-in', { email, password });
      if (response.data.message === '로그인에 성공했습니다.') {
        localStorage.setItem('accessToken', response.data.data.accessToken);
        localStorage.setItem('refreshToken', response.data.data.refreshToken);
        navigate('/main');
      } else {
        dispatch({ type: SET_ERROR, error: response.data.message });
      }
    } catch (error) {
      dispatch({ type: SET_ERROR, error: '로그인 중 오류가 발생했습니다.' });
    }
  };

  const handleNaverLogin = async () => {
      window.location.href = 'http://127.0.0.1:3095/auth/naver'
  }


  const handleKakaoLogin = () => {
    window.location.href = 'http://127.0.0.1:3095/auth/kakao';
  };

  return (
    <div className="auth-form">
      <h2>로그인</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">이메일</label>
          <input type="email" id="email" name="email" value={state.email} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="password">비밀번호</label>
          <input type="password" id="password" name="password" value={state.password} onChange={handleChange} />
        </div>
        {state.error && <div className="error">{state.error}</div>}
        <button type="submit">로그인</button>
      </form>
      <div className="social-login-buttons">
        <button onClick={handleNaverLogin} className="naver-login-button">네이버 로그인</button>
        <button onClick={handleKakaoLogin} className="kakao-login-button">카카오 로그인</button>
      </div>
      <p>계정이 없으신가요? <Link to="/sign-up">회원가입</Link></p>
    </div>
  );
};

export default SignIn;
