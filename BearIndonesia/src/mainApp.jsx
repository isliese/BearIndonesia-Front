import React, { useEffect, useState, useRef } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Navigation from './components/navigation.jsx';
import HomePage from './features/home/pages/homePage.jsx';
import NewsPage from './features/news/pages/newsPage.jsx';
import CalendarPage from './features/calendar/pages/calendarPage.jsx';
import AboutPage from './features/about/pages/aboutPage.jsx';
import SectionNewsPage from './features/news/pages/SectionNewsPage.jsx';
import NewsDetailPage from './features/news/pages/newsDetailPage.jsx';
import SearchResultsPage from './features/news/pages/SearchResultsPage.jsx';
import LoginPage from './features/auth/pages/loginPage.jsx';
import SignupPage from './features/auth/pages/signupPage.jsx';
import ProfilePage from './features/auth/pages/profilePage.jsx';
import ScrappedNewsPage from './features/auth/pages/scrappedNewsPage.jsx';
import { fetchMe } from './api/authApi';
import { getAuthToken, setAuthSession, clearAuthSession } from './utils/auth';

const MainApp = () => {
  const [selectedNews, setSelectedNews] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const scrollRef = useRef(null);

  useEffect(() => {
    try {
      if (selectedNews) {
        sessionStorage.setItem("selectedNews", JSON.stringify(selectedNews));
      }
    } catch {
      // Ignore storage failures.
    }
  }, [selectedNews]);

  useEffect(() => {
    let active = true;
    const token = getAuthToken();
    if (!token) return undefined;
    fetchMe()
      .then((user) => {
        if (!active) return;
        setAuthSession({ token, user });
      })
      .catch(() => {
        if (!active) return;
        clearAuthSession();
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const key = `${location.pathname}${location.search}`;
    const container = scrollRef.current;
    if (location.state?.preserveScroll) {
      const saved = sessionStorage.getItem(`scroll:${key}`);
      if (container && saved !== null) {
        container.scrollTo({ top: Number(saved) || 0, left: 0, behavior: "auto" });
      }
      return () => {
        if (container) {
          sessionStorage.setItem(`scroll:${key}`, String(container.scrollTop || 0));
        }
      };
    }
    if (container && typeof container.scrollTo === "function") {
      container.scrollTo({ top: 0, left: 0, behavior: "auto" });
    } else {
      window.scrollTo(0, 0);
    }
    return () => {
      if (container) {
        sessionStorage.setItem(`scroll:${key}`, String(container.scrollTop || 0));
      }
    };
  }, [location.pathname, location.search]);

  // 검색 처리 함수
  const handleSearch = (term) => {
    if (term && term.trim()) {
      const trimmed = term.trim();
      navigate(`/search?query=${encodeURIComponent(trimmed)}`, {
        state: { from: location.pathname }
      });
    }
  };

  return (
    <div style={{
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      height: '100vh',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {/* 고정 네비게이션 */}
      <Navigation />
      
      {/* 스크롤 가능한 콘텐츠 영역 */}
      <div 
        ref={scrollRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden'
        }}
      >
        <Routes>
          <Route
            path="/"
            element={<HomePage onSearch={handleSearch} setSelectedNews={setSelectedNews} />}
          />
          <Route
            path="/news"
            element={<NewsPage setSelectedNews={setSelectedNews} />}
          />
          <Route
            path="/section-news"
            element={<SectionNewsPage setSelectedNews={setSelectedNews} />}
          />
          <Route
            path="/calendar"
            element={<CalendarPage setSelectedNews={setSelectedNews} />}
          />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/scrap" element={<ScrappedNewsPage setSelectedNews={setSelectedNews} />} />
          <Route
            path="/news/detail"
            element={<NewsDetailPage news={selectedNews} />}
          />
          <Route
            path="/search"
            element={<SearchResultsPage setSelectedNews={setSelectedNews} />}
          />
          <Route
            path="*"
            element={<HomePage onSearch={handleSearch} setSelectedNews={setSelectedNews} />}
          />
        </Routes>
      </div>
    </div>
  );
};

export default MainApp;
