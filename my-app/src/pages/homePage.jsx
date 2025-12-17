import septemberData from "../data/september.json";
import React, { useState, useMemo } from 'react';

const HomePage = ({ onSearch }) => {
  const topHeadlines = useMemo(() => {
  const arr = Array.isArray(septemberData) ? septemberData : [septemberData];
  return arr
    .filter(a => typeof a?.importance === "number")
    .sort((a, b) => (b.importance ?? 0) - (a.importance ?? 0))
    .slice(0, 6)
    .map(a => ({
      id: a.id,
      title: a.korTitle || a.title || "(제목 없음)",
      date: a.date || "",
      source: a.source || "",
      importance: a.importance ?? 0,
      link: a.link || "#"
    }));
}, []);

  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = () => {
    if (searchTerm.trim()) {
      onSearch(searchTerm); // 부모로 검색어 전달
    }
  };
  
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 'calc(100vh - 200px)',
      textAlign: 'center',
      padding: '2rem'
    }}>
      <h1 style={{
        fontSize: '3.5rem',
        marginBottom: '1rem',
        background: 'linear-gradient(135deg, #ff8c42, #ffa726)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text'
      }}>
        BaioBrief
      </h1>
      <p style={{
        fontSize: '1.4rem',
        color: '#b0b0b0',
        marginBottom: '3rem',
        maxWidth: '1000px'
      }}>
        AI 기반으로 인도네시아 제약 산업의 최신 뉴스와 허가 정보를 효과적으로 제공합니다. <br></br> 
        검색을 통해 원하는 정보를 빠르게 찾아보세요.
      </p>
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: '850px'
      }}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="제약 회사명, 의약품명, 임상단계를 검색해보세요!"
          style={{
            width: '100%',
            padding: '1em 0.9rem 1em 1rem',
            fontSize: '1.2rem',
            border: '2px solid rgba(255, 140, 66, 0.3)',
            borderRadius: '50px',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            color: 'white',
            outline: 'none',
            transition: 'all 0.3s ease'
          }}
        />
        <button
          onClick={handleSearch}
          style={{
            position: 'absolute',
            right: '-20px',
            top: '4.0%',
            transform: 'translateY(-50%)',
            background: '#ff8c42',
            border: 'none',
            padding: '0.7rem 1.5rem',
            borderRadius: '50px',
            color: 'white',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
        >
          검색
        </button>
        
        {/* Top Headlines Section */}
      <div style={{
        width: '100%',
        maxWidth: '1200px',
        background: 'linear-gradient(135deg, rgba(255, 140, 66, 0.1), rgba(255, 167, 38, 0.05))',
        marginTop: '100px',
        backdropFilter: 'blur(15px)',
        border: '1px solid rgba(255, 140, 66, 0.2)',
        borderRadius: '20px',
        padding: '2rem',
        boxShadow: '0 8px 32px rgba(255, 140, 66, 0.1)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1.5rem'
        }}>
          <div style={{
            width: '4px',
            height: '24px',
            background: 'linear-gradient(135deg, #ff8c42, #ffa726)',
            borderRadius: '2px',
            marginRight: '12px'
          }}></div>
          <h2 style={{
            fontSize: '1.8rem',
            color: '#ff8c42',
            margin: '0',
            fontWeight: '600'
          }}>
            Top Headlines
          </h2>
        </div>
        
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.8rem' }}>
          {topHeadlines.map(item => (
            <li key={item.id} style={{
              display: 'grid',
              gridTemplateColumns: '1fr auto',
              alignItems: 'center',
              gap: '0.6rem',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,140,66,0.20)',
              borderRadius: '14px',
              padding: '0.9rem 1rem'
            }}>
              <div>
                <div style={{ fontSize: '1.05rem', color: '#fff', fontWeight: 600, lineHeight: 1.35 }}>
                  <a href={item.link} target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
                    {item.title}
                  </a>
                </div>
                <div style={{ marginTop: '0.25rem', fontSize: '0.86rem', color: '#c8c8c8' }}>
                  {item.date} · {item.source}
                </div>
              </div>
              <span style={{
                fontSize: '0.8rem',
                color: '#ff8c42',
                border: '1px solid rgba(255,140,66,0.35)',
                background: 'rgba(255,140,66,0.10)',
                padding: '0.25rem 0.5rem',
                borderRadius: '10px',
                whiteSpace: 'nowrap'
              }}>
                중요도 {item.importance}
              </span>
            </li>
          ))}
        </ul>

      </div>
      </div>
    </div>
  );
};

export default HomePage;