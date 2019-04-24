/*

Shape of an assembly data object

{
  assembly_name: string;
};

*/

// should return a list of assemblies for a given strand

// Question: what does the endpoint look like?

export default {
  genome_id: 'mus_musculus',
  assemblies: [
    {
      assembly_name: 'GRCh38.p12'
    },
    {
      assembly_name: 'GRCh37.p13'
    }
  ]
};
