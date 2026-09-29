import { getBusinessHours, getBusinessInfo } from "@/lib/data/business-info";
import { BusinessInfoForm } from "@/components/admin/BusinessInfoForm";
import { BusinessHoursForm } from "@/components/admin/BusinessHoursForm";

export const dynamic = "force-dynamic";

export default async function BusinessInfoPage() {
  const [businessInfo, hours] = await Promise.all([
    getBusinessInfo(),
    getBusinessHours(),
  ]);

  if (!businessInfo) {
    return <p className="text-sm text-red-600">No business_info row found. Run the seed migration.</p>;
  }

  return (
    <div className="space-y-12">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink-900">Business info</h1>
        <div className="mt-6">
          <BusinessInfoForm businessInfo={businessInfo} />
        </div>
      </div>

      <div>
        <h2 className="font-display text-xl font-bold text-ink-900">Weekly hours</h2>
        <div className="mt-6">
          <BusinessHoursForm hours={hours} />
        </div>
      </div>
    </div>
  );
}
