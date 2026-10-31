import { FC, Suspense } from "react";
import { BlockColumn, Title } from "@/shared/ui";
import { LimitsOverview } from "@/widgets/LimitsOverview";
import { CheckoutReturn } from "@/features/billing/checkout-return";
import { getServerT } from "@/shared/i18n/server";

const Limits: FC = async () => {
  const { t } = await getServerT();

  return (
    <BlockColumn>
      <Title text={t("nav.limits")} />
      {/* Reads ?checkout= after Stripe sends the user back */}
      <Suspense fallback={null}>
        <CheckoutReturn />
      </Suspense>
      <LimitsOverview />
    </BlockColumn>
  );
};

export default Limits;
