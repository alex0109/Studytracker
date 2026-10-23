import { FC } from "react";
import {
  FinalCta,
  Glossary,
  Hero,
  HowItWorks,
  KnowledgeLoop,
  ScrollTint,
  WordsThatStick,
} from "./(client)/(home)";
import { Navigation } from "@/widgets/Navigation";

const Page: FC = () => {
  return (
    <>
      <Navigation />
      <ScrollTint />
      <div className="flex flex-col items-center gap-28 overflow-x-clip pt-36 pb-24 md:gap-36 md:pt-44">
        <Hero />
        <KnowledgeLoop />
        <HowItWorks />
        <WordsThatStick />
        <Glossary />
        <FinalCta />
      </div>
    </>
  );
};

export default Page;
