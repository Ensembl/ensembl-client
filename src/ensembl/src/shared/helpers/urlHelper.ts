import queryString from 'query-string';

export const speciesSelector = () => '/app/species-selector';
export const customDownload = () => '/app/custom-download';

type BrowserUrlParams = {
  genomeId?: string | null;
  focus?: string | null;
  location?: string | null;
};

export const browser = (params?: BrowserUrlParams) => {
  if (params) {
    const path = `/app/browser/${params.genomeId}`;
    const query = queryString.stringify(
      {
        focus: params.focus,
        location: params.location || undefined // have to use undefined, because if location is null it will still get in query
      },
      {
        encode: false
      }
    );
    return query ? `${path}?${query}` : path;
  } else {
    return `/app/browser/`;
  }
};
