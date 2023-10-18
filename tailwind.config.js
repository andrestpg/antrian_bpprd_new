module.exports = {
    content: [
      "./views/public/**/*.ejs", 
      "./assets/public_template/src/*.css", 
      "./assets/public_template/js/*.js", 
    ],
    theme: {
        extend: {},
    },
    plugins: [require("daisyui")],

    daisyui: {
        themes: [
            {
                light: {
                    primary: "#0066ff",
                    secondary: "#d8dde6",
                    accent: "#24292e",
                    neutral: "#15191c",
                    "base-100": "#ffffff",
                    info: "#4795ea",
                    success: "#00C897",
                    warning: "#F5D866",
                    error: "#DD2241",
                },
                dark: {
                    primary: "#0066ff",
                    secondary: "#93ABD3",
                    accent: "#24292e",
                    neutral: "#15191c",
                    "base-100": "#24292e",
                    info: "#3ABFF8",
                    success: "#00C897",
                    warning: "#FF8E00",
                    error: "#FF4848",
                },
            },
        ],
        styled: true,
        base: true,
        utils: true,
        logs: true,
        rtl: false,
        darkTheme: "dark",
    },
};
