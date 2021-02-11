/**
 * See the NOTICE file distributed with this work for additional information
 * regarding copyright ownership.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { useState, useEffect } from 'react';
import AccordionStore, {
  InjectedButtonAttributes,
  InjectedHeadingAttributes,
  InjectedPanelAttributes
} from '../helpers/AccordionStore';
import { UUID } from './ItemContext';

export interface ProviderProps {
  preExpanded: UUID[];
  allowMultipleExpanded?: boolean;
  allowZeroExpanded?: boolean;
  children?: React.ReactNode;
  onChange?(args: UUID[]): void;
}

export interface AccordionContext {
  allowMultipleExpanded: boolean;
  allowZeroExpanded: boolean;
  toggleExpanded(uuid: UUID): void;
  isItemDisabled(uuid: UUID): boolean;
  isItemExpanded(uuid: UUID): boolean;
  getPanelAttributes(uuid: UUID): InjectedPanelAttributes;
  getHeadingAttributes(uuid: UUID): InjectedHeadingAttributes;
  getButtonAttributes(uuid: UUID): InjectedButtonAttributes;
}

const Context = React.createContext(null as AccordionContext | null);

export const Provider = (props: ProviderProps) => {
  const [store, setStore] = useState(
    new AccordionStore({
      allowMultipleExpanded: props.allowMultipleExpanded,
      allowZeroExpanded: props.allowZeroExpanded,
      expanded: props.preExpanded
    })
  );

  useEffect(() => {
    if (props.onChange) {
      props.onChange(store.expanded);
    }
  }, [store.expanded]);

  useEffect(() => {
    const differences = store.expanded.filter(
      (uuid) => !props.preExpanded.includes(uuid)
    ).length;

    if (store.expanded.length !== props.preExpanded.length || differences) {
      setStore(store.setExpanded(props.preExpanded));
    }
  }, [props.preExpanded]);

  const toggleExpanded = (key: UUID): void => {
    setStore(store.toggleExpanded(key));
  };

  const isItemDisabled = (key: UUID): boolean => {
    return store.isItemDisabled(key);
  };

  const isItemExpanded = (key: UUID): boolean => {
    return store.isItemExpanded(key);
  };

  const getPanelAttributes = (key: UUID): InjectedPanelAttributes => {
    return store.getPanelAttributes(key);
  };

  const getHeadingAttributes = (): InjectedHeadingAttributes => {
    return store.getHeadingAttributes();
  };

  const getButtonAttributes = (key: UUID): InjectedButtonAttributes => {
    return store.getButtonAttributes(key);
  };

  const { allowZeroExpanded, allowMultipleExpanded } = store;

  return (
    <Context.Provider
      value={{
        allowMultipleExpanded,
        allowZeroExpanded,
        getButtonAttributes,
        getHeadingAttributes,
        getPanelAttributes,
        isItemDisabled,
        isItemExpanded,
        toggleExpanded
      }}
    >
      {props.children || null}
    </Context.Provider>
  );
};

Provider.defaultProps = {
  allowMultipleExpanded: false,
  allowZeroExpanded: false,
  preExpanded: []
};
export class Consumer extends React.PureComponent<{
  children(container: AccordionContext): React.ReactNode;
}> {
  public renderChildren = (
    container: AccordionContext | null
  ): React.ReactNode => {
    return container ? this.props.children(container) : null;
  };

  public render(): JSX.Element {
    return <Context.Consumer>{this.renderChildren}</Context.Consumer>;
  }
}
