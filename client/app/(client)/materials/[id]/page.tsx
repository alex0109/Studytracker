import MaterialPage from "./components/material.page";
import { getOneMaterialService } from "../services/material.service";
import { getUser } from "@/shared/queries/user";
import { getAllAssessmentsService } from "../services/assessment.service";

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { token } = await getUser();
  const { id } = await params;

  const material = await getOneMaterialService(token, id);

  return <MaterialPage token={token!} exactMaterial={material} />;
};

export default Page;
