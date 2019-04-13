import React from 'react';
import { Checkbox } from 'src/shared';

type Props = {
  gridData: any;
  columns: number;
};

const renderCheckBoxList = (checkboxList: any, title?: string) => {
  if (!Object.keys(checkboxList).length) {
    return null;
  }

  // Sort the list by labels
  const sortedList: any = {};

  Object.keys(checkboxList)
    .sort()
    .forEach(function(key) {
      sortedList[key] = checkboxList[key];
    });

  type listItemProp = {
    id: string;
    label: string;
    status: boolean;
  };
  return (
    <>
      <div>{title ? title : null}</div>
      {sortedList.map((listItem: listItemProp, key: number) => {
        return (
          <Checkbox
            key={key}
            label={listItem.label}
            checked={listItem.status}
          />
        );
      })}
    </>
  );
};

const CheckBoxGrid = (props: Props) => {
  console.log(props);

  return <>{renderCheckBoxList(props.gridData.default, 'Default')}</>;
};

export default CheckBoxGrid;
