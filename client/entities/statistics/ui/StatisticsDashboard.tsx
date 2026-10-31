"use client";

import { MotionConfig, motion } from "framer-motion";
import { OverviewStamp } from "./OverviewStamp";
import { AttemptTrendChart } from "./AttemptTrendChart";
import { DifficultyRings } from "./DifficultyRings";
import { ConfidenceCalibrationBars } from "./ConfidenceCalibrationBars";
import { TagPerformanceList } from "./TagPerformanceList";
import { StudyStreakStrip } from "./StudyStreakStrip";
import { stagger } from "./../lib/motion";

export function StatisticsDashboard() {
  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="mx-auto grid w-full max-w-5xl gap-6 md:grid-cols-2"
      >
        <OverviewStamp />
        <AttemptTrendChart />
        <DifficultyRings />
        <ConfidenceCalibrationBars />
        <TagPerformanceList />
        <StudyStreakStrip />
      </motion.div>
    </MotionConfig>
  );
}
