import axios from "axios";
import { IProfile, IProfileUpdate } from "../model";

const base = () => `${process.env.NEXT_PUBLIC_API_HTTP}/profile`;
const auth = (token: string | undefined) => ({
  headers: { Authorization: `Bearer ${token}` },
});

export const getProfile = async (token: string | undefined): Promise<IProfile> =>
  (await axios.get(base(), auth(token))).data;

export const updateProfile = async (
  token: string | undefined,
  body: IProfileUpdate,
): Promise<IProfile> => (await axios.patch(base(), body, auth(token))).data;

// Replays the review history with the current settings; returns how many words and questions moved
export const rescheduleReviews = async (
  token: string | undefined,
): Promise<{ words: number; questions: number }> =>
  (await axios.post(`${base()}/reschedule`, {}, auth(token))).data;
