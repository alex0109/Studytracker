import BlockColumn from "@/shared/components/block-column";
import Subtitle from "@/shared/components/subtitle";
import Title from "@/shared/components/title";
import { getUser } from "@/shared/queries/user";
import { getReducedQuestionsService } from "../../services/question.service";
import { Separator } from "@/shared/components/ui/separator";
import { shuffleInPlace } from "../../utils/shuffle.util";
import ContainerRow from "@/shared/components/container-row";
import TextArea from "@/shared/components/text-area";
import QuestionItem from "./components/question.component";
import { Button } from "@/shared/components/ui/button";
import AssessmentHeader from "./components/assessment-header.component";

const Assessment = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const { token } = await getUser();

  const questionsReduced = await getReducedQuestionsService(token, id);
  return (
    <BlockColumn>
      <AssessmentHeader id={id} />
      <Separator />
      {shuffleInPlace(questionsReduced).map((item, i) => (
        <QuestionItem
          key={item.id}
          id={item.id}
          index={i + 1}
          title={item.title}
        />
      ))}
      <Separator className="my-10" />
      <Button
        className="text-md bg-emerald-600 text-white hover:bg-emerald-700 hover:text-white"
        size="lg"
        variant="outline"
      >
        Finish
      </Button>
    </BlockColumn>
  );
};

export default Assessment;
