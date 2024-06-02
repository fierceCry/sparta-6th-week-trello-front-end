// import React, { useState } from 'react';
// import axios from 'axios';

// const SignUp = () => {
//     const [nickname, setNickname] = useState('');
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [confirmPassword, setConfirmPassword] = useState('');
//     const [error, setError] = useState('');
//     const [success, setSuccess] = useState('');

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         if (password !== confirmPassword) {
//             setError('Passwords do not match');
//             return;
//         }
//         try {
//             const apiUrl = process.env.REACT_APP_API_URL;
//             const response = await axios.post(`${apiUrl}/auth/sign-up`, {
//                 nickname,
//                 email,
//                 password,
//             });
//             if (response.status === 201) {
//                 setSuccess('Account created successfully. Please sign in.');
//                 setNickname('');
//                 setEmail('');
//                 setPassword('');
//                 setConfirmPassword('');
//                 setError('');
//             } else {
//                 setError(response.data.message);
//             }
//         } catch (err) {
//             if (err.response) {
//                 setError(err.response.data.message);
//             } else if (err.request) {
//                 setError('No response from server. Please try again later.');
//             } else {
//                 setError('An error occurred. Please try again later.');
//             }
//         }
//     };

//     return (
//         <div className="sign-up-container">
//             <h2>Sign Up</h2>
//             <form onSubmit={handleSubmit}>
//                 <div className="form-group">
//                     <label htmlFor="nickname">Nickname:</label>
//                     <input
//                         type="text"
//                         id="nickname"
//                         value={nickname}
//                         onChange={(e) => setNickname(e.target.value)}
//                     />
//                 </div>
//                 <div className="form-group">
//                     <label htmlFor="email">Email:</label>
//                     <input
//                         type="email"
//                         id="email"
//                         value={email}
//                         onChange={(e) => setEmail(e.target.value)}
//                     />
//                 </div>
//                 <div className="form-group">
//                     <label htmlFor="password">Password:</label>
//                     <input
//                         type="password"
//                         id="password"
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                     />
//                 </div>
//                 <div className="form-group">
//                     <label htmlFor="confirm-password">Confirm Password:</label>
//                     <input
//                         type="password"
//                         id="confirm-password"
//                         value={confirmPassword}
//                         onChange={(e) => setConfirmPassword(e.target.value)}
//                     />
//                 </div>
//                 {error && <div className="error">{error}</div>}
//                 {success && <div className="success">{success}</div>}
//                 <button type="submit">Sign Up</button>
//             </form>
//             <p>
//                 Already have an account? <a href="/sign-in">Sign In</a>
//             </p>
//         </div>
//     );
// };

// export default SignUp;

import React, { useState } from 'react';
import './sign-up.scss';
import { users } from '../data/data';

const SignUp = () => {
    const [nickname, setNickname] = useState('');
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [emailVerified, setEmailVerified] = useState(false);
    const [verificationCode, setVerificationCode] = useState('');
    const [inputVerificationCode, setInputVerificationCode] = useState('');
    const [verificationError, setVerificationError] = useState('');
    const [success, setSuccess] = useState('');
    const [showVerification, setShowVerification] = useState(false);

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const sendVerificationCode = () => {
        if (!validateEmail(email)) {
            setEmailError('유효하지 않은 이메일 형식입니다.');
            return;
        }

        const userExists = users.some(user => user.email === email);
        if (userExists) {
            setEmailError('이미 존재하는 사용자입니다.');
            return;
        }

        // 실제로는 서버에 이메일을 전송하는 코드가 여기에 들어가야 합니다.
        const generatedCode = Math.floor(100000 + Math.random() * 900000);
        setVerificationCode(generatedCode.toString());
        setShowVerification(true);
        alert(`인증 코드 ${generatedCode}가 이메일로 전송되었습니다.`);
    };

    const verifyCode = () => {
        if (inputVerificationCode === '') {
            setVerificationError('인증 코드를 입력해 주세요.');
            return;
        }

        if (verificationCode !== inputVerificationCode) {
            setVerificationError('인증 코드가 일치하지 않습니다.');
            return;
        }

        setEmailVerified(true);
        setVerificationError('');
        setShowVerification(false);
        alert('이메일 인증이 완료되었습니다.');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setEmailError('');
        setPasswordError('');
        setSuccess('');

        if (!emailVerified) {
            setEmailError('이메일 인증이 필요합니다.');
            return;
        }

        if (password.length < 6) {
            setPasswordError('비밀번호는 최소 6자 이상이어야 합니다.');
            return;
        }

        if (password !== confirmPassword) {
            setPasswordError('비밀번호가 일치하지 않습니다.');
            return;
        }

        users.push({ nickname, email, password });
        setSuccess('계정이 성공적으로 생성되었습니다. 로그인해주세요.');
        setNickname('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setEmailVerified(false);
        setVerificationCode('');
        setInputVerificationCode('');
    };

    return (
        <div className="sign-up-container">
            <h2>Sign Up</h2>
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
                    <button type="button" onClick={sendVerificationCode} disabled={emailVerified}>
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
                        {verificationError && <div className="error">{verificationError}</div>}
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
                </div>
                <div className="form-group">
                    <label htmlFor="confirm-password">비밀번호 확인</label>
                    <input
                        type="password"
                        id="confirm-password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    {passwordError && <div className="error">{passwordError}</div>}
                </div>
                <div className="form-group">
                    <label htmlFor="nickname">닉네임</label>
                    <input
                        type="text"
                        id="nickname"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                    />
                </div>
                {success && <div className="success">{success}</div>}
                <button type="submit">회원가입</button>
            </form>
            <p>
                계정이 이미 있습니까? <a href="/sign-in">로그인</a>
            </p>
        </div>
    );
};

export default SignUp;
