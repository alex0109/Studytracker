"use client";

import React, { useContext, useState, createContext } from "react";
import { SwitchSectionName } from "../types/section-name.type";

interface ActiveSectionContextProvider {
  children: React.ReactNode;
}

type ActiveSectionContextType = {
  activeSection: SwitchSectionName;
  setActiveSection: React.Dispatch<React.SetStateAction<SwitchSectionName>>;
  timeOfLastClick: number;
  setTimeOfLastClick: React.Dispatch<React.SetStateAction<number>>;
};

export const ActiveSectionContext =
  createContext<ActiveSectionContextType | null>(null);

export default function ActiveSectionContextProvider({
  children,
}: ActiveSectionContextProvider) {
  const [activeSection, setActiveSection] =
    useState<SwitchSectionName>(undefined);
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
