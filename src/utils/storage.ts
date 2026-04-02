const KEYS = {
  favorites: "french-dict-favorites",
  history: "french-dict-history",
  reviewList: "french-dict-review",
} as const;

function getList(key: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function setList(key: string, list: string[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(list));
  } catch {
    // storage full or unavailable
  }
}

// Favorites
export function getFavorites(): string[] {
  return getList(KEYS.favorites);
}

export function toggleFavorite(id: string): string[] {
  const favorites = getFavorites();
  const index = favorites.indexOf(id);
  if (index >= 0) {
    favorites.splice(index, 1);
  } else {
    favorites.unshift(id);
  }
  setList(KEYS.favorites, favorites);
  return favorites;
}

export function isFavorite(id: string): boolean {
  return getFavorites().includes(id);
}

// History
export function getHistory(): string[] {
  return getList(KEYS.history);
}

export function addToHistory(id: string): string[] {
  const history = getHistory().filter((h) => h !== id);
  history.unshift(id);
  const trimmed = history.slice(0, 50);
  setList(KEYS.history, trimmed);
  return trimmed;
}

// Review List
export function getReviewList(): string[] {
  return getList(KEYS.reviewList);
}

export function toggleReview(id: string): string[] {
  const list = getReviewList();
  const index = list.indexOf(id);
  if (index >= 0) {
    list.splice(index, 1);
  } else {
    list.unshift(id);
  }
  setList(KEYS.reviewList, list);
  return list;
}

export function isInReviewList(id: string): boolean {
  return getReviewList().includes(id);
}
