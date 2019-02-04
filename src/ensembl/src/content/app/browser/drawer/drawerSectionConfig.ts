export type DrawerSection = {
  label: string;
  name: string;
};

export type DrawerSectionList = {
  [key: string]: DrawerSection[];
};

export const drawerSectionConfig: DrawerSectionList = {
  'track-one': [
    {
      label: 'Summary',
      name: 'summary'
    },
    {
      label: 'Miscellaneous',
      name: 'miscellaneous'
    }
  ],
  'track-two': []
};
