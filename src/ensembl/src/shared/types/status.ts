/*
  This file contains the Status enumerable type.
  The Status type does not correspond to any single thing,
  but rather serves as a collection of various possible statuses
  that various things may have.
*/

// To developer: for easier checking of which statuses are available,
// please add new variants to the enum in the alphabetical order
export enum Status {
  ACTIVE = 'active',
  DISABLED = 'disabled',
  DEFAULT = 'default',
  HIGHLIGHTED = 'highlighted',
  INACTIVE = 'inactive',
  OPEN = 'open',
  CLOSED = 'closed'
}
