import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import SignIn from './auth/sign-in';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignUp from './auth/sign-up';
import MyBoard from './users/board-mypage';
import CallbackPage from './auth/NaverCallback';
import UserProfilePage from './users/UserProfilePage'
import TrelloWebsite from './mypage/mypage'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="/sign-in" element={<SignIn />} />
      <Route path="/mypage-board" element={<MyBoard />} />
      <Route path="mypage" element={<TrelloWebsite />} />
      <Route path="/user/my" element={<UserProfilePage />} />
      <Route path="/callback" element={<CallbackPage />} />
      <Route path="/" element={<SignIn />} />
    </Routes>
  </BrowserRouter>

);
reportWebVitals();