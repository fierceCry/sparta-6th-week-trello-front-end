import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import SignIn from './auth/sign-in';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignUp from './auth/sign-up';
import MyBoard from './users/main';
import CallbackPage from './auth/NaverCallback';
import UserProfilePage from './users/UserProfilePage'
import TrelloWebsite from './mypage/board'
import UserPermissionsPage from './member/UserPermissionsPage'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="/sign-in" element={<SignIn />} />
      <Route path="/main" element={<MyBoard />} />
      <Route path="/board/:id" element={<TrelloWebsite />} />
      <Route path="/user/my" element={<UserProfilePage />} />
      <Route path="/members/permission" element={<UserPermissionsPage />} />
      <Route path="/callback" element={<CallbackPage />} />
      <Route path="/" element={<SignIn />} />
    </Routes>
  </BrowserRouter>
);

reportWebVitals();
