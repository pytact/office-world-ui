// Typography Tokens
// From ui_foundation.config.md - Section 4
// Using system fonts for default appearance

export const typography = {
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', 'Arial', sans-serif",
  fontFamilySystem:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  fontSize: {
    h1: "clamp(2rem, 5vw, 3rem)",
    h2: "clamp(1.75rem, 4vw, 2.5rem)",
    h3: "clamp(1.5rem, 3vw, 2rem)",
    h4: "clamp(1.25rem, 2.5vw, 1.75rem)",
    h5: "clamp(1.125rem, 2vw, 1.5rem)",
    h6: "clamp(1rem, 1.5vw, 1.25rem)",
    body: "clamp(0.875rem, 1vw, 1rem)",
    small: "clamp(0.75rem, 0.875vw, 0.875rem)",
    caption: "clamp(0.625rem, 0.75vw, 0.75rem)",
  },
  lineHeight: {
    h1: 1.2,
    h2: 1.3,
    h3: 1.4,
    h4: 1.4,
    h5: 1.5,
    h6: 1.5,
    body: 1.6,
    small: 1.5,
    caption: 1.4,
  },
};

