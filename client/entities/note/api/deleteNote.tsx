import axios from "axios";

// The note goes with its questions and their progress
export const deleteNote = async (
  token: string | undefined,
  materialId: string,
  noteId: string,
): Promise<void> => {
  await axios.delete(
    `${process.env.NEXT_PUBLIC_API_HTTP}/materials/${materialId}/notes/${noteId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
};
