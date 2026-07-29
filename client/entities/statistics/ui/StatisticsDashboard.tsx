import { OverviewStamp } from "./OverviewStamp";
import { AttemptTrendChart } from "./AttemptTrendChart";
import { DifficultyRings } from "./DifficultyRings";
import { ConfidenceCalibrationBars } from "./ConfidenceCalibrationBars";
import { TagPerformanceList } from "./TagPerformanceList";
import { StudyStreakStrip } from "./StudyStreakStrip";

export function StatisticsDashboard() {
  return (
    <div className="flex justify-center items-center max-w-3xl flex-col gap-6 lg:p-6">
      <OverviewStamp />
      <AttemptTrendChart />

      <div className="grid gap-6 sm:grid-cols-2">
        <DifficultyRings />
        <ConfidenceCalibrationBars />
      </div>

      <TagPerformanceList />
      <StudyStreakStrip />
    </div>
  );
}
