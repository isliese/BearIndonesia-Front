// 서비스 소개 페이지
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuthUser, isAdminUser } from '../../../utils/auth';

const AboutPage = () => {
  const navigate = useNavigate();
  const [authUser, setAuthUser] = useState(() => getAuthUser());
  const isAdmin = useMemo(() => isAdminUser(authUser), [authUser]);

  useEffect(() => {
    const update = () => setAuthUser(getAuthUser());
    update();
    window.addEventListener('authchange', update);
    window.addEventListener('storage', update);
    return () => {
      window.removeEventListener('authchange', update);
      window.removeEventListener('storage', update);
    };
  }, []);

  const shellStyle = useMemo(
    () => ({
      maxWidth: '860px',
      width: '100%',
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      borderRadius: '15px',
      border: '1px solid rgba(255,255,255,0.12)',
      padding: 'clamp(1rem, 2.6vw, 1.45rem)',
      boxSizing: 'border-box',
    }),
    [],
  );

  const cardStyle = useMemo(
    () => ({
      background: 'rgba(255, 140, 66, 0.08)',
      padding: '0.75rem 0.82rem',
      borderRadius: '12px',
      border: '1px solid rgba(255, 140, 66, 0.18)',
    }),
    [],
  );

  const features = useMemo(
    () => [
      {
        title: 'AI 자동 분류 및 태그',
        desc: "‘신약 허가’, ‘M&A’ 등 핵심 카테고리와 키워드로 뉴스를 자동 분류합니다. 불필요한 정보는 걸러내고 중요한 소식에만 집중하세요.",
      },
      {
        title: 'AI 핵심 요약 · 인사이트',
        desc: '긴 기사의 핵심을 빠르게 요약하고, 업무에 필요한 인사이트까지 뽑아볼 수 있습니다.',
      },
      {
        title: '검색 · 기간/언론사/분야/경쟁사 필터',
        desc: '원하는 조건으로 뉴스를 빠르게 좁혀보고, 필요한 정보만 선별해서 확인할 수 있습니다.',
      },
      {
        title: '스크랩 · 코멘트',
        desc: '기사를 스크랩하고 코멘트를 함께 남겨, 원하는 뉴스를 인사이트와 함께 저장하고 다시 확인 수 있습니다.',
      },
      {
        title: '워드클라우드',
        desc: '현재 시장에서 뜨는 키워드를 한눈에 파악하고, 시간에 따른 시장의 관심 주제를 빠르게 스캔할 수 있습니다.',
      },
      {
        title: '인터랙티브 캘린더',
        desc: '캘린더에서 날짜를 드래그해 기간별 뉴스를 확인하고, 특정 기간의 흐름을 쉽게 따라갈 수 있습니다.',
      },
      {
        title: '월별 뉴스레터 (미리보기 · PDF)',
        desc: '월간 핵심 뉴스/동향/전략 제안을 뉴스레터 형태로 미리보고 PDF로 다운로드할 수 있습니다.',
      },
      {
        title: 'Report (경쟁사 리포트)',
        desc: '경쟁사/주주 관점에서 뉴스를 모아 확인할 수 있습니다.',
      },
      ...(isAdmin
        ? [
            {
              title: 'Sales',
              desc: 'Raw Excel을 업로드하면 시각화 페이지(HTML)를 생성하고, ADMIN끼리 공유/조회할 수 있습니다.',
            },
            {
              title: 'Admin · Users',
              desc: '유저 Role(USER/ADMIN)을 관리하고 ADMIN 전용 기능 접근을 제어할 수 있습니다.',
            },
          ]
        : []),
    ],
    [isAdmin],
  );

  const steps = useMemo(
    () => [
      {
        title: '1) News에서 빠르게 탐색',
        desc: '정렬/기간/필터를 조합해서 필요한 뉴스만 확인하고, 상세 페이지에서 요약을 빠르게 확인하세요.',
        cta: { label: 'News로 이동', to: '/news' },
      },
      {
        title: '2) 스크랩으로 중요한 뉴스 쌓기',
        desc: '중요 기사는 스크랩하고 코멘트를 남겨, 나중에 다시 볼 때 “왜 중요했는지”까지 남길 수 있습니다.',
        cta: { label: '스크랩 보기', to: '/scrap' },
      },
      {
        title: '3) 워드클라우드/캘린더로 흐름 파악',
        desc: '기간별 키워드와 날짜별 뉴스를 함께 보며 시장 흐름을 빠르게 파악하세요.',
        cta: { label: '캘린더 보기', to: '/calendar' },
      },
      {
        title: '4) 리포트/뉴스레터로 공유',
        desc: '월별 뉴스레터(PDF)와 경쟁사 리포트를 통해 팀 내 공유를 더 쉽게 만들 수 있습니다.',
        cta: { label: 'Report 보기', to: '/report/competitor' },
      },
    ],
    [],
  );

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        minHeight: 'calc(100vh - 80px)',
        textAlign: 'center',
        padding: 'clamp(1rem, 3.6vw, 2rem) clamp(0.95rem, 3vw, 1.45rem)',
        boxSizing: 'border-box',
      }}
    >
      {/* Hero */}
      <div
        style={{
          ...shellStyle,
          paddingTop: 'clamp(0.9rem, 2.4vw, 1.35rem)',
          marginTop: 'clamp(10px, 3vw, 28px)',
          marginBottom: 'clamp(0.8rem, 3vw, 1.25rem)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'center',
            gap: '0.45rem',
            flexWrap: 'wrap',
          }}
        >
          <div
            style={{
              fontSize: 'clamp(1.25rem, 1.7vw, 1.55rem)',
              fontWeight: 900,
              color: '#ff8c42',
            }}
          >
            BearIndonesia
          </div>
          <div
            style={{
              color: '#d0d0d0',
              fontSize: 'clamp(0.78rem, 0.9vw, 0.9rem)',
            }}
          >
            AI 기반 제약 산업 뉴스 · 허가 정보 · 인사이트
          </div>
        </div>

        <p
          style={{
            color: '#d0d0d0',
            lineHeight: '1.7',
            margin: '0.72rem auto 0',
            maxWidth: 720,
            fontSize: 'clamp(0.8rem, 0.95vw, 0.9rem)',
          }}
        >
          복잡하고 빠르게 변화하는 인도네시아 제약 시장, 정보의 홍수 속에서 핵심을 놓치고 계신가요? <br></br>
          BearIndonesia는 매일 쏟아지는 뉴스 속에서 당신이 반드시 알아야 할 요약과 인사이트를 AI로 빠르게 제공합니다.
        </p>
      </div>

      {/* Features */}
      <div style={{ ...shellStyle, marginBottom: 'clamp(0.8rem, 3vw, 1.35rem)' }}>
        <h2 style={{ fontSize: '1.24rem', marginBottom: '0.72rem', color: '#ff8c42' }}>주요 기능</h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '0.72rem',
            marginTop: '0.82rem',
          }}
        >
          {features.map((f) => (
            <div key={f.title} style={cardStyle}>
              <div style={{ color: '#ffb86b', fontWeight: 900, marginBottom: '0.25rem', fontSize: '0.86rem' }}>{f.title}</div>
              <div style={{ color: '#b0b0b0', fontSize: '0.8rem', lineHeight: 1.46 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* How to use */}
      <div style={{ ...shellStyle, marginBottom: 'clamp(1.6rem, 6vw, 64px)' }}>
        <h2 style={{ fontSize: '1.24rem', marginBottom: '0.55rem', color: '#ff8c42' }}>사용 방법</h2>
        <div
          style={{
            color: '#d0d0d0',
            lineHeight: 1.6,
            fontSize: 'clamp(0.8rem, 0.92vw, 0.88rem)',
          }}
        >
          BearIndonesia는 아직 개발 중이며, 실사용자 피드백을 통해 사용 경험을 지속적으로 개선하고 기능을 확장해나갈 예정입니다.
        </div>

        <div style={{ display: 'grid', gap: '0.72rem', marginTop: '0.82rem' }}>
          {steps.map((s) => (
            <div key={s.title} style={cardStyle}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.62rem',
                  flexWrap: 'wrap',
                }}
              >
                <div style={{ color: '#ff8c42', fontWeight: 900, fontSize: '0.84rem' }}>{s.title}</div>
                <button
                  type="button"
                  onClick={() => navigate(s.cta.to)}
                  style={{
                    background: 'transparent',
                    border: '1px solid rgba(255, 140, 66, 0.35)',
                    color: 'white',
                    padding: '0.28rem 0.56rem',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    fontWeight: 800,
                    fontSize: '0.76rem',
                  }}
                >
                  {s.cta.label}
                </button>
              </div>
              <div style={{ marginTop: '0.34rem', color: '#b0b0b0', fontSize: '0.8rem', lineHeight: 1.46 }}>{s.desc}</div>
            </div>
          ))}
        </div>

        {isAdmin && (
          <div style={{ marginTop: '0.82rem', color: '#b0b0b0', fontSize: '0.8rem', lineHeight: 1.45 }}>
            ADMIN 계정이라면 상단 메뉴에서 <span style={{ color: '#ffb86b', fontWeight: 900 }}>Sales</span> /{' '}
            <span style={{ color: '#ffb86b', fontWeight: 900 }}>Admin</span> 기능을 사용할 수 있어요.
          </div>
        )}
      </div>
    </div>
  );
};

export default AboutPage;

