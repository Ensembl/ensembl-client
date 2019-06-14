export const speciesSelector = () => '/app/species-selector';
export const customDownload = () => '/app/custom-download';
export const browser = (genomeId: string, focus: string, region: string) =>
  `/app/browser/${genomeId}/focus=${focus}&region=${region}`;
