// src/pages/NewsDetailPage.jsx
import React, { useState } from 'react';

const NewsDetailPage = ({ news, setCurrentPage, prevPage }) => {
  const [lang, setLang] = useState("ko"); // ✅ 드롭다운 상태 추가

  if (!news) {
    return (
      <div style={{
        padding: '2rem', display: 'flex', justifyContent: 'center',
        alignItems: 'center', height: '50vh', color: '#ff8c42', fontSize: '1.2rem'
      }}>
        뉴스 데이터를 불러올 수 없습니다.
      </div>
    );
  }

  const titleKO   = news.korTitle || news.title || '';
  const titleEN   = news.engTitle || news.title || '';
  const summaryKO = news.korSummary || '';
  const summaryEN = news.engSummary || '';
  const insight   = news.importanceRationale || news.importance_rationale || '';
  const author    = news.source || '';
  const date      = news.date || '';
  const link      = news.link || '';
  const tags      = Array.isArray(news.tags) ? news.tags : [];

  // **굵게** -> 포인트 컬러 굵게 (배경 없음) + 개행 유지
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
    <div style={{ position: 'relative', padding: '2rem 1rem', minHeight: 'calc(100vh - 80px)' }}>
      {/* 뒤로가기 */}
      <button
        onClick={() => setCurrentPage(prevPage || 'news')}
        style={{
          position: 'absolute',
          top: '3.5rem',
          left: '15rem',
          background: 'rgba(255, 255, 255, 0.1)',
          border: '1px solid rgba(255, 140, 66, 0.5)', borderRadius: '50%',
          width: '50px', height: '50px', color: '#ff8c42', fontSize: '1.5rem',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.3s ease', zIndex: 10
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

      <div style={{ maxWidth: '900px', margin: '0 auto', marginTop: '1rem' }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.08)', backdropFilter: 'blur(20px)',
          borderRadius: '25px', border: '1px solid rgba(255, 255, 255, 0.1)',
          overflow: 'hidden', boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
        }}>
          {/* 헤더 */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(255, 140, 66, 0.15), rgba(255, 167, 38, 0.15))',
            padding: '3rem 3rem 2rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            {/* ✅ 드롭다운 + 제목 */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h1 style={{
                fontSize: '2.2rem', fontWeight: '700', lineHeight: '1.3',
                marginBottom: '2rem', color: 'white',
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)'
              }}>
                {lang === "ko" ? titleKO : titleEN}
              </h1>

              <select
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                style={{
                  background: "rgba(255,255,255,0.1)",
                  color: "black",
                  border: "1px solid rgba(255,255,255,0.3)",
                  borderRadius: "8px",
                  padding: "0.4rem 0.6rem",
                  fontSize: "0.9rem",
                  cursor: "pointer"
                }}
              >
                <option value="ko">한국어 제목</option>
                <option value="en">영어 제목</option>
              </select>
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

          {/* 본문 & 요약 */}
          <div style={{ padding: '3rem' }}>
            {/* ✅ AI 요약(한국어) */}
            {summaryKO && (
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{
                  color: '#ff8c42', fontSize: '1.3rem', fontWeight: 600,
                  marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem'
                }}>
                  <span>🤖</span>AI 요약
                </h3>
                <div
                  style={{
                    color: '#d0d0d0',
                    marginBottom: '1rem',
                    lineHeight: '1.6',
                    display: '-webkit-box',
                    WebkitLineClamp: 5,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}
                >
                  {renderHighlighted(summaryKO)}
                </div>
              </div>
            )}

            {/* ✅ AI 요약(영어) */}
            {summaryEN && (
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{
                  color: '#ff8c42', fontSize: '1.3rem', fontWeight: 600,
                  marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem'
                }}>
                  <span>🤖</span>AI 요약(영어)
                </h3>
                <div
                  style={{
                    color: '#d0d0d0',
                    marginBottom: '1rem',
                    lineHeight: '1.6',
                    display: '-webkit-box',
                    WebkitLineClamp: 5,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}
                >
                  {renderHighlighted(summaryEN)}
                </div>
              </div>
            )}

            {/* ✅ 인사이트 */}
            {insight && (
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ color: '#ff8c42', fontSize: '1.15rem', fontWeight: 600, marginBottom: '0.75rem' }}>
                  인사이트
                </h3>
                <p style={{ color: '#e0e0e0', lineHeight: 1.7 }}>{insight}</p>
              </div>
            )}
          </div>
        </div>

        <div style={{ height: '3rem' }} />
      </div>
    </div>
  );
};

export default NewsDetailPage;
