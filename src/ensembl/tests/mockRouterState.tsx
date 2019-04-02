import React from 'react';
import { createMemoryHistory } from 'history';
import { ConnectedRouter } from 'connected-react-router';
import { MemoryRouter } from 'react-router-dom';

// Reset history
const history = createMemoryHistory();

// Mock props
const props = {
  action: 'POP',
  location: {
    pathname: '/path/to/somewhere'
  },
  history
};

export const mockRouterState = {
  router: {
    action: 'POP',
    location: {
      pathname: '/path/to/somewhere'
    },
    history
  }
};

export const wrapInRouter = (node: any) => <MemoryRouter>{node}</MemoryRouter>;
