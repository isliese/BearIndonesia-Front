// 상단 액션 컴포넌트

import React, { useState } from "react";

const NewsTopActions = ({
  wcStartDate,
  wcEndDate,
  setWcStartDate,
  setWcEndDate,
  onGenerateWordCloud,
  wordCloudLoading,
  excelYear,
  excelMonth,
  setExcelYear,
  setExcelMonth,
  onDownloadExcel,
  newsletterYear,
  newsletterMonth,
  setNewsletterYear,
  setNewsletterMonth,
}) => {
  const [isWcHover, setIsWcHover] = useState(false);
  const [isExcelHover, setIsExcelHover] = useState(false);
  const [isNewsletterHover, setIsNewsletterHover] = useState(false);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        gap: "1rem",
        marginBottom: "2rem",
        flexWrap: "wrap",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          alignItems: "center",
          background: "rgba(100, 181, 246, 0.1)",
          padding: "0.5rem 1rem",
          borderRadius: "50px",
          border: "1px solid rgba(100, 181, 246, 0.3)",
        }}
      >
        <input
          type="date"
          value={wcStartDate}
          onChange={(e) => setWcStartDate(e.target.value)}
          style={{
            background: "rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: "8px",
            padding: "0.4rem",
            color: "white",
            fontSize: "0.85rem",
          }}
        />
        <span style={{ color: "white" }}>~</span>
        <input
          type="date"
          value={wcEndDate}
          onChange={(e) => setWcEndDate(e.target.value)}
          style={{
            background: "rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: "8px",
            padding: "0.4rem",
            color: "white",
            fontSize: "0.85rem",
          }}
        />
        <div style={{ position: "relative", display: "inline-flex" }}>
          <button
            onClick={onGenerateWordCloud}
            disabled={wordCloudLoading}
            onMouseEnter={() => setIsWcHover(true)}
            onMouseLeave={() => setIsWcHover(false)}
            style={{
              background: isWcHover ? "rgba(100, 181, 246, 0.22)" : "transparent",
              border: "1px solid rgba(100, 181, 246, 0.35)",
              color: "white",
              cursor: wordCloudLoading ? "not-allowed" : "pointer",
              fontSize: "0.9rem",
              fontWeight: "bold",
              opacity: wordCloudLoading ? 0.6 : 1,
              padding: "0.35rem 0.9rem",
              borderRadius: "999px",
              transition: "transform 0.15s ease, background 0.2s ease, box-shadow 0.2s ease",
              boxShadow: isWcHover ? "0 6px 14px rgba(100, 181, 246, 0.25)" : "none",
              transform: isWcHover ? "translateY(-1px)" : "translateY(0)",
            }}
          >
            {wordCloudLoading ? "로딩 중..." : "워드클라우드 생성"}
          </button>
          {isWcHover && !wordCloudLoading && (
            <div
              style={{
                position: "absolute",
                bottom: "140%",
                left: "50%",
                transform: "translateX(-50%)",
                background: "rgba(15, 23, 42, 0.92)",
                color: "white",
                padding: "0.5rem 0.7rem",
                borderRadius: "8px",
                fontSize: "0.75rem",
                lineHeight: 1.3,
                whiteSpace: "nowrap",
                border: "1px solid rgba(148, 163, 184, 0.35)",
                boxShadow: "0 10px 24px rgba(0,0,0,0.25)",
                zIndex: 1,
              }}
            >
              기간을 너무 좁게 설정하면 단어 개수가 적어질 수 있습니다.
            </div>
          )}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          alignItems: "center",
          background: "rgba(76, 175, 80, 0.1)",
          padding: "0.5rem 1rem",
          borderRadius: "50px",
          border: "1px solid rgba(76, 175, 80, 0.3)",
        }}
      >
        <select
          value={excelYear}
          onChange={(e) => setExcelYear(Number(e.target.value))}
          style={{
            background: "rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: "8px",
            padding: "0.4rem",
            color: "white",
            fontSize: "0.85rem",
          }}
        >
          {[2024, 2025, 2026].map((year) => (
            <option key={year} value={year} style={{ background: "#1a1a2e" }}>
              {year}년
            </option>
          ))}
        </select>
        <select
          value={excelMonth}
          onChange={(e) => setExcelMonth(Number(e.target.value))}
          style={{
            background: "rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: "8px",
            padding: "0.4rem",
            color: "white",
            fontSize: "0.85rem",
          }}
        >
          {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
            <option key={month} value={month} style={{ background: "#1a1a2e" }}>
              {month}월
            </option>
          ))}
        </select>
        <button
          onClick={onDownloadExcel}
          onMouseEnter={() => setIsExcelHover(true)}
          onMouseLeave={() => setIsExcelHover(false)}
          style={{
            background: isExcelHover ? "rgba(76, 175, 80, 0.22)" : "transparent",
            border: "1px solid rgba(76, 175, 80, 0.35)",
            color: "white",
            cursor: "pointer",
            fontSize: "0.9rem",
            fontWeight: "bold",
            padding: "0.35rem 0.9rem",
            borderRadius: "999px",
            transition: "transform 0.15s ease, background 0.2s ease, box-shadow 0.2s ease",
            boxShadow: isExcelHover ? "0 6px 14px rgba(76, 175, 80, 0.25)" : "none",
            transform: isExcelHover ? "translateY(-1px)" : "translateY(0)",
          }}
        >
          Excel 다운로드
        </button>
      </div>

      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          alignItems: "center",
          background: "rgba(255, 140, 66, 0.1)",
          padding: "0.5rem 1rem",
          borderRadius: "50px",
          border: "1px solid rgba(255, 140, 66, 0.35)",
        }}
      >
        <select
          value={newsletterYear}
          onChange={(e) => setNewsletterYear(Number(e.target.value))}
          style={{
            background: "rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: "8px",
            padding: "0.4rem",
            color: "white",
            fontSize: "0.85rem",
          }}
        >
          {[2024, 2025, 2026].map((year) => (
            <option key={year} value={year} style={{ background: "#1a1a2e" }}>
              {year}년
            </option>
          ))}
        </select>
        <select
          value={newsletterMonth}
          onChange={(e) => setNewsletterMonth(Number(e.target.value))}
          style={{
            background: "rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: "8px",
            padding: "0.4rem",
            color: "white",
            fontSize: "0.85rem",
          }}
        >
          {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
            <option key={month} value={month} style={{ background: "#1a1a2e" }}>
              {month}월
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => alert("현재 개발중인 기능입니다.")}
          onMouseEnter={() => setIsNewsletterHover(true)}
          onMouseLeave={() => setIsNewsletterHover(false)}
          style={{
            background: isNewsletterHover ? "rgba(255, 140, 66, 0.22)" : "transparent",
            border: "1px solid rgba(255, 140, 66, 0.45)",
            color: "white",
            cursor: "pointer",
            fontSize: "0.9rem",
            fontWeight: "bold",
            padding: "0.35rem 0.9rem",
            borderRadius: "999px",
            transition: "transform 0.15s ease, background 0.2s ease, box-shadow 0.2s ease",
            boxShadow: isNewsletterHover ? "0 6px 14px rgba(255, 140, 66, 0.25)" : "none",
            transform: isNewsletterHover ? "translateY(-1px)" : "translateY(0)",
          }}
        >
          Newsletter 보러가기
        </button>
      </div>
    </div>
  );
};

export default NewsTopActions;
