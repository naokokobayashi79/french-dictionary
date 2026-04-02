"use client";

import { useState, useEffect, useCallback } from "react";
import { getHistory, addToHistory } from "@/utils/storage";

export function useHistory() {
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const add = useCallback((id: string) => {
    const updated = addToHistory(id);
    setHistory([...updated]);
  }, []);

  return { history, addToHistory: add };
}
