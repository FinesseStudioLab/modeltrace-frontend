import { HTMLAttributes } from "react";
import styles from "./ui.module.css";

type BadgeVariant = "default" | "success" | "warning" | "danger" | "neutral";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export function Badge({ className = "", variant = "default", ...props }: BadgeProps) {
  const variantClass = {
    default: styles.badgeDefault,
    success: styles.badgeSuccess,
    warning: styles.badgeWarning,
    danger: styles.badgeDanger,
    neutral: styles.badgeNeutral,
  }[variant];

  const rootClass = [styles.badge, variantClass, className].filter(Boolean).join(" ");
  
  return <span className={rootClass} {...props} />;
}

