// 홈 페이지
import React, { useState, useMemo } from 'react';
import septemberData from "../data/september.json";
import BpomLogo from "../assets/images/BPOM.jpg";
import CnbcLogo from "../assets/images/CNBC.png";
import CnnLogo from "../assets/images/CNN.png";
import DetikLogo from "../assets/images/detik.png";
import FarmasetikaLogo from "../assets/images/farmasetika.webp";
import MohLogo from "../assets/images/MOH.png";

const HomePage = ({ onSearch, setCurrentPage = () => {}, setSelectedNews = () => {}, setPrevPage = () => {} }) => {
  const topHeadlines = useMemo(() => {
    const arr = Array.isArray(septemberData) ? septemberData : [septemberData];
    return arr
      .filter(a => typeof a?.importance === "number")
      .sort((a, b) => (b.importance ?? 0) - (a.importance ?? 0))
      .slice(0, 6);
  }, []);

  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = () => {
    if (searchTerm.trim()) {
      onSearch(searchTerm);
    }
  };

  const handleHeadlineClick = (article) => {
    setSelectedNews(article);
    setPrevPage("home");
    setCurrentPage("newsDetail");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const newsStandItems = [
    { name: "BPOM", image: BpomLogo, filterValue: "BPOM" },
    { name: "CNBC", image: CnbcLogo, filterValue: "CNBC" },
    { name: "CNN", image: CnnLogo, filterValue: "CNN Indonesia" },
    { name: "Detik", image: DetikLogo, filterValue: "detik" },
    { name: "Farmasetika", image: FarmasetikaLogo, filterValue: "Farmasetika" },
    { name: "MOH", image: MohLogo, filterValue: "MOH" },
  ];
  
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
        BearIndonesia
      </h1>
      <p style={{
        fontSize: '1.4rem',
        color: '#b0b0b0',
        marginBottom: '3rem',
        maxWidth: '1000px'
      }}>
        AI 기반으로 인도네시아 제약 산업의 최신 뉴스와 허가 정보를 빠르고 정확하게 제공합니다. <br/> 
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
          placeholder="제약 회사명, 의약품명 등을 검색해보세요!"
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
            top: '2.85%',
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

        {/* News Stand Section */}
        <div style={{
          width: '100%',
          maxWidth: '1200px',
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.06), rgba(15, 52, 96, 0.15))',
          marginTop: '2.5rem',
          backdropFilter: 'blur(15px)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '20px',
          padding: '1.8rem',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.18)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.4rem'
          }}>
            <div style={{
              width: '4px',
              height: '24px',
              background: 'linear-gradient(135deg, #80cbc4, #64b5f6)',
              borderRadius: '2px',
              marginRight: '12px'
            }}></div>
            <h2 style={{
              fontSize: '1.7rem',
              color: '#d5f5f2',
              margin: '0',
              fontWeight: '600'
            }}>
              News Stand
            </h2>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '1rem'
          }}>
            {newsStandItems.map((item) => (
              <button
                key={item.name}
                type="button"
                onClick={() => {
                  try {
                    localStorage.setItem("newsFilter_press", item.filterValue);
                    localStorage.setItem("newsFilter_period", "전체");
                    localStorage.setItem("newsFilter_sort", "최신순");
                  } catch {
                    // Ignore storage issues and still navigate.
                  }
                  setPrevPage("home");
                  setCurrentPage("news");
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.16)',
                  borderRadius: '16px',
                  padding: '0.9rem',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '110px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.background = 'rgba(255,255,255,0.14)';
                  e.currentTarget.style.borderColor = 'rgba(128,203,196,0.6)';
                  e.currentTarget.style.boxShadow = '0 10px 24px rgba(0,0,0,0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.16)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  style={{
                    maxWidth: '120px',
                    maxHeight: '48px',
                    objectFit: 'contain',
                    filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.25))'
                  }}
                />
              </button>
            ))}
          </div>
        </div>
        
        {/* Top Headlines Section */}
        <div style={{
          width: '100%',
          maxWidth: '1200px',
          background: 'linear-gradient(135deg, rgba(255, 140, 66, 0.1), rgba(255, 167, 38, 0.05))',
          marginTop: '2.5rem',
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
          
          <ul style={{ 
            listStyle: 'none', 
            padding: 0, 
            margin: 0, 
            display: 'grid', 
            gap: '0.8rem' 
          }}>
            {topHeadlines.map(item => (
              <li 
                key={item.id} 
                onClick={() => handleHeadlineClick(item)}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr auto',
                  alignItems: 'center',
                  gap: '0.6rem',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,140,66,0.20)',
                  borderRadius: '14px',
                  padding: '0.9rem 1rem',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.10)';
                  e.currentTarget.style.transform = 'translateX(4px)';
                  e.currentTarget.style.borderColor = 'rgba(255,140,66,0.40)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.borderColor = 'rgba(255,140,66,0.20)';
                }}
              >
                <div>
                  <div style={{ 
                    fontSize: '1.05rem', 
                    color: '#fff', 
                    fontWeight: 600, 
                    lineHeight: 1.35 
                  }}>
                    {item.korTitle || item.title || "(제목 없음)"}
                  </div>
                  <div style={{ 
                    marginTop: '0.25rem', 
                    fontSize: '0.86rem', 
                    color: '#c8c8c8' 
                  }}>
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
                  중요도 {item.importance ?? 0}
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
