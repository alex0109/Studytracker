"use client";

import { FC, Suspense } from "react";
import { LuDatabase, LuGraduationCap, LuTriangleAlert, LuUserRound } from "react-icons/lu";
import { useTranslation } from "@/shared/i18n";
import { LearningForm, ProfileForm } from "@/features/profile";
import { ExportAccountButton } from "@/features/account/export-account";
import { DeleteAccountButton } from "@/features/account/delete-account";
import { AccountSection } from "./account-section";

export const AccountSettings: FC = () => {
  const { t } = useTranslation();

  return (
    <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
      <AccountSection
        title={t("profile.title")}
        subtitle={t("profile.subtitle")}
        icon={<LuUserRound />}
        className="md:col-span-2"
      >
        <ProfileForm />
      </AccountSection>

      <AccountSection
        id="learning"
        title={t("learning.title")}
        subtitle={t("learning.subtitle")}
        icon={<LuGraduationCap />}
        className="md:col-span-2"
      >
        <LearningForm />
      </AccountSection>

      <AccountSection
        title={t("account.export.title")}
        subtitle={t("account.export.subtitle")}
        icon={<LuDatabase />}
      >
        <ExportAccountButton />
      </AccountSection>

      <AccountSection
        title={t("account.delete.sectionTitle")}
        subtitle={t("account.delete.sectionText")}
        icon={<LuTriangleAlert />}
        tone="danger"
      >
        {/* Only the button waits for the address (it reopens after a second sign in): a boundary
            around the forms would hydrate them after the profile arrived and break hydration */}
        <Suspense>
          <DeleteAccountButton />
        </Suspense>
      </AccountSection>
    </div>
  );
};
