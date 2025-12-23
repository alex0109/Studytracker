import { useState, useEffect } from "react";

function useLastOpened() {
  const [lastOpened, setLastOpened] = useState<string | null>(null);

  useEffect(() => {
    const storedId = localStorage.getItem("materialId");
    if (storedId) {
      setLastOpened(storedId);
    }
  }, []);

  const saveLastOpenedId = (materialId: string) => {
    setLastOpened(materialId);
    localStorage.setItem("materialId", materialId);
  };

  return { lastOpened, saveLastOpenedId };
}

export default useLastOpened;
