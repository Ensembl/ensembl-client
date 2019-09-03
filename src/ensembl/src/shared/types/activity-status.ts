export const ActivityStatuses = {
  ACTIVE: 'active' as 'active',
  INACTIVE: 'inactive' as 'inactive'
};

export type ActivityStatus = (typeof ActivityStatuses)[keyof typeof ActivityStatuses];
