// 검색 결과 페이지

import React, { useState, useMemo, useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import ScrapStarButton from '../../../components/ScrapStarButton';
import { getAuthUser, isAdminUser } from '../../../utils/auth';
import { useMediaQuery } from '../../../hooks/useMediaQuery';

// API 호출 함수
const searchAPI = async (searchTerm, sortBy = 'relevance', filterType = 'all') => {
  console.log('🔍 [API] 검색 요청 시작:', { 
    searchTerm, 
    sortBy, 
    filterType,
    url: '/api/search'
  });
  
  try {
    const requestBody = {
      query: searchTerm,
      sortBy: sortBy,
      filterType: filterType
    };
    
    console.log('📤 [API] 요청 본문:', requestBody);
    
    const response = await fetch('/api/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });
    
    console.log('📡 [API] 응답 상태:', response.status, response.statusText);
    console.log('📡 [API] 응답 헤더:', Object.fromEntries(response.headers));
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ [API] HTTP 에러:', {
        status: response.status,
        statusText: response.statusText,
        errorText: errorText
      });
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }
    
    const data = await response.json();
    console.log('✅ [API] 성공 응답:', data);
    console.log('📊 [API] 검색 결과 개수:', data.results ? data.results.length : 0);
    
    if (data.results) {
      console.log('📋 [API] 첫 번째 결과 샘플:', data.results[0]);
    }
    
    const results = Array.isArray(data.results) ? data.results : [];
    return results.map((item) => ({
      ...item,
      id: item?.id ?? item?.rawNewsId ?? item?.raw_news_id ?? null,
      korContent: item?.korContent ?? item?.translated ?? "",
    }));
  } catch (error) {
    console.error('💥 [API] 검색 API 호출 실패:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    
    // 네트워크 에러인지 확인
    if (error instanceof TypeError && error.message.includes('fetch')) {
      console.error('🌐 [API] 네트워크 연결 문제 - 백엔드 서버가 실행 중인지 확인하세요');
    }
    
    return [];
  }
};

function getInitials(text = "") {
  const s = String(text).trim();
  if (!s) return "미상";
  if (s.startsWith("@")) return s.replace(/^@/, "").slice(0, 2).toUpperCase();
  const parts = s.split(/\s+/).filter(Boolean);
  const initials = parts.slice(0, 2).map(w => w[0]).join("");
  return (initials || s.slice(0, 2)).toUpperCase();
}

/* tagsJson 혹은 article.tags를 안전하게 배열 문자열로 변환 */
const parseTags = (article) => {
  if (Array.isArray(article?.tags)) {
    return article.tags
      .map(v => (typeof v === 'string' ? v : v?.name))
      .filter(Boolean);
  }
  const raw = article?.tagsJson;
  if (!raw) return [];
  try {
    const arr = JSON.parse(raw);
    if (Array.isArray(arr)) {
      return arr.map(v => (typeof v === 'string' ? v : v?.name)).filter(Boolean);
    }
  } catch (_) {
    // 쉼표 구분 스트링 대비
    return String(raw).split(',').map(s => s.trim()).filter(Boolean);
  }
  return [];
};

// 검색어 하이라이트 (특수문자 안전, 한국어 지원)
const highlightText = (text, term) => {
  const s = String(text ?? '');
  const q = String(term ?? '').trim();
  if (!q) return s;
  
  // 한국어와 영어 모두 지원하는 정규식
  const escapeRegExp = (v) => v.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`(${escapeRegExp(q)})`, 'ig');
  const parts = s.split(re);
  
  return parts.map((part, i) =>
    i % 2 === 1
      ? (
        <span key={i} style={{
          background: 'rgba(255, 235, 59, 0.3)',
          color: '#FFEB3B',
          fontWeight: 'bold',
          textShadow: '0 0 2px rgba(255, 235, 59, 0.5)'
        }}>
          {part}
        </span>
      )
      : <span key={i}>{part}</span>
  );
};

// **...** 굵게 표시 + (굵지 않은 세그먼트만) 검색어 하이라이트 적용
const renderHighlighted = (text = "", term = "") => {
  const segments = String(text).split(/(\*\*[^*]+\*\*)/g);
  return segments.map((seg, idx) => {
    const m = seg.match(/^\*\*([^*]+)\*\*$/);
    if (m) {
      return (
        <strong key={idx} style={{ color: "#ffcc80" }}>
          {m[1]}
        </strong>
      );
    }
    return <span key={idx}>{highlightText(seg, term)}</span>;
  });
};

