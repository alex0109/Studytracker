// Same values as backend NotificationType
export enum NotificationTypeEnum {
  DailyReview = "DailyReview",
  StreakAtRisk = "StreakAtRisk",
  WeeklyDigest = "WeeklyDigest",
}

export interface IDictionaryDue {
  dictionaryId: string;
  materialId: string;
  title: string;
  due: number;
  new: number;
}

export interface IDailyReviewData {
  dueWords: number;
  newWords: number;
  dictionaries: IDictionaryDue[];
  // Missing in reminders saved before questions had repetition
  dueQuestions?: number;
}

export interface IStreakAtRiskData {
  streakDays: number;
}

export interface IWeeklyDigestData {
  from: string;
  to: string;
  studyDays: number;
  streakDays: number;
  attempts: number;
  answers: number;
  accuracy: number | null;
  previousAccuracy: number | null;
  averageScore: number | null;
  reviews: number;
  weakestTopics: { name: string; accuracy: number; answers: number }[];
}

// Made by background jobs; texts are built here from type and data
export type INotification =
  | { id: string; type: NotificationTypeEnum.DailyReview; periodKey: string; data: IDailyReviewData; createdAt: string; readAt?: string | null }
  | { id: string; type: NotificationTypeEnum.StreakAtRisk; periodKey: string; data: IStreakAtRiskData; createdAt: string; readAt?: string | null }
  | { id: string; type: NotificationTypeEnum.WeeklyDigest; periodKey: string; data: IWeeklyDigestData; createdAt: string; readAt?: string | null };

export interface ITodayDigest {
  localDate: string;
  dueWords: number;
  newWords: number;
  dueQuestions?: number;
  dictionaries: IDictionaryDue[];
  streakDays: number;
  studiedToday: boolean;
  streakAtRisk: boolean;
}

export interface INotificationFeed {
  today: ITodayDigest;
  notifications: INotification[];
  unreadCount: number;
}

export interface INotificationSettings {
  timeZone: string | null;
  language: string;
  email: string | null;
  emailDailyReminder: boolean;
  emailWeeklyDigest: boolean;
  emailStreakReminder: boolean;
}

export type INotificationSettingsUpdate = Partial<Omit<INotificationSettings, "email">>;
