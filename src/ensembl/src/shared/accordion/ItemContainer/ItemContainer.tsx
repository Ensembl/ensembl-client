// tslint:disable:max-classes-per-file

import React from 'react';

export type UUID = string | number;

export type ProviderProps = {
  children?: React.ReactNode;
  uuid: UUID;
};

export type ItemContainer = {
  uuid: UUID;
};

// Arbitrary, but ought to be unique to avoid context namespace clashes.
export const CONTEXT_KEY = 'ItemContainer';

export class Provider extends React.Component<ProviderProps> {
  public static childContextTypes: { [CONTEXT_KEY](): null } = {
    [CONTEXT_KEY]: (): null => null
  };

  public getChildContext(): { [CONTEXT_KEY]: ItemContainer } {
    const { uuid } = this.props;
    const context: ItemContainer = {
      uuid
    };

    return {
      [CONTEXT_KEY]: context
    };
  }

  public render(): React.ReactNode {
    return this.props.children || null;
  }
}

type ConsumerProps = {
  children(container: ItemContainer): React.ReactNode;
};

type ConsumerState = {};

type ConsumerContext = {
  [CONTEXT_KEY](): null;
};

export class Consumer extends React.Component<
  ConsumerProps,
  ConsumerState,
  ConsumerContext
> {
  public static contextTypes: ConsumerContext = {
    [CONTEXT_KEY]: (): null => null
  };

  public render(): React.ReactNode {
    return this.props.children(this.context[CONTEXT_KEY]);
  }
}

export const getItemStore = <T extends { [CONTEXT_KEY]: ItemContainer }>(
  context: T
): ItemContainer | undefined => {
  return context[CONTEXT_KEY];
};
