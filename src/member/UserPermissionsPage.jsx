import React, { useState } from 'react';
import './UserPermissionsPage.scss'

const MemberRoles = {
  ONLY_VIEW :"OnlyView",
  EDITOR :"Editor",
  ADMIN :"Admin",
}

const UserPermissionsPage = () => {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: '김철수',
      role: MemberRoles.ADMIN
    },
    {
      id: 2,
      name: '이영희',
      role: MemberRoles.ONLY_VIEW
    }
  ]);

  const [selectedUser, setSelectedUser] = useState(users[0]);

  const handleRoleChange = (newRole) => {
    setSelectedUser(prevUser => ({
      ...prevUser,
      role: newRole
    }));
  };

  const handleSave = () => {
    console.log('Role saved:', selectedUser.role);
    // Here you would typically send the updated role to your backend
    setUsers(users.map(user => 
      user.id === selectedUser.id ? { ...user, role: selectedUser.role } : user
    ));
  };

  return (
    <div className="user-permissions-page">
      <h1>유저 권한 설정</h1>
      
      <div className="user-select">
        <label htmlFor="userSelect">사용자 선택:</label>
        <select 
          id="userSelect" 
          value={selectedUser.id}
          onChange={(e) => setSelectedUser(users.find(user => user.id === parseInt(e.target.value)))}
        >
          {users.map(user => (
            <option key={user.id} value={user.id}>{user.name}</option>
          ))}
        </select>
      </div>
      
      <h2>{selectedUser.name} 사용자의 역할 수정</h2>
      
      <div className="role-list">
        {Object.values(MemberRoles).map((role) => (
          <div key={role} className="role-item">
            <input 
              type="radio" 
              id={role} 
              name="role"
              value={role}
              checked={selectedUser.role === role}
              onChange={() => handleRoleChange(role)}
            />
            <label htmlFor={role}>{getRoleLabel(role)}</label>
          </div>
        ))}
      </div>
      
      <div className="button-group">
        <button className="cancel-button">취소</button>
        <button 
          onClick={handleSave}
          className="save-button"
        >
          저장
        </button>
      </div>
    </div>
  );
};

function getRoleLabel(role) {
  const labels = {
    [MemberRoles.ONLY_VIEW]: '읽기 전용',
    [MemberRoles.EDITOR]: '편집자',
    [MemberRoles.ADMIN]: '관리자',
  };
  return labels[role] || role;
}

export default UserPermissionsPage;