// 서비스 소개 페이지
import React from 'react';

const AboutPage = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 'calc(100vh - 80px)',
      textAlign: 'center',
      padding: '2rem'
    }}>
      <div style={{
        paddingTop: '30px',
        marginTop: '100px',
        maxWidth: '840px',
        width: '100%',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: '15px',
        padding: '2rem',
        marginBottom: '4rem'
      }}>
        <h2 style={{
          fontSize: '1.5rem',
          marginBottom: '1rem',
          color: '#ff8c42'
        }}>
          서비스 소개
        </h2>
        <p style={{
          color: '#d0d0d0',
          lineHeight: '1.8',
          marginBottom: '1.5rem'
        }}>
          복잡하고 빠르게 변화하는 인도네시아 제약 시장, 정보의 홍수 속에서 핵심을 놓치고 계신가요?
          <br></br>BearIndonesia는 매일 쏟아지는 뉴스 속에서 당신이 반드시 알아야 할 인사이트를 AI 기술로 찾아드립니다.
        </p>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(258px, 1fr))',
          gap: '1rem',
          marginTop: '2rem'
        }}>
          <div style={{
            background: 'rgba(255, 140, 66, 0.1)',
            padding: '1rem',
            borderRadius: '10px',
            border: '1px solid rgba(255, 140, 66, 0.2)',
            minHeight: '200px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            <h3 style={{ color: '#ff8c42', marginBottom: '0.5rem' }}>AI 자동 분류 및 태그</h3>
            <p style={{ 
              color: '#b0b0b0', 
              fontSize: '0.9rem',
              flexGrow: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
              }}>
            '신약 허가', 'M&A' 등 핵심 카테고리와<br></br>키워드로 뉴스를 자동 분류합니다.<br></br>불필요한 정보는 걸러내고<br></br>가장 중요한 소식에만 집중하여<br></br>시간을 절약하세요. 
            </p>
          </div>
          <div style={{
            background: 'rgba(255, 140, 66, 0.1)',
            padding: '1rem',
            borderRadius: '10px',
            border: '1px solid rgba(255, 140, 66, 0.2)',
            minHeight: '200px',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <h3 style={{ color: '#ff8c42', marginBottom: '0.5rem' }}>AI 핵심 요약</h3>
            <p style={{ color: '#b0b0b0', 
              fontSize: '0.9rem',
              flexGrow: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
              }}>
              AI가 긴 기사의 핵심 내용을<br></br>단 몇 줄로 요약해 드립니다.<br></br>출퇴근길, 커피 한 잔의 시간에<br></br>시장의 핵심 동향을<br></br>완벽하게 파악할 수 있습니다.
            </p>
          </div>
          <div style={{
            background: 'rgba(255, 140, 66, 0.1)',
            padding: '1rem',
            borderRadius: '10px',
            border: '1px solid rgba(255, 140, 66, 0.2)',
            minHeight: '200px',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <h3 style={{ color: '#ff8c42', marginBottom: '0.5rem' }}>인터렉티브 캘린더</h3>
            <p style={{ 
              color: '#b0b0b0', 
              fontSize: '0.9rem',
              flexGrow: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
              }}> 
              특정 기간의 아티클을<br></br>손쉽게 필터링하여 확인할 수 있습니다.
            </p>
          </div>
        </div>
      </div>
      <div style={{
        maxWidth: '840px',
        marginBottom: '100px',
        width: '100%',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: '15px',
        padding: '2rem'
      }}>
        <h2 style={{
          fontSize: '1.5rem',
          marginBottom: '1rem',
          color: '#ff8c42'
        }}>
          사용 방법
        </h2>
        <p style={{
          color: '#d0d0d0',
          lineHeight: '1.8',
          marginBottom: '1.5rem'
        }}>
          BearIndonesia의 강력한 기능들을 아래 3단계로 간단하게 활용해 보세요.
          <br></br>매일 업데이트되는 제약 산업의 핵심 정보를 놓치지 않고 따라갈 수 있습니다.
        </p>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(258px, 1fr))',
          gap: '1rem',
          marginTop: '2rem'
        }}>
          <div style={{
            background: 'rgba(255, 140, 66, 0.1)',
            padding: '1rem',
            borderRadius: '10px',
            border: '1px solid rgba(255, 140, 66, 0.2)',
            minHeight: '200px',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <h3 style={{ color: '#ff8c42', marginBottom: '0.5rem' }}>1. 뉴스 탐색</h3>
            <p style={{ 
              color: '#b0b0b0', 
              fontSize: '0.9rem',
              flexGrow: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
              }}> 
              '최신뉴스' 페이지에서 AI가 분류한<br></br>다양한 카테고리의 기사들을 확인하고<br></br>최신 50개 뉴스 워드 클라우드도<br></br>함께 확인해보세요.
              </p>
          </div>
          <div style={{
            background: 'rgba(255, 140, 66, 0.1)',
            padding: '1rem',
            borderRadius: '10px',
            border: '1px solid rgba(255, 140, 66, 0.2)',
            minHeight: '200px',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <h3 style={{ color: '#ff8c42', marginBottom: '0.5rem' }}>2. Excel 및 PDF 다운</h3>
            <p style={{ 
              color: '#b0b0b0',
              fontSize: '0.9rem',
              flexGrow: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
              }}> 
              이달의 뉴스 기사를 정리한<br></br>Excel과 보고서를<br></br>다운로드 할 수 있어요.
            </p>
          </div>
          <div style={{
            background: 'rgba(255, 140, 66, 0.1)',
            padding: '1rem',
            borderRadius: '10px',
            border: '1px solid rgba(255, 140, 66, 0.2)',
            minHeight: '200px',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <h3 style={{ color: '#ff8c42', marginBottom: '0.5rem' }}>3. 캘린더 활용</h3>
            <p style={{ 
              color: '#b0b0b0', 
              fontSize: '0.9rem',
              flexGrow: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
              }}> 
              '인터렉티브 캘린더'에서<br></br>기간별 주요 기사를 확인하고<br></br>관련 뉴스를 함께 모아봐요.
            </p>
        </div>
      </div>
    </div>
    </div>
  );
};

export default AboutPage;