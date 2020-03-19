// TODO: Need updating
type Option = {
  value: string;
  label: string;
};

type ExternalLink = {
  label: string | null;
  url: string;
  anchor_text: string;
};

type Assembly = {
  species_name: string;
  assembly_name: string;
  stable_id: string;
};

type Allele = {
  allele_name: string;
  stable_id: string;
};

enum DataSetType {
  'Current assembly',
  'Gene',
  'Protein'
}

type DataSet = {
  type: DataSetType;
  stable_id: string;
};

type Homeologue = {
  type: string;
  stable_id: string;
};

type Strain = {
  strain_name: string;
  stable_id: string;
};

type AdditionalAttribute = {
  description: string;
  displayName: string;
  code: string;
};

export type EntityViewerSidebarResponse = {
  gene_symbol: string;
  gene_name: string;
  stable_id: string;
  dbprimary_acc: string; // HGNC:1101
  synonyms: string[];
  additional_attributes: AdditionalAttribute[];
  function: {
    description: string | null;
    provider: ExternalLink;
  };
  sequence: {
    transcripts: Option[];
    gene: Option[]; // Find out if there is any indication to enable these options
    tark_url: ExternalLink;
  };
  other_data_sets: DataSet[];
  other_assemblies: {
    assemblies: Assembly[];
    strains: Strain[];
  };
  homeologues: Homeologue[];
  alternative_alleles: Allele[];
  external_references: ExternalLink[];
};

export const entityViewResponse = {
  gene: {
    symbol: 'BRCA2',
    name: 'BRCA2, DNA repair associated',
    stable_id: 'ENSG00000139618.15',
    synonyms: ['BRCC2', 'FACD', 'FAD', 'FAD1', 'FANCD', 'FANCD1', 'XRCC11'],
    attributes: ['protein coding', 'another attribute'],
    function: {
      description: `Involved in double-strand break repair and/or homologous
                recombination. Binds RAD51 and potentiates recombinational DNA
                repair by promoting assembly of RAD51 onto singlestranded DNA
                (ssDNA). Acts by targeting RAD51 to ssDNA over double-stranded
                DNA, enabling RAD51 to displace replication protein-A (RPA) from
                ssDNA and stabilizing RAD51-ssDNA filaments by blocking ATP
                hydrolysis. May participate in S phase checkpoint activation.
                Binds selectively to ssDNA, and to ssDNA in tailed duplexes and
                replication fork structures. In concert with NPM1, regulates
                centrosome duplication`,
      source: {
        name: 'UniProt',
        value: 'P51587',
        url: 'https://www.uniprot.org/uniprot/P51587'
      }
    },
    transcript: {
      sequence: {
        filters: [
          {
            value: 'Genomic sequence',
            label: 'Genomic sequence'
          },
          {
            value: 'cDNA',
            label: 'cDNA'
          },
          {
            value: 'CDS',
            label: 'CDS'
          },
          {
            value: 'Protein sequence',
            label: 'Protein sequence'
          }
        ]
      },
      tark_url: 'http://betatark.ensembl.org/web/search/'
    }
  },
  other_assemblies: [
    {
      speciesName: 'Human',
      assemblyName: 'GRCh37',
      stableId: 'ENSG00000139618'
    }
  ],
  other_date_sets: [
    { label: 'Current assembly', value: 'GRCh38.p13' },
    { label: 'Gene', value: 'ENSG00000139618.15' }
  ],
  homeologues: [
    {
      type: 'Gene',
      stableId: 'TraesCS3A02G274400'
    },
    {
      type: 'Gene',
      stableId: 'TraesCS3B02G308100'
    }
  ],
  publications: [
    {
      title: 'Identification of the breast cancer susceptibility gene BRCA2.',
      description:
        'Wooster R, Bignell G, Lancaster J, Swift S, Seal S, Mangion J, Collins N, Gregory S, Gumbs C, Micklem G, Barfoot R, Hamoudi R, Patel S, Rice C, Biggs P, Hashim Y, Smith A, Connor F, Stratton MR',
      linkUrl: '',
      linkText: 'Europe PMC',
      sourceDescription: ''
    },
    {
      title:
        'The complete BRCA2 gene and mutations in chromosome 13q-linked kindreds',
      description:
        'Tavtigian SV, Simard J, Rommens J, Couch F, Shattuck-Eidens D, Neuhausen S, Merajver S, Thorlacius S, Offit K, Stoppa-Lyonnet D, Belanger C, Bell R, Berry S, Bogden R, Chen Q, Davis T, Dumont M, Frye C, Goldar DE',
      linkUrl: '',
      linkText: 'Europe PMC',
      sourceDescription: ''
    },
    {
      title: '',
      description: '',
      linkUrl: '',
      linkText: 'NIEHS SNPs program',
      sourceDescription:
        'Submitted (OCT-2003) to the EMBL/GenBank/DDBJ databases'
    },
    {
      title: 'The DNA sequence and analysis of human chromosome 13.',
      description:
        'Dunham A, Matthews LH, Burton J, Ashurst JL, Howe KL, Ashcroft KJ, Beare DM, Burford DC, Hunt SE, Griffiths-Jones S, Jones MC, Keenan SJ, Oliver K, Scott CE, Ainscough R, Almeida JP, Ambrose KD, Andrews DT, Ross MT',
      linkUrl: '',
      linkText: 'Europe PMC',
      sourceDescription: ''
    },
    {
      title:
        'Germline BRCA2 6174delT mutations in Ashkenazi Jewish pancreatic cancer patients.',
      description:
        'Ozcelik H, Schmocker B, Di Nicola N, Shi X H, Langer B, Moore M, Taylor BR, Narod SA, Darlington G, Andrulis IL, Gallinger S, Redston M',
      linkUrl: '',
      linkText: 'Europe PMC',
      sourceDescription: ''
    }
  ]
};
