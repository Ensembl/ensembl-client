import React, { ReactElement } from 'react';

import SingleLineSpeciesWrapper, {
  Props as SingleLineSpeciesWrapperProps
} from './SingleLineSpeciesWrapper';
import MultiLineSpeciesWrapper from './MultiLineSpeciesWrapper';

type Props = {
  isWrappable: boolean;
  speciesTabs: ReactElement<any>[]; // FIXME any
  link?: React.ReactNode;
};

const SpeciesTabsWrapper = (props: Props) => {
  return props.isWrappable ? (
    <MultiLineSpeciesWrapper {...props} />
  ) : (
    <SingleLineSpeciesWrapper {...(props as SingleLineSpeciesWrapperProps)} />
  );
};

SpeciesTabsWrapper.defaultProps = {
  isWrappable: true
};

export default SpeciesTabsWrapper;
