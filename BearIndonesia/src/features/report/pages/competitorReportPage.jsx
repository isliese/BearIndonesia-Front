import React, { useEffect, useMemo, useState } from "react";
import { fetchCompetitorReport } from "../../../api/reportApi";

const MAJOR_COMPETITORS = ["Kalbe Farma", "Kimia Farma", "Indofarma", "Bio Farma"];
const OTHER_COMPETITORS = ["Dexa Medica", "Sanbe Farma", "Tempo Scan Pacific", "Phapros"];
const PRESET_KEYWORDS = [...MAJOR_COMPETITORS, ...OTHER_COMPETITORS];
const DEFAULT_DAYS = 30;
const ISSUE_TOP_COUNT = 8;
const formatDateInput = (date) => date.toISOString().slice(0, 10);
const TODAY_DATE = formatDateInput(new Date());
const KEYWORD_GENERIC_BLOCKLIST = new Set([
  "의약품", "의약", "약품", "제약", "제약사", "제약 회사", "제약회사", "제약 산업", "제약산업",
  "산업", "시장", "회사", "기업", "제품", "신약", "임상", "규제", "정책", "정부", "의료",
  "헬스케어", "바이오", "원료", "수입", "국내", "글로벌",
  "있습니다", "밝혔습니다", "이러한", "관련", "통해", "대해", "기준", "중심", "위해", "에서",
  "대한", "또한", "이번", "최근", "가능성", "확인", "분석", "예상", "추진", "계획",
  "pt", "tbk", "persero", "farma",
  "pharmaceutical", "pharma", "industry", "market", "company", "companies", "product", "medicine", "drug",
]);

const normalizeKeywordToken = (value = "") => {
  return String(value)
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
};

const isGenericKeyword = (keyword = "") => {
  const normalized = normalizeKeywordToken(keyword);
  if (!normalized) return true;
  if (normalized.length < 3) return true;
  if (normalized.endsWith("습니다")) return true;
  if (/\b(pt|tbk|persero)\b/.test(normalized)) return true;
  return KEYWORD_GENERIC_BLOCKLIST.has(normalized);
};
const cleanSummaryText = (value = "") => {
  return String(value)
    .replace(/\*\*/g, "")
    .replace(/^[-*]\s+/gm, "")
    .replace(/\s+/g, " ")
    .replace(/^\s*(trend\s*summary|summary|요약)\s*[:：-]\s*/i, "")
    .replace(/\(([A-Z]{2,6})\)/g, "")
    .replace(/\s*-\s*[^-]{0,40}\?\s*$/g, "")
    .trim();
};

const toShortSentence = (value = "", maxLength = 120) => {
  const cleaned = cleanSummaryText(value);
  if (!cleaned) return "";
  const parts = cleaned.split(/[.!?。！？\n]/).map((s) => s.trim()).filter(Boolean);
  const first = parts[0] || cleaned;
  if (first.length <= maxLength) return first;
  return `${first.slice(0, maxLength).trim()}...`;
};

const normalizeIssueLine = (value = "") => {
  let text = cleanSummaryText(value)
    .replace(/\s+/g, " ")
    .replace(/(그리고|및|또는|등)\s*$/u, "")
    .trim();

  if (!text) return "";

  text = toShortSentence(text, 120).replace(/[.!?]+$/g, "").trim();

  const looksNounLike =
    text.length < 20 ||
    /^[A-Za-z0-9\s.&,\-()/]+$/.test(text) ||
    /^(PT|CV|TBK)\b/i.test(text);

  if (looksNounLike) {
    return "";
  }

  if (/(습니다|입니다|됩니다|되었습니다|했다|하였다|나타났다|확인됐다|발표됐다)$/u.test(text)) {
    if (/다$/u.test(text) && !/습니다$/u.test(text)) {
      return `${text.slice(0, -1)}습니다.`;
    }
    return `${text}.`;
  }

  return `${text} 이슈가 확인되었습니다.`;
};

const isLowQualityIssueLine = (value = "") => {
  const text = cleanSummaryText(value).replace(/[.!?]+$/g, "").trim();
  if (!text) return true;
  if (text.length < 22) return true;
  if (/^(PT|CV|TBK)\b\.?/i.test(text)) return true;
  if (/^[A-Za-z0-9\s.&,\-()/]+$/.test(text)) return true;
  if (/주식 소유자는 누구|설립된|what is|who owns/i.test(text)) return true;
  return false;
};

