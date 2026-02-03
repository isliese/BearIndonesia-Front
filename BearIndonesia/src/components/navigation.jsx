// 공통 nav바 컴포넌트

import React, { useEffect, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import AReumiUser from '../assets/images/AReumi_User.png';
import { clearAuthSession, getAuthUser, getDisplayName } from '../utils/auth';
import { clearScrapCache } from '../utils/scrapStorage';

const Navigation = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [toast, setToast] = useState({ open: false, message: "", type: "info" });
  const [authUser, setAuthUser] = useState(() => getAuthUser());
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { id: 'about', label: '서비스 소개', to: '/about' },
    { id: 'news', label: 'News', to: '/news' },
    { id: 'calendar', label: '인터렉티브 캘린더', to: '/calendar' }
  ];

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const closeDropdown = () => setDropdownOpen(false);
  const openToast = (message, type = "info") => {
    if (!message) return;
    setToast({ open: true, message, type });
  };

  useEffect(() => {
    const update = () => setAuthUser(getAuthUser());
    update();
    window.addEventListener("authchange", update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener("authchange", update);
      window.removeEventListener("storage", update);
    };
  }, []);

  useEffect(() => {
    const handler = (event) => {
      const detail = event?.detail || {};
      if (!detail.message) return;
      setToast({ open: true, message: detail.message, type: detail.type || "info" });
    };
    window.addEventListener("app-toast", handler);
    return () => window.removeEventListener("app-toast", handler);
  }, []);

  useEffect(() => {
    if (!toast.open) return;
    const id = setTimeout(() => {
      setToast((prev) => ({ ...prev, open: false }));
    }, 2200);
    return () => clearTimeout(id);
  }, [toast.open, toast.message]);

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
        onClick={() => navigate('/')}
      >
        BearIndonesia
      </div>

      {/* Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.6rem' }}>
        <ul style={{ display: 'flex', gap: '1rem', listStyle: 'none', margin: 0, padding: 0 }}>
          {navItems.map((item) => (
            <li key={item.id}>
              <NavLink
                to={item.to}
                style={({ isActive }) => ({
                  whiteSpace: 'nowrap',
                  color: 'white',
                  textDecoration: 'none',
                  padding: '0.5rem 1rem',
                  fontSize: '1.1rem',
                  borderRadius: '8px',
                  transition: 'all 0.3s ease',
                  background: isActive ? '#ff8c42' : 'transparent'
                })}
              >
                {item.label}
              </NavLink>
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
              {authUser ? (
                <>
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
                        {getDisplayName(authUser)}
                      </div>
                      <div style={{ color: '#888', fontSize: '12px' }}>
                        {authUser.email || "User"}
                      </div>
                    </div>
                  </div>

                  {/* 메뉴 아이템 */}
                  <div style={{ padding: '8px 0' }}>
                    <button
                      onClick={() => {
                        navigate('/profile', { state: { from: location.pathname } });
                        closeDropdown();
                      }}
                      style={menuButtonStyle}
                      onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.1)'}
                      onMouseLeave={(e) => e.target.style.background = 'none'}
                    >
                       <span>🍀</span> 회원 정보
                    </button>

                    <button
                      onClick={() => {
                        navigate('/scrap', { state: { from: location.pathname } });
                        closeDropdown();
                      }}
                      style={menuButtonStyle}
                      onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.1)'}
                      onMouseLeave={(e) => e.target.style.background = 'none'}
                    >
                       <span>📰</span> 스크랩한 기사
                    </button>

                    <button
                      onClick={() => {
                        clearAuthSession();
                        clearScrapCache();
                        openToast("로그아웃되었습니다.", "info");
                        navigate('/');
                        closeDropdown();
                      }}
                      style={menuButtonStyle}
                      onMouseEnter={(e) => e.target.style.background = 'rgba(255, 140, 66, 0.15)'}
                      onMouseLeave={(e) => e.target.style.background = 'none'}
                    >
                       <span>🚪</span> 로그아웃
                    </button>
                  </div>
                </>
              ) : (
                <div style={{ padding: '8px 0' }}>
                  <button
                    onClick={() => {
                      navigate('/login', { state: { from: location.pathname } });
                      closeDropdown();
                    }}
                    style={menuButtonStyle}
                    onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.1)'}
                    onMouseLeave={(e) => e.target.style.background = 'none'}
                  >
                     <span>🔐</span> 로그인
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {toast.open && (
        <div
          role="status"
          aria-live="polite"
          style={{
            position: "fixed",
            top: "92px",
            right: "24px",
            padding: "0.75rem 1rem",
            borderRadius: "12px",
            background:
              toast.type === "success"
                ? "rgba(46, 125, 50, 0.92)"
                : "rgba(30, 41, 59, 0.92)",
            border:
              toast.type === "success"
                ? "1px solid rgba(134, 239, 172, 0.5)"
                : "1px solid rgba(148, 163, 184, 0.4)",
            color: "white",
            fontSize: "0.9rem",
            boxShadow: "0 12px 28px rgba(0,0,0,0.35)",
            zIndex: 1001,
            backdropFilter: "blur(8px)",
          }}
        >
          {toast.message}
        </div>
      )}
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
