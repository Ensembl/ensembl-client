export type ProteinDomainsResources = {
  [name_of_resource: string]: {
    name: string;
    domains: [
      {
        name: string;
        source_uri: string;
        source: {
          name: string;
          uri: string;
        };
        location: {
          start: number;
          end: number;
        };
        score: number;
      }
    ];
  };
};

export enum ProductType {
  PROTEIN = 'protein'
}

export type Product = {
  type: ProductType;
  stable_id: string;
  length: number;
  protein_domains_resources: ProteinDomainsResources;
};
