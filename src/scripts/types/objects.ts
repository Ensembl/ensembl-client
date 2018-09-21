import { RefObject, ReactEventHandler } from 'react';

export type ReactRefs = {
  [key: string]: RefObject<HTMLElement>;
};

export type EventHandlers = {
  [key: string]: ReactEventHandler;
};
