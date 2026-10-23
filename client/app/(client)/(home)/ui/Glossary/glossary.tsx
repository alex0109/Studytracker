import { FC } from "react";
import { Reveal } from "../Reveal";
import { SectionHeading } from "../SectionHeading";
import { glossary } from "./data";

export const Glossary: FC = () => {
  return (
    <section className="flex w-full max-w-6xl flex-col gap-12 px-4">
      <Reveal>
        <SectionHeading
          eyebrow="Glossary"
          title="Every piece, in one line"
          text="Nine ideas are all you need to know to feel at home."
        />
      </Reveal>

      <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {glossary.map((item) => (
          <Reveal key={item.name}>
            <div className="group flex h-full gap-4 rounded-2xl border border-white bg-white/70 p-5 backdrop-blur transition duration-300 hover:bg-white hover:shadow-lg">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-neutral-900 text-white transition-transform duration-300 group-hover:-rotate-6">
                <item.icon />
              </span>
              <div className="flex flex-col gap-1">
                <dt className="font-semibold text-neutral-900">{item.name}</dt>
                <dd className="text-sm text-neutral-600">{item.text}</dd>
              </div>
            </div>
          </Reveal>
        ))}
      </dl>
    </section>
  );
};
