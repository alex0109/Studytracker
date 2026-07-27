import axios from "axios";

export const startAttempt = async (
  token: string | undefined,
  assessmentId: string,
): Promise<string> => {
  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_API_HTTP}/attempts/start`,
    { assessmentId: assessmentId },
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  return res.data;
};
