"use client";

import { useState, useEffect, useCallback } from "react";
import { getReviewList, toggleReview, isInReviewList } from "@/utils/storage";

export function useReviewList() {
  const [reviewList, setReviewList] = useState<string[]>([]);

  useEffect(() => {
    setReviewList(getReviewList());
  }, []);

  const toggle = useCallback((id: string) => {
    const updated = toggleReview(id);
    setReviewList([...updated]);
  }, []);

  const check = useCallback((id: string) => {
    return isInReviewList(id);
  }, [reviewList]); // eslint-disable-line react-hooks/exhaustive-deps

  return { reviewList, toggle, isInReviewList: check };
}
