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
import { users } from '../data/data';

const SignUp = () => {
    const [nickname, setNickname] = useState('');
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState(''); // 이메일 에러 상태 추가
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState(''); // 패스워드 에러 상태 추가
    const [success, setSuccess] = useState('');

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // 에러 상태 초기화
        setEmailError('');
        setPasswordError('');
        setSuccess('');

        if (!validateEmail(email)) {
            setEmailError('유효하지 않은 이메일 형식입니다.');
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

        const userExists = users.some(user => user.email === email);
        if (userExists) {
            setEmailError('이미 존재하는 사용자입니다.');
            return;
        }

        users.push({ nickname, email, password });
        setSuccess('계정이 성공적으로 생성되었습니다. 로그인해주세요.');
        // 입력 필드 초기화
        setNickname('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
    };

    return (
        <div className="sign-up-container">
            <h2>Sign Up</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="nickname">Nickname:</label>
                    <input
                        type="text"
                        id="nickname"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    {emailError && <div className="error">{emailError}</div>} {/* 이메일 에러 메시지 조건부 렌더링 */}
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
                <div className="form-group">
                    <label htmlFor="confirm-password">Confirm Password:</label>
                    <input
                        type="password"
                        id="confirm-password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    {passwordError && <div className="error">{passwordError}</div>} {/* 패스워드 에러 메시지 조건부 렌더링 */}
                </div>
                {success && <div className="success">{success}</div>}
                <button type="submit">Sign Up</button>
            </form>
            <p>
                Already have an account? <a href="/sign-in">Sign In</a>
            </p>
        </div>
    );
};

export default SignUp;
