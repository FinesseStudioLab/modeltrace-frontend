import { HTMLAttributes } from "react";
import styles from "./ui.module.css";

interface StatProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
  value: string | number;
}

export function Stat({ label, value, className = "", ...props }: StatProps) {
  return (
    <div className={[styles.stat, className].filter(Boolean).join(" ")} {...props}>
      <p className={styles.statLabel}>{label}</p>
      <strong className={styles.statValue}>{value}</strong>
    </div>
  );
}

