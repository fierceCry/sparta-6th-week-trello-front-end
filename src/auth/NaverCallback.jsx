import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CallbackPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // 현재 URL에서 토큰 추출
    const urlParams = new URLSearchParams(window.location.search);
    console.log(urlParams)
    const accessToken = urlParams.get('accessToken');
    const refreshToken = urlParams.get('refreshToken');
    console.log(accessToken)
    console.log(refreshToken)
    if (accessToken && refreshToken) {
      // 토큰을 로컬 스토리지에 저장 (혹은 원하는 저장 방식)
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      // 인증 후 이동할 페이지로 리디렉션
      navigate('/main');
    } else {
      // 토큰이 없는 경우, 에러 처리 (로그인 페이지로 리디렉션 등)
      navigate('/sign-in');
    }
  }, [navigate]);

  return (
    <div>
      <h1>로그인 처리 중...</h1>
    </div>
  );
};

export default CallbackPage;
