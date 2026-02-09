import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { getAuthToken } from "../utils/auth";
import { isScrapped, toggleScrap } from "../utils/scrapStorage";
import ScrapCommentModal from "./ScrapCommentModal";

const ScrapStarButton = ({ article, size = 18, style = {}, onChange }) => {
  const [scrapped, setScrapped] = useState(() => isScrapped(article));
  const [commentOpen, setCommentOpen] = useState(false);
  const [comment, setComment] = useState("");
  const wrapperRef = useRef(null);
  const tooltipRef = useRef(null);
  const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 });

  const showToast = (message, type = "info") => {
    try {
      window.dispatchEvent(new CustomEvent("app-toast", { detail: { message, type } }));
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    const update = () => setScrapped(isScrapped(article));
    update();
    window.addEventListener("scrapchange", update);
    return () => window.removeEventListener("scrapchange", update);
  }, [article]);

  const canScrap = Boolean(article?.id || article?.rawNewsId);
  const [hovered, setHovered] = useState(false);
  const isLoggedIn = Boolean(getAuthToken());

  useLayoutEffect(() => {
    if (!hovered || isLoggedIn) return;
    const rect = wrapperRef.current?.getBoundingClientRect?.();
    if (!rect) return;
    setTooltipPos({ top: rect.bottom + 8, left: rect.left + rect.width / 2 });
  }, [hovered, isLoggedIn]);

  useLayoutEffect(() => {
    if (!hovered || isLoggedIn) return;
    const rect = wrapperRef.current?.getBoundingClientRect?.();
    const tip = tooltipRef.current;
    if (!rect || !tip) return;

    const nextTop = rect.bottom + 8;
    let nextLeft = rect.left + rect.width / 2;
    const half = tip.offsetWidth / 2;
    const minLeft = 8 + half;
    const maxLeft = window.innerWidth - 8 - half;
    nextLeft = Math.min(Math.max(nextLeft, minLeft), maxLeft);

    setTooltipPos((prev) => (prev.top === nextTop && prev.left === nextLeft ? prev : { top: nextTop, left: nextLeft }));
  }, [tooltipPos.top, tooltipPos.left, hovered, isLoggedIn]);

  useEffect(() => {
    if (!hovered || isLoggedIn) return undefined;
    const update = () => {
      const rect = wrapperRef.current?.getBoundingClientRect?.();
      if (!rect) return;
      setTooltipPos({ top: rect.bottom + 8, left: rect.left + rect.width / 2 });
    };
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [hovered, isLoggedIn]);

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
    if (!scrapped) {
      setComment("");
      setCommentOpen(true);
      return;
    }
    try {
      const next = await toggleScrap(article);
      setScrapped(next);
      onChange?.(next);
      showToast("스크랩이 해제되었습니다.", "info");
    } catch {
      window.alert("스크랩 처리에 실패했습니다.");
    }
  };

  const handleSaveComment = async () => {
    try {
      const next = await toggleScrap(article, { comment });
      setScrapped(next);
      onChange?.(next);
      setCommentOpen(false);
      setComment("");
      if (next) {
        showToast("스크랩되었습니다.", "success");
      }
    } catch {
      window.alert("스크랩 처리에 실패했습니다.");
    }
  };

  return (
    <div
      ref={wrapperRef}
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        ...style,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
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
        }}
      >
        {scrapped ? "★" : "☆"}
      </button>

      {!isLoggedIn &&
        hovered &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            ref={tooltipRef}
            style={{
              position: "fixed",
              top: tooltipPos.top,
              left: tooltipPos.left,
              transform: "translateX(-50%)",
              background: "rgba(20, 20, 20, 0.95)",
              color: "#ffcc80",
              padding: "6px 10px",
              borderRadius: "8px",
              fontSize: "0.75rem",
              whiteSpace: "nowrap",
              border: "1px solid rgba(255, 140, 66, 0.35)",
              boxShadow: "0 6px 18px rgba(0,0,0,0.35)",
              zIndex: 20000,
              pointerEvents: "none",
            }}
          >
            로그인 후 이용해주세요.
          </div>,
          document.body,
        )}

      <ScrapCommentModal
        isOpen={commentOpen}
        value={comment}
        onChange={setComment}
        onClose={() => setCommentOpen(false)}
        onSave={handleSaveComment}
      />
    </div>
  );
};

export default ScrapStarButton;
