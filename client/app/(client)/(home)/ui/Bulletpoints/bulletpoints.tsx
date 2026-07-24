import { ContainerColumn, ContainerRow, Title, Subtitle } from "@/shared/ui";
import { Bullet } from "./bullet";

export const Bulletpoints = () => {
  return (
    <div className="flex justify-center items-center w-full h-full bg-neutral-100 dark:bg-neutral-800">
      <ContainerColumn blockStyles="flex w-[80%] justify-center items-center">
        {/* <h1>ST Advantages</h1> */}
        <ContainerRow blockStyles="justify-between">
          <div className="flex w-full flex-1 justify-center items-center">
            <Bullet>
              <span className="font-bold text-4xl">1</span>
            </Bullet>
          </div>
          <div className="flex-2 w-full p-5">
            <div className="flex justify-start">
              <Title text="Personal Learning Analytics" />
            </div>
            <div>
              <p className="text-lg">
                Studytracker transforms passive learning into a measurable
                process. Instead of simply storing notes, the system collects
                learning data, tracks test results, and helps students
                understand their strengths and weaknesses. Users can review
                their learning history and make better decisions about what
                areas require more attention.
              </p>
            </div>
          </div>
        </ContainerRow>
        <ContainerRow blockStyles="justify-between">
          <div className="flex-2 p-10">
            <div className="flex justify-end">
              <Title text="Active Learning Through Self-Testing" />
            </div>
            <div>
              <p className="text-lg">
                Unlike traditional note-taking applications, Studytracker
                connects learning materials with interactive assessments. Users
                can create questions from their notes, test their knowledge,
                receive scores, and track improvement over time. This approach
                encourages active recall, which helps users retain information
                more effectively.
              </p>
            </div>
          </div>
          <div className="flex w-full flex-1 justify-center items-center">
            <Bullet>
              <span className="font-bold text-4xl">2</span>
            </Bullet>
          </div>
        </ContainerRow>
        <ContainerRow blockStyles="justify-between">
          <div className="flex w-full flex-1 justify-center items-center">
            <Bullet>
              <span className="font-bold text-4xl">3</span>
            </Bullet>
          </div>
          <div className="flex-2 p-10">
            <div className="flex justify-start">
              <Title text="Progress Tracking and Self-Improvement" />
            </div>
            <div>
              <p className="text-lg">
                Studytracker gives students a clear overview of their
                development journey. By analyzing previous attempts and results,
                users can identify patterns, measure improvement, and build more
                effective learning habits. The platform turns learning from an
                unstructured activity into a continuous improvement process.
              </p>
            </div>
          </div>
        </ContainerRow>
        <ContainerRow blockStyles="justify-between">
          <div className="flex-2 px-10">
            <div className="flex justify-end">
              <Title text="Scalable and Maintainable Architecture" />
            </div>
            <div>
              <p className="text-lg">
                Studytracker is built with a modern backend architecture
                designed for long-term growth and reliability. Clean
                Architecture principles, separation of responsibilities, and
                scalable technologies make the system easier to maintain,
                extend, and improve as new features are introduced. This
                foundation allows the product to evolve without accumulating
                unnecessary technical complexity.
              </p>
            </div>
          </div>
          <div className="flex w-full flex-1 justify-center items-center">
            <Bullet>
              <span className="font-bold text-4xl">4</span>
            </Bullet>
          </div>
        </ContainerRow>
      </ContainerColumn>
    </div>
  );
};
