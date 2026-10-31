import { LibraryReader } from "@/widgets/Library";

const LibraryItemPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  return <LibraryReader itemId={id} />;
};

export default LibraryItemPage;
