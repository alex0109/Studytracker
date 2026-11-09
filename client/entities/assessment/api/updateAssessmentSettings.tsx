import axios from "axios";
import { IAssessment, IAssessmentSettings } from "../model/assessment.type";

export const updateAssessmentSettings = async (
  token: string | undefined,
  assessmentId: string,
  settings: IAssessmentSettings,
): Promise<IAssessment> => {
  const res = await axios.put(
    `${process.env.NEXT_PUBLIC_API_HTTP}/assessments/${assessmentId}/settings`,
    settings,
    { headers: { Authorization: `Bearer ${token}` } },
  );

  return res.data;
};
