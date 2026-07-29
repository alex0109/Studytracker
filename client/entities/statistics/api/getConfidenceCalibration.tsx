import axios from "axios";
import { IConfidenceCalibration } from "../model/confidence-calibration";

export const getConfidenceCalibration = async (
  token: string | undefined,
): Promise<IConfidenceCalibration[]> => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_HTTP}/statistics/confidence`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  return res.data;
};
