import { HTMLAttributes, ThHTMLAttributes, TdHTMLAttributes, forwardRef } from "react";
import styles from "./ui.module.css";

export const Table = forwardRef<HTMLTableElement, HTMLAttributes<HTMLTableElement>>(
  ({ className = "", ...props }, ref) => (
    <div className={styles.tableContainer}>
      <table ref={ref} className={[styles.table, className].filter(Boolean).join(" ")} {...props} />
    </div>
  )
);
Table.displayName = "Table";

export const TableHeader = forwardRef<HTMLTableSectionElement, HTMLAttributes<HTMLTableSectionElement>>(
  ({ className = "", ...props }, ref) => (
    <thead ref={ref} className={className} {...props} />
  )
);
TableHeader.displayName = "TableHeader";

export const TableBody = forwardRef<HTMLTableSectionElement, HTMLAttributes<HTMLTableSectionElement>>(
  ({ className = "", ...props }, ref) => (
    <tbody ref={ref} className={className} {...props} />
  )
);
TableBody.displayName = "TableBody";

export const TableRow = forwardRef<HTMLTableRowElement, HTMLAttributes<HTMLTableRowElement>>(
  ({ className = "", ...props }, ref) => (
    <tr ref={ref} className={[styles.tableRow, className].filter(Boolean).join(" ")} {...props} />
  )
);
TableRow.displayName = "TableRow";

export const TableHead = forwardRef<HTMLTableCellElement, ThHTMLAttributes<HTMLTableCellElement>>(
  ({ className = "", ...props }, ref) => (
    <th ref={ref} className={className} {...props} />
  )
);
TableHead.displayName = "TableHead";

export const TableCell = forwardRef<HTMLTableCellElement, TdHTMLAttributes<HTMLTableCellElement>>(
  ({ className = "", ...props }, ref) => (
    <td ref={ref} className={className} {...props} />
  )
);
TableCell.displayName = "TableCell";