// 텍스트를 줄 수로 제한하는 함수
const truncateToLines = (text, maxLines = 4) => {
  if (!text) return '';
  
  const words = text.split(' ');
  const wordsPerLine = 12; // 대략적인 한 줄당 단어 수
  const maxWords = maxLines * wordsPerLine;
  
  if (words.length <= maxWords) {
    return text;
  }
  
  return words.slice(0, maxWords).join(' ') + '...';
};

const SearchCard = ({ article, onOpen, searchTerm, onTagClick }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const koTitle = article.korTitle || article.title || "";
  const koSummary = article.korSummary || article.korContent || article.translated || "";
  const author = article.source || "";
  const avatar = getInitials(author);
  const tags = parseTags(article).slice(0, 5); // 카드에 최대 5개 노출

  const truncatedSummary = truncateToLines(koSummary, 4);
  const shouldTruncate = truncatedSummary !== koSummary;

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        background: "rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(10px)",
        borderRadius: "13px",
        padding: "1rem",
        minHeight: "280px",
        transition: "all 0.3s ease",
        cursor: "pointer",
        overflow: "hidden",
        border: "1px solid rgba(255, 140, 66, 0.2)",
      }}
      onClick={onOpen}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-5px)";
        e.currentTarget.style.boxShadow = "0 8px 25px rgba(255, 140, 66, 0.15)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <ScrapStarButton article={article} style={{ position: "absolute", top: 12, right: 12 }} />
      <div style={{ display: "flex", alignItems: "center", marginBottom: "0.72rem" }}>
        <div
          style={{
            width: "34px",
            height: "34px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #ff8c42, #ffa726)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontWeight: "bold",
            marginRight: "0.75rem",
          }}
        >
          {avatar}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ color: "#b0b0b0", fontSize: "0.8rem" }}>{author}</div>
        </div>
      </div>

      <div 
        style={{ 
          fontSize: "1.02rem", 
          fontWeight: "bold", 
          marginBottom: "0.55rem", 
          color: "white",
          lineHeight: "1.4",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          minHeight: "2.8rem",
        }}
      >
        {renderHighlighted(koTitle, searchTerm)}
      </div>
      
      <div style={{ 
        color: "#d0d0d0", 
        marginBottom: 0, 
        lineHeight: "1.6",
        fontSize: "0.84rem"
      }}>
        <span style={{ color: "#ff8c42", fontWeight: "600" }}>AI 요약: </span>
        {renderHighlighted(isExpanded ? koSummary : truncatedSummary, searchTerm)}
        
        {shouldTruncate && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            style={{
              background: "none",
              border: "none",
              color: "#ff8c42",
              cursor: "pointer",
              padding: "0.2rem 0.5rem",
              marginLeft: "0.5rem",
              fontSize: "0.78rem",
              fontWeight: "600",
              textDecoration: "underline"
            }}
          >
            {isExpanded ? "접기" : "더보기"}
          </button>
        )}
      </div>

      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "flex-end", 
        color: "#999", 
        fontSize: "0.78rem",
        gap: "0.7rem",
        marginTop: "auto",
        paddingTop: "0.72rem",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.7rem" }}>
          <span>{article.date}</span>
          <span style={{ 
            color: '#FFD700',
            fontWeight: 'bold'
          }}>
            ★ {(article?.importance ?? 0)}/100
          </span>
        </div>
        
        <div style={{ display: "flex", gap: "0.3rem", flexWrap: "wrap", maxWidth: "60%" }}>
          {tags.length > 0 ? (
            tags.map(tag => (
              <span
                key={tag}
                onClick={(e) => { e.stopPropagation(); onTagClick?.(tag); }}
                style={{
                  background: "rgba(255, 140, 66, 0.2)",
                  color: "#ff8c42",
                  padding: "0.2rem 0.5rem",
                  borderRadius: "9px",
                  fontSize: "0.68rem",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  whiteSpace: "nowrap"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255, 140, 66, 0.3)";
                  e.currentTarget.style.transform = "scale(1.05)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255, 140, 66, 0.2)";
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                #{tag}
              </span>
            ))
          ) : (
            <span
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                color: "#bbb",
                padding: "0.2rem 0.5rem",
                borderRadius: "9px",
                fontSize: "0.68rem"
              }}
            >
              태그 없음
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

const SearchResultsPage = ({ setSelectedNews }) => {
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get("query") || "";
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      const raw = localStorage.getItem("recentSearchTerms");
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed.filter(Boolean).slice(0, 8) : [];
    } catch {
      return [];
    }
  });
  const [authUser, setAuthUser] = useState(() => getAuthUser());
  const [sortBy, setSortBy] = useState("relevance");
  const [filterType, setFilterType] = useState("all");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]); // 다중 태그 선택
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  // 검색 실행 함수
  const performSearch = async (term, sort, filter) => {
    console.log('🚀 [SEARCH] 검색 함수 호출:', { term, sort, filter });
    
    if (!term?.trim()) {
      console.log('⚠️ [SEARCH] 검색어가 비어있음, 결과 초기화');
      setSearchResults([]);
      setSelectedTags([]); // 검색어 비우면 태그 선택도 초기화
      return;
    }

    console.log('⏳ [SEARCH] 로딩 시작...');
    setLoading(true);
    setError(null);
    
    try {
      console.log('📞 [SEARCH] API 호출 시작...');
      const results = await searchAPI(term, sort, filter);
      
      console.log('📥 [SEARCH] API 응답 받음:', {
        resultType: typeof results,
        isArray: Array.isArray(results),
        length: results ? results.length : 'null/undefined'
      });
      
      if (results && results.length > 0) {
        console.log('🎉 [SEARCH] 검색 결과 있음:', results.length + '개');
        console.log('📄 [SEARCH] 결과 샘플:', results.slice(0, 2));
      } else {
        console.log('😞 [SEARCH] 검색 결과 없음 또는 빈 배열');
      }
      
      setSearchResults(results || []);
      setSelectedTags([]); // 새로운 검색마다 태그 필터 초기화
    } catch (err) {
      console.error('💥 [SEARCH] 검색 함수에서 오류 발생:', {
        name: err.name,
        message: err.message,
        stack: err.stack
      });
      setError(`검색 중 오류가 발생했습니다: ${err.message}`);
      setSearchResults([]);
      setSelectedTags([]);
    } finally {
      console.log('✅ [SEARCH] 로딩 완료');
      setLoading(false);
    }
  };

  // 검색어나 필터 변경 시 검색 실행
  useEffect(() => {
    performSearch(searchTerm, sortBy, filterType);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, sortBy, filterType]);

  useEffect(() => {
    const q = String(searchTerm || "").trim();
    if (!q) return;
    setRecentSearches((prev) => {
      const next = [q, ...prev.filter((item) => item !== q)].slice(0, 8);
      try {
        localStorage.setItem("recentSearchTerms", JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  }, [searchTerm]);

  // 동적 태그 팩셋 계산 (검색 결과에 기반)
  const tagFacets = useMemo(() => {
    const counts = new Map();
    for (const a of searchResults || []) {
      const tags = parseTags(a);
      for (const t of new Set(tags)) {
        counts.set(t, (counts.get(t) || 0) + 1);
      }
    }
    return Array.from(counts.entries())
      .sort((a,b) => (b[1]-a[1]) || a[0].localeCompare(b[0]))
      .slice(0, 20) // 최대 20개 태그만 표시
      .map(([name,count]) => ({ name, count }));
  }, [searchResults]);

  // 태그 토글/초기화
  const toggleTag = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };
  const clearTags = () => setSelectedTags([]);

  // 태그로 결과 필터링 (AND 방식)
  const filteredResults = useMemo(() => {
    if (!selectedTags.length) return searchResults;
    return (searchResults || []).filter(a => {
      const tags = parseTags(a).map(s => s.toLowerCase());
      return selectedTags.every(t => tags.includes(t.toLowerCase()));
    });
  }, [searchResults, selectedTags]);

  const visibleResults = useMemo(() => {
    if (isAdminUser(authUser)) return filteredResults;
    return (filteredResults || []).filter((a) => {
      const needsReview = Boolean(a?.tagMismatch ?? a?.tag_mismatch) || Boolean(a?.categoryMismatch ?? a?.category_mismatch);
      return !needsReview;
    });
  }, [filteredResults, authUser]);

  return (
    <div style={{ position: 'relative', padding: '0.9rem 0.68rem 1rem', minHeight: 'calc(100vh - 80px)' }}>
      {/* 뒤로가기 버튼 */}
      <button
        onClick={() => navigate(location.state?.from || '/news')}
        style={{
          position: 'absolute',
          top: '3.6rem',
          left: '2.6rem',
          background: 'rgba(255, 255, 255, 0.1)',
          border: '1px solid rgba(255, 140, 66, 0.5)',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          color: '#ff8c42',
          fontSize: '1.2rem',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s ease',
          zIndex: 10
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(255, 140, 66, 0.2)';
          e.currentTarget.style.transform = 'scale(1.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        <span style={{ fontSize: '1.1rem' }}>←</span>
      </button>

      <div style={{ maxWidth: "1080px", margin: "0 auto", paddingTop: "0.32rem" }}>
        {/* 검색 결과 헤더 */}
        <div style={{ 
          textAlign: "center", 
          marginBottom: "0.85rem",
          background: "rgba(255, 140, 66, 0.05)",
          padding: "0.8rem",
          borderRadius: "14px",
          border: "1px solid rgba(255, 140, 66, 0.2)"
        }}>
          <h1 style={{ 
            fontSize: "clamp(1.36rem, 1.7vw, 1.65rem)", 
            color: "#ff8c42", 
            textAlign: "center",
            width: "100%",
            lineHeight: 1.2,
            margin: 0,
            marginBottom: "0.42rem",
            paddingTop: "0.2rem",
          }}>
            검색 결과
          </h1>
	          <p style={{ 
	            fontSize: "0.74rem", 
	            color: "#b0b0b0",
	            marginBottom: "0.5rem"
	          }}>
	            "<span style={{ color: "#ff8c42", fontWeight: "bold" }}>{searchTerm}</span>"에 대한 
	            <span style={{ color: "#4CAF50", fontWeight: "bold", marginLeft: "0.5rem" }}>
	              {visibleResults.length}개
	            </span>의 검색 결과
	          </p>
          <div style={{ color: "#999", fontSize: "0.74rem" }}>
            인도네시아 제약 산업 관련 최신 정보를 확인하세요 (한국어/영어 검색 지원)
          </div>

          {recentSearches.length > 0 && (
            <div style={{ marginTop: "0.62rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.45rem", flexWrap: "wrap" }}>
              <span style={{ color: "#b9b9b9", fontSize: "0.72rem" }}>최근 검색어</span>
              {recentSearches.map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => {
                    if (term === searchTerm) return;
                    navigate(`/search?query=${encodeURIComponent(term)}`, { state: { from: location.state?.from || "/news" } });
                  }}
                  style={{
                    padding: "0.26rem 0.52rem",
                    borderRadius: "999px",
                    border: "1px solid rgba(255,255,255,0.22)",
                    background: "rgba(255,255,255,0.08)",
                    color: "#e5e5e5",
                    fontSize: "0.7rem",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                  }}
                >
                  {term}
                </button>
              ))}
              <button
                type="button"
                onClick={() => {
                  setRecentSearches([]);
                  try {
                    localStorage.removeItem("recentSearchTerms");
                  } catch {
                    // ignore
                  }
                }}
                style={{
                  padding: "0.24rem 0.5rem",
                  borderRadius: "999px",
                  border: "1px solid rgba(255,140,66,0.38)",
                  background: "transparent",
                  color: "#ffb067",
                  fontSize: "0.68rem",
                  cursor: "pointer",
                }}
              >
                전체 삭제
              </button>
            </div>
          )}
        </div>

        {/* 필터 및 정렬 옵션 */}
        <div style={{ 
          display: "flex", 
          justifyContent: "center", 
          gap: "0.55rem", 
          marginBottom: "0.62rem",
          flexWrap: "wrap"
        }}>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              background: "rgba(255, 255, 255, 0.1)",
              border: "1px solid rgba(255, 140, 66, 0.3)",
              borderRadius: "18px",
              padding: "0.4rem 0.62rem",
              color: "white",
              fontSize: "0.74rem",
              cursor: "pointer",
              outline: "none"
            }}
          >
            <option value="relevance" style={{ background: "#1a1a2e" }}>관련성순</option>
            <option value="date" style={{ background: "#1a1a2e" }}>최신순</option>
            <option value="importance" style={{ background: "#1a1a2e" }}>중요도순</option>
          </select>

          {/* 동적 태그 영역 */}
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center" }}>
            {selectedTags.length > 0 && (
              <button
                onClick={clearTags}
                style={{
                  padding: "0.4rem 0.62rem",
                  background: "transparent",
                  border: "1px solid rgba(255, 140, 66, 0.5)",
                  borderRadius: "18px",
                  color: "#ff8c42",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  fontSize: "0.72rem",
                }}
              >
                전체 해제 ✕
              </button>
            )}
            
            {tagFacets.slice(0, 8).map(({name, count}) => {
              const active = selectedTags.includes(name);
              return (
                <button
                  key={name}
                  onClick={() => toggleTag(name)}
                  title={`${name} (${count}개 결과)`}
                  style={{
                    padding: "0.4rem 0.62rem",
                    background: active ? "#ff8c42" : "rgba(255, 255, 255, 0.1)",
                    border: "1px solid",
                    borderColor: active ? "#ff8c42" : "rgba(255, 255, 255, 0.2)",
                    borderRadius: "18px",
                    color: "white",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    fontSize: "0.72rem",
                  }}
                >
                  {name} <span style={{opacity:0.7}}>({count})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 로딩 상태 */}
        {loading && (
          <div style={{
            textAlign: "center",
            padding: "3rem",
            color: "#ff8c42"
          }}>
            <div style={{ 
              fontSize: "2rem", 
              marginBottom: "0.7rem",
              animation: "spin 1s linear infinite"
            }}>⟳</div>
            <h3>검색 중...</h3>
            <p style={{ color: "#b0b0b0" }}>H2 데이터베이스에서 정보를 가져오고 있습니다.</p>
          </div>
        )}

        {/* 에러 상태 */}
        {error && (
          <div style={{
            textAlign: "center",
            padding: "3rem",
            color: "#f44336"
          }}>
            <div style={{ fontSize: "3rem", marginBottom: "0.7rem" }}>⚠️</div>
            <h3>오류 발생</h3>
            <p style={{ color: "#b0b0b0" }}>{error}</p>
            <button
              onClick={() => performSearch(searchTerm, sortBy, filterType)}
              style={{
                background: "#ff8c42",
                border: "none",
                padding: "0.7rem 1.5rem",
                borderRadius: "18px",
                color: "white",
                cursor: "pointer",
                marginTop: "1rem"
              }}
            >
              다시 시도
            </button>
          </div>
        )}

        {/* 검색 결과 카드 목록 */}
        {!loading && !error && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile
                ? "1fr"
                : "repeat(3, minmax(0, 1fr))",
              gap: "0.85rem",
            }}
          >
	            {visibleResults.map((article) => (
	              <SearchCard
	                key={article.id}
	                article={article}
	                searchTerm={searchTerm}
	                onTagClick={toggleTag}
                onOpen={() => {
                  if (setSelectedNews) setSelectedNews({
                    ...article,
                    semanticConfidence: article?.semanticConfidence ?? article?.semantic_confidence ?? null,
                    tagMismatch: article?.tagMismatch ?? article?.tag_mismatch ?? null,
                    categoryMismatch: article?.categoryMismatch ?? article?.category_mismatch ?? null,
                  });
                  navigate('/news/detail', { state: { from: `${location.pathname}${location.search}` } });
                }}
              />
	            ))}
	          </div>
	        )}

        {/* 검색 결과가 없을 때 */}
	        {!loading && !error && visibleResults.length === 0 && searchTerm && (
	          <div style={{
	            textAlign: "center",
	            padding: "3rem",
	            color: "#b0b0b0"
	          }}>
            <div style={{ fontSize: "3rem", marginBottom: "0.7rem" }}>🔍</div>
            <h3 style={{ color: "#ff8c42", marginBottom: "0.7rem" }}>검색 결과가 없습니다</h3>
            <p>"{searchTerm}"에 대한 결과를 찾을 수 없습니다.</p>
            <p>다른 검색어를 시도해보시거나 필터를 변경해보세요.</p>
            <div style={{ marginTop: "1.5rem", fontSize: "0.78rem" }}>
              <strong>검색 팁:</strong><br />
              • 한국어: "칼베파마", "메트포르민", "3상 임상시험"<br />
              • English: "Kalbe Farma", "Metformin", "Phase III"
            </div>
          </div>
        )}

        {/* 하단 안내 */}
        <div style={{
          textAlign: "center",
          marginTop: "1.4rem",
          padding: "1rem",
          background: "rgba(255, 140, 66, 0.05)",
          borderRadius: "12px",
          border: "1px solid rgba(255, 140, 66, 0.1)"
        }}>
          <p style={{ color: "#b0b0b0", fontSize: "0.78rem", margin: "0" }}>
            더 정확한 검색을 원하시면 구체적인 키워드를 사용해보세요. 
            <br />
            한국어/영어 모두 지원 | 예: "Kalbe Farma", "메트포르민", "Phase III", "임상시험" 등
          </p>
        </div>
      </div>
    </div>
  );
};

export default SearchResultsPage;
