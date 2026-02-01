// 뉴스 상세 페이지
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ScrapStarButton from '../../../components/ScrapStarButton';

const NewsDetailPage = ({ news }) => {
  const [titleLang, setTitleLang] = useState("ko"); 
  const [contentTab, setContentTab] = useState("ko"); 
  const navigate = useNavigate();
  const location = useLocation();
  let storedNews = null;
  try {
    const raw = sessionStorage.getItem("selectedNews");
    if (raw) storedNews = JSON.parse(raw);
  } catch {
    storedNews = null;
  }
  const resolvedNews = news || storedNews;

  if (!resolvedNews) {
    return (
      <div style={{
        padding: '2rem', display: 'flex', justifyContent: 'center',
        alignItems: 'center', height: '50vh', color: '#ff8c42', fontSize: '1.2rem'
      }}>
        뉴스 데이터를 불러올 수 없습니다.
      </div>
    );
  }

  const titleKO   = resolvedNews.korTitle || '';
  const titleID   = resolvedNews.title || '';
  const summaryKO = resolvedNews.korSummary || '';
  const summaryID = resolvedNews.idSummary || resolvedNews.summary || '';
  const semanticConfidence = resolvedNews.semanticConfidence ?? null;
  const tagMismatch = resolvedNews.tagMismatch ?? false;
  const categoryMismatch = resolvedNews.categoryMismatch ?? false;
  const showDev = import.meta.env.MODE !== "production";
  const imageURL = resolvedNews.img || '';
  const contentKO = resolvedNews.korContent || '';
  const contentID = resolvedNews.content || '';
  const insight   = resolvedNews.insight || resolvedNews.insight || '';
  const author    = resolvedNews.source || '';
  const date      = resolvedNews.date || '';
  const link      = resolvedNews.link || '';
  const tags      = Array.isArray(resolvedNews.tags) ? resolvedNews.tags : [];

  // 텍스트 하이라이트
  const renderHighlighted = (text) => {
    if (!text) return null;
    const parts = String(text).split(/(\*\*[^*]+\*\*)/g);
    const nodes = [];
    parts.forEach((part, i) => {
      if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
        const inner = part.slice(2, -2);
        nodes.push(
          <strong key={`s-${i}`} style={{ color: '#ffae66', fontWeight: 700 }}>
            {inner}
          </strong>
        );
      } else {
        const lines = part.split('\n');
        lines.forEach((line, j) => {
          nodes.push(<React.Fragment key={`t-${i}-${j}`}>{line}</React.Fragment>);
          if (j < lines.length - 1) nodes.push(<br key={`br-${i}-${j}`} />);
        });
      }
    });
    return nodes;
  };

  return (
    <div style={{ padding: '2rem 1rem', minHeight: 'calc(100vh - 80px)' }}>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
        <div style={{ width: '60px', display: 'flex', justifyContent: 'center', flexShrink: 0 }}>
          {/* 뒤로가기 */}
          <button
            onClick={() => navigate(location.state?.from || '/news', { state: { preserveScroll: true } })}
            style={{
              position: 'sticky',
              top: '2.5rem',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 140, 66, 0.5)', 
              borderRadius: '50%',
              width: '50px', 
              height: '50px', 
              color: '#ff8c42', 
              fontSize: '1.5rem',
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
        </div>

        <div style={{ maxWidth: '900px', width: '100%', marginTop: '1rem' }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.08)', 
          backdropFilter: 'blur(20px)',
          borderRadius: '25px', 
          border: '1px solid rgba(255, 255, 255, 0.1)',
          overflow: 'hidden', 
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
        }}>
          {/* 헤더 */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(255, 140, 66, 0.15), rgba(255, 167, 38, 0.15))',
            padding: '3rem 3rem 2rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            {/* 제목 + 드롭다운 */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem" }}>
              <h1 style={{
                fontSize: '2.2rem', 
                fontWeight: '700', 
                lineHeight: '1.3',
                marginBottom: '2rem', 
                color: 'white',
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
                flex: 1
              }}>
                {titleLang === "ko" ? titleKO : titleID}
              </h1>
        {showDev && (tagMismatch || categoryMismatch) && (
          <div style={{ marginTop: '0.6rem', fontSize: '0.9rem', color: '#c8c8c8' }}>
            Review needed{tagMismatch ? ' (tag_mismatch)' : ''}{categoryMismatch ? ' (category_mismatch)' : ''}
          </div>
        )}

              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexShrink: 0 }}>
                <ScrapStarButton article={resolvedNews} size={18} />
                <select
                  value={titleLang}
                  onChange={(e) => setTitleLang(e.target.value)}
                  style={{
                    background: "rgba(255,255,255,0.15)",
                    color: "white",
                    border: "1px solid rgba(255,255,255,0.3)",
                    borderRadius: "8px",
                    padding: "0.5rem 0.8rem",
                    fontSize: "0.9rem",
                    cursor: "pointer",
                    flexShrink: 0
                  }}
                >
                  <option value="ko" style={{color: 'black'}}>한국어 제목</option>
                  <option value="id" style={{color: 'black'}}>원문 제목</option>
                </select>
              </div>
            </div>

            {/* 메타 */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1.5rem',
              marginBottom: '0.75rem'
            }}>
              <div>
                <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem' }}>언론사</div>
                <div style={{ color: 'white', fontWeight: '600', fontSize: '1.1rem' }}>
                  {author || '정보 없음'}
                </div>
              </div>
              <div>
                <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem' }}>발행일</div>
                <div style={{ color: 'white', fontWeight: '600', fontSize: '1.1rem' }}>
                  {date || '정보 없음'}
                </div>
              </div>
            </div>

            {/* 링크(좌) + 태그(우) 한 줄 */}
            {(link || tags.length > 0) && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem',
                flexWrap: 'wrap'
              }}>
                {/* 왼쪽: 원문 기사 보기 */}
                <div style={{ minWidth: 200, marginTop:"12px", marginBottom: "-10px" }}>
                  {link && (
                    <a
                      href={link}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        color: '#ffae66',
                        fontWeight: 600,
                        textDecoration: 'none'
                      }}
                    >
                      원문 기사 보기 ↗
                    </a>
                  )}
                </div>

                {/* 오른쪽: 태그들 */}
                {tags.length > 0 && (
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '8px',
                    marginLeft: 'auto'
                  }}>
                    {tags.map((t, i) => (
                      <span
                        key={`${t?.name ?? 'tag'}-${i}`}
                        style={{
                          display: 'inline-block',
                          background: 'rgba(255, 140, 66, 0.3)',
                          marginTop:"15px", 
                          marginBottom: "-10px",
                          color: '#ffae66',
                          padding: '0.4rem 0.9rem',
                          borderRadius: '25px',
                          fontSize: '0.85rem',
                          fontWeight: '600',
                          border: '1px solid rgba(255, 140, 66, 0.4)'
                        }}
                      >
                        #{t?.name ?? ''}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 탭 + 본문 */}
          <div style={{ padding: '0' }}>
            {/* 탭 */}
            <div style={{ 
              display: 'flex', 
              background: 'rgba(0, 0, 0, 0.2)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            }}>
              <button
                onClick={() => setContentTab("ko")}
                style={{
                  padding: '1rem 12rem',
                  background: contentTab === "ko" ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                  border: 'none',
                  borderTopLeftRadius: '12px',
                  borderTopRightRadius: '12px',
                  color: contentTab === "ko" ? '#ff8c42' : 'rgba(255, 255, 255, 0.6)',
                  fontSize: '1rem',
                  fontWeight: contentTab === "ko" ? '600' : '400',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                  borderBottom: contentTab === "ko" ? 'none' : '1px solid rgba(255, 255, 255, 0.1)',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  minWidth: '160px',
                }}
                onMouseEnter={(e) => {
                  if (contentTab !== "ko") {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (contentTab !== "ko") {
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                한국어
              </button>
              
              <button
                onClick={() => setContentTab("id")}
                style={{
                  padding: '1rem 12rem',
                  background: contentTab === "id" ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                  border: 'none',
                  borderTopLeftRadius: '12px',
                  borderTopRightRadius: '12px',
                  color: contentTab === "id" ? '#ff8c42' : 'rgba(255, 255, 255, 0.6)',
                  fontSize: '1rem',
                  fontWeight: contentTab === "id" ? '600' : '400',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                  borderBottom: contentTab === "id" ? 'none' : '1px solid rgba(255, 255, 255, 0.1)',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                }}
                onMouseEnter={(e) => {
                  if (contentTab !== "id") {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (contentTab !== "id") {
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                인도네시아어
              </button>
            </div>

            {/* 탭 내용 */}
            <div style={{ padding: '3rem' }}>
              {contentTab === "ko" ? (
                <>
                  {/* AI 요약(한국어) */}
                  {summaryKO && (
                    <div style={{ marginBottom: '2.5rem' }}>
                      <h3 style={{
                        color: '#ff8c42', 
                        fontSize: '1.3rem', 
                        fontWeight: 600,
                        marginBottom: '1rem', 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.5rem'
                      }}>
                        <span>🤖</span>AI 요약
                      </h3>
                      <div style={{
                        color: '#d0d0d0',
                        lineHeight: '1.8',
                        fontSize: '1.05rem'
                      }}>
                        {renderHighlighted(summaryKO)}
                      </div>
                    </div>
                  )}

                  {/* 인사이트 */}
                  {insight && (
                    <div style={{ marginBottom: '2rem' }}>
                      <h3 style={{ 
                        color: '#ff8c42', 
                        fontSize: '1.3rem', 
                        fontWeight: 600, 
                        marginBottom: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}>
                        💡 인사이트
                      </h3>
                      <div style={{ 
                        color: '#e0e0e0', 
                        lineHeight: 1.8,
                        fontSize: '1.02rem',
                        background: 'rgba(255, 140, 66, 0.08)',
                        padding: '1.5rem',
                        borderRadius: '12px',
                        border: '1px solid rgba(255, 140, 66, 0.2)'
                      }}>
                        {insight}
                      </div>
                    </div>
                  )}

                  {/* 뉴스 대표 이미지 */}
                  {imageURL && (
                    <div style={{
                      margin: '2.5rem 0',
                      display: 'flex',
                      justifyContent: 'center'
                    }}>
                      <img
                        src={imageURL}
                        alt="뉴스 대표 이미지"
                        style={{
                          maxWidth: '100%',
                          maxHeight: '420px',
                          objectFit: 'cover',
                          borderRadius: '18px',
                          boxShadow: '0 10px 30px rgba(0,0,0,0.35)',
                          border: '1px solid rgba(255,255,255,0.12)'
                        }}
                        loading="lazy"
                      />
                    </div>
                  )}

                  {/* 원문(한국어) */}
                  {contentKO && (
                    <div style={{ marginBottom: '2.5rem' }}>
                      <h3 style={{
                        color: '#ff8c42', 
                        fontSize: '1.3rem', 
                        fontWeight: 600,
                        marginBottom: '1rem'
                      }}>
                        📝 원문
                      </h3>
                      <div style={{
                        color: '#e0e0e0',
                        lineHeight: '1.8',
                        fontSize: '1.02rem',
                        whiteSpace: 'pre-wrap'
                      }}>
                        {contentKO}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <>
                  {/* AI 요약(인도네시아어) */}
                  {summaryID && (
                    <div style={{ marginBottom: '2.5rem' }}>
                      <h3 style={{
                        color: '#ff8c42', 
                        fontSize: '1.3rem', 
                        fontWeight: 600,
                        marginBottom: '1rem', 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.5rem'
                      }}>
                        <span>🤖</span>AI Ringkasan
                      </h3>
                      <div style={{
                        color: '#d0d0d0',
                        lineHeight: '1.8',
                        fontSize: '1.05rem'
                      }}>
                        {renderHighlighted(summaryID)}
                      </div>
                    </div>
                  )}

                  {/* 원문(인도네시아어) */}
                  {contentID && (
                    <div style={{ marginBottom: '2.5rem' }}>
                      <h3 style={{
                        color: '#ff8c42', 
                        fontSize: '1.3rem', 
                        fontWeight: 600,
                        marginBottom: '1rem'
                      }}>
                        📄 Artikel Asli
                      </h3>
                      <div style={{
                        color: '#e0e0e0',
                        lineHeight: '1.8',
                        fontSize: '1.02rem',
                        whiteSpace: 'pre-wrap'
                      }}>
                        {contentID}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        <div style={{ height: '3rem' }} />
      </div>
    </div>
  );
};

export default NewsDetailPage;
