module.exports = {
  purge: ["./dist/*.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {
      opacity: ["disabled"],
      pointerEvents: ["disabled"],
      cursor: ["disabled"],
      backgroundColor: ["disabled"],
    },
  },
  plugins: [
    require("@tailwindcss/forms")({
      strategy: "class",
    }),
  ],
};
