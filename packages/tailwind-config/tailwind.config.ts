// import type { Config } from 'tailwindcss/types/config';
//
// export default {
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// } as Omit<Config, 'content'>;
import baseConfig from '@extension/tailwindcss-config';
import { withUI } from '@extension/ui';

export default withUI({
  ...baseConfig,
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
});
