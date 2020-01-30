export const assetsUrl = '/static';
export const imgBaseUrl = `${assetsUrl}/img`;

export enum BreakpointWidth {
  PHONE = 0,
  TABLET = 600,
  LAPTOP = 900,
  DESKTOP = 1200,
  BIG_DESKTOP = 1800
}

export enum AppName {
  GENOME_BROWSER = 'Genome browser',
  SPECIES_SELECTOR = 'Species selector',
  CUSTOM_DOWNLOADS = 'Custom downloads',
  ENTITY_VIEWER = 'Entity viewer'
}

export const globalMediaQueries: Record<
  keyof typeof BreakpointWidth,
  string
> = {
  PHONE: 'screen and (max-width: 599px)',
  TABLET: 'screen and (min-width: 600px) and (max-width: 899px)',
  LAPTOP: 'screen and (min-width: 900px) and (max-width: 1199px)',
  DESKTOP: 'screen and (min-width: 1200px) and (max-width: 1799px)',
  BIG_DESKTOP: 'screen and (min-width: 1800px)'
};
