import { Strand } from './strand';

export type Slice = {
  location: {
    start: number;
    end: number;
  };
  region: {
    name: string;
    strand: {
      code: Strand;
      value?: number;
    };
  };
};

export type SliceWithLocationOnly = {
  location: {
    start: number;
    end: number;
  };
};
