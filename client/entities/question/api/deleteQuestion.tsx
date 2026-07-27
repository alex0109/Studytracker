import axios from "axios";

export const deleteQuestion = async (
  token: string | undefined,
  materialId: string,
  id: string,
): Promise<boolean> => {
  const res = await axios.delete(
    `${process.env.NEXT_PUBLIC_API_HTTP}/materials/${materialId}/questions/${id}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  return res.data;
};
