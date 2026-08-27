import styles from "./charts.module.css";
import { getMessages } from "@/lib/i18n";
import { formatNumber } from "@/lib/i18n/formatters";

interface DataTableProps {
  caption: string;
  /** Header for the first column — the dimension the rows are keyed by. */
  rowHeader: string;
  columns: string[];
  rows: Array<{ label: string; color?: string; values: number[] }>;
  unit?: string;
  /** Appends a total row. Off for charts where a total is meaningless. */
  showTotals?: boolean;
}

/**
 * The numeric view of a chart.
 *
 * Every chart in this set ships one. For a compliance product an auditor wants
 * the numbers regardless, and having them is also what satisfies the
 * text-alternative requirement — one artefact, both jobs.
 */
export function DataTable({
  caption,
  rowHeader,
  columns,
  rows,
  unit,
  showTotals = false,
}: DataTableProps) {
  const m = getMessages();
  const totals = columns.map((_, i) => rows.reduce((sum, r) => sum + (r.values[i] ?? 0), 0));
  // formatNumber reads the active locale — no hardcoded "en-US".
  const withUnit = (n: number) =>
    unit ? `${formatNumber(n)} ${unit}` : formatNumber(n);

  return (
    <table className={styles.table}>
      <caption className={styles.summary}>{caption}</caption>
      <thead>
        <tr>
          <th scope="col">{rowHeader}</th>
          {columns.map((column) => (
            <th key={column} scope="col">
              {column}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.label}>
            <th scope="row">
              {row.color ? (
                <span
                  className={styles.tableSwatch}
                  style={{ background: row.color }}
                  aria-hidden="true"
                />
              ) : null}
              {row.label}
            </th>
            {columns.map((column, i) => (
              <td key={column}>{withUnit(row.values[i] ?? 0)}</td>
            ))}
          </tr>
        ))}
      </tbody>
      {showTotals ? (
        <tfoot>
          <tr>
            <th scope="row">{m.dataTable.totalRowHeader}</th>
            {totals.map((total, i) => (
              <td key={columns[i]}>{withUnit(total)}</td>
            ))}
          </tr>
        </tfoot>
      ) : null}
    </table>
  );
}
