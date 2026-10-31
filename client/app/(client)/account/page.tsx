import { FC } from "react";
import { BlockColumn, Title } from "@/shared/ui";
import { AccountSettings } from "@/widgets/AccountSettings";
import { getServerT } from "@/shared/i18n/server";

const Account: FC = async () => {
  const { t } = await getServerT();

  return (
    <BlockColumn>
      <Title text={t("nav.account")} />
      <AccountSettings />
    </BlockColumn>
  );
};

export default Account;
