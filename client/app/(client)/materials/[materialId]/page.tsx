import MaterialPage from "./components/material.page";
import { getOneMaterialService } from "../../../../entities/material/api/material.service";
import { getUser } from "@/shared/api";

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
