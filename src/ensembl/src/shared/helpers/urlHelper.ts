import queryString from 'query-string';

export const speciesSelector = () => '/app/species-selector';
export const customDownload = () => '/app/custom-download';

type BrowserUrlParams = {
  genomeId?: string | null;
  focus?: string | null;
  location?: string | null;
};

type EntityViewerUrlParams = {
  genomeId?: string | null;
  entityId?: string;
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

export const entityViewer = (params?: EntityViewerUrlParams) => {
  if (!params?.genomeId && params?.entityId) {
    // this should never happen; this combination doesn't make sense
    throw 'Malformed Entity Viewer url';
  }
  const genomeId = params?.genomeId || '';
  const entityId = params?.entityId || '';

  return `/app/entity-viewer/${genomeId}/${entityId}`;
};
