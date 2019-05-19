import React from 'react';

type Props = {
  error: Error;
};

const BrowserError = (props: Props) => {
  console.log('Browser error component received error', props.error);
  return <span>Oopsie!</span>;
};

export default BrowserError;
