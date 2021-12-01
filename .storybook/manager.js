import { addons } from '@storybook/addons';
import { create as createTheme } from '@storybook/theming/create';

const ensemblTheme = createTheme({
  base: 'light',
  brandTitle: 'Ensembl storybook',
  brandUrl: 'https://ensembl.org'  
});

addons.setConfig({
  theme: ensemblTheme
});
