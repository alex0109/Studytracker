import axios from "axios";

export const startAssessment = async (
  token: string | undefined,
  id: string,
): Promise<string> => {
  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_API_HTTP}/assessments/${id}/start`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return res.data;
};
