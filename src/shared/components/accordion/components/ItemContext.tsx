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

import * as React from 'react';
import {
  InjectedButtonAttributes,
  InjectedHeadingAttributes,
  InjectedPanelAttributes
} from '../helpers/AccordionStore';
import {
  AccordionContext,
  Consumer as AccordionContextConsumer
} from './AccordionContext';

export type UUID = string | number;

type ProviderProps = {
  children?: React.ReactNode;
  uuid: UUID;
  accordionContext: AccordionContext;
};

export type ProviderWrapperProps = Pick<
  ProviderProps,
  Exclude<keyof ProviderProps, 'accordionContext'>
>;

export type ItemContext = {
  uuid: UUID;
  expanded: boolean;
  disabled: boolean;
  panelAttributes: InjectedPanelAttributes;
  headingAttributes: InjectedHeadingAttributes;
  buttonAttributes: InjectedButtonAttributes;
  toggleExpanded(): void;
};

const Context = React.createContext(null as ItemContext | null);

const Provider = (props: ProviderProps) => {
  const toggleExpanded = (): void => {
    props.accordionContext.toggleExpanded(props.uuid);
  };

  const renderChildren = (accordionContext: AccordionContext): JSX.Element => {
    const { uuid } = props;

    const expanded = accordionContext.isItemExpanded(uuid);
    const disabled = accordionContext.isItemDisabled(uuid);
    const panelAttributes = accordionContext.getPanelAttributes(uuid);
    const headingAttributes = accordionContext.getHeadingAttributes(uuid);
    const buttonAttributes = accordionContext.getButtonAttributes(uuid);

    return (
      <Context.Provider
        value={{
          buttonAttributes,
          disabled,
          expanded,
          headingAttributes,
          panelAttributes,
          toggleExpanded: toggleExpanded,
          uuid
        }}
      >
        {props.children}
      </Context.Provider>
    );
  };

  return <AccordionContextConsumer>{renderChildren}</AccordionContextConsumer>;
};

const ProviderWrapper = (props: ProviderWrapperProps) => (
  <AccordionContextConsumer>
    {(accordionContext: AccordionContext) => (
      <Provider {...props} accordionContext={accordionContext} />
    )}
  </AccordionContextConsumer>
);

export { ProviderWrapper as Provider };

type ConsumerProps = {
  children(container: ItemContext): React.ReactNode;
};

export const Consumer = (props: ConsumerProps) => {
  const renderChildren = (container: ItemContext | null): React.ReactNode => {
    return container ? props.children(container) : null;
  };

  return <Context.Consumer>{renderChildren}</Context.Consumer>;
};
