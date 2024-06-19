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
      'border-radius': '43px',
      'background': '#0E0E0E',
      'box-shadow': '30px 30px 40px #060606, -30px -30px 40px #161616',
    }],
  ],
  theme: {
    colors: {
        primary: '#D60026',
        light: '#FAF7FF',
        dark: '#0E0E0E',
        offDark: '#1e1e1e',
    }
  }
});
