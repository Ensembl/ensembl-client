/*

Shape of a strain object:

{
  production_name: string;
  display_name: string;
};

*/

// result of request for strains of the reference mouse species

// QUESTION: what does the endpoint look like? It should accept reference species as a parameeter

export default {
  reference_species_name: 'mus_musculus', // <-- production name of reference species
  strains: [
    {
      production_name: 'mus_musculus', // <-- I guess the reference species is also included
      display_name: 'Mouse'
    },
    {
      production_name: 'mus_musculus_1',
      display_name: 'Mouse 129S1/SvImJ'
    },
    {
      production_name: 'mus_musculus_2',
      display_name: 'Mouse A/J'
    },
    {
      production_name: 'mus_musculus_3',
      display_name: 'Mouse AKR/J'
    },
    {
      production_name: 'mus_musculus_4',
      display_name: 'Mouse BALB/cJ'
    },
    {
      production_name: 'mus_musculus_5',
      display_name: 'Mouse C3H/HeJ'
    },
    {
      production_name: 'mus_musculus_6',
      display_name: 'Mouse C57BL/6NJ'
    },
    {
      production_name: 'mus_musculus_7',
      display_name: 'Mouse CAST/EiJ'
    },
    {
      production_name: 'mus_musculus_8',
      display_name: 'Mouse CBA/J'
    },
    {
      production_name: 'mus_musculus_9',
      display_name: 'Mouse DBA/2'
    },
    {
      production_name: 'mus_musculus_10',
      display_name: 'Mouse FVB/NJ'
    },
    {
      production_name: 'mus_musculus_11',
      display_name: 'Mouse LP/J'
    },
    {
      production_name: 'mus_musculus_12',
      display_name: 'Mouse NOD/ShiLtJ'
    },
    {
      production_name: 'mus_musculus_13',
      display_name: 'Mouse NZO/HlLtJ'
    }
  ]
};
