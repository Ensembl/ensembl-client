import React from 'react';

import { EnsObject } from 'src/shared/state/ens-object/ensObjectTypes';

type Props = {
  gene: EnsObject;
};

const GeneSummaryStrip = (props: Props) => {
  return <div>{props.gene.label}</div>;
};

export default GeneSummaryStrip;
