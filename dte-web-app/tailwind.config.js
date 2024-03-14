/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
      extend: {
        colors: {
          steelblue: {
            "100": "#5e8aba",
            "200": "#456fa0",
            "300": "#395576",
          },
          white: "#fff",
          slategray: "#5e7a9c",
          deepskyblue: "#63b4ff",
          lavender: "#e6eaff",
          gray: {
            "100": "#898989",
            "200": "#87827f",
            "300": "rgba(0, 0, 0, 0.49)",
          },
          black: "#000",
          indianred: {
            "100": "#c76b6b",
            "200": "#c26b6b",
            "300": "#c65656",
            "400": "#a85050",
            "500": "#a04545",
          },
          lightcoral: "#e07070",
          gainsboro: {
            "100": "#e6e6e6",
            "200": "#e2e2e2",
            "300": "#dedede",
          },
          seagreen: {
            "100": "#5e9c6e",
            "200": "#397646",
          },
          darkslategray: "#454545",
          red: {
            "100": "#f30707",
            "200": "#ff0000",
          },
          dimgray: "#747070",
          limegreen: "#08d304",
          tomato: "#ff4343",
          whitesmoke: "#e9e9e9",
          lightgray: {
            "100": "#cfcfcf",
            "200": "#cecece",
          },
        },
        spacing: {},
        fontFamily: {
          "inria-sans": "'Inria Sans'",
          inter: "Inter",
        },
        borderRadius: {
          mini: "15px",
          "3xs": "10px",
          "6xs": "7px",
          "11xl": "30px",
        },
      },
      fontSize: {
        lg: "18px",
        xs: "12px",
        mini: "15px",
        "3xl": "22px",
        xl: "20px",
        "6xl": "25px",
        "3xs": "10px",
        "11xl": "30px",
        inherit: "inherit",
      },
      screens: {
        mq1700: {
          raw: "screen and (max-width: 1700px)",
        },
        mq1325: {
          raw: "screen and (max-width: 1325px)",
        },
        mq900: {
          raw: "screen and (max-width: 900px)",
        },
        mq450: {
          raw: "screen and (max-width: 450px)",
        },
        mq408: {
          raw: "screen and (max-width: 408px)",
        },
        mq390: {
          raw: "screen and (max-width: 390px)",
        },
        mq328: {
          raw: "screen and (max-width: 328px)",
        },
        mq312: {
          raw: "screen and (max-width: 312px)",
        },
      },
    },
    corePlugins: {
      preflight: false,
    },
  };
  