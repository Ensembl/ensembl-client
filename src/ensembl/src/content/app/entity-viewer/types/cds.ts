export type CDS = {
  protein?: {
    id: string;
    length: number;
  };
  start: number;
  end: number;
  relative_location: {
    start: number;
    end: number;
  };
};
