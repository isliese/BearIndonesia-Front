import React, { useEffect, useState } from "react";
import { getAuthToken } from "../utils/auth";
import { isScrapped, toggleScrap } from "../utils/scrapStorage";

const ScrapStarButton = ({ article, size = 18, style = {}, onChange }) => {
  const [scrapped, setScrapped] = useState(() => isScrapped(article));

  useEffect(() => {
    const update = () => setScrapped(isScrapped(article));
    update();
    window.addEventListener("scrapchange", update);
    return () => window.removeEventListener("scrapchange", update);
  }, [article]);

  const canScrap = Boolean(article?.id || article?.rawNewsId);
  const handleClick = async (e) => {
    e.stopPropagation();
    if (!getAuthToken()) {
      window.alert("로그인 후 스크랩할 수 있어요.");
      return;
    }
    if (!canScrap) {
      window.alert("이 기사는 스크랩할 수 없어요.");
      return;
    }
    try {
      const next = await toggleScrap(article);
      setScrapped(next);
      onChange?.(next);
    } catch {
      window.alert("스크랩 처리에 실패했습니다.");
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={!canScrap}
      aria-pressed={scrapped}
      title={scrapped ? "스크랩 해제" : "스크랩"}
      style={{
        background: "rgba(0, 0, 0, 0.25)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        borderRadius: "999px",
        width: size + 12,
        height: size + 12,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: canScrap ? "pointer" : "not-allowed",
        color: scrapped ? "#f6d365" : "#9aa0a6",
        fontSize: size,
        textShadow: scrapped ? "0 0 6px rgba(246, 211, 101, 0.6)" : "none",
        opacity: canScrap ? 1 : 0.5,
        transition: "all 0.2s ease",
        ...style,
      }}
    >
      {scrapped ? "★" : "☆"}
    </button>
  );
};

export default ScrapStarButton;
