import React, { useEffect, useMemo, useRef, useState } from "react";
import { fetchSalesReportHtml, fetchSalesReports, uploadSalesReport } from "../../../api/salesApi";
import { getAuthUser, isAdminUser } from "../../../utils/auth";

const SalesPage = () => {
  const [authUser, setAuthUser] = useState(() => getAuthUser());
  const isAdmin = useMemo(() => isAdminUser(authUser), [authUser]);

  const [reports, setReports] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loadingList, setLoadingList] = useState(false);
  const [loadingHtml, setLoadingHtml] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);

  const iframeRef = useRef(null);
  const [html, setHtml] = useState("");

  useEffect(() => {
    const update = () => setAuthUser(getAuthUser());
    update();
    window.addEventListener("authchange", update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener("authchange", update);
      window.removeEventListener("storage", update);
    };
  }, []);

  const loadList = async () => {
    setLoadingList(true);
    setError("");
    try {
      const list = await fetchSalesReports();
      const normalized = Array.isArray(list) ? list : [];
      setReports(normalized);
      if (!selectedId && normalized.length) {
        setSelectedId(normalized[0].id);
      }
    } catch (e) {
      setError(e?.message || "리포트 목록을 불러오지 못했습니다.");
      setReports([]);
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    if (!isAdmin) return;
    loadList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin]);

  useEffect(() => {
    if (!isAdmin) return;
    if (!selectedId) return;
    let mounted = true;
    setLoadingHtml(true);
    setError("");
    setHtml("");
    fetchSalesReportHtml(selectedId)
      .then((text) => {
        if (!mounted) return;
        setHtml(String(text || ""));
      })
      .catch((e) => {
        if (!mounted) return;
        setError(e?.message || "시각화 페이지를 불러오지 못했습니다.");
      })
      .finally(() => {
        if (!mounted) return;
        setLoadingHtml(false);
      });
    return () => {
      mounted = false;
    };
  }, [selectedId, isAdmin]);

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const created = await uploadSalesReport({ file, title: title.trim() });
      setTitle("");
      setFile(null);
      await loadList();
      if (created?.id) setSelectedId(created.id);
      window.dispatchEvent(new CustomEvent("app-toast", { detail: { message: "업로드되었습니다.", type: "success" } }));
    } catch (e) {
      setError(e?.message || "업로드에 실패했습니다.");
    } finally {
      setUploading(false);
    }
  };

  const selected = reports.find((r) => r.id === selectedId) || null;
  const selectedTitle = selected ? (selected.title || selected.fileName || `Report #${selected.id}`) : "Sales Report";

  const normalizePdfTitle = (value) => {
    const raw = String(value || "Sales Report").trim();
    const withoutBadChars = raw.replace(/[\\/:*?"<>|]/g, "-");
    return withoutBadChars.slice(0, 120) || "Sales Report";
  };

  const handleSavePdf = () => {
    const iframe = iframeRef.current;
    const win = iframe?.contentWindow;
    const doc = iframe?.contentDocument;
    if (!iframe || !win || !doc) {
      window.dispatchEvent(
        new CustomEvent("app-toast", {
          detail: { message: "PDF 저장을 위해 미리보기를 먼저 불러와주세요.", type: "info" },
        }),
      );
      return;
    }
    if (!html || loadingHtml) {
      window.dispatchEvent(
        new CustomEvent("app-toast", {
          detail: { message: "시각화 페이지 로딩이 끝난 후 다시 시도해주세요.", type: "info" },
        }),
      );
      return;
    }

    const nextTitle = normalizePdfTitle(selectedTitle);
    const prevTitle = doc.title;
    try {
      doc.title = nextTitle;
      win.focus();
      win.print();
    } finally {
      // Restore title after print dialog opens.
      window.setTimeout(() => {
        try {
          doc.title = prevTitle;
        } catch {
          // ignore
        }
      }, 1000);
    }
  };

  if (!isAdmin) {
    return (
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "2rem 1.2rem",
          boxSizing: "border-box",
          textAlign: "center",
          color: "#ff8c42",
        }}
      >
        권한이 없습니다.
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: 1400,
        margin: "0 auto",
        padding: "1.5rem 1.2rem",
        boxSizing: "border-box",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
        <h1 style={{ color: "#ff8c42", margin: 0 }}>Sales</h1>
        <div style={{ color: "#b0b0b0", fontSize: "0.95rem" }}>
          Raw Excel 업로드 → 시각화 페이지(HTML) 생성/조회
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: "1rem", marginTop: "1rem" }}>
        {/* Sidebar */}
        <div
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: "18px",
            padding: "1rem",
            backdropFilter: "blur(10px)",
            height: "calc(100vh - 180px)",
            overflow: "auto",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.6rem", marginBottom: "0.8rem" }}>
            <div style={{ color: "#d9e7ef", fontWeight: 800 }}>Reports</div>
            <button
              type="button"
              onClick={loadList}
              disabled={loadingList}
              style={{
                background: "transparent",
                border: "1px solid rgba(255, 140, 66, 0.35)",
                color: "white",
                padding: "0.25rem 0.6rem",
                borderRadius: "10px",
                cursor: loadingList ? "not-allowed" : "pointer",
                opacity: loadingList ? 0.6 : 1,
              }}
            >
              새로고침
            </button>
          </div>

          <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "14px", padding: "0.8rem", marginBottom: "1rem" }}>
            <div style={{ color: "#ffb86b", fontWeight: 800, marginBottom: "0.5rem" }}>업로드</div>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="리포트 제목(선택)"
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "0.6rem 0.7rem",
                borderRadius: "12px",
                border: "1px solid rgba(255,255,255,0.14)",
                background: "rgba(10,10,20,0.55)",
                color: "white",
                outline: "none",
                marginBottom: "0.6rem",
              }}
            />
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              style={{ width: "100%", color: "#d0d0d0" }}
            />
            <button
              type="button"
              onClick={handleUpload}
              disabled={!file || uploading}
              style={{
                width: "100%",
                marginTop: "0.7rem",
                padding: "0.7rem 0.9rem",
                borderRadius: "14px",
                border: "none",
                background: "linear-gradient(135deg, #ff8c42, #ffa726)",
                color: "white",
                fontWeight: 800,
                cursor: !file || uploading ? "not-allowed" : "pointer",
                opacity: !file || uploading ? 0.6 : 1,
              }}
            >
              {uploading ? "업로드 중..." : "업로드"}
            </button>
            <div style={{ marginTop: "0.6rem", color: "#b0b0b0", fontSize: "0.82rem", lineHeight: 1.35 }}>
              .xlsx 파일만 업로드 가능합니다. <br />
              업로드된 리포트는 모든 ADMIN 유저가 조회할 수 있어요.
            </div>
          </div>

          {loadingList && <div style={{ color: "#b0b0b0" }}>목록 불러오는 중...</div>}
          {!loadingList && reports.length === 0 && (
            <div style={{ color: "#b0b0b0" }}>등록된 리포트가 없습니다.</div>
          )}

          <div style={{ display: "grid", gap: "0.6rem" }}>
            {reports.map((r) => {
              const active = r.id === selectedId;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setSelectedId(r.id)}
                  style={{
                    textAlign: "left",
                    width: "100%",
                    background: active ? "rgba(255, 140, 66, 0.20)" : "rgba(255,255,255,0.04)",
                    border: active ? "1px solid rgba(255, 140, 66, 0.45)" : "1px solid rgba(255,255,255,0.10)",
                    borderRadius: "14px",
                    padding: "0.75rem 0.8rem",
                    cursor: "pointer",
                    color: "white",
                  }}
                >
                  <div style={{ fontWeight: 800, color: "white", marginBottom: "0.2rem" }}>
                    {r.title || r.fileName || `Report #${r.id}`}
                  </div>
                  <div style={{ color: "#b0b0b0", fontSize: "0.82rem" }}>
                    {(r.createdAt || "").toString().slice(0, 19).replace("T", " ") || "—"}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main */}
        <div
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: "18px",
            padding: "1rem",
            backdropFilter: "blur(10px)",
            height: "calc(100vh - 180px)",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            gap: "0.8rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.8rem", flexWrap: "wrap" }}>
            <div style={{ color: "#d9e7ef", fontWeight: 800 }}>
              {selected ? selectedTitle : "시각화"}
            </div>
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
              <button
                type="button"
                onClick={handleSavePdf}
                disabled={!selectedId || loadingHtml || !html}
                style={{
                  background: "transparent",
                  border: "1px solid rgba(255, 140, 66, 0.35)",
                  color: "white",
                  padding: "0.35rem 0.7rem",
                  borderRadius: "12px",
                  cursor: !selectedId || loadingHtml || !html ? "not-allowed" : "pointer",
                  opacity: !selectedId || loadingHtml || !html ? 0.6 : 1,
                  fontWeight: 800,
                  whiteSpace: "nowrap",
                }}
              >
                PDF 저장
              </button>
              <div style={{ color: "#b0b0b0", fontSize: "0.85rem" }}>
                {selected ? (selected.createdByName || selected.createdByEmail || "") : ""}
              </div>
            </div>
          </div>

          {error && (
            <div style={{ color: "#ff8c42", background: "rgba(255,140,66,0.08)", border: "1px solid rgba(255,140,66,0.18)", borderRadius: "14px", padding: "0.8rem" }}>
              {error}
            </div>
          )}

          {!selectedId && !loadingList && (
            <div style={{ flex: 1, display: "grid", placeItems: "center", color: "#b0b0b0" }}>
              왼쪽에서 리포트를 선택하거나 업로드하세요.
            </div>
          )}

          {selectedId && (
            <div style={{ flex: 1, borderRadius: "14px", border: "1px solid rgba(255,255,255,0.10)", overflow: "hidden", background: "rgba(10,10,20,0.35)" }}>
              {loadingHtml && (
                <div style={{ padding: "1rem", color: "#b0b0b0" }}>
                  시각화 페이지를 불러오는 중...
                </div>
              )}
              {!loadingHtml && html && (
                <iframe
                  ref={iframeRef}
                  title="Sales visualization"
                  style={{ width: "100%", height: "100%", border: "none", background: "white" }}
                  srcDoc={html}
                />
              )}
              {!loadingHtml && !html && (
                <div style={{ padding: "1rem", color: "#b0b0b0" }}>
                  표시할 페이지가 없습니다.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SalesPage;
