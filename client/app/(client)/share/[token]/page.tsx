import { SharedMaterial } from "@/widgets/SharedMaterial";

const SharePage = async ({
  params,
}: {
  params: Promise<{ token: string }>;
}) => {
  const { token } = await params;

  return <SharedMaterial shareToken={token} />;
};

export default SharePage;
