export const getColumnStyle = (color: string) => ({
   '--c': color,
   background: `
    linear-gradient(
      135deg,
      color-mix(in srgb, var(--c) 26%, transparent),
      color-mix(in srgb, var(--c) 8%, transparent)
    )
  `,
   border: `
    1px solid color-mix(in srgb, var(--c) 36%, transparent)
  `,
} as React.CSSProperties);
