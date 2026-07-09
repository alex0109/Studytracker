import axios from "axios";

export const startAttempt = async (
  token: string | undefined,
  id: string,
): Promise<string> => {
  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_API_HTTP}/attempts/start`,
    { assessmentId: id },
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  return res.data;
};
