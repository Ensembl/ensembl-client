/*

Shape of an assembly data object

{
  assembly_name: string;
};

*/

// should return a list of assemblies for a given strand

// Question: what does the endpoint look like?
// Question: an array or an array of arrays (i.e. of groups)?

export default {
  alternative_assemblies: [
    {
      assembly_name: 'GRCh38.p12',
      genome_id: 'mus_musculus_abd'
    },
    {
      assembly_name: 'GRCh37.p13',
      genome_id: 'mus_musculus_bdc'
    }
  ]
};
