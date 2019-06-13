import React from 'react';

import { ZmenuData } from './zmenu-types';

type Props = ZmenuData & {
  browserRef: React.RefObject<HTMLDivElement>;
  onEnter: () => void;
  onLeave: () => void;
};

const Zmenu = (props: Props) => {
  return <div>I am zmenu</div>;
};

export default Zmenu;
