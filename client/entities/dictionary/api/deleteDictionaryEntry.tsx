import axios from "axios";

export const deleteDictionaryEntry = async (
  token: string | undefined,
  entryId: string,
): Promise<boolean> => {
  const res = await axios.delete(
    `${process.env.NEXT_PUBLIC_API_HTTP}/dictionaries/entries/${entryId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  return res.data;
};
