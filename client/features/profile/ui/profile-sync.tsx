"use client";

import { FC, useEffect } from "react";
import { browserTimeZone, IProfileUpdate, useProfile } from "@/entities/profile";
import { useTranslation } from "@/shared/i18n";
import { useProfileUpdate } from "../hooks/useProfileUpdate";

// Gives the server what it can't know: the browser's time zone on the first visit (a chosen one
// is never overwritten, the profile page offers the browser's instead) and the site language,
// which emails and background jobs need too. Renders nothing
export const ProfileSync: FC = () => {
  const { i18n } = useTranslation();
  const { profileData } = useProfile();
  const { updateProfile } = useProfileUpdate(true);

  useEffect(() => {
    if (!profileData) return;

    const changes: IProfileUpdate = {};
    const timeZone = browserTimeZone();

    if (!profileData.timeZone && timeZone) changes.timeZone = timeZone;
    if (profileData.interfaceLanguage !== i18n.language) changes.interfaceLanguage = i18n.language;

    if (Object.keys(changes).length > 0) updateProfile(changes);
  }, [profileData, i18n.language, updateProfile]);

  return null;
};
