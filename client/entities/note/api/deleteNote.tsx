import axios from "axios";

export const deleteNote = async (
  token: string | undefined,
  materialId: string,
  noteId: string,
): Promise<boolean> => {
  const res = await axios.delete(
    `${process.env.NEXT_PUBLIC_API_HTTP}/materials/${materialId}/notes/${noteId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  return res.data;
};
