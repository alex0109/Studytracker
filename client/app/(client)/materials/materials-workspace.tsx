"use client";

import { FC } from "react";
import { IMaterialsView, MaterialsSideBar, MaterialsSidebarSectionEnum } from "@/widgets/MaterialsSideBar";
import { MaterialContent } from "@/widgets/MaterialContent";
import { NotesContent } from "@/widgets/NotesContent";
import { DictionaryContent } from "@/widgets/DictionaryContent";
import { QuestionsContent } from "@/widgets/QuestionsContent";
import { AttemptsContent } from "@/widgets/AttemptsContent";
import { MaterialTags } from "@/widgets/MaterialTags";
import { DeadlinePlanCard, DeadlineProperty } from "@/widgets/Deadlines";
import { TodayReminder } from "@/widgets/TodayReview";

// The page puts the widgets together: the list, and next to it the open material, note or
// dictionary with the blocks they show inside
const OpenContent: FC<{ view: IMaterialsView }> = ({ view }) => {
  const { section, material, note, dictionaryId, openMaterial, openDictionary } = view;

  if (section === MaterialsSidebarSectionEnum.Notes) {
    return note ? (
      <NotesContent
        materialId={material.id}
        noteId={note.id}
        title={note.title}
        type={note.type}
        onOpenDictionary={openDictionary}
        onDeleted={() => openMaterial(material.id)}
        questions={<QuestionsContent materialId={material.id} noteId={note.id} assessmentId={material.assessmentId} />}
      />
    ) : null;
  }

  if (section === MaterialsSidebarSectionEnum.Dictionary) {
    return dictionaryId ? (
      <DictionaryContent
        key={dictionaryId}
        materialId={material.id}
        dictionaryId={dictionaryId}
        onDeleted={() => openMaterial(material.id)}
      />
    ) : null;
  }

  return (
    <MaterialContent
      key={material.id}
      id={material.id}
      title={material.title}
      type={material.type}
      link={material.link}
      status={material.status}
      createdAt={material.createdAt}
      isImported={material.isImported}
      isFromLibrary={material.isFromLibrary}
      importedAt={material.importedAt}
      onOpenDictionary={openDictionary}
      slots={{
        questions: <QuestionsContent materialId={material.id} assessmentId={material.assessmentId} />,
        attempts: <AttemptsContent materialId={material.id} />,
        deadlinePlan: <DeadlinePlanCard materialId={material.id} compact />,
        subjects: <MaterialTags materialId={material.id} materialTags={material.materialTags} compact />,
        deadline: <DeadlineProperty materialId={material.id} />,
      }}
    />
  );
};

// What "Today" waits for sits above the list, as wide as it
export const MaterialsWorkspace: FC = () => (
  <>
    <TodayReminder className="mt-3 lg:w-[94%] xl:w-[90%]" />
    <MaterialsSideBar renderContent={(view) => <OpenContent view={view} />} />
  </>
);
