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

const MainApp = () => {
  const [selectedNews, setSelectedNews] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();


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
