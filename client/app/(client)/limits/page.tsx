import { FC, Suspense } from "react";
import { LimitsOverview } from "@/widgets/LimitsOverview";
import { CheckoutReturn } from "@/features/billing/checkout-return";
import { getServerT } from "@/shared/i18n/server";

const Limits: FC = async () => {
  const { t } = await getServerT();

  return (
    <div className="flex w-full flex-col items-center px-4 pb-20">
      <div className="flex w-full max-w-5xl flex-col gap-6">
        <header className="flex flex-col gap-1">
          <h1 className="text-3xl! font-semibold! tracking-tight">{t("billing.page.title")}</h1>
          <p className="text-neutral-500">{t("billing.page.subtitle")}</p>
        </header>
        {/* Reads ?checkout= after Stripe sends the user back */}
        <Suspense fallback={null}>
          <CheckoutReturn />
        </Suspense>
        <LimitsOverview />
      </div>
    </div>
  );
};

export default Limits;
