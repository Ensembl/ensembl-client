const getCustomDownloadPreviewResults = async (
  attributes: any,
  filters: any
) => {
  let endpoint = 'http://gti-es-0.ebi.ac.uk:8080/api/genes/query?query=';

  let endpointFields = '';
  attributes.forEach((attribute: any) => {
    endpointFields += attribute[2] + ',';
  });

  const endpointFilters: any = {
    genome: 'homo_sapiens'
  };

  Object.keys(filters).forEach((filter: string) => {
    endpointFilters[filter] = filters[filter];
  });

  endpoint =
    endpoint +
    JSON.stringify(endpointFilters) +
    '&fields=' +
    endpointFields +
    '&sort=id&array=true';
  try {
    console.log(endpoint);
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    return await response.json();
  } catch (error) {
    throw error;
  }
};

export default getCustomDownloadPreviewResults;