const CATEGORY_CONFIG = [
  {
    id: "investment",
    label: "투자 및 자본시장",
    keywordLabel: "투자 관련",
    patterns: [/투자|주가|매수|외국인|수급|증권사|목표가|자사주|모멘텀|capital market|brokerage|buy/i],
    interpretation: "시장 내 투자 관심도 상승",
    strategy: "자본시장 중심의 흐름이 이어지고 있습니다",
  },
  {
    id: "ma",
    label: "M&A 및 합병",
    keywordLabel: "M&A 관련",
    patterns: [/합병|인수|m&a|acquisition|merger|포트폴리오|외형 성장/i],
    interpretation: "사업 확장 전략 강화",
    strategy: "확장 전략 중심의 움직임이 관찰됩니다",
  },
  {
    id: "product",
    label: "제품·신약·임상",
    keywordLabel: "제품 관련",
    patterns: [/의약품|신약|제품|임상|pipeline|drug|medicine|launch/i],
    interpretation: "제품 경쟁력 확대",
    strategy: "제품 및 연구개발 중심의 흐름이 두드러집니다",
  },
  {
    id: "regulation",
    label: "규제 및 정책",
    keywordLabel: "규제 관련",
    patterns: [/규제|정책|정부|승인|허가|bpom|moh|compliance|policy|approval/i],
    interpretation: "규제 환경 변화 대응",
    strategy: "정책 환경 변화에 따른 영향이 감지됩니다",
  },
];

const countDaysInclusive = (start, end) => {
  const s = new Date(start);
  const e = new Date(end);
  if (Number.isNaN(s.getTime()) || Number.isNaN(e.getTime())) return DEFAULT_DAYS;
  const diff = Math.floor((e - s) / (1000 * 60 * 60 * 24)) + 1;
  return Math.max(1, diff);
};

const detectTopCategory = (mentions = [], articles = []) => {
  const scores = {};
  CATEGORY_CONFIG.forEach((c) => { scores[c.id] = 0; });

  mentions.forEach((m) => {
    const text = String(m?.tag || "").toLowerCase();
    const weight = Number(m?.count || 1);
    CATEGORY_CONFIG.forEach((c) => {
      if (c.patterns.some((p) => p.test(text))) scores[c.id] += weight;
    });
  });

  articles.slice(0, 8).forEach((a) => {
    const text = cleanSummaryText([a?.korSummary, a?.idSummary, a?.korTitle, a?.title].filter(Boolean).join(" ")).toLowerCase();
    CATEGORY_CONFIG.forEach((c) => {
      if (c.patterns.some((p) => p.test(text))) scores[c.id] += 1;
    });
  });

  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const top = sorted[0]?.[0] || "investment";
  return CATEGORY_CONFIG.find((c) => c.id === top) || CATEGORY_CONFIG[0];
};

