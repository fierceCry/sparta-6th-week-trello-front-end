import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import SignIn from './auth/sign-in';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignUp from './auth/sign-up';
import MainPage from './post/MainPage';
import MyPage from './users/users';
import 'bootstrap/dist/css/bootstrap.min.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/sign-in" element={<SignIn />} />
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="/main" element={<MainPage />} />
      <Route path="/mypage" element={<MyPage />} />
      {/* <Route path="/dashboard" element={<Dashboard />} /> */}
      <Route path="/" element={<SignIn />} />
    </Routes>
  </BrowserRouter>
);

reportWebVitals();
