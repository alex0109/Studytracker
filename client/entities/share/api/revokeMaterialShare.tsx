import axios from "axios";

export const revokeMaterialShare = async (
  token: string | undefined,
  materialId: string,
): Promise<boolean> => {
  const res = await axios.delete(
    `${process.env.NEXT_PUBLIC_API_HTTP}/materials/${materialId}/share`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  return res.data;
};
