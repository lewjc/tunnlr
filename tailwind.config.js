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
    },
  },
  plugins: [],
};
