import axios from "axios";

export const getAssessment = async (
  token: string | undefined,
  id: string,
): Promise<string> => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_HTTP}/assessments/${id}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  return res.data;
};
