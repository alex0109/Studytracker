import axios from "axios";

// A zip with everything the app keeps about the user, built on request
export const exportAccount = async (token: string | undefined): Promise<Blob> =>
  (
    await axios.get(`${process.env.NEXT_PUBLIC_API_HTTP}/account/export`, {
      headers: { Authorization: `Bearer ${token}` },
      responseType: "blob",
    })
  ).data;
