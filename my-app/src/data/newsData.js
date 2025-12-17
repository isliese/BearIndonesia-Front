// src/data/newsData.js
// - src/data/*.json(통합 스키마)를 자동 로드
// - 뷰 모델로 어댑팅(한국어 제목/요약 우선)
// - 날짜별 그룹핑 & 유틸 제공

const modules = import.meta.glob('./*.json', { eager: true });

/** 모든 파일에서 기사 로드 */
const rawArticles = Object.values(modules).flatMap((mod) => {
  const data = mod?.default ?? mod;
  return Array.isArray(data) ? data : [data];
});

/** 보정: tags[] → tag, author→source, priority→importance 등 */
function priorityToImportance(p) {
  if (p === 'high') return 90;
  if (p === 'medium') return 60;
  return 30;
}
function normalizeArticle(a) {
  const out = { ...a };

  // tags(array) → tag(string)
  if (!out.tag && Array.isArray(out.tags) && out.tags.length > 0) {
    const named = out.tags.find(t => t && t.name)?.name;
    out.tag = named || String(out.tags[0] ?? '');
  }
  delete out.tags;

  // author → source
  if (!out.source && out.author) out.source = out.author;
  delete out.author;

  // priority → importance
  if (out.priority && typeof out.importance !== 'number') {
    out.importance = priorityToImportance(out.priority);
  }
  delete out.priority;

  return out;
}

const normalized = rawArticles.map(normalizeArticle);

/** 뷰 모델(한국어 우선 타이틀/요약) */
function importanceToPriority(x) {
  const v = Number(x ?? 0);
  if (v >= 80) return 'high';
  if (v >= 50) return 'medium';
  return 'low';
}
function inferType(a) {
  const cat = (a.category || a.engCategory || '').toLowerCase();
  if (cat.includes('규제') || cat.includes('regulat')) return '규제변경';
  if (cat.includes('임상') || cat.includes('clinical')) return '임상시험';
  if (cat.includes('허가') || cat.includes('approval')) return '허가승인';
  if (cat.includes('시장') || cat.includes('market')) return '시장동향';
  if (cat.includes('기업') || cat.includes('company')) return '기업뉴스';
  return '기타';
}
function inferCompany(a) {
  return a.company || '업계 전체';
}
function pickTag(a) {
  if (a.tag && typeof a.tag === 'string') return a.tag;
  return a.category || a.engCategory || '일반';
}
function toViewModel(a) {
  // 한국어 우선 제목/요약
  const koTitle = a.korTitle || a.title || '';
  const koSummary = a.korSummary || '';

  return {
    id: a.id,
    title: koTitle,           // 카드/리스트/상세 기본 제목 = 한국어
    summary: koSummary,       // 카드/리스트 기본 요약 = 한국어
    content: a.content || '', // 상세 본문(원문)
    author: a.source || '',
    tag: pickTag(a),
    priority: importanceToPriority(a.importance),
    type: inferType(a),
    company: inferCompany(a),
    _raw: a,                  // 원본 보존(engTitle/engSummary/date/link 등)
  };
}

export const viewArticles = normalized.map(toViewModel);

/** 날짜별 그룹핑 (키: YYYY-MM-DD) */
export const newsData = viewArticles.reduce((acc, vm) => {
  const d = vm._raw?.date;
  if (!d) return acc;
  (acc[d] ||= []).push(vm);
  return acc;
}, {});

/** 유틸 */
export const getNewsForDate = (dateString) => newsData[dateString] || [];
export const getNewsCount = (dateString) => newsData[dateString]?.length || 0;
export const getHighestPriority = (dateString) => {
  const day = newsData[dateString];
  if (!day?.length) return null;
  const order = { high: 3, medium: 2, low: 1 };
  return day.sort((a, b) => order[b.priority] - order[a.priority])[0].priority;
};
export const getAllNewsDatesSorted = () =>
  Object.keys(newsData).sort((a, b) => new Date(b) - new Date(a));
