import { FC } from "react";
import { Title } from "@/shared/ui";
import { getServerT } from "@/shared/i18n/server";

const ErrorPage: FC = async () => {
  const { t } = await getServerT();

  return (
    <div className="flex justify-center items-center w-full h-[90vh] py-10">
      <div>
        <Title text={t("errors.generic")} />
      </div>
    </div>
  );
};

export default ErrorPage;
