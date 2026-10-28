import { TrainingManager } from "@/components/admin/training-manager";
import { AdminPageHeader } from "@/components/admin/ui";
import { readTrainingSettings } from "@/lib/training-store";

export const metadata = { title: "Training" };
export const instant = false;

export default async function AdminTrainingPage() {
  const settings = await readTrainingSettings();

  return (
    <div>
      <AdminPageHeader
        eyebrow="Studio"
        title="Training"
        description="Set next artist-training cohorts by month and year, list several intakes, or show “will be announced” — no calendar day on booking."
      />
      <TrainingManager initial={settings} />
    </div>
  );
}
