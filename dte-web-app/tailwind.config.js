/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            colors: {
                steelblue: "#395576",
                white: "#fff",
                slategray: "#5e7a9c",
                deepskyblue: "#63b4ff",
                lavender: "#e6eaff",
                gray: "#87827f",
                black: "#000",
            },
            spacing: {},
            fontFamily: {
                "inria-sans": "'Inria Sans'",
                inter: "Inter",
            },
            borderRadius: {
                mini: "15px",
                "3xs": "10px",
            },
        },
        fontSize: {
            lg: "18px",
            xs: "12px",
            mini: "15px",
            "3xl": "22px",
            inherit: "inherit",
        },
    },
    corePlugins: {
        preflight: false,
    },
};