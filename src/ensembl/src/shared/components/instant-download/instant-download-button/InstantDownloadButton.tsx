import React from 'react';

import { PrimaryButton } from 'src/shared/components/button/Button';

type Props = {
  isDisabled?: boolean;
  className?: string;
  onClick: () => void;
};

const InstantDownloadButton = (props: Props) => {
  return <PrimaryButton {...props}>Download</PrimaryButton>;
};

export default InstantDownloadButton;
