/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: '#ffffff',
                foreground: '#1c1917', // Stone 900 (Dark Grey/Black)
                primary: '#84CC16', // Bereschoon Green (Lime) - Main Brand Color
                'primary-foreground': '#ffffff',
                secondary: '#2D2420', // Dark Warm Brown/Grey (Neutralized)
                'secondary-foreground': '#ffffff',
                accent: '#06b6d4', // Cyan/Teal (Water/Cleaning accents)
                'accent-foreground': '#ffffff',
                muted: '#F5F5F4', // Warm grey
                'muted-foreground': '#78716C', // Stone grey
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'], // We'll need to remember to import Inter or use a system font stack that looks good
            },
        },
    },
    plugins: [],
}
