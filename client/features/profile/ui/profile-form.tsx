"use client";

import { FC, useMemo, useState } from "react";
import { LuLocateFixed } from "react-icons/lu";
import { Skeleton } from "@/shared/radix-ui";
import { SaveStatus } from "@/shared/ui";
import {
  isLanguage,
  LANGUAGE_LABELS,
  LANGUAGES,
  useLanguage,
  useTranslation,
} from "@/shared/i18n";
import {
  browserTimeZone,
  EXPLANATION_LANGUAGES,
  IProfileUpdate,
  QUESTION_LANGUAGE,
  useProfile,
} from "@/entities/profile";
import { useProfileUpdate } from "../hooks/useProfileUpdate";
import { control, Field } from "./field";

type FieldName = keyof IProfileUpdate;

// Every field saves on its own: selects on change, text when the field is left
export const ProfileForm: FC = () => {
  const { t } = useTranslation();
  const { setLanguage } = useLanguage();
  const { profileData } = useProfile();
  const { updateProfile, updateProfileIsPending, updateProfileIsError } = useProfileUpdate();
  const [savingField, setSavingField] = useState<FieldName | null>(null);
  const [draft, setDraft] = useState({ nativeLanguage: "", studyLanguage: "", nickname: "" });

  const timeZones = useMemo(() => {
    try {
      return Intl.supportedValuesOf("timeZone");
    } catch {
      return [];
    }
  }, []);
  const browserZone = browserTimeZone();

  // Text fields follow the server copy until the user types
  const [syncedProfile, setSyncedProfile] = useState<typeof profileData>();
  if (profileData && profileData !== syncedProfile) {
    setSyncedProfile(profileData);
    setDraft({
      nativeLanguage: profileData.nativeLanguage ?? "",
      studyLanguage: profileData.studyLanguage ?? "",
      nickname: profileData.nickname ?? "",
    });
  }

  if (!profileData) {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 5 }, (_, index) => (
          <Skeleton key={index} className="h-16 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  const save = (field: FieldName, body: IProfileUpdate) => {
    setSavingField(field);
    updateProfile(body);
  };

  const status = (field: FieldName) => (
    <SaveStatus
      isPending={updateProfileIsPending && savingField === field}
      isError={updateProfileIsError}
    />
  );

  const saveText = (field: "nativeLanguage" | "studyLanguage" | "nickname") => {
    const value = draft[field].trim().replace(/\s+/g, " ");
    if (value !== (profileData[field] ?? "")) save(field, { [field]: value });
  };

  const interfaceName = isLanguage(profileData.interfaceLanguage)
    ? LANGUAGE_LABELS[profileData.interfaceLanguage].name
    : profileData.interfaceLanguage;

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field
        label={t("profile.timeZone")}
        status={status("timeZone")}
        hint={t("profile.timeZoneHint")}
        className="sm:col-span-2"
      >
        <div className="flex flex-col gap-2 sm:flex-row">
          <select
            className={control}
            value={profileData.timeZone ?? ""}
            onChange={(event) => save("timeZone", { timeZone: event.target.value })}
          >
            {!profileData.timeZone && <option value="">{t("profile.timeZoneUnknown")}</option>}
            {timeZones.map((zone) => (
              <option key={zone} value={zone}>
                {zone.replaceAll("_", " ")}
              </option>
            ))}
          </select>
          {browserZone && browserZone !== profileData.timeZone && (
            <button
              type="button"
              onClick={() => save("timeZone", { timeZone: browserZone })}
              className="inline-flex h-10 shrink-0 items-center justify-center gap-1.5 rounded-xl border border-dashed border-neutral-300 px-3 text-sm text-neutral-700 transition-colors hover:bg-neutral-100 dark:border-neutral-600 dark:text-neutral-200 dark:hover:bg-neutral-800"
            >
              <LuLocateFixed aria-hidden />
              {t("profile.useBrowserZone", { zone: browserZone.replaceAll("_", " ") })}
            </button>
          )}
        </div>
      </Field>

      <Field label={t("profile.interfaceLanguage")} status={status("interfaceLanguage")}>
        <select
          className={control}
          value={profileData.interfaceLanguage}
          onChange={(event) => {
            const next = event.target.value;
            if (!isLanguage(next)) return;
            save("interfaceLanguage", { interfaceLanguage: next });
            setLanguage(next);
          }}
        >
          {LANGUAGES.map((code) => (
            <option key={code} value={code} lang={code}>
              {LANGUAGE_LABELS[code].name}
            </option>
          ))}
        </select>
      </Field>

      <Field
        label={t("profile.explanationLanguage")}
        status={status("explanationLanguage")}
        hint={t("profile.explanationHint")}
      >
        <select
          className={control}
          value={profileData.explanationLanguage ?? ""}
          onChange={(event) => save("explanationLanguage", { explanationLanguage: event.target.value })}
        >
          <option value="">{t("profile.explanationAsInterface", { language: interfaceName })}</option>
          <option value={QUESTION_LANGUAGE}>{t("profile.explanationAsQuestion")}</option>
          {EXPLANATION_LANGUAGES.map(({ code, name }) => (
            <option key={code} value={code} lang={code}>
              {name}
            </option>
          ))}
        </select>
      </Field>

      <Field label={t("profile.nativeLanguage")} status={status("nativeLanguage")}>
        <input
          className={control}
          value={draft.nativeLanguage}
          maxLength={40}
          placeholder={t("profile.nativeLanguagePlaceholder")}
          onChange={(event) => setDraft((prev) => ({ ...prev, nativeLanguage: event.target.value }))}
          onBlur={() => saveText("nativeLanguage")}
        />
      </Field>

      <Field label={t("profile.studyLanguage")} status={status("studyLanguage")}>
        <input
          className={control}
          value={draft.studyLanguage}
          maxLength={40}
          placeholder={t("profile.studyLanguagePlaceholder")}
          onChange={(event) => setDraft((prev) => ({ ...prev, studyLanguage: event.target.value }))}
          onBlur={() => saveText("studyLanguage")}
        />
      </Field>

      <Field label={t("profile.nickname")} status={status("nickname")} hint={t("profile.nicknameHint")}>
        <input
          className={control}
          value={draft.nickname}
          maxLength={40}
          autoComplete="nickname"
          onChange={(event) => setDraft((prev) => ({ ...prev, nickname: event.target.value }))}
          onBlur={() => saveText("nickname")}
        />
      </Field>
    </div>
  );
};
