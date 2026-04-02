"use client";

import { useState, useEffect, useCallback } from "react";
import { getFavorites, toggleFavorite, isFavorite } from "@/utils/storage";

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    setFavorites(getFavorites());
  }, []);

  const toggle = useCallback((id: string) => {
    const updated = toggleFavorite(id);
    setFavorites([...updated]);
  }, []);

  const check = useCallback((id: string) => {
    return isFavorite(id);
  }, [favorites]); // eslint-disable-line react-hooks/exhaustive-deps

  return { favorites, toggle, isFavorite: check };
}
