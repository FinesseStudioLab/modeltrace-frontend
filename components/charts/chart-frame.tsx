import type { ReactNode } from "react";
import styles from "./charts.module.css";
import type { ChartBaseProps, ChartState } from "./types";

export interface LegendEntry {
  label: string;
  color: string;
  /** Repeats the non-colour cue used in the plot, so the legend is legible
   *  without colour too. */
  pattern?: string;
}

interface ChartFrameProps extends ChartBaseProps {
  legend?: LegendEntry[];
  /** Rendered inside a `<details>` beneath the plot. For a compliance product
   *  the numbers are the deliverable, not a fallback. */
  table?: ReactNode;
  tableLabel?: string;
  /** Set on plots with an axis: below a legibility floor they scroll at
   *  native size rather than shrinking their tick labels into noise. */
  wide?: boolean;
  children: ReactNode;
}

const STATE_COPY: Record<Exclude<ChartState, "ready">, string> = {
  loading: "Loading chart data…",
  empty: "No data for this period.",
  error: "Chart data could not be loaded.",
};

/**
 * The shell every chart renders inside.
 *
 * It exists so that the three surfaces needing charts cannot drift: the title,
 * the text alternative, the legend, the data table, and all three
 * not-ready states are decided once here rather than per chart and per page.
 *
 * The plot itself is marked `role="img"` with the summary as its accessible
 * name. A screen reader gets the finding in one sentence and the full numbers
 * from the table; it never has to walk the SVG.
 */
export function ChartFrame({
  title,
  summary,
  state = "ready",
  errorMessage,
  legend,
  table,
  tableLabel = "Show data table",
  wide = false,
  children,
}: ChartFrameProps) {
  const notReady = state !== "ready";

  return (
    <figure className={styles.frame}>
      <figcaption className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.summary}>{summary}</p>
      </figcaption>

      {notReady ? (
        state === "loading" ? (
          <div className={styles.skeleton} role="status" aria-label={STATE_COPY.loading} />
        ) : (
          <p
            className={`${styles.state} ${state === "error" ? styles.stateError : ""}`}
            role={state === "error" ? "alert" : undefined}
          >
            {state === "error" ? (errorMessage ?? STATE_COPY.error) : STATE_COPY.empty}
          </p>
        )
      ) : (
        <>
          <div
            className={wide ? `${styles.plot} ${styles.plotWide}` : styles.plot}
            role="img"
            aria-label={summary}
          >
            {children}
          </div>

          {legend && legend.length > 1 ? (
            <ul className={styles.legend}>
              {legend.map((entry) => (
                <li key={entry.label} className={styles.legendItem}>
                  <span
                    className={styles.swatch}
                    style={{ background: entry.color }}
                    aria-hidden="true"
                  />
                  <span>
                    {entry.label}
                    {entry.pattern ? (
                      <span className={styles.summary}> · {entry.pattern}</span>
                    ) : null}
                  </span>
                </li>
              ))}
            </ul>
          ) : null}

          {table ? (
            <details className={styles.details}>
              <summary>{tableLabel}</summary>
              <div className={styles.tableWrap}>{table}</div>
            </details>
          ) : null}
        </>
      )}
    </figure>
  );
}

export { styles as chartStyles };