const buildNarrativeSummary = ({
  keyword,
  mentions,
  articles,
  total,
  startDate,
  endDate,
}) => {
  const topCategory = detectTopCategory(mentions || [], articles || []);
  const totalArticles = Number(total?.count || (articles?.length || 0));
  const totalMentionCount = (mentions || []).reduce((sum, m) => sum + Number(m?.count || 0), 0);
  const categoryMentionCount = (mentions || []).reduce((sum, m) => {
    const tag = String(m?.tag || "").toLowerCase();
    const matched = topCategory.patterns.some((p) => p.test(tag));
    return sum + (matched ? Number(m?.count || 0) : 0);
  }, 0);
  const ratioBase = totalMentionCount > 0 ? totalMentionCount : Math.max(1, totalArticles);
  const ratio = Math.max(0, Math.round((categoryMentionCount / ratioBase) * 100));

  const keywordTokens = (mentions || [])
    .slice()
    .sort((a, b) => Number(b?.count || 0) - Number(a?.count || 0))
    .map((m) => m?.tag)
    .filter(Boolean)
    .slice(0, 2);

  const periodDays = countDaysInclusive(startDate, endDate);
  const lines = [];
  if (totalArticles === 0) {
    return `${keyword}는 최근 ${periodDays}일 기준으로 집계된 관련 기사가 없어 동향 요약을 생성할 수 없습니다.`;
  }

  if (totalArticles < 3) {
    lines.push(`${keyword}는 최근 ${periodDays}일 동안 관련 기사 ${totalArticles}건이 확인되어 추세를 일반화하기에는 표본이 제한적입니다.`);
  }

  lines.push(`${keyword}는 최근 ${topCategory.label} 중심의 이슈가 다수 확인됩니다.`);
  lines.push(`최근 ${periodDays}일 동안 총 ${totalArticles}건의 기사 중 ${topCategory.keywordLabel} 보도가 ${ratio}%로 가장 높은 비중을 차지했습니다.`);

  if (keywordTokens.length >= 2) {
    lines.push(`특히 ${keywordTokens[0]}, ${keywordTokens[1]} 등의 키워드가 반복적으로 언급되었습니다.`);
  } else if (keywordTokens.length === 1) {
    lines.push(`특히 ${keywordTokens[0]} 키워드가 반복적으로 언급되었습니다.`);
  } else if (totalMentionCount > 0) {
    lines.push(`특히 핵심 관련 키워드가 반복적으로 언급되었습니다.`);
  }

  lines.push(`이는 ${topCategory.interpretation} 가능성을 시사합니다.`);
  lines.push(`전반적으로 ${topCategory.strategy}.`);

  if (typeof total?.delta === "number") {
    if (total.delta > 0) {
      lines.push("관련 보도가 최근 들어 증가하는 추세입니다.");
    } else if (total.delta < 0) {
      lines.push("전반적인 기사량은 감소세를 보이고 있습니다.");
    }
  }

  return lines.join(" ");
};

