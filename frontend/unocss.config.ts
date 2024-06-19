import { defineConfig, presetIcons, presetMini, presetWebFonts } from 'unocss'

export default defineConfig({
  presets: [
      presetMini(),
      // npm install -D @iconify-json/[the-collection-you-want]
      presetIcons({ /* options */ }),
      presetWebFonts({
        provider: 'google',
        fonts: {
            code: 'JetBrains Mono',
        },
      }),
  ],
  rules: [
      ['nm', {
      'border-radius': '30px',
      'background': '#0E0E0E',
      'box-shadow': '26px 26px 52px #060606, -26px -26px 52px #161616',
    }],
  ],
  theme: {
    colors: {
        primary: '#D60026',
        light: '#FAF7FF',
        dark: '#0E0E0E',
        offDark: '#242230',
    }
  }
});
