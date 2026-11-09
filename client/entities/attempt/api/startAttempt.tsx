import axios from "axios";

// useExamSettings: the material's exam settings (levels, number of questions, timer) apply to an
// attempt started from the material, not from a note
export const startAttempt = async (
  token: string | undefined,
  assessmentId: string,
  useExamSettings: boolean,
): Promise<string> => {
  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_API_HTTP}/attempts/start`,
    { assessmentId, useExamSettings },
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  return res.data;
};
