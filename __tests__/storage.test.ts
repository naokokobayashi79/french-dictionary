import {
  getFavorites,
  toggleFavorite,
  isFavorite,
  getHistory,
  addToHistory,
  getReviewList,
  toggleReview,
  isInReviewList,
} from "@/utils/storage";

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

beforeEach(() => {
  localStorageMock.clear();
});

describe("Favorites", () => {
  it("returns empty array initially", () => {
    expect(getFavorites()).toEqual([]);
  });

  it("toggles favorite on", () => {
    toggleFavorite("bonjour");
    expect(isFavorite("bonjour")).toBe(true);
  });

  it("toggles favorite off", () => {
    toggleFavorite("bonjour");
    toggleFavorite("bonjour");
    expect(isFavorite("bonjour")).toBe(false);
  });
});

describe("History", () => {
  it("adds to history", () => {
    addToHistory("merci");
    expect(getHistory()).toContain("merci");
  });

  it("moves repeated entry to front", () => {
    addToHistory("bonjour");
    addToHistory("merci");
    addToHistory("bonjour");
    const history = getHistory();
    expect(history[0]).toBe("bonjour");
    expect(history.filter((h) => h === "bonjour")).toHaveLength(1);
  });

  it("limits history to 50 entries", () => {
    for (let i = 0; i < 60; i++) {
      addToHistory(`word-${i}`);
    }
    expect(getHistory().length).toBeLessThanOrEqual(50);
  });
});

describe("Review List", () => {
  it("returns empty array initially", () => {
    expect(getReviewList()).toEqual([]);
  });

  it("toggles review on", () => {
    toggleReview("etre");
    expect(isInReviewList("etre")).toBe(true);
  });

  it("toggles review off", () => {
    toggleReview("etre");
    toggleReview("etre");
    expect(isInReviewList("etre")).toBe(false);
  });
});
