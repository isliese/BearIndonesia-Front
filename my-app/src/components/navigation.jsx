// 공통 nav바 컴포넌트

import React, { useState } from 'react';
import AReumiUser from '../assets/images/AReumi_User.png';

const Navigation = ({ currentPage, setCurrentPage }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  const navItems = [
    { id: 'about', label: '서비스 소개' },
    { id: 'news', label: 'News' },
    { id: 'calendar', label: '인터렉티브 캘린더' }
  ];

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  return (
    <nav style={{
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      padding: '1rem 2.5rem 1rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      {/* 로고 */}
      <div 
        style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ff8c42', cursor: 'pointer' }}
        onClick={() => setCurrentPage('home')}
      >
        BearIndonesia
      </div>

      {/* 네비게이션 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.6rem' }}>
        <ul style={{ display: 'flex', gap: '1rem', listStyle: 'none', margin: 0, padding: 0 }}>
          {navItems.map(item => (
            <li key={item.id}>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentPage(item.id);
                }}
                style={{
                  whiteSpace: 'nowrap',
                  color: 'white',
                  textDecoration: 'none',
                  padding: '0.5rem 1rem',
                  fontSize: '1.1rem',
                  borderRadius: '8px',
                  transition: 'all 0.3s ease',
                  background: currentPage === item.id ? '#ff8c42' : 'transparent'
                }}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        {/* 프로필 드롭다운 */}
        <div style={{ position: 'relative' }}>
          <button 
            onClick={toggleDropdown} 
            style={{ 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer', 
              padding: 0, 
              borderRadius: '50%' 
            }}
          >
            <img 
              src={AReumiUser} 
              alt="User Avatar" 
              style={{ width: '40px', height: '40px', borderRadius: '50%' }} 
            />
          </button>

          {dropdownOpen && (
            <div style={{
              position: 'absolute', top: '100%', right: 0, marginTop: '8px',
              background: 'rgba(30, 30, 30, 0.95)', backdropFilter: 'blur(10px)',
              borderRadius: '12px', minWidth: '200px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              overflow: 'hidden', zIndex: 1000
            }}>
              {/* 사용자 정보 */}
              <div style={{
                padding: '16px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: '#f5e6d3',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid #d4a574'
                }}>
                  <img
                    src={AReumiUser}
                    alt="User Avatar"
                    style={{ width: '30px', height: '30px', borderRadius: '50%' }}
                  />
                </div>
                <div>
                  <div style={{ color: 'white', fontWeight: 'bold', fontSize: '14px' }}>
                    아르미
                  </div>
                  <div style={{ color: '#888', fontSize: '12px' }}>
                    AReumi_User_ID
                  </div>
                </div>
              </div>

              {/* 메뉴 아이템 */}
              <div style={{ padding: '8px 0' }}>
                <button
                  onClick={() => {
                    setCurrentPage('account');
                    setDropdownOpen(false);
                  }}
                  style={menuButtonStyle}
                  onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.1)'}
                  onMouseLeave={(e) => e.target.style.background = 'none'}
                >
                  <span>🍀</span> 회원 정보
                </button>

                <button
                  onClick={() => {
                    setCurrentPage('scrapped');
                    setDropdownOpen(false);
                  }}
                  style={menuButtonStyle}
                  onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.1)'}
                  onMouseLeave={(e) => e.target.style.background = 'none'}
                >
                  <span>📰</span> 내가 스크랩한 기사
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

const menuButtonStyle = {
  width: '100%',
  padding: '12px 16px',
  background: 'none',
  border: 'none',
  color: 'white',
  textAlign: 'left',
  cursor: 'pointer',
  transition: 'background-color 0.2s ease',
  fontSize: '15px',
  display: 'flex',
  alignItems: 'center',
  gap: '12px'
};

export default Navigation;