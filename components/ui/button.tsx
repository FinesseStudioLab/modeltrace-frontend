import { ButtonHTMLAttributes, forwardRef, ElementType } from "react";
import styles from "./ui.module.css";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  as?: ElementType;
  href?: string;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", size = "md", as: Component = "button", ...props }, ref) => {
    const variantClass = {
      primary: styles.btnPrimary,
      secondary: styles.btnSecondary,
      ghost: styles.btnGhost,
    }[variant];

    const sizeClass = {
      sm: styles.btnSm,
      md: styles.btnMd,
      lg: styles.btnLg,
    }[size];

    const rootClass = [styles.button, variantClass, sizeClass, className].filter(Boolean).join(" ");

    return <Component ref={ref} className={rootClass} {...props} />;
  }
);
Button.displayName = "Button";

