// 홈 페이지
import React, { useState, useMemo, useEffect } from 'react';
import { useLocation, useNavigate, useNavigationType } from 'react-router-dom';
import { useMediaQuery } from "../../../hooks/useMediaQuery";
import BpomLogo from "../../../assets/images/bpom.png";
import CnbcLogo from "../../../assets/images/CNBC.png";
import CnnLogo from "../../../assets/images/CNN.png";
import DetikLogo from "../../../assets/images/detik.png";
import FarmasetikaLogo from "../../../assets/images/farmasetika.png";
import MohLogo from "../../../assets/images/moh.png";
import MarketbisnisLogo from "../../../assets/images/marketbisnis.png";
import NasionalkontanLogo from "../../../assets/images/nasionalkontan.png";
import SindonewsLogo from "../../../assets/images/sindonews.png";
import SuaraLogo from "../../../assets/images/suara.png";
import TempoLogo from "../../../assets/images/tempo.png";
import VivaLogo from "../../../assets/images/viva.svg";
import KompasLogo from "../../../assets/images/Kompas.png";
import IdxLogo from "../../../assets/images/idx.png";
import ScrapStarButton from "../../../components/ScrapStarButton";
import { getAuthUser, isAdminUser } from "../../../utils/auth";

const HomePage = ({ onSearch, setSelectedNews = () => {} }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const navigationType = useNavigationType();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [newsItems, setNewsItems] = useState([]);
  const [newsError, setNewsError] = useState("");
  const [newsLoading, setNewsLoading] = useState(false);
  const [scrollRestored, setScrollRestored] = useState(false);
  const [authUser, setAuthUser] = useState(() => getAuthUser());

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
    let isMounted = true;
    const controller = new AbortController();

    const load = async () => {
      setNewsLoading(true);
      setNewsError("");
      try {
        const response = await fetch("/api/articles", { signal: controller.signal });
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP ${response.status}: ${errorText || response.statusText}`);
        }
        const data = await response.json();
        const results = Array.isArray(data) ? data : Array.isArray(data?.results) ? data.results : [];
        const normalized = results.map((item) => ({
          ...item,
          id: item?.id ?? item?.rawNewsId ?? item?.raw_news_id ?? null,
          date: item?.publishedDate ?? item?.date ?? "",
          img:
            item?.img ??
            item?.image ??
            item?.imageUrl ??
            item?.image_url ??
            item?.thumbnail ??
            item?.thumb ??
            item?.coverImage ??
            item?.cover_image ??
            item?.photo ??
            "",
        }));
        if (isMounted) {
          setNewsItems(normalized);
        }
      } catch (err) {
        if (err.name === "AbortError") return;
        if (isMounted) {
          setNewsError(err.message || "뉴스 데이터를 불러오지 못했습니다.");
          setNewsItems([]);
        }
      } finally {
        if (isMounted) {
          setNewsLoading(false);
        }
      }
    };

    load();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  // Home → Detail → Back(POP) 시 스크롤 복원 (데이터 로딩 후 높이 확보)
  useEffect(() => {
    if (scrollRestored) return;
    const shouldRestore = navigationType === "POP" || Boolean(location.state?.preserveScroll);
    if (!shouldRestore) return;
    if (newsLoading) return;
    if (newsItems.length === 0 && !newsError) return;

    const key = `${location.pathname}${location.search}`;
    const saved = sessionStorage.getItem(`scroll:${key}`);
    if (saved === null) return;

    const container = document.getElementById("app-scroll-container");
    if (!container || typeof container.scrollTo !== "function") return;

    setScrollRestored(true);
    requestAnimationFrame(() => {
      container.scrollTo({ top: Number(saved) || 0, left: 0, behavior: "auto" });
    });
  }, [
    scrollRestored,
    navigationType,
    location.state?.preserveScroll,
    newsLoading,
    newsItems.length,
    newsError,
    location.pathname,
    location.search,
  ]);

  const topHeadlines = useMemo(() => {
    const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return newsItems
      .filter((a) => {
        if (isAdminUser(authUser)) return true;
        const needsReview = Boolean(a?.tagMismatch ?? a?.tag_mismatch) || Boolean(a?.categoryMismatch ?? a?.category_mismatch);
        return !needsReview;
      })
      .filter((a) => {
        const rawDate = a?.publishedDate ?? a?.date ?? "";
        const ts = Date.parse(rawDate);
        return Number.isFinite(ts) && ts >= cutoff;
      })
      .filter((a) => typeof a?.importance === "number")
      .sort((a, b) => {
        const impDiff = (b.importance ?? 0) - (a.importance ?? 0);
        if (impDiff !== 0) return impDiff;
        const aDate = Date.parse(a?.publishedDate ?? a?.date ?? "") || 0;
        const bDate = Date.parse(b?.publishedDate ?? b?.date ?? "") || 0;
        if (bDate !== aDate) return bDate - aDate;
        const aId = a?.id ?? 0;
        const bId = b?.id ?? 0;
        return bId - aId;
      })
      .slice(0, 6);
  }, [newsItems, authUser]);

  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedNewsStand, setSelectedNewsStand] = useState(null);
  const [hoveredStand, setHoveredStand] = useState(null);

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
    { name: "Kompas", image: KompasLogo, filterValue: "Kompas", website: "https://www.kompas.com/" },
    { name: "MOH", image: MohLogo, filterValue: "MOH", website: "https://www.kemkes.go.id/" },
    { name: "Bisnis", image: MarketbisnisLogo, filterValue: "Bisnis", website: "https://bisnis.com/" },
    { name: "Kontan", image: NasionalkontanLogo, filterValue: "Kontan", website: "https://www.kontan.co.id/" },
    { name: "IDX", image: IdxLogo, filterValue: "IDX", website: "https://www.idx.co.id/" },
    { name: "Sindo News", image: SindonewsLogo, filterValue: "Sindo News", website: "https://www.sindonews.com/" },
    { name: "Suara", image: SuaraLogo, filterValue: "Suara", website: "https://www.suara.com/" },
    { name: "Tempo", image: TempoLogo, filterValue: "Tempo", website: "https://tempo.co/" },
    { name: "Viva", image: VivaLogo, filterValue: "Viva", website: "https://www.viva.co.id/" },
  ];

  const disabledStandMessages = {
    CNN: "CNN 뉴스를 더 수집 중입니다.",
    Tempo: "Tempo 뉴스를 더 수집 중입니다.",
  };
  
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 'calc(100vh - 200px)',
      textAlign: 'center',
      padding: '1.35rem'
    }}>
      <h1 style={{
        fontSize: 'clamp(1.75rem, 3vw, 2.7rem)',
        marginBottom: '0.72rem',
        background: 'linear-gradient(135deg, #ff8c42, #ffa726)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text'
      }}>
        BearIndonesia
      </h1>
      <p style={{
        fontSize: 'clamp(0.9rem, 1.2vw, 1.1rem)',
        color: '#b0b0b0',
        marginBottom: '1.8rem',
        maxWidth: '860px'
      }}>
        AI 기반으로 인도네시아 제약 산업의 최신 뉴스와 허가 정보를 빠르고 정확하게 제공합니다. <br/> 
        검색을 통해 원하는 정보를 빠르게 찾아보세요.
      </p>
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: '1040px'
      }}>
        <input
          className="home-search-input"
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="제약 회사명, 의약품명 등을 검색해보세요!"
          style={{
            width: '100%',
            padding: '0.84em 5.8rem 0.84em 1.2rem',
            fontSize: '1rem',
            border: '2px solid rgba(255, 140, 66, 0.3)',
            borderRadius: '50px',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            color: 'white',
            outline: 'none',
            transition: 'all 0.3s ease',
            boxSizing: 'border-box'
          }}
        />
        <button
          className="home-search-btn"
          onClick={handleSearch}
          style={{
            position: 'absolute',
            right: '26px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: '#ff8c42',
            border: 'none',
            padding: '0.58rem 1.2rem',
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
        maxWidth: '1040px',
        marginTop: '1.5rem',
        display: 'flex',
        gap: '1.2rem',
        justifyContent: 'center',
        alignItems: 'stretch',
        flexWrap: 'wrap'
      }}>
        {/* News Stand Section */}
        <div style={{
          width: '100%',
          flex: '1 1 420px',
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.06), rgba(15, 52, 96, 0.15))',
          backdropFilter: 'blur(15px)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '20px',
          padding: '1.25rem',
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
              fontSize: '1.35rem',
              color: '#d5f5f2',
              margin: '0',
              fontWeight: '600'
            }}>
              News Stand
            </h2>
          </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? 'repeat(2, minmax(0, 1fr))' : 'repeat(4, minmax(0, 1fr))',
              gap: '0.72rem'
            }}>
            {newsStandItems.map((item) => (
              (() => {
                const tooltip = disabledStandMessages[item.name];
                const disabled = Boolean(tooltip);
                return (
                  <div
                    key={item.name}
                    style={{ position: "relative" }}
                    onMouseEnter={() => setHoveredStand(item.name)}
                    onMouseLeave={() => setHoveredStand(null)}
                  >
                    <button
                      type="button"
                      disabled={disabled}
                      onClick={disabled ? undefined : () => handleNewsStandClick(item)}
                      style={{
                        background: 'rgba(255,255,255,0.08)',
                        border: '1px solid rgba(255,255,255,0.16)',
                        borderRadius: '16px',
                        padding: '0.72rem',
                        cursor: disabled ? 'not-allowed' : 'pointer',
                        transition: 'all 0.25s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: '92px',
                        width: "100%",
                        opacity: disabled ? 0.7 : 1,
                      }}
                      onMouseEnter={(e) => {
                        if (disabled) return;
                        e.currentTarget.style.transform = 'translateY(-4px)';
                        e.currentTarget.style.background = 'rgba(255,255,255,0.14)';
                        e.currentTarget.style.borderColor = 'rgba(128,203,196,0.6)';
                        e.currentTarget.style.boxShadow = '0 10px 24px rgba(0,0,0,0.2)';
                      }}
                      onMouseLeave={(e) => {
                        if (disabled) return;
                        e.currentTarget.style.transform = 'none';
                        e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.16)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
	                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', alignItems: 'center' }}>
	                        <div
	                          style={{
	                            height: isMobile ? '48px' : '60px',
	                            width: '100%',
	                            display: 'flex',
	                            alignItems: 'center',
	                            justifyContent: 'center',
	                          }}
	                        >
	                          <img
	                            src={item.image}
	                            alt={item.name}
	                            style={{
	                              maxWidth: isMobile ? (item.name === "Bisnis" ? '128px' : '84px') : (item.name === "Bisnis" ? '162px' : '102px'),
	                              maxHeight: isMobile ? '48px' : '60px',
	                              objectFit: 'contain',
	                              filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.25))'
	                            }}
	                          />
	                        </div>
                        <span style={{ fontSize: '0.78rem', color: '#d9e7ef', letterSpacing: '0.02em' }}>
                          {item.name}
                        </span>
                      </div>
                    </button>

                    {disabled && hoveredStand === item.name && (
                      <div
                        style={{
                          position: "absolute",
                          top: "calc(100% + 8px)",
                          left: "50%",
                          transform: "translateX(-50%)",
                          background: "rgba(20, 20, 20, 0.95)",
                          color: "#ffcc80",
                          padding: "6px 10px",
                          borderRadius: "8px",
                          fontSize: "0.8rem",
                          whiteSpace: "nowrap",
                          border: "1px solid rgba(255, 140, 66, 0.35)",
                          boxShadow: "0 6px 18px rgba(0,0,0,0.35)",
                          zIndex: 20,
                          pointerEvents: "none",
                        }}
                      >
                        {tooltip}
                      </div>
                    )}
                  </div>
                );
              })()
            ))}
          </div>
        </div>
        
        {/* Top Headlines Section */}
        <div style={{
          width: '100%',
          flex: '1 1 420px',
          background: 'linear-gradient(135deg, rgba(255, 140, 66, 0.1), rgba(255, 167, 38, 0.05))',
          backdropFilter: 'blur(15px)',
          border: '1px solid rgba(255, 140, 66, 0.2)',
          borderRadius: '20px',
          padding: '1.3rem',
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
              fontSize: '1.4rem',
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
            gap: '0.62rem' 
          }}>
            {newsLoading && (
              <li style={{ color: '#b0b0b0', textAlign: 'center', padding: '0.5rem 0' }}>
                뉴스 데이터를 불러오는 중...
              </li>
            )}
            {!newsLoading && newsError && (
              <li style={{ color: '#ff8c42', textAlign: 'center', padding: '0.5rem 0' }}>
                {newsError}
              </li>
            )}
            {!newsLoading && !newsError && topHeadlines.length === 0 && (
              <li style={{ color: '#b0b0b0', textAlign: 'center', padding: '5rem 0' }}>
                최근 7일 간의 뉴스가 없습니다.
              </li>
            )}
            {topHeadlines.map(item => (
              <li 
                key={item.id} 
                onClick={() => handleHeadlineClick(item)}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '64px 1fr auto',
                  alignItems: 'center',
                  gap: '0.6rem',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,140,66,0.20)',
                  borderRadius: '14px',
                  padding: '0.7rem 0.8rem',
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
                <div
                  style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    border: '1px solid rgba(255,255,255,0.18)',
                    background: 'rgba(255,255,255,0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {item.img ? (
                    <img
                      src={item.img}
                      alt=""
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      loading="lazy"
                    />
                  ) : (
                    <span style={{ color: '#cfcfcf', fontSize: '0.75rem' }}>No Image</span>
                  )}
                </div>
                <div>
                  <div style={{ 
                    fontSize: '0.95rem', 
                    color: '#fff', 
                    fontWeight: 600, 
                    lineHeight: 1.35,
                    textAlign: 'left'
                  }}>
                    {item.korTitle || item.title || "(제목 없음)"}
                  </div>
                  <div style={{ 
                    marginTop: '0.25rem', 
                    fontSize: '0.8rem', 
                    color: '#c8c8c8' 
                  }}>
                    {item.date} · {item.source}
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <ScrapStarButton article={item} size={16} />
                  <span style={{
                    fontSize: '0.72rem',
                    color: '#ff8c42',
                    border: '1px solid rgba(255,140,66,0.35)',
                    background: 'rgba(255,140,66,0.10)',
                    padding: '0.2rem 0.4rem',
                    borderRadius: '10px',
                    whiteSpace: 'nowrap'
                  }}>
                    중요도 {item.importance ?? 0}
                  </span>
                </div>
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
              padding: '2rem',
              maxWidth: '400px',
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
                  maxWidth: '120px',
                  maxHeight: '52px',
                  objectFit: 'contain',
                  marginBottom: '1rem',
                  filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))'
                }}
              />
              <h3 style={{
                fontSize: '1.32rem',
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
                  padding: '0.85rem 1.2rem',
                  color: '#ff8c42',
                  fontSize: '0.96rem',
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
                  padding: '0.85rem 1.2rem',
                  color: '#ff8c42',
                  fontSize: '0.96rem',
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
