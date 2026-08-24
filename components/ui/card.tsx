import { HTMLAttributes } from "react";
import styles from "./ui.module.css";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
}

export function Card({ className = "", interactive, ...props }: CardProps) {
  const rootClass = [
    styles.card,
    interactive && styles.cardInteractive,
    className
  ].filter(Boolean).join(" ");
  
  return <div className={rootClass} {...props} />;
}

