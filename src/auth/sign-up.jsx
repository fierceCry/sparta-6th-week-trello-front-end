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
  const [oneLinerError, setOneLinerError] = useState('');
  const [emailVerified, setEmailVerified] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [inputVerificationCode, setInputVerificationCode] = useState('');
  const [verificationError, setVerificationError] = useState('');
  const [success, setSuccess] = useState('');
  const [showVerification, setShowVerification] = useState(false);
  const [oneLiner, setOneLiner] = useState('');

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
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/email`, { email });
      setVerificationCode(response.data.verificationCode);
      setShowVerification(true);
      alert(`인증 코드가 이메일로 전송되었습니다.`);
    } catch (error) {
      console.log(error.response.data.message)
      if (error.response && error.response.data.message === '이미 가입된 사용자입니다.'){
        setEmailError('가입 된 이메일입니다.');
      } else {
        setEmailError('이메일 전송 중 오류가 발생했습니다.');
      }
      console.error('Error sending verification code:', error);
    }
  };

  const verifyCode = async () => {
    if (inputVerificationCode === '') {
      setVerificationError('인증 코드를 입력해 주세요.');
      return;
    }
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/auth/verify-email/${email}/${inputVerificationCode}`
      );
      if (response.data.message) {
        setEmailVerified(true);
        setVerificationError('');
        setShowVerification(false);
        alert('이메일 인증이 완료되었습니다.');
      } else {
        setVerificationError('인증 코드가 일치하지 않습니다.');
      }
    } catch (error) {
      console.error('Error verifying email:', error);
      setVerificationError('인증 코드가 일치하지 않습니다.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailError('');
    setPasswordError('');
    setNicknameError('');
    setOneLinerError('');
    setSuccess('');

    let hasError = false;

    if (!validateEmail(email)) {
      setEmailError('유효하지 않은 이메일 형식입니다.');
      hasError = true;
    }

    if (password.length < 6) {
      setPasswordError('비밀번호는 최소 6자 이상이어야 합니다.');
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

    if (!oneLiner) {
      setOneLinerError('한 줄 소개를 입력해 주세요.');
      hasError = true;
    }

    if (!emailVerified) {
      setEmailError('이메일 인증이 필요합니다.');
      hasError = true;
    }

    if (hasError) {
      return;
    }

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/sign-up`, {
        email,
        password,
        passwordConfirm: confirmPassword,
        nickname,
        emailVerified,
        provider: 'local',
        oneLiner,
      });
      if (response.data.message) {
        setSuccess('회원가입에 성공했습니다.');
        setNickname('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setEmailVerified(false);
        setVerificationCode('');
        setInputVerificationCode('');
        setOneLiner('');
        window.location.replace('/');
      } else {
        setEmailError('회원가입 중 오류가 발생했습니다.');
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        const message = error.response.data.data.message;
        if (message.includes('사용자')) {
          setEmailError('이미 가입된 사용자입니다.');
        } else if (message.includes('닉네임')) {
          setNicknameError('이미 존재하는 닉네임입니다.');
        } else if (message.includes('한줄 소개')) {
          setOneLinerError('한줄 소개를 입력해주세요.');
        } else if (message === '가입 된 이메일입니다.') {
          setEmailError('가입 된 이메일입니다.');
        } else {
          setEmailError('회원가입 중 오류가 발생했습니다.');
        }
      } else {
        setEmailError('회원가입 중 오류가 발생했습니다.');
      }
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
              disabled={emailVerified}
            />
            <button
              type="button"
              onClick={sendVerificationCode}
              disabled={emailVerified}
            >
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
                value={inputVerificationCode}
                onChange={(e) => setInputVerificationCode(e.target.value)}
              />
              <button type="button" onClick={verifyCode}>
                확인
              </button>
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
          <div className="form-group">
            <label htmlFor="one-liner">한 줄 소개</label>
            <input
              type="text"
              id="one-liner"
              value={oneLiner}
              onChange={(e) => setOneLiner(e.target.value)}
            />
            {oneLinerError && <div className="error">{oneLinerError}</div>}
          </div>
          {success && <div className="success">{success}</div>}
          <button
            type="submit"
            id="login-button"
          >
            회원가입
          </button>
        </form>
        <p>
          계정이 이미 있습니까? <a href="/sign-in">로그인</a>
        </p>
      </div>

    </div>
  )
};

export default SignUp;
