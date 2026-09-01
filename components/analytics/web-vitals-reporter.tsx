"use client";

/**
 * components/analytics/web-vitals-reporter.tsx
 *
 * Reports Core Web Vitals via Next's useReportWebVitals, per the issue.
 *
 * "Reported and visible" is satisfied two ways, deliberately not one:
 *   - In development, every metric is logged to the console as it lands —
 *     visible to anyone running the app locally, with no dashboard needed.
 *   - In production (when analytics is configured), each metric is sent as a
 *     Plausible custom event named "Web Vitals" with the metric name and
 *     rating as event properties. Plausible's dashboard is then where "visible"
 *     means something for a deployed site: the property breakdown shows the
 *     good/needs-improvement/poor split for each metric over time.
 *
 * The value sent is rounded per Web Vitals' own convention — whole
 * milliseconds for time-based metrics, thousandths for the unitless CLS —
 * because these are aggregated in a dashboard afterwards, and un-rounded
 * floating-point values would fragment otherwise-identical measurements into
 * separate property values.
 */

import { useReportWebVitals } from "next/web-vitals";
import { track } from "@/lib/analytics";

/** CLS is a unitless score; every other Web Vital is a duration in ms. */
function roundMetricValue(name: string, value: number): number {
  return name === "CLS" ? Math.round(value * 1000) / 1000 : Math.round(value);
}

export function WebVitalsReporter() {
  useReportWebVitals((metric) => {
    const value = roundMetricValue(metric.name, metric.value);

    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console -- deliberate: this is the local
      // "reported and visible" half of the acceptance criterion.
      console.debug(`[web-vitals] ${metric.name}: ${value} (${metric.rating})`);
    }

    track("Web Vitals", {
      metric: metric.name,
      rating: metric.rating,
      value,
    });
  });

  return null;
}
