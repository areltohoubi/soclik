"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const activityData = [
  { day: "Mon", value: 35 },
  { day: "Tue", value: 60 },
  { day: "Wed", value: 45 },
  { day: "Thu", value: 80 },
  { day: "Fri", value: 70 },
  { day: "Sat", value: 50 },
  { day: "Sun", value: 85 },
];

export function ActivityChart() {
  const max = Math.max(...activityData.map((d) => d.value));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.25 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Content activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-between gap-2 h-40">
            {activityData.map((item) => (
              <div
                key={item.day}
                className="flex flex-1 flex-col items-center gap-2"
              >
                <div
                  className="w-full max-w-[30px] rounded-t-md bg-indigo-500 transition-all duration-500 hover:bg-indigo-600"
                  style={{ height: `${(item.value / max) * 100}%` }}
                />
                <span className="text-xs text-slate-500">{item.day}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
