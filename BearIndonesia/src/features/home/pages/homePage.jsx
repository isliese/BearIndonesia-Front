// 홈 페이지
import React, { useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import septemberData from "../../../data/september.json";
import BpomLogo from "../../../assets/images/BPOM.jpg";
import CnbcLogo from "../../../assets/images/CNBC.png";
import CnnLogo from "../../../assets/images/CNN.png";
import DetikLogo from "../../../assets/images/detik.png";
import FarmasetikaLogo from "../../../assets/images/farmasetika.webp";
import MohLogo from "../../../assets/images/MOH.png";

const HomePage = ({ onSearch, setSelectedNews = () => {} }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const topHeadlines = useMemo(() => {
    const arr = Array.isArray(septemberData) ? septemberData : [septemberData];
    return arr
      .filter(a => typeof a?.importance === "number")
      .sort((a, b) => (b.importance ?? 0) - (a.importance ?? 0))
      .slice(0, 6);
  }, []);

  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedNewsStand, setSelectedNewsStand] = useState(null);

  const handleSearch = () => {
    if (searchTerm.trim()) {
      onSearch(searchTerm);
    }
  };

  const handleNewsStandClick = (item) => {
    setSelectedNewsStand(item);
    setModalOpen(true);
  };

  const handleGoToWebsite = () => {
    if (selectedNewsStand?.website) {
      window.open(selectedNewsStand.website, '_blank');
    }
    setModalOpen(false);
  };

  const handleGoToFiltered = () => {
    if (selectedNewsStand) {
      try {
        localStorage.setItem("newsFilter_press", selectedNewsStand.filterValue);
        localStorage.setItem("newsFilter_period", "전체");
        localStorage.setItem("newsFilter_sort", "최신순");
      } catch {
        // Ignore storage issues and still navigate.
      }
      navigate('/news', { state: { from: location.pathname } });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setModalOpen(false);
  };

  const handleHeadlineClick = (article) => {
    setSelectedNews(article);
    navigate('/news/detail', { state: { from: location.pathname } });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const newsStandItems = [
    { name: "BPOM", image: BpomLogo, filterValue: "BPOM", website: "https://www.pom.go.id/" },
    { name: "CNBC", image: CnbcLogo, filterValue: "CNBC", website: "https://www.cnbcindonesia.com/" },
    { name: "CNN", image: CnnLogo, filterValue: "CNN Indonesia", website: "https://www.cnnindonesia.com/" },
    { name: "Detik", image: DetikLogo, filterValue: "detik", website: "https://www.detik.com/" },
    { name: "Farmasetika", image: FarmasetikaLogo, filterValue: "Farmasetika", website: "https://farmasetika.com/" },
    { name: "MOH", image: MohLogo, filterValue: "MOH", website: "https://www.kemkes.go.id/" },
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
            right: '12px',
            top: '50%',
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

      </div>

      <div style={{
        width: '100%',
        maxWidth: '1200px',
        marginTop: '2.5rem',
        display: 'flex',
        gap: '2rem',
        justifyContent: 'center',
        alignItems: 'stretch',
        flexWrap: 'wrap'
      }}>
        {/* News Stand Section */}
        <div style={{
          width: '100%',
          flex: '1 1 480px',
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.06), rgba(15, 52, 96, 0.15))',
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
                onClick={() => handleNewsStandClick(item)}
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
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', alignItems: 'center' }}>
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
                  <span style={{ fontSize: '0.85rem', color: '#d9e7ef', letterSpacing: '0.02em' }}>
                    {item.name}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
        
        {/* Top Headlines Section */}
        <div style={{
          width: '100%',
          flex: '1 1 480px',
          background: 'linear-gradient(135deg, rgba(255, 140, 66, 0.1), rgba(255, 167, 38, 0.05))',
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

      {/* Modal */}
      {modalOpen && selectedNewsStand && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
          onClick={() => setModalOpen(false)}
        >
          <div 
            style={{
              background: 'linear-gradient(135deg, rgba(30, 30, 40, 0.95), rgba(20, 20, 30, 0.95))',
              border: '1px solid rgba(255, 140, 66, 0.3)',
              borderRadius: '24px',
              padding: '2.5rem',
              maxWidth: '450px',
              width: '90%',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <img
                src={selectedNewsStand.image}
                alt={selectedNewsStand.name}
                style={{
                  maxWidth: '140px',
                  maxHeight: '60px',
                  objectFit: 'contain',
                  marginBottom: '1rem',
                  filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))'
                }}
              />
              <h3 style={{
                fontSize: '1.6rem',
                color: '#fff',
                margin: '0.5rem 0 0.3rem 0',
                fontWeight: '600'
              }}>
                {selectedNewsStand.name}
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <button
                onClick={handleGoToWebsite}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  borderRadius: '14px',
                  padding: '1rem 1.5rem',
                  color: '#ff8c42',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 5px rgba(255, 140, 66, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'linear-gradient(135deg, #ff8c42, #ffa726)'
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 10px rgba(255, 140, 66, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = '0 2px 5px rgba(255, 140, 66, 0.3)';
                }}
              >
                공식 웹사이트로 이동
              </button>

              <button
                onClick={handleGoToFiltered}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  borderRadius: '14px',
                  padding: '1rem 1.5rem',
                  color: '#ff8c42',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 5px rgba(255, 140, 66, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 10px rgba(255, 140, 66, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = '0 2px 5px rgba(255, 140, 66, 0.3)';
                }}
              >
                뉴스 보기
              </button>

              <button
                onClick={() => setModalOpen(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#888',
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  padding: '0.5rem',
                  transition: 'color 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#fff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#888';
                }}
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
