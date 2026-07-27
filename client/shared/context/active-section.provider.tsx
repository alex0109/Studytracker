"use client";

import React, { useContext, useState, createContext } from "react";
import { MaterialSectionName } from "../types/section-name.type";

interface ActiveSectionContextProvider {
  children: React.ReactNode;
}

type ActiveSectionContextType = {
  activeSection: MaterialSectionName;
  setActiveSection: React.Dispatch<React.SetStateAction<MaterialSectionName>>;
  timeOfLastClick: number;
  setTimeOfLastClick: React.Dispatch<React.SetStateAction<number>>;
};

export const ActiveSectionContext =
  createContext<ActiveSectionContextType | null>(null);

export default function ActiveSectionContextProvider({
  children,
}: ActiveSectionContextProvider) {
  const [activeSection, setActiveSection] =
    useState<MaterialSectionName>("Materials");
  const [timeOfLastClick, setTimeOfLastClick] = useState(0);

  return (
    <ActiveSectionContext.Provider
      value={{
        activeSection,
        setActiveSection,
        timeOfLastClick,
        setTimeOfLastClick,
      }}
    >
      {children}
    </ActiveSectionContext.Provider>
  );
}

export function useActiveSectionContext() {
  const context = useContext(ActiveSectionContext);

  if (context === null) {
    throw new Error(
      "useActiveSectionContext must be used within a ActiveSectionContextProvider",
    );
  }

  return context;
}
