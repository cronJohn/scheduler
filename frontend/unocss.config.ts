import { defineConfig, presetIcons, presetMini, presetWebFonts, toEscapedSelector as e} from 'unocss'

export default defineConfig({
    presets: [
        presetMini(),
        presetIcons({ /* options */ }),
        presetWebFonts({
            provider: 'google',
            fonts: {
                code: 'JetBrains Mono',
                norm: ['Rubik', 'Rubik:400,500,700'],
            },
        }),
    ],
    rules: [
        [/^text-(.*)$/, ([, c], { theme }) => {
            if (theme.colors[c])
                return { color: theme.colors[c] }
        }],
        ['nm', {
            'border-radius': '13px',
            'background': '#0E0E0E',
            'box-shadow': '10px 10px 20px #060606, -10px -10px 20px #161616',
        }],
        ['iw', { // item width
            'width': '175px',
        }],
        ['sw', { // section width
            'width': '100%',
        }],
        ['rt', {
            'font-size': 'clamp(1rem, 1.5vw + 1rem, 2rem)'
        }],
        ["ol", { // outline
            'outline-width': '0.5px',
        }],
        [/^bt$/, ([], { rawSelector, theme }) => { // button transition
            const selector = e(rawSelector);
            return `
            ${selector} {
                transition: background-color 0.2s, transform 0.2s;
            }
            ${selector}:hover {
                background-color: ${theme.colors.slightDark};
            }
            ${selector}:active {
                transform: scale(0.95);
            }
            `;
        }],
        [/^bb-(.+)$/, (match, { rawSelector, theme }) => {
            const [_, color] = match;
            const selector = e(rawSelector);

            const borderColor = theme.colors[color] || theme.colors.primary;

            return `
            ${selector} {
                border-width: 2px;
                border-style: solid;
                border-color: ${borderColor};
            }
            `;
        }],
    ],
    theme: {
        colors: {
            primary: '#D60026',
            light: '#FAF7FF',
            dark: '#0E0E0E',
            offDark: '#1e1e1e',
            slightDark: '#1D1D1D',
        },
        breakpoints: {
            sm: '584px',
            md: '768px',
            lg: '1024px',
            xl: '1280px',
            otherSm: '560px',
            maxSm: '967px',
        },
    }
});
