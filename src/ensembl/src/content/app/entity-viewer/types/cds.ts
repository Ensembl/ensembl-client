export type CDS = {
  start: number;
  end: number;
  protein_length?: number;
  relative_location: {
    start: number;
    end: number;
  };
};
