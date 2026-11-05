export interface ICalendarDeadline {
  // "yyyy-MM-dd", like every date here
  date: string;
  materialId: string;
  title: string;
}

export interface IStudyCalendar {
  today: string;
  // Days with any study in the requested range
  studyDays: string[];
  // The days of the running streak
  streakDays: string[];
  deadlines: ICalendarDeadline[];
}
