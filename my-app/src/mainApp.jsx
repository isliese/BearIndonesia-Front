import React, { useState } from 'react';
import Navigation from './components/navigation.jsx';
import HomePage from './pages/homePage.jsx';
import NewsPage from './pages/newsPage.jsx';
import CalendarPage from './pages/calendarPage.jsx';
import AboutPage from './pages/aboutPage.jsx';
import SectionNewsPage from './pages/SectionNewsPage.jsx';
import NewsDetailPage from './pages/newsDetailPage.jsx';
import SearchResultsPage from './pages/SearchResultsPage.jsx';

const MainApp = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [prevPage, setPrevPage] = useState('home');
  const [selectedNews, setSelectedNews] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // 검색 처리 함수
  const handleSearch = (term) => {
    if (term && term.trim()) {
      setSearchTerm(term.trim());
      setCurrentPage('search');
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage 
          onSearch={handleSearch}
          setCurrentPage={setCurrentPage}
          setSelectedNews={setSelectedNews}
          setPrevPage={setPrevPage}
        />;
              
      case 'news':
        return <NewsPage 
          setCurrentPage={setCurrentPage} 
          setSelectedNews={setSelectedNews}
          setPrevPage={setPrevPage}
        />;
      
      case 'section-news': 
        return <SectionNewsPage 
          setCurrentPage={setCurrentPage} 
          setSelectedNews={setSelectedNews}
          setPrevPage={setPrevPage}
        />;
      
      case 'calendar':
        return <CalendarPage 
          setCurrentPage={setCurrentPage} 
          setSelectedNews={setSelectedNews} 
          setPrevPage={setPrevPage}
        />;
      
      case 'about':
        return <AboutPage />;
      
      case 'newsDetail':
        return <NewsDetailPage 
          news={selectedNews}
          setCurrentPage={setCurrentPage}
          prevPage={prevPage}
        />;
      
      case 'search':
        return <SearchResultsPage 
          searchTerm={searchTerm}
          setCurrentPage={setCurrentPage}
          setSelectedNews={setSelectedNews}
          setPrevPage={setPrevPage}
        />;
      
      default:
        return <HomePage onSearch={handleSearch} />;
    }
  };

  return (
    <div style={{
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      minHeight: '100vh',
      color: 'white'
    }}>
      <Navigation currentPage={currentPage} setCurrentPage={setCurrentPage} />
      {renderPage()}
    </div>
  );
};

export default MainApp;