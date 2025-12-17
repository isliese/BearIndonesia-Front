// total data
// 모든 412개의 데이터 합산
import BPOM from "../data/BPOM.json";
import CNBC from "../data/CNBC.json";
import CNN from "../data/CNN.json";
import Detik from "../data/Detik.json";
import Farmasetika from "../data/Farmasetika.json";
import MOH from "../data/MOH.json";

// 날짜 파싱 유틸 (YYYY-MM-DD만 뽑아 정렬에 사용)
const toYMD = (d) => {
  if (!d) return "";
  // 이미 YYYY-MM-DD 형태면 그대로
  const m = String(d).match(/\d{4}-\d{2}-\d{2}/);
  if (m) return m[0];
  // 기타 문자열에서 yyyy-mm-dd 비슷한 형태 추출 시도
  const alt = String(d).match(/(20\d{2})[-./](\d{1,2})[-./](\d{1,2})/);
  if (alt) {
    const [_, y, mm, dd] = alt;
    const m2 = String(mm).padStart(2, "0");
    const d2 = String(dd).padStart(2, "0");
    return `${y}-${m2}-${d2}`;
  }
  try {
    const date = new Date(d);
    if (!isNaN(date)) {
      const mm = String(date.getMonth() + 1).padStart(2, "0");
      const dd = String(date.getDate()).padStart(2, "0");
      return `${date.getFullYear()}-${mm}-${dd}`;
    }
  } catch {}
  return "";
};

const normalize = (a) => {
  const dateYMD = toYMD(a.date);
  return {
    id: a.id ?? undefined,
    title: a.title ?? "",
    korTitle: a.korTitle ?? a.title ?? "",
    engTitle: a.engTitle ?? "",
    link: a.link ?? "",
    content: a.content ?? "",
    date: dateYMD || a.date || "",
    category: a.category ?? "",
    engCategory: a.engCategory ?? "",
    source: a.source ?? a.author ?? "",
    korSummary: a.korSummary ?? a.summary ?? "",
    engSummary: a.engSummary ?? "",
    translated: a.translated ?? null,
    importance: typeof a.importance === "number" ? a.importance : 0,
    importanceRationale: a.importanceRationale ?? a.importance_rationale ?? null,
    tags: Array.isArray(a.tags) ? a.tags : [],
    // 일부 데이터에 tag 단일 필드가 있을 수 있어 대비
    tag: a.tag ?? a.category ?? "",
    author: a.author ?? a.source ?? "",
  };
};

// 중복 제거 (id 우선, 없으면 link+date 기준)
const dedupe = (arr) => {
  const byKey = new Map();
  for (const x of arr) {
    const key = x.id ? `id:${x.id}` : `ld:${x.link}|${x.date}`;
    if (!byKey.has(key)) byKey.set(key, x);
  }
  return Array.from(byKey.values());
};

// 정렬 (날짜 desc, importance desc, id desc)
const sortArticles = (arr) =>
  [...arr].sort((a, b) => {
    const ad = a.date || "";
    const bd = b.date || "";
    if (ad !== bd) return ad < bd ? 1 : -1; // 날짜 내림차순
    if (a.importance !== b.importance) return b.importance - a.importance;
    if (a.id && b.id) return b.id - a.id;
    return 0;
  });

// 6개 소스 합치기
const SOURCES = [BPOM, CNBC, CNN, Detik, Farmasetika, MOH];

const combined = sortArticles(
  dedupe(
    SOURCES.flatMap((src) => (Array.isArray(src) ? src : [])).map(normalize)
  )
);

// ===== 공개 API =====

// 모든 기사
export const getAllArticles = () => combined;

// 날짜 목록 (YYYY-MM-DD) 최신순
export const getAllNewsDatesSorted = () => {
  const s = new Set();
  combined.forEach((a) => a.date && s.add(a.date));
  return Array.from(s).sort((a, b) => (a < b ? 1 : -1));
};

// 특정 날짜의 기사
export const getNewsForDate = (ymd) =>
  combined.filter((a) => a.date === ymd);

// 태그/카테고리로 필터
export const getByTag = (tagId) => {
  if (!tagId || tagId === "all") return combined;
  return combined.filter((n) => (n.tag ?? n.category) === tagId);
};

// 특정 날짜 뉴스 개수
export const getNewsCount = (ymd) => getNewsForDate(ymd).length;

export const getHighestPriority = (ymd) => {
  const news = getNewsForDate(ymd);
  if (!news.length) return null;
  const maxImportance = Math.max(...news.map(n => n.importance || 0));
  if (maxImportance >= 70) return 'high';
  if (maxImportance >= 30) return 'medium';
  return 'low';
};
