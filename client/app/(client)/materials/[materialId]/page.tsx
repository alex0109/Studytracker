import { MaterialPageClient } from "./material-page-client";

const MaterialPage = async ({
  params,
}: {
  params: Promise<{ materialId: string }>;
}) => {
  const { materialId } = await params;

  return <MaterialPageClient materialId={materialId} />;
};

export default MaterialPage;
