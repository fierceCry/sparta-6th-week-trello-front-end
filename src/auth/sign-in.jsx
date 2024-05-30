import React, { useState } from 'react';
import axios from 'axios';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const apiUrl = process.env.REACT_APP_API_URL;      
      const response = await axios.post(`${apiUrl}/auth/sign-in`, {
        email,
        password,
      });
      if (response.status === 200) {
        // 로그인 성공 시 사용자 정보를 저장하고 페이지를 이동시킵니다.
        localStorage.setItem('user', JSON.stringify({ email }));
        window.location.href = '/dashboard';
      } else {
        // 로그인 실패 시 에러 메시지를 표시합니다.
        setError(response.data.message);
      }
    } catch (err) {
      if (err.response) {
        // 서버가 응답을 반환한 경우 (2xx 외의 상태 코드)
        setError(err.response.data.message);
      } else if (err.request) {
        // 요청이 전송되었으나 응답을 받지 못한 경우
        setError('No response from server. Please try again later.');
      } else {
        // 요청을 설정하는 중에 오류가 발생한 경우
        setError('An error occurred. Please try again later.');
      }
    }
  };

  return (
    <div className="sign-in-container">
      <h2>Sign In</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <div className="error">{error}</div>}
        <button type="submit">Sign In</button>
      </form>
      <p>
        Don't have an account? <a href="/sign-up">Sign Up</a>
      </p>
    </div>
  );
};

export default SignIn;
