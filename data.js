export const VERSION = 1;
export const THEMES = {
  floral: '플로럴', vanilla: '바닐라', woody: '우디', citrus: '시트러스', musk: '머스크'
};

export const CATALOG = [
  { id: 'blanche', name: '블랑쉬', brand: '바이레도', theme: 'musk' },
  { id: 'eau-duelle', name: '오 듀엘', brand: '딥티크', theme: 'vanilla' },
  { id: 'english-pear', name: '잉글리쉬 페어 앤 프리지아', brand: '조 말론 런던', theme: 'floral' },
  { id: 'santal-33', name: '상탈 33', brand: '르 라보', theme: 'woody' },
  { id: 'neroli-portofino', name: '네롤리 포르토피노', brand: '톰 포드', theme: 'citrus' },
  { id: 'lazy-sunday', name: '레이지 선데이 모닝', brand: '메종 마르지엘라', theme: 'musk' },
  { id: 'chance', name: '샹스 오 땅드르', brand: '샤넬', theme: 'floral' }
];

export const emptyState = () => ({ version: VERSION, shelf: [], records: {}, themes: {}, updatedAt: new Date().toISOString() });
export const dateKey = date => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
export const seasonStart = date => {
  const month = date.getMonth();
  if (month < 2) return new Date(date.getFullYear() - 1, 11, 1);
  return new Date(date.getFullYear(), Math.floor((month - 2) / 3) * 3 + 2, 1);
};

export function validateBackup(value) {
  if (!value || typeof value !== 'object' || value.version !== VERSION || !Array.isArray(value.shelf) || !value.records || typeof value.records !== 'object') return false;
  return Object.entries(value.records).every(([key, entry]) => /^\d{4}-\d{2}-\d{2}$/.test(key) && entry && Array.isArray(entry.items) && typeof entry.memo === 'string' && entry.items.every(item => typeof item.id === 'string' && Number.isInteger(item.count) && item.count > 0));
}

export function periodStats(state, start, months) {
  const end = new Date(start.getFullYear(), start.getMonth() + months, 1);
  const counts = {}, themes = {};
  let days = 0;
  for (const [key, entry] of Object.entries(state.records)) {
    const date = new Date(`${key}T12:00:00`);
    if (date < start || date >= end || !entry.items.length) continue;
    days += 1;
    for (const item of entry.items) {
      counts[item.id] = (counts[item.id] || 0) + item.count;
      const perfume = CATALOG.find(p => p.id === item.id);
      const theme = state.themes[item.id] || perfume?.theme || 'musk';
      themes[theme] = (themes[theme] || 0) + item.count;
    }
  }
  return { days, uses: Object.values(counts).reduce((a, b) => a + b, 0), counts, themes };
}
