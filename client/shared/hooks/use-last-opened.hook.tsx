import { useState, useEffect } from "react";

function useLastOpened() {
  const [lastOpened, setLastOpened] = useState<string | null>(null);

  useEffect(() => {
    const storedId = localStorage.getItem("materialId");
    if (storedId) {
      setLastOpened(storedId);
    }
  }, [lastOpened]);

  const saveLastOpenedId = (materialId: number) => {
    setLastOpened(String(materialId));
    localStorage.setItem("materialId", String(materialId));
  };

  return { lastOpened: Number(lastOpened), saveLastOpenedId };
}

export default useLastOpened;