const CompetitorReportPage = () => {
  const [selectedKeyword, setSelectedKeyword] = useState(PRESET_KEYWORDS[0]);
  const [isPeriodSectionOpen, setIsPeriodSectionOpen] = useState(true);
  const [isCompetitorSectionOpen, setIsCompetitorSectionOpen] = useState(true);
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - DEFAULT_DAYS);
    return formatDateInput(d);
  });
  const [endDate, setEndDate] = useState(() => formatDateInput(new Date()));
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const competitorKeywords = PRESET_KEYWORDS;

  const fetchReport = async () => {
    if (!competitorKeywords.length) return;
    if (startDate > endDate) {
      setError("기간 설정이 올바르지 않습니다. 시작일은 종료일보다 늦을 수 없습니다.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const data = await fetchCompetitorReport({
        keywords: competitorKeywords.join(","),
        topLimit: 8,
        start: startDate,
        end: endDate,
      });
      setReport(data);
    } catch (err) {
      setError(err.message || "리포트 데이터를 불러오지 못했습니다.");
      setReport(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  const totalsByKeyword = useMemo(() => {
    const out = {};
    if (!report?.totals) return out;
    report.totals.forEach((t) => {
      out[t.keyword] = t;
    });
    return out;
  }, [report]);

  const impactsByKeyword = useMemo(() => {
    const out = {};
    if (!report?.impacts) return out;
    report.impacts.forEach((row) => {
      out[row.keyword] = row;
    });
    return out;
  }, [report]);

  const clustersByKeyword = useMemo(() => {
    const out = {};
    if (!report?.clusters) return out;
    report.clusters.forEach((row) => {
      if (!out[row.keyword]) out[row.keyword] = [];
      out[row.keyword].push(row);
    });
    return out;
  }, [report]);

  const pinsByKeyword = useMemo(() => {
    const out = {};
    if (!report?.pins) return out;
    report.pins.forEach((row) => {
      if (!out[row.keyword]) out[row.keyword] = [];
      out[row.keyword].push(row);
    });
    return out;
  }, [report]);

  const dailyByKeyword = useMemo(() => {
    const out = {};
    if (!report?.daily) return out;
    report.daily.forEach((row) => {
      if (!out[row.keyword]) out[row.keyword] = [];
      out[row.keyword].push(row);
    });
    return out;
  }, [report]);

  const sourcesByKeyword = useMemo(() => {
    const out = {};
    if (!report?.sources) return out;
    report.sources.forEach((row) => {
      if (!out[row.keyword]) out[row.keyword] = [];
      out[row.keyword].push(row);
    });
    return out;
  }, [report]);

  const articlesByKeyword = useMemo(() => {
    const out = {};
    if (!report?.topArticles) return out;
    report.topArticles.forEach((row) => {
      if (!out[row.keyword]) out[row.keyword] = [];
      out[row.keyword].push(row);
    });
    return out;
  }, [report]);

  const selectedDaily = dailyByKeyword[selectedKeyword] || [];
  const selectedSources = sourcesByKeyword[selectedKeyword] || [];
  const selectedArticles = articlesByKeyword[selectedKeyword] || [];
  const selectedClusters = clustersByKeyword[selectedKeyword] || [];
  const selectedPins = pinsByKeyword[selectedKeyword] || [];
  const pinsByDate = useMemo(() => {
    const out = {};
    selectedPins.forEach((p) => {
      out[p.date] = p;
    });
    return out;
  }, [selectedPins]);

  const maxDaily = Math.max(1, ...selectedDaily.map((d) => d.count));

  const keywordRanks = report?.keywordRanks || [];
  const weeklyIssues = report?.weeklyIssues || [];
  const monthlyIssues = report?.monthlyIssues || [];
  const rangeIssueTitles = report?.rangeIssueTitles || [];
  const mentionedKeywords = report?.mentionedKeywords || [];

  const overallKeywordRanks = useMemo(() => {
    return keywordRanks
      .filter((row) => !isGenericKeyword(row?.keyword))
      .slice(0, 12);
  }, [keywordRanks]);

  const mentionedByKeyword = useMemo(() => {
    const out = {};
    mentionedKeywords.forEach((row) => {
      if (!out[row.keyword]) out[row.keyword] = [];
      out[row.keyword].push(row);
    });
    return out;
  }, [mentionedKeywords]);

  const insightsByKeyword = useMemo(() => {
    const out = {};
    (report?.insights || []).forEach((row) => {
      if (row?.keyword) out[row.keyword] = row.summary || "";
    });
    return out;
  }, [report]);

  const selectedMentions = mentionedByKeyword[selectedKeyword] || [];
  const normalizedRangeIssues = useMemo(() => {
    const rows = rangeIssueTitles || [];
    const strict = [];
    const used = new Set();

    rows.forEach((row, idx) => {
      if (strict.length >= ISSUE_TOP_COUNT) return;
      const normalizedTitle = normalizeIssueLine(row?.title || "");
      if (!normalizedTitle) return;
      strict.push({ ...row, normalizedTitle });
      used.add(idx);
    });

    if (strict.length < ISSUE_TOP_COUNT) {
      rows.forEach((row, idx) => {
        if (strict.length >= ISSUE_TOP_COUNT) return;
        if (used.has(idx)) return;
        const rawTitle = cleanSummaryText(row?.title || "");
        if (isLowQualityIssueLine(rawTitle)) return;
        const fallback = toShortSentence(rawTitle, 120);
        if (!fallback) return;
        strict.push({ ...row, normalizedTitle: fallback.endsWith(".") ? fallback : `${fallback}.` });
      });
    }

    return strict.slice(0, ISSUE_TOP_COUNT);
  }, [rangeIssueTitles]);
  const trendSummaryText = useMemo(() => {
    const serverSummary = (insightsByKeyword[selectedKeyword] || "").trim();
    if (serverSummary) return serverSummary;
    return buildNarrativeSummary({
      keyword: selectedKeyword,
      mentions: selectedMentions,
      articles: selectedArticles,
      total: totalsByKeyword[selectedKeyword],
      startDate,
      endDate,
    });
  }, [selectedKeyword, selectedMentions, selectedArticles, totalsByKeyword, startDate, endDate, insightsByKeyword]);

  return (
    <div style={pageStyle}>
      <h1 style={pageTitleStyle}>Report</h1>
      {loading && <div style={infoBoxStyle}>불러오는 중...</div>}
      {error && <div style={errorBoxStyle}>{error}</div>}

      {!loading && !error && report && (
        <>
          <div style={dashboardCardStyle}>
            <div style={titleRow}>
              <h2 style={sectionTitleLarge}>기간별 리포트</h2>
              <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
                <label style={filterLabel}>기간 필터</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  style={dateInputStyle}
                  max={endDate || TODAY_DATE}
                />
                <span style={{ color: "#cfcfcf" }}>~</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  style={dateInputStyle}
                  min={startDate}
                  max={TODAY_DATE}
                />
                <button
                  onClick={fetchReport}
                  style={{
                    ...primaryButton,
                    opacity: startDate > endDate ? 0.6 : 1,
                    cursor: startDate > endDate ? "not-allowed" : "pointer",
                  }}
                  disabled={startDate > endDate}
                >
                  필터 적용
                </button>
                <button
                  onClick={() => setIsPeriodSectionOpen((prev) => !prev)}
                  style={toggleButtonStyle}
                >
                  {isPeriodSectionOpen ? "접기" : "펼치기"}
                </button>
              </div>
            </div>
            {isPeriodSectionOpen && (
              <>
                <div style={periodStyle}>선택 기간 기준: {startDate} ~ {endDate}</div>

                <div style={groupGridStyle}>
                  <div style={subCardStyle}>
                    <h3 style={sectionTitle}>핵심 이슈 TOP</h3>
                    {normalizedRangeIssues.length === 0 && (
                      <div style={{ color: "#b0b0b0" }}>데이터 없음</div>
                    )}
                    <div style={{ display: "grid", gap: "0.34rem" }}>
                      {normalizedRangeIssues.map((row, idx) => (
                        <div key={`range-title-${idx}`} style={rankRow}>
                          <span>{idx + 1}. {row.normalizedTitle}</span>
                          <span style={rankMeta}>{row.source || ""}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={subCardStyle}>
                    <h3 style={sectionTitle}>키워드 언급량 TOP</h3>
                    {overallKeywordRanks.length === 0 && (
                      <div style={{ color: "#b0b0b0" }}>데이터 없음</div>
                    )}
                    <div style={{ display: "grid", gap: "0.42rem" }}>
                      {overallKeywordRanks.map((row) => (
                        <div key={row.keyword} style={{ display: "grid", gridTemplateColumns: "140px 1fr 52px", gap: "0.55rem", alignItems: "center" }}>
                          <div style={{ color: "#e6e6e6", fontSize: "0.82rem" }}>{row.keyword}</div>
                          <div style={barTrack}>
                            <div
                              style={{
                                ...barFill,
                                width: `${Math.min(100, (row.count / (overallKeywordRanks[0]?.count || 1)) * 100)}%`,
                              }}
                            />
                          </div>
                          <div style={{ textAlign: "right", color: "#ffb86b", fontWeight: 600, fontSize: "0.8rem" }}>{row.count}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          <div style={dashboardCardStyle}>
            <div style={titleRow}>
              <h2 style={sectionTitleLarge}>경쟁사 리포트 대시보드</h2>
              <button
                onClick={() => setIsCompetitorSectionOpen((prev) => !prev)}
                style={toggleButtonStyle}
              >
                {isCompetitorSectionOpen ? "접기" : "펼치기"}
              </button>
            </div>
            {isCompetitorSectionOpen && (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap", marginBottom: "0.9rem" }}>
                  {competitorKeywords.map((kw) => (
                    <button
                      key={kw}
                      onClick={() => setSelectedKeyword(kw)}
                      style={{
                        ...chipStyle,
                        borderColor: selectedKeyword === kw ? "rgba(255,140,66,0.8)" : "rgba(255,255,255,0.15)",
                        background: selectedKeyword === kw ? "rgba(255,140,66,0.2)" : "rgba(255,255,255,0.05)",
                      }}
                    >
                      {kw}
                    </button>
                  ))}
                </div>

                <div style={summaryCardStyle}>
                  <h3 style={sectionTitle}>동향 요약</h3>
                  <div style={{ color: "#dcdcdc", lineHeight: 1.52, fontSize: "0.88rem" }}>
                    {trendSummaryText || "요약 데이터 없음"}
                  </div>
                </div>

                <div style={dashboardGridStyle}>
                  <div style={subCardStyle}>
                    <h3 style={sectionTitle}>언급 키워드</h3>
                    {selectedMentions.length === 0 && (
                      <div style={{ color: "#b0b0b0" }}>데이터 없음</div>
                    )}
                    <div style={{ display: "grid", gap: "0.45rem" }}>
                      {selectedMentions.slice(0, 10).map((row) => (
                        <div key={`${row.keyword}-${row.tag}`} style={rankRow}>
                          <span>{row.tag}</span>
                          <span style={rankCount}>{row.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={subCardStyle}>
                    <h3 style={sectionTitle}>관련 기사</h3>
                    {selectedArticles.length === 0 && (
                      <div style={{ color: "#b0b0b0" }}>데이터 없음</div>
                    )}
                    <div style={{ display: "grid", gap: "0.62rem" }}>
                      {selectedArticles.map((a) => (
                        <a
                          key={`${a.keyword}-${a.link}`}
                          href={a.link}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            display: "grid",
                            gridTemplateColumns: "52px 1fr auto",
                            gap: "0.6rem",
                            textDecoration: "none",
                            color: "white",
                            padding: "0.62rem",
                            borderRadius: "12px",
                            background: "rgba(255,255,255,0.06)",
                            border: "1px solid rgba(255,255,255,0.08)",
                          }}
                        >
                          <div
                            style={{
                              width: "52px",
                              height: "52px",
                              borderRadius: "10px",
                              overflow: "hidden",
                              background: "rgba(255,255,255,0.1)",
                            }}
                          >
                            {a.img ? (
                              <img
                                src={a.img}
                                alt=""
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                loading="lazy"
                              />
                            ) : (
                              <div style={{ fontSize: "0.68rem", color: "#bbb", textAlign: "center", paddingTop: "17px" }}>
                                No Image
                              </div>
                            )}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, marginBottom: "0.18rem", fontSize: "0.86rem" }}>
                              {a.korTitle || a.title}
                            </div>
                            <div style={{ fontSize: "0.76rem", color: "#cfcfcf" }}>
                              {a.date} · {a.source}
                            </div>
                            {(a.korSummary || a.idSummary) && (
                              <div style={{ fontSize: "0.74rem", color: "#b8b8b8", marginTop: "0.28rem" }}>
                                {toShortSentence(a.korSummary || a.idSummary, 95)}
                              </div>
                            )}
                          </div>
                          <div style={{ alignSelf: "center", color: "#ffb86b", fontWeight: 600, whiteSpace: "nowrap", fontSize: "0.78rem" }}>
                            중요도 {a.importance ?? "-"}
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </>
      )}

    </div>
  );
};

const pageStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "0.72rem",
  padding: "0.9rem clamp(0.5rem, 1.1vw, 0.76rem) 1rem",
  maxWidth: 1240,
  width: "100%",
  margin: "0 auto",
  color: "white",
};

const pageTitleStyle = {
  fontSize: "clamp(1.36rem, 1.7vw, 1.65rem)",
  color: "#ff8c42",
  textAlign: "center",
  width: "100%",
  lineHeight: 1.2,
  margin: 0,
  marginBottom: "0.42rem",
  paddingTop: "0.2rem",
};

const titleRow = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "0.55rem",
  marginBottom: "0.3rem",
  flexWrap: "wrap",
};

const periodStyle = {
  color: "#d0d0d0",
  fontSize: "0.76rem",
  marginBottom: "0.42rem",
};

const filterLabel = {
  color: "#d8d8d8",
  fontSize: "0.72rem",
};

const dateInputStyle = {
  padding: "0.28rem 0.42rem",
  borderRadius: "8px",
  border: "1px solid rgba(255,255,255,0.2)",
  background: "rgba(10,10,20,0.6)",
  color: "white",
  outline: "none",
  fontSize: "0.76rem",
};

const primaryButton = {
  padding: "0.38rem 0.8rem",
  borderRadius: "9px",
  border: "none",
  background: "linear-gradient(135deg, #ff8c42, #ffa726)",
  color: "white",
  fontWeight: 600,
  fontSize: "0.76rem",
  cursor: "pointer",
};

const toggleButtonStyle = {
  padding: "0.34rem 0.66rem",
  borderRadius: "8px",
  border: "1px solid rgba(255, 184, 107, 0.5)",
  background: "rgba(255, 184, 107, 0.12)",
  color: "#ffcf9f",
  fontWeight: 600,
  fontSize: "0.74rem",
  cursor: "pointer",
};

const cardStyle = {
  background: "rgba(255,255,255,0.06)",
  borderRadius: "14px",
  padding: "0.7rem",
  border: "1px solid rgba(255,255,255,0.1)",
  backdropFilter: "blur(10px)",
};

const sectionTitleLarge = {
  margin: 0,
  color: "#ffb86b",
  fontSize: "0.92rem",
};

const sectionTitle = {
  margin: 0,
  marginBottom: "0.5rem",
  color: "#ffb86b",
  fontSize: "0.84rem",
};

const infoBoxStyle = {
  background: "rgba(255,255,255,0.08)",
  padding: "0.82rem",
  borderRadius: "12px",
  color: "#ddd",
  fontSize: "0.82rem",
};

const errorBoxStyle = {
  background: "rgba(255, 99, 71, 0.15)",
  padding: "0.82rem",
  borderRadius: "12px",
  color: "#ffb3a7",
  border: "1px solid rgba(255, 99, 71, 0.4)",
  fontSize: "0.82rem",
};

const rankRow = {
  display: "flex",
  justifyContent: "space-between",
  padding: "0.36rem 0.52rem",
  borderRadius: "9px",
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.08)",
  fontSize: "0.78rem",
};

const rankCount = {
  color: "#ffb86b",
  fontWeight: 600,
};

const rankMeta = {
  color: "#b8b8b8",
  fontSize: "0.68rem",
};

const chipStyle = {
  background: "rgba(255, 140, 66, 0.18)",
  color: "#ffb86b",
  padding: "0.22rem 0.46rem",
  borderRadius: "999px",
  border: "1px solid rgba(255, 140, 66, 0.45)",
  fontSize: "0.68rem",
  cursor: "pointer",
};

const barTrack = {
  height: "7px",
  borderRadius: "999px",
  background: "rgba(255,255,255,0.08)",
  overflow: "hidden",
};

const barFill = {
  height: "100%",
  borderRadius: "999px",
  background: "linear-gradient(90deg, #ff8c42, #ffa726)",
};

const groupGridStyle = {
  display: "grid",
  gap: "0.62rem",
  gridTemplateColumns: "1fr",
};

const dashboardGridStyle = {
  display: "grid",
  gap: "0.82rem",
  gridTemplateColumns: "repeat(auto-fit, minmax(clamp(220px, 24vw, 290px), 1fr))",
  alignItems: "start",
};

const subCardStyle = {
  background: "rgba(255,255,255,0.04)",
  borderRadius: "11px",
  padding: "0.7rem",
  border: "1px solid rgba(255,255,255,0.08)",
};

const dashboardCardStyle = {
  ...cardStyle,
  padding: "0.82rem",
};

const summaryCardStyle = {
  ...subCardStyle,
  marginTop: "0.82rem",
  marginBottom: "0.82rem",
};

const modalOverlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(10, 10, 20, 0.7)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "1.25rem",
  zIndex: 20,
};

const modalCard = {
  width: "min(760px, 92vw)",
  background: "rgba(20, 20, 35, 0.95)",
  borderRadius: "14px",
  padding: "0.92rem",
  border: "1px solid rgba(255,255,255,0.12)",
  backdropFilter: "blur(16px)",
};

const modalHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "0.72rem",
};

const closeButton = {
  background: "rgba(255,255,255,0.12)",
  border: "none",
  borderRadius: "7px",
  padding: "0.24rem 0.5rem",
  color: "#f0f0f0",
  cursor: "pointer",
  fontSize: "0.72rem",
};

const modalSectionTitle = {
  marginTop: "0.58rem",
  marginBottom: "0.34rem",
  color: "#f7cba2",
  fontWeight: 700,
  fontSize: "0.82rem",
};

const modalGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
  gap: "0.5rem",
};

const modalItemButton = {
  background: "rgba(255,255,255,0.06)",
  borderRadius: "10px",
  padding: "0.5rem",
  border: "1px solid rgba(255,255,255,0.08)",
  display: "grid",
  gap: "0.18rem",
  textAlign: "left",
  color: "white",
  cursor: "pointer",
  fontSize: "0.74rem",
};

export default CompetitorReportPage;
