import React, { ReactElement } from 'react';

type Props = {
  isWrappable: boolean;
  speciesTabs: ReactElement<any>[]; // FIXME any
  terminalLink?: React.ReactNode;
};

const SpeciesTabsWrapper = (props: Props) => {
  return props.isWrappable ? (
    <MultiLineWrapper {...props} />
  ) : (
    <SingleLineWrapper {...props} />
  );
};

SpeciesTabsWrapper.defaultProps = {
  isWrappable: true
};

const SingleLineWrapper = (props: Props) => {
  const speciesTabs = React.Children.map(
    props.speciesTabs,
    (node: ReactElement<any>) => {
      console.log(node.props);
      return node;
    }
  );
  return <div>{speciesTabs}</div>;
};

const MultiLineWrapper = (props: Props) => {
  return <div>{props.speciesTabs}</div>;
};

export default SpeciesTabsWrapper;
