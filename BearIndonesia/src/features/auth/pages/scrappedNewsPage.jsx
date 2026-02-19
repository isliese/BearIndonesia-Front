import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ScrapStarButton from "../../../components/ScrapStarButton";
import { getAuthUser } from "../../../utils/auth";
import { fetchScraps } from "../../../api/scrapApi";
import { syncScrapList } from "../../../utils/scrapStorage";

const ScrappedNewsPage = ({ setSelectedNews }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrapped, setScrapped] = useState([]);
  const user = getAuthUser();

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const list = await syncScrapList();
        if (active) setScrapped(list);
      } catch {
        if (active) setScrapped([]);
      }
    };
    load();
    const refresh = async () => {
      if (!active) return;
      try {
        const list = await fetchScraps();
        if (active) setScrapped(Array.isArray(list) ? list : []);
      } catch {
        if (active) setScrapped([]);
      }
    };
    window.addEventListener("scrapchange", refresh);
    return () => {
      active = false;
      window.removeEventListener("scrapchange", refresh);
    };
  }, []);

  if (!user) {
    return (
      <div style={pageContainerStyle}>
        <div style={cardStyle}>
          <h2 style={{ color: "#ff8c42", marginBottom: "0.6rem" }}>로그인이 필요합니다</h2>
          <p style={{ color: "#b0b0b0", marginBottom: "1.6rem" }}>
            스크랩한 기사를 보려면 로그인해주세요.
          </p>
          <button
            type="button"
            onClick={() => navigate("/login", { state: { from: location.pathname } })}
            style={primaryButtonStyle}
          >
            로그인하러 가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem 1rem", minHeight: "calc(100vh - 80px)" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <h1
          style={{
            fontSize: "clamp(1.36rem, 1.7vw, 1.65rem)",
            color: "#ff8c42",
            textAlign: "center",
            marginTop: 0,
            marginBottom: "0.5rem",
            paddingTop: "0.2rem",
          }}
        >
          Scrap
        </h1>
        <div style={{
          background: "rgba(255, 255, 255, 0.08)",
          borderRadius: "20px",
          padding: "2rem",
          border: "1px solid rgba(255, 140, 66, 0.2)"
        }}>
          <h2 style={{ color: "#ff8c42", marginBottom: "0.4rem" }}>스크랩한 기사</h2>
          <p style={{ color: "#b0b0b0", marginBottom: "1.6rem" }}>
            저장한 뉴스 {scrapped.length}개
          </p>

          {scrapped.length === 0 ? (
            <div style={{
              textAlign: "center",
              color: "#b0b0b0",
              padding: "3rem 1rem",
              borderRadius: "16px",
              background: "rgba(255, 255, 255, 0.04)"
            }}>
              아직 스크랩한 기사가 없습니다.
            </div>
          ) : (
            <div style={{ display: "grid", gap: "1rem" }}>
              {scrapped.map((item) => (
                <div
                  key={item.key || item.id}
                  onClick={() => {
                    setSelectedNews?.(item);
                    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
                    navigate("/news/detail", { state: { from: location.pathname } });
                  }}
                  style={{
                    position: "relative",
                    background: "rgba(255, 255, 255, 0.08)",
                    borderRadius: "16px",
                    padding: "1.2rem",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    cursor: "pointer",
                    transition: "all 0.2s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 8px 20px rgba(255, 140, 66, 0.2)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "none";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <ScrapStarButton article={item} size={18} style={{ position: "absolute", top: 12, left: 12 }} />

                  <div style={{ color: "#d0d0d0", fontSize: "0.85rem", marginBottom: "0.3rem", paddingLeft: "1.75rem" }}>
                    {item.source || "출처 미상"} · {item.date || "날짜 없음"}
                  </div>
                  <div style={{ fontSize: "1.05rem", fontWeight: 600, color: "white", marginBottom: "0.5rem", marginTop: "0.75rem" }}>
                    {item.korTitle || item.title || "제목 없음"}
                  </div>
                  {item?.comment ? (
                    <div
                      style={{
                        marginTop: "0.75rem",
                        background: "rgba(255, 255, 255, 0.05)",
                        border: "1px solid rgba(255, 255, 255, 0.10)",
                        borderRadius: "12px",
                        padding: "0.85rem",
                        color: "#d9e7ef",
                        lineHeight: 1.55,
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      <div style={{ color: "#ff8c42", fontWeight: 700, marginBottom: "0.35rem", fontSize: "0.9rem" }}>
                        내 코멘트
                      </div>
                      {String(item.comment).slice(0, 300)}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const pageContainerStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "calc(100vh - 80px)",
  padding: "2rem",
};

const cardStyle = {
  width: "100%",
  maxWidth: "640px",
  background: "rgba(255, 255, 255, 0.1)",
  backdropFilter: "blur(10px)",
  borderRadius: "20px",
  border: "1px solid rgba(255, 140, 66, 0.2)",
  padding: "2.2rem",
  boxShadow: "0 12px 32px rgba(0, 0, 0, 0.25)",
};

const primaryButtonStyle = {
  padding: "0.9rem 1rem",
  background: "linear-gradient(135deg, #ff8c42, #ffa726)",
  border: "none",
  borderRadius: "12px",
  color: "white",
  cursor: "pointer",
  fontSize: "1rem",
  fontWeight: "600",
  width: "100%",
};

export default ScrappedNewsPage;
