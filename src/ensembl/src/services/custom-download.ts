const getCustomDownloadPreviewResults = async (attributes: any) => {
  let endpoint =
    'http://gti-es-0.ebi.ac.uk:8080/api/genes/query?query={"genome":"homo_sapiens","biotype": "protein_coding"}&array=true&';

  let endpointFields = '';
  attributes.forEach((attribute: any) => {
    if (attribute[0] === 'gene') {
      endpointFields += attribute[2] + ',';
    } else {
      endpointFields += attribute[0] + '.' + attribute[2] + ',';
    }
  });

  endpoint = endpoint + 'fields=' + endpointFields + '&sort=' + endpointFields;
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
