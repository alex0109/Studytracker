import axios from "axios";

export const resetEntryProgress = async (
  token: string | undefined,
  entryId: string,
): Promise<boolean> => {
  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_API_HTTP}/dictionaries/entries/${entryId}/progress/reset`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  return res.data;
};
