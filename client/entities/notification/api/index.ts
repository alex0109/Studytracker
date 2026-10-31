import axios from "axios";
import {
  INotificationFeed,
  INotificationSettings,
  INotificationSettingsUpdate,
} from "../model";

const base = () => `${process.env.NEXT_PUBLIC_API_HTTP}/notifications`;
const auth = (token: string | undefined) => ({
  headers: { Authorization: `Bearer ${token}` },
});

export const getNotificationFeed = async (
  token: string | undefined,
): Promise<INotificationFeed> =>
  (await axios.get(base(), auth(token))).data;

export const getNotificationSettings = async (
  token: string | undefined,
): Promise<INotificationSettings> =>
  (await axios.get(`${base()}/settings`, auth(token))).data;

export const updateNotificationSettings = async (
  token: string | undefined,
  body: INotificationSettingsUpdate,
): Promise<INotificationSettings> =>
  (await axios.put(`${base()}/settings`, body, auth(token))).data;

export const markNotificationRead = async (
  token: string | undefined,
  notificationId: string,
): Promise<void> => {
  await axios.post(`${base()}/${notificationId}/read`, {}, auth(token));
};

export const markAllNotificationsRead = async (
  token: string | undefined,
): Promise<void> => {
  await axios.post(`${base()}/read-all`, {}, auth(token));
};
