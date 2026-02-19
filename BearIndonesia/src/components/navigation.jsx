// 공통 nav바 컴포넌트

import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import AReumiUser from '../assets/images/AReumi_User.png';
import { clearAuthSession, getAuthUser, getDisplayName, isAdminUser } from '../utils/auth';
import { clearScrapCache } from '../utils/scrapStorage';
import { useMediaQuery } from "../hooks/useMediaQuery";

const Navigation = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [toast, setToast] = useState({ open: false, message: "", type: "info" });
  const [authUser, setAuthUser] = useState(() => getAuthUser());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const isAdmin = isAdminUser(authUser);
  const navItems = [
    { id: 'about', label: 'About', to: '/about' },
    { id: 'news', label: 'News', to: '/news' },
    { id: 'calendar', label: 'Interactive Calendar', to: '/calendar' },
    { id: 'report', label: 'Report', to: '/report/competitor' },
    ...(isAdmin ? [{ id: 'sales', label: 'Sales', to: '/sales' }] : []),
    ...(isAdmin ? [{ id: 'admin', label: 'Admin', to: '/admin/users' }] : []),
  ];

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const closeDropdown = () => setDropdownOpen(false);
  const openToast = (message, type = "info") => {
    if (!message) return;
    setToast({ open: true, message, type });
  };

  useEffect(() => {
    if (!isMobile && mobileMenuOpen) setMobileMenuOpen(false);
  }, [isMobile, mobileMenuOpen]);

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

  useEffect(() => {
    if (!dropdownOpen) return;
    const handleClickOutside = (event) => {
      if (!dropdownRef.current) return;
      if (!dropdownRef.current.contains(event.target)) {
        closeDropdown();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  return (
    <nav style={{
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      padding: 'clamp(0.75rem, 1.2vw, 1rem) clamp(1rem, 3vw, 2.5rem)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 'clamp(0.6rem, 1.2vw, 1.2rem)',
      flexWrap: 'wrap',
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
      <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(0.8rem, 1.6vw, 1.6rem)', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
        {!isMobile && (
          <ul style={{ display: 'flex', gap: 'clamp(0.4rem, 1vw, 1rem)', flexWrap: 'wrap', listStyle: 'none', margin: 0, padding: 0 }}>
            {navItems.map((item) => (
              <li key={item.id}>
                <NavLink
                  to={item.to}
                  style={({ isActive }) => ({
                    whiteSpace: 'nowrap',
                    color: 'white',
                    textDecoration: 'none',
                    padding: 'clamp(0.4rem, 0.8vw, 0.55rem) clamp(0.6rem, 1.2vw, 1rem)',
                    fontSize: 'clamp(0.95rem, 1.05vw, 1.1rem)',
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
        )}

        {isMobile && (
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: 'white',
              padding: '0.45rem 0.7rem',
              borderRadius: '10px',
              cursor: 'pointer',
              lineHeight: 1,
            }}
          >
            ☰
          </button>
        )}

        {/* 프로필 드롭다운 */}
        <div style={{ position: 'relative' }} ref={dropdownRef}>
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
                        openToast("로그아웃 되었습니다.", "info");
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

      {isMobile && mobileMenuOpen && (
        <div
          style={{
            width: "100%",
            marginTop: "0.2rem",
            background: "rgba(20, 20, 30, 0.75)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            borderRadius: "14px",
            padding: "0.6rem",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            {navItems.map((item) => (
              <NavLink
                key={item.id}
                to={item.to}
                onClick={() => setMobileMenuOpen(false)}
                style={({ isActive }) => ({
                  color: "white",
                  textDecoration: "none",
                  padding: "0.65rem 0.8rem",
                  borderRadius: "12px",
                  background: isActive ? "rgba(255, 140, 66, 0.22)" : "transparent",
                  border: isActive ? "1px solid rgba(255, 140, 66, 0.35)" : "1px solid transparent",
                })}
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
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
