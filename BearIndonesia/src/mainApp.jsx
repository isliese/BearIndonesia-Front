import React, { useEffect, useState, useRef } from 'react';
import { Routes, Route, useLocation, useNavigate, useNavigationType } from 'react-router-dom';
import Navigation from './components/navigation.jsx';
import HomePage from './features/home/pages/homePage.jsx';
import NewsPage from './features/news/pages/newsPage.jsx';
import CalendarPage from './features/calendar/pages/calendarPage.jsx';
import AboutPage from './features/about/pages/aboutPage.jsx';
import SectionNewsPage from './features/news/pages/SectionNewsPage.jsx';
import NewsDetailPage from './features/news/pages/newsDetailPage.jsx';
import SearchResultsPage from './features/news/pages/SearchResultsPage.jsx';
import CompetitorReportPage from './features/report/pages/competitorReportPage.jsx';
import LoginPage from './features/auth/pages/loginPage.jsx';
import SignupPage from './features/auth/pages/signupPage.jsx';
import ProfilePage from './features/auth/pages/profilePage.jsx';
import ScrappedNewsPage from './features/auth/pages/scrappedNewsPage.jsx';
import SalesPage from './features/admin/pages/salesPage.jsx';
import AdminUsersPage from './features/admin/pages/adminUsersPage.jsx';
import { fetchMe } from './api/authApi';
import { getAuthToken, setAuthSession, clearAuthSession } from './utils/auth';
import { clearScrapCache } from './utils/scrapStorage';

const MainApp = () => {
  const [selectedNews, setSelectedNews] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const navigationType = useNavigationType();
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
    const handler = () => {
      clearAuthSession();
      clearScrapCache();
      try {
        window.dispatchEvent(new CustomEvent("app-toast", { detail: { message: "로그인이 필요합니다.", type: "info" } }));
      } catch {
        // ignore
      }
      const from = `${location.pathname}${location.search}`;
      if (location.pathname === "/login") return;
      navigate("/login", { state: { from } });
    };
    window.addEventListener("app-auth-required", handler);
    return () => window.removeEventListener("app-auth-required", handler);
  }, [navigate, location.pathname, location.search]);

  useEffect(() => {
    const key = `${location.pathname}${location.search}`;
    const container = scrollRef.current;
    const saved = sessionStorage.getItem(`scroll:${key}`);
    const restoreOnPopPaths = new Set(["/", "/news"]);
    const shouldRestore =
      location.state?.preserveScroll ||
      (navigationType === "POP" && restoreOnPopPaths.has(location.pathname) && saved !== null);

    if (shouldRestore) {
      const top = Number(saved) || 0;
      if (container && saved !== null) {
        container.scrollTo({ top, left: 0, behavior: "auto" });
      }
      window.scrollTo({ top, left: 0, behavior: "auto" });
      document.documentElement.scrollTo({ top, left: 0, behavior: "auto" });
      document.body.scrollTo({ top, left: 0, behavior: "auto" });
      return () => {
        if (container) {
          const savedTop = Math.max(
            container.scrollTop || 0,
            window.scrollY || 0,
            document.documentElement.scrollTop || 0,
            document.body.scrollTop || 0,
          );
          sessionStorage.setItem(`scroll:${key}`, String(savedTop || 0));
        }
      };
    }
    if (container && typeof container.scrollTo === "function") {
      container.scrollTo({ top: 0, left: 0, behavior: "auto" });
    } else {
      window.scrollTo(0, 0);
    }
    document.documentElement.scrollTo({ top: 0, left: 0, behavior: "auto" });
    document.body.scrollTo({ top: 0, left: 0, behavior: "auto" });
    return () => {
      if (container) {
        const savedTop = Math.max(
          container.scrollTop || 0,
          window.scrollY || 0,
          document.documentElement.scrollTop || 0,
          document.body.scrollTop || 0,
        );
        sessionStorage.setItem(`scroll:${key}`, String(savedTop || 0));
      }
    };
  }, [location.pathname, location.search, navigationType]);

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
        id="app-scroll-container"
        style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'auto'
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
          <Route path="/report/competitor" element={<CompetitorReportPage />} />
          <Route path="/sales" element={<SalesPage />} />
          <Route path="/admin/users" element={<AdminUsersPage />} />
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
