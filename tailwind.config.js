/** @type {import('tailwindcss').Config} */
module.exports = {
  // Only apply hover: utilities on devices that actually support hover, so
  // decorative hover effects don't get "stuck" after a tap on a touchscreen.
  future: { hoverOnlyWhenSupported: true },
  darkMode: "class",
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#e9c176",
        "on-primary": "#412d00",
        background: "#131313",
        surface: "#131313",
        "on-surface": "#e4e2e1",
        "on-surface-variant": "#d1c5b4",
        outline: "#9a8f80",
        "outline-variant": "#4e4639",
        secondary: "#ccc6b9",
        "on-primary-container": "#4e3700",
        "on-error": "#690005",
        "on-primary-fixed": "#261900",
        "on-error-container": "#ffdad6",
        "primary-container": "#c5a059",
        "on-primary-fixed-variant": "#5d4201",
        "surface-container-highest": "#353535",
        "secondary-fixed": "#e9e2d5",
        "inverse-on-surface": "#303030",
        "surface-variant": "#353535",
        "on-secondary-fixed": "#1e1b13",
        "on-background": "#e4e2e1",
        "surface-tint": "#e9c176",
        "inverse-surface": "#e4e2e1",
        "secondary-fixed-dim": "#ccc6b9",
        "surface-bright": "#393939",
        "error-container": "#93000a",
        "secondary-container": "#4d493f",
        "tertiary-fixed-dim": "#ffb68c",
        "on-secondary-fixed-variant": "#4a463d",
        error: "#ffb4ab",
        "surface-container": "#1f2020",
        tertiary: "#ffb68c",
        "tertiary-container": "#fd8533",
        "on-tertiary": "#532200",
        "on-tertiary-fixed-variant": "#763400",
        "primary-fixed-dim": "#e9c176",
        "surface-container-high": "#2a2a2a",
        "inverse-primary": "#775a19",
        "on-secondary": "#333027",
        "tertiary-fixed": "#ffdbc9",
        "on-tertiary-container": "#642b00",
        "on-secondary-container": "#beb8ab",
        "surface-dim": "#131313",
        "primary-fixed": "#ffdea5",
        "surface-container-low": "#1b1c1c",
        "on-tertiary-fixed": "#321200",
        "surface-container-lowest": "#0e0e0e",
        "error-dim": "#bb5551",
        "secondary-dim": "#9c9da4",
        "tertiary-dim": "#ceccec",
        "primary-dim": "#b3b9c8"
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        headline: ["Inter"],
        body: ["Inter"],
        label: ["Inter"],
        display: ["Inter"]
      },
      borderRadius: {
        DEFAULT: "0.5rem",
        lg: "1rem",
        xl: "1.5rem",
        full: "9999px"
      },
      animation: {
        'orb-slow': 'orb 8s ease-in-out infinite alternate',
        'orb-medium': 'orb 6s ease-in-out infinite alternate-reverse',
        'orb-spin': 'spin 12s linear infinite',
        'flicker-fast': 'flicker 1.5s ease-in-out infinite alternate',
        'flicker-medium': 'flicker 2.5s ease-in-out infinite alternate',
        'flicker-slow': 'flicker 4s ease-in-out infinite alternate',
        'orbit-slow': 'orbit 30s linear infinite',
        'orbit-medium': 'orbit 20s linear infinite reverse',
        'orbit-fast': 'orbit 15s linear infinite',
      },
      keyframes: {
        orb: {
          '0%': { transform: 'scale(0.8)', opacity: 0.3 },
          '100%': { transform: 'scale(1.2)', opacity: 0.8 },
        },
        flicker: {
          '0%': { opacity: 0.2, transform: 'scale(0.7)' },
          '50%': { opacity: 1, transform: 'scale(1.2)' },
          '100%': { opacity: 0.5, transform: 'scale(0.9)' },
        },
        orbit: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries')
  ],
}