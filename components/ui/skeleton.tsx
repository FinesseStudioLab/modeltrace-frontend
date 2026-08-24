import { HTMLAttributes } from "react";
import styles from "./ui.module.css";

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  width?: string | number;
  height?: string | number;
}

export function Skeleton({ width, height, className = "", style, ...props }: SkeletonProps) {
  return (
    <div
      className={[styles.skeleton, className].filter(Boolean).join(" ")}
      style={{ width, height, ...style }}
      {...props}
    />
  );
}

