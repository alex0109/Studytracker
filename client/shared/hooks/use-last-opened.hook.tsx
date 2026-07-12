"use client";

import { useState, useEffect } from "react";

export function useLastOpened() {
  const [lastOpened, setLastOpened] = useState<string | undefined>(undefined);

  useEffect(() => {
    const storedId = localStorage.getItem("materialId");
    if (storedId) {
      setLastOpened(storedId);
    }
  }, [lastOpened]);

  const saveLastOpenedId = (materialId: string) => {
    setLastOpened(String(materialId));
    localStorage.setItem("materialId", String(materialId));
  };

  return { lastOpened: lastOpened, saveLastOpenedId };
}
