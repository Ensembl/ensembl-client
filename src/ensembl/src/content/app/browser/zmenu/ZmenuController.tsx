import React, { useState } from 'react';

import Zmenu from './Zmenu';

import { ZmenuData } from './zmenu-types';

type Props = {
  browserRef: React.RefObject<HTMLDivElement>;
};

const ZmenuController = (props: Props) => {
  return <Zmenu browserRef={props.browserRef} />;
};

export default ZmenuController;
