import { defineConfig, presetIcons, presetMini, presetWebFonts } from 'unocss'

export default defineConfig({
  presets: [
      presetMini(),
      presetIcons({ /* options */ }),
      presetWebFonts({
        provider: 'google',
        fonts: {
            code: 'JetBrains Mono',
            norm: 'Inter',
        },
      }),
  ],
  rules: [
      ['nm', {
      'border-radius': '13px',
      'background': '#0E0E0E',
      'box-shadow': '10px 10px 20px #060606, -10px -10px 20px #161616',
    }],
    ['iw', { // item width
      'width': '175px',
    }],
    ['sw', { // section width
        'width': '75%',
    }],
  ],
  theme: {
    colors: {
        primary: '#D60026',
        light: '#FAF7FF',
        dark: '#0E0E0E',
        offDark: '#1e1e1e',
        slightDark: '#1D1D1D',
    }
  }
});
