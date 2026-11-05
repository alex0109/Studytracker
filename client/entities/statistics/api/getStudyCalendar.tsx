import axios from "axios";
import { IStudyCalendar } from "../model/study-calendar";

export const getStudyCalendar = async (
  token: string | undefined,
  from: string,
  to: string,
): Promise<IStudyCalendar> => {
  const res = await axios.get(`${process.env.NEXT_PUBLIC_API_HTTP}/statistics/calendar`, {
    params: { from, to },
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.data;
};
