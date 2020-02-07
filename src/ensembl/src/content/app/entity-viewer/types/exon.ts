export type Exon = {
  id: string;
  slice: {
    location: {
      start: number;
      end: number;
    };
  };
  relative_location: {
    start: number;
    end: number;
  };
};
