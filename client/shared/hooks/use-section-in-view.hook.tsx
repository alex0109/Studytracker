import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { SectionName } from "../lib/types";
import { useActiveSectionContext } from "../context/active-section.context";

export default function useSectionInView(sectionName: SectionName) {
  const { setActiveSection, timeOfLastClick } = useActiveSectionContext();

  const { ref, inView } = useInView({ threshold: 0.5 });

  useEffect(() => {
    if (inView && Date.now() - timeOfLastClick > 1000) {
      setActiveSection(sectionName);
    }
  }, [inView, sectionName, setActiveSection, timeOfLastClick]);

  return {
    ref,
  };
}
