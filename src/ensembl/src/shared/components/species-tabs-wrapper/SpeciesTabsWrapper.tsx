import React from 'react';

import SingleLineSpeciesWrapper, {
  Props as SingleLineSpeciesWrapperProps
} from './SingleLineSpeciesWrapper';
import MultiLineSpeciesWrapper, {
  Props as MultiLineSpeciesWrapperProps
} from './MultiLineSpeciesWrapper';

type Props = SingleLineSpeciesWrapperProps | MultiLineSpeciesWrapperProps;

const SpeciesTabsWrapper = (props: Props) => {
  return props.isWrappable ? (
    <MultiLineSpeciesWrapper {...props} />
  ) : (
    <SingleLineSpeciesWrapper {...props} />
  );
};

SpeciesTabsWrapper.defaultProps = {
  isWrappable: true
};

export default SpeciesTabsWrapper;
