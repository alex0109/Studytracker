import axios from "axios";

export interface IAccountDelete {
  confirmEmail: string;
  // Language of the goodbye email
  language: string;
}

export const deleteAccount = async (
  token: string | undefined,
  body: IAccountDelete,
): Promise<void> => {
  await axios.delete(`${process.env.NEXT_PUBLIC_API_HTTP}/account`, {
    headers: { Authorization: `Bearer ${token}` },
    data: body,
  });
};

// The server wants a sign in from the last minutes before it deletes anything
export const isReauthRequired = (error: unknown): boolean =>
  axios.isAxiosError(error) &&
  error.response?.status === 403 &&
  error.response.data?.title === "Reauthentication required";
