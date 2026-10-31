import axios from "axios";

export const deleteDictionary = async (
  token: string | undefined,
  dictionaryId: string,
): Promise<boolean> => {
  const res = await axios.delete(
    `${process.env.NEXT_PUBLIC_API_HTTP}/dictionaries/${dictionaryId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  return res.data;
};
