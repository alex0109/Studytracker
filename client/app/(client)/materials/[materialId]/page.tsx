import MaterialPage from "./components/material.page";
import { getOneMaterialService } from "../services/material.service";
import { getUser } from "@/shared/queries/user";

const Page = async ({
  params,
}: {
  params: Promise<{ materialId: string }>;
}) => {
  const { token } = await getUser();
  const { materialId } = await params;

  const material = await getOneMaterialService(token, materialId);

  return <MaterialPage materialId={materialId} exactMaterial={material} />;
};

export default Page;
