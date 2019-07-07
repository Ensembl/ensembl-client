export const speciesSelector = () => '/app/species-selector';
export const customDownload = () => '/app/custom-download';

type BrowserUrlParams = {
  genomeId?: string | null;
  focus?: string | null;
  location?: string;
};

export const browser = (params?: BrowserUrlParams) => {
  if (params && params.genomeId) {
    if (params.focus && params.location) {
      return `/app/browser/${params.genomeId}?focus=${params.focus}&location=${params.location}`;
    }

    return `/app/browser/${params.genomeId}`;
  } else {
    return `/app/browser/`;
  }
};
