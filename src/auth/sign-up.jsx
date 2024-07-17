import React, { useState } from 'react';
import './sign-up.scss';
import axios from 'axios';

const SignUp = () => {
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [nicknameError, setNicknameError] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationError, setVerificationError] = useState('');
  const [success, setSuccess] = useState('');
  const [showVerification, setShowVerification] = useState(false);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const sendVerificationCode = async () => {
    if (!validateEmail(email)) {
      setEmailError('유효하지 않은 이메일 형식입니다.');
      return;
    }

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/v1/auth/email-verification`, { email });
      setShowVerification(true);
      alert(`인증 코드가 이메일로 전송되었습니다.`);
    } catch (error) {
      if (error.response && error.response.data.message === '이미 가입된 사용자입니다.') {
        setEmailError('가입 된 이메일입니다.');
      } else {
        setEmailError('이메일 전송 중 오류가 발생했습니다.');
      }
      console.error('Error sending verification code:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailError('');
    setPasswordError('');
    setNicknameError('');
    setVerificationError('');
    setSuccess('');

    let hasError = false;

    if (!validateEmail(email)) {
      setEmailError('유효하지 않은 이메일 형식입니다.');
      hasError = true;
    }

    if (password.length < 8) {
      setPasswordError('비밀번호는 최소 8자 이상이어야 합니다.');
      hasError = true;
    }

    if (password !== confirmPassword) {
      setPasswordError('비밀번호가 일치하지 않습니다.');
      hasError = true;
    }

    if (!nickname) {
      setNicknameError('닉네임을 입력해 주세요.');
      hasError = true;
    }

    if (!verificationCode) {
      setVerificationError('인증 코드를 입력해 주세요.');
      hasError = true;
    }

    if (hasError) {
      return;
    }

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/v1/auth/sign-up`, {
        email,
        password,
        passwordCheck: confirmPassword,
        name: nickname,
        verificationCode: parseInt(verificationCode, 10),
      });

      if (response.data) {
        setSuccess('회원가입에 성공했습니다.');
        setNickname('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setVerificationCode('');
        window.location.replace('/');
      } else {
        setEmailError('회원가입 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.log(error.response.data.message)
      if (error.response.data.message == '발송된 인증 코드와 다릅니다.') {
        setVerificationError('인증 코드가 일치하지 않습니다.')
      } else if(error.response.data.message === '이메일이 이미 존재합니다.'){
        setEmailError('이미 가입된 계정입니다.');
      }
      console.error('Error during sign up:', error);
    }
  };

  return (
    <div id="sign-up-mother">
      <div className="sign-up-container">
        <h2>회원가입</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">이메일</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="button" onClick={sendVerificationCode}>
              인증코드 전송
            </button>
            {emailError && <div className="error">{emailError}</div>}
          </div>
          {showVerification && (
            <div className="form-group">
              <label htmlFor="verification-code">인증 코드</label>
              <input
                type="text"
                id="verification-code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
              />
              {verificationError && (
                <div className="error">{verificationError}</div>
              )}
            </div>
          )}
          <div className="form-group">
            <label htmlFor="password">비밀번호</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {passwordError && <div className="error">{passwordError}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="confirm-password">비밀번호 확인</label>
            <input
              type="password"
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="nickname">닉네임</label>
            <input
              type="text"
              id="nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
            {nicknameError && <div className="error">{nicknameError}</div>}
          </div>
          {success && <div className="success">{success}</div>}
          <button type="submit" id="login-button">
            회원가입
          </button>
        </form>
        <p>
          계정이 이미 있습니까? <a href="/sign-in">로그인</a>
        </p>
      </div>
    </div>
  );
};

export default SignUp;