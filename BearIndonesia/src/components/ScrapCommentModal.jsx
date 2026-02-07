import React, { useEffect, useRef } from "react";

const MAX_LEN = 300;

const ScrapCommentModal = ({ isOpen, value, onChange, onClose, onSave }) => {
  const textareaRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    const id = setTimeout(() => textareaRef.current?.focus?.(), 0);
    return () => clearTimeout(id);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;
  const safeValue = String(value ?? "");
  const len = safeValue.length;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2000,
        padding: "1rem",
        boxSizing: "border-box",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(560px, 100%)",
          background: "linear-gradient(135deg, rgba(30, 30, 40, 0.96), rgba(20, 20, 30, 0.96))",
          border: "1px solid rgba(255, 140, 66, 0.28)",
          borderRadius: "18px",
          padding: "1.25rem",
          boxShadow: "0 20px 60px rgba(0,0,0,0.45)",
        }}
        role="dialog"
        aria-modal="true"
        aria-label="스크랩 코멘트"
      >
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "0.75rem" }}>
          <div style={{ color: "white", fontWeight: 700, fontSize: "1.1rem" }}>코멘트 작성</div>
          <div style={{ color: "#b0b0b0", fontSize: "0.9rem" }}>
            ({len}/{MAX_LEN})
          </div>
        </div>

        <div style={{ marginTop: "0.9rem" }}>
          <textarea
            ref={textareaRef}
            value={safeValue}
            onChange={(e) => onChange?.(e.target.value.slice(0, MAX_LEN))}
            placeholder="스크랩할 때 남겨둘 메모를 적어주세요 (최대 300자)"
            rows={5}
            style={{
              width: "100%",
              resize: "none",
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.14)",
              borderRadius: "12px",
              padding: "0.9rem",
              color: "white",
              outline: "none",
              lineHeight: 1.5,
              boxSizing: "border-box",
            }}
          />
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.6rem", marginTop: "1rem" }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.18)",
              color: "white",
              padding: "0.6rem 0.9rem",
              borderRadius: "12px",
              cursor: "pointer",
            }}
          >
            취소
          </button>
          <button
            type="button"
            onClick={onSave}
            style={{
              background: "linear-gradient(135deg, #ff8c42, #ffa726)",
              border: "none",
              color: "white",
              padding: "0.6rem 0.95rem",
              borderRadius: "12px",
              cursor: "pointer",
              fontWeight: 700,
            }}
          >
            스크랩 저장
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScrapCommentModal;
