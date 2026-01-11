// 인터렉티브 캘린더 페이지
import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  getNewsForDate, 
  getNewsCount
} from '../data/totalData';

const CalendarPage = ({ setSelectedNews }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedRange, setSelectedRange] = useState({ start: null, end: null });
  const [isDragging, setIsDragging] = useState(false);
  const [calendarKey, setCalendarKey] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  const formatDate = (date) => date.toLocaleDateString('sv-SE');

  const getMonthData = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    const days = [];
    const current = new Date(startDate);
    while (days.length < 42) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    return days;
  };

  const clearSelection = () => {
    setIsDragging(false);
    setSelectedRange({ start: null, end: null });
    if (typeof setSelectedNews === 'function') setSelectedNews(null);
  };

  const changeMonth = (offset) => {
    clearSelection();
    setCurrentDate(prev => {
      const d = new Date(prev);
      d.setMonth(d.getMonth() + offset);
      return d;
    });
    setCalendarKey(k => k + 1);
  };

  useEffect(() => {
    clearSelection();
  }, [currentDate]);

  const getPriorityColorLocal = (priority) => {
    switch (priority) {
      case 'high': return '#ff4444';
      case 'medium': return '#ff8c42';
      case 'low': return '#4caf50';
      default: return 'transparent';
    }
  };

  const getMajorityPriority = (dateStr) => {
    const newsForDate = getNewsForDate(dateStr);
    if (!newsForDate.length) return null;
    const priorityCount = { high: 0, medium: 0, low: 0 };
    newsForDate.forEach(news => {
      const importance = news.importance || 0;
      if (importance >= 70) priorityCount.high++;
      else if (importance >= 30) priorityCount.medium++;
      else priorityCount.low++;
    });
    const maxCount = Math.max(priorityCount.high, priorityCount.medium, priorityCount.low);
    if (priorityCount.high === maxCount) return 'high';
    if (priorityCount.medium === maxCount) return 'medium';
    return 'low';
  };

  const monthNames = ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'];
  const dayNames = ['일','월','화','수','목','금','토'];

  const days = useMemo(() => getMonthData(currentDate), [currentDate]);

  const isInRange = (day) => {
    const { start, end } = selectedRange;
    if (!start || !end) return false;
    const dayTime = day.getTime();
    return dayTime >= start.getTime() && dayTime <= end.getTime();
  };

  const handleMouseDown = (day) => {
    const d = new Date(day);
    setSelectedRange({ start: d, end: d });
    setIsDragging(true);
  };

  const handleMouseEnter = (day) => {
    if (isDragging && selectedRange.start) {
      const d = new Date(day);
      const s = new Date(selectedRange.start);
      setSelectedRange({
        start: s.getTime() <= d.getTime() ? s : d,
        end: s.getTime() <= d.getTime() ? d : s
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const getSelectedRangeNews = () => {
    const { start, end } = selectedRange;
    if (!start || !end) return [];
    const allNews = [];
    const currentDate = new Date(start);
    const endDate = new Date(end);
    while (currentDate <= endDate) {
      const dateStr = formatDate(currentDate);
      const newsForDate = getNewsForDate(dateStr);
      newsForDate.forEach(item => {
        allNews.push({
          ...item,
          displayDate: dateStr,
          priority: item.importance >= 70 ? 'high' : 
                   item.importance >= 30 ? 'medium' : 'low',
          type: item.category || item.source || '기타'
        });
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return allNews.sort((a, b) => {
      if (a.displayDate !== b.displayDate) {
        return b.displayDate.localeCompare(a.displayDate);
      }
      return (b.importance || 0) - (a.importance || 0);
    });
  };

  const selectedNews = getSelectedRangeNews();
  const hasSelectedRange = selectedRange.start && selectedRange.end;

  return (
    <div
      className="calendar-container"
      onMouseUp={handleMouseUp}
      style={{ padding: '1.5rem', minHeight: 'calc(100vh - 80px)' }}
      key={`page-${calendarKey}`}
    >
      <h1 style={{ fontSize: '2.1rem', textAlign: 'center', marginBottom: '1.25rem', color: '#ff8c42' }}>
        인터렉티브 캘린더
      </h1>

      <div style={{ display: 'flex', gap: '1rem', maxWidth: '1200px', margin: '0 auto' }}>
        {/* 캘린더 */}
        <div style={{ flex: 2, background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(10px)', borderRadius: '12px', padding: '1.1rem' }}>
          {/* 헤더 */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <button
              type="button"
              onMouseDown={() => changeMonth(-1)}
              style={{ background: '#ff8c42', border: 'none', borderRadius: '8px', padding: '0.4rem 0.8rem', color: 'white', cursor: 'pointer', fontSize: '0.95rem' }}
            >←</button>
            <h2 style={{ color: 'white', fontSize: '1.3rem', margin: 0 }}>
              {currentDate.getFullYear()}년 {monthNames[currentDate.getMonth()]}
            </h2>
            <button
              type="button"
              onMouseDown={() => changeMonth(1)}
              style={{ background: '#ff8c42', border: 'none', borderRadius: '8px', padding: '0.4rem 0.8rem', color: 'white', cursor: 'pointer', fontSize: '0.95rem' }}
            >→</button>
          </div>

          {/* 범례 */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '0.75rem', padding: '0.4rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff4444', marginRight: 6 }} />
              <span style={{ fontSize: '0.85rem', color: '#d0d0d0' }}>중요도 높음</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff8c42', marginRight: 6 }} />
              <span style={{ fontSize: '0.85rem', color: '#d0d0d0' }}>중요도 보통</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#4caf50', marginRight: 6 }} />
              <span style={{ fontSize: '0.85rem', color: '#d0d0d0' }}>중요도 낮음</span>
            </div>
          </div>

          {/* 요일 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 3, marginBottom: '0.4rem' }}>
            {dayNames.map(day => (
              <div key={day} style={{ textAlign: 'center', padding: '0.4rem', color: '#b0b0b0', fontSize: '0.85rem', fontWeight: 'bold' }}>{day}</div>
            ))}
          </div>

          {/* 날짜 그리드 */}
          <div
            key={`grid-${calendarKey}`}
            onMouseLeave={() => setIsDragging(false)}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 3 }}
          >
            {days.map((day, index) => {
              const isCurrentMonth = day.getMonth() === currentDate.getMonth();
              const isToday = formatDate(day) === formatDate(new Date());
              const newsCount = getNewsCount(formatDate(day));
              const priority = getMajorityPriority(formatDate(day));
              const selected = isInRange(day);

              return (
                <div
                  key={index}
                  onMouseDown={() => handleMouseDown(day)}
                  onMouseEnter={() => handleMouseEnter(day)}
                  style={{
                    position: 'relative',
                    minHeight: 44,
                    padding: '0.4rem',
                    background: selected ? 'rgba(255, 140, 66, 0.28)' :
                               isToday ? 'rgba(255, 140, 66, 0.08)' : 'transparent',
                    color: isCurrentMonth ? 'white' : '#666',
                    cursor: 'pointer',
                    borderRadius: 7,
                    transition: 'all 0.2s ease',
                    fontSize: '0.85rem'
                  }}
                >
                  <div>{day.getDate()}</div>
                  {newsCount > 0 && (
                    <>
                      <div style={{ position: 'absolute', bottom: 3, right: 3, width: 7, height: 7, borderRadius: '50%', background: getPriorityColorLocal(priority) }} />
                      <div style={{ position: 'absolute', top: 2, right: 2, fontSize: 9, background: 'rgba(255, 140, 66, 0.8)', borderRadius: 9, padding: '1px 4px', color: 'white', minWidth: 12, textAlign: 'center' }}>
                        {newsCount}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 선택된 날짜 범위 뉴스 목록 */}
        <div
          key={`side-${calendarKey}`}
          style={{ flex: 1, background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(10px)', borderRadius: '12px', padding: '1.1rem' }}
        >
          <h3 style={{ textAlign: 'center', color: '#ff8c42', marginBottom: '0.85rem', fontSize: '1.05rem' }}>
            {selectedRange.start ? (
              selectedRange.end && selectedRange.start.getTime() !== selectedRange.end.getTime() ? 
              `${selectedRange.start.getMonth() + 1}월 ${selectedRange.start.getDate()}일 ~ ${selectedRange.end.getMonth() + 1}월 ${selectedRange.end.getDate()}일 뉴스 (${selectedNews.length}개)`
              : `${selectedRange.start.getMonth() + 1}월 ${selectedRange.start.getDate()}일 뉴스 (${selectedNews.length}개)`
            ) : '날짜를 선택해주세요'}
          </h3>

          {selectedNews.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: 500, overflowY: 'auto' }}>
              {selectedNews.map((news, index) => (
                <div 
                  key={`${news.id || index}-${news.displayDate}`}
                  onClick={() => {
                    setSelectedNews(news);
                    navigate('/news/detail', { state: { from: location.pathname } });
                  }}
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: 9,
                    padding: '0.85rem',
                    borderLeft: `3px solid ${getPriorityColorLocal(news.priority)}`,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.opacity = 0.75; }}
                  onMouseLeave={(e) => { e.currentTarget.style.opacity = 1; }}
                >
                  <div style={{ fontSize: '0.95rem', color: 'white', marginBottom: '0.4rem', lineHeight: 1.35 }}>
                    {news.korTitle || news.title || '제목 없음'}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#ccc', marginBottom: '0.4rem' }}>
                    {news.displayDate}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.78rem', background: 'rgba(255,140,66,0.18)', color: '#ff8c42', padding: '0.2rem 0.6rem', borderRadius: 14 }}>
                      {news.type}
                    </span>
                    <span style={{ fontSize: '0.78rem', color: getPriorityColorLocal(news.priority), fontWeight: 'bold' }}>
                      {news.priority === 'high' ? '높음' : news.priority === 'medium' ? '보통' : '낮음'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: '#b0b0b0', fontSize: '1.05rem', lineHeight: 1.35, padding: '1.5rem', marginTop: '55%' }}>
              {hasSelectedRange ? 
                '선택된 날짜 범위에는 뉴스가 없습니다.' :
                '캘린더에서 날짜를 드래그하여 뉴스를 확인하세요.'
              }
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
