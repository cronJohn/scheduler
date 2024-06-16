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
});
