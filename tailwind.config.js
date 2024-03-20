const { nextui } = require('@nextui-org/react')

/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ['class'],
    content: [
        './pages/**/*.{ts,tsx}',
        './components/**/*.{ts,tsx}',
        './app/**/*.{ts,tsx}',
        './src/**/*.{ts,tsx}',
        './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
    ],
    prefix: '',
    theme: {
        container: {
            center: true,
            padding: '2rem',
            screens: {
                '2xl': '1400px',
            },
        },
        extend: {
            colors: {
                'aiot-blue': '#005072',
                'aiot-blue-md': '#0d596e',
                'aiot-blue-m': '#1c6269',
                'aiot-blue-ml': '#2c6c64',
                'aiot-blue-l': '#437a5c',
                'aiot-green-l': '#558556',
                'aiot-green-ml': '#6c944e',
                'aiot-green-m': '#91ab42',
                'aiot-green': '#aebd38',
            },
        },
    },
    plugins: [nextui()],
}
