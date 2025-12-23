import type { Config } from "tailwindcss";
import { colors } from "./theme/tokens/colors";
import { spacing } from "./theme/tokens/spacing";
import { typography } from "./theme/tokens/typography";
import { borderRadius } from "./theme/tokens/borders";
import { shadows } from "./theme/tokens/shadows";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./modules/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: colors.primary,
        "primary-hover": colors.primaryHover,
        secondary: colors.secondary,
        "secondary-hover": colors.secondaryHover,
        "neutral-base": colors.neutralBase,
        "background-primary": colors.backgroundPrimary,
        "background-secondary": colors.backgroundSecondary,
        "background-neutral": colors.backgroundNeutral,
        "background-dark": colors.backgroundDark,
        "text-primary": colors.textPrimary,
        "text-secondary": colors.textSecondary,
        "text-muted": colors.textMuted,
        "text-disabled": colors.textDisabled,
        "text-inverse": colors.textInverse,
        success: colors.success,
        "success-bg": colors.successBg,
        "success-text": colors.successText,
        warning: colors.warning,
        "warning-bg": colors.warningBg,
        "warning-text": colors.warningText,
        error: colors.error,
        "error-bg": colors.errorBg,
        "error-text": colors.errorText,
        info: colors.info,
        "info-bg": colors.infoBg,
        "info-text": colors.infoText,
        "border-default": colors.borderDefault,
        "border-focus": colors.borderFocus,
        "border-error": colors.borderError,
        "border-light": colors.borderLight,
      },
      spacing: spacing,
      borderRadius: {
        none: borderRadius.none,
        sm: borderRadius.sm,
        md: borderRadius.md,
        max: borderRadius.max,
      },
      boxShadow: {
        none: shadows.none,
        sm: shadows.sm,
        md: shadows.md,
        lg: shadows.lg,
        card: shadows.card,
        elevated: shadows.elevated,
      },
      fontFamily: {
        sans: [typography.fontFamilySystem],
        serif: [typography.fontFamily],
      },
      fontSize: typography.fontSize,
      fontWeight: typography.fontWeight,
      lineHeight: typography.lineHeight,
    },
  },
  plugins: [],
};

export default config;

