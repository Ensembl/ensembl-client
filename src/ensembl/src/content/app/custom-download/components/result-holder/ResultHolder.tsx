import React from 'react';
import styles from './ResultHolder.scss';

const ResultHolder = () => {
  const sampleData = Array(50).fill([
    'NAME',
    'ENST00000000000.0',
    'Lorem ipsum dolor sit amet nemore albucius sit id'
  ]);

  sampleData[0] = [
    'Transcript symbol',
    'Transcript stable ID',
    'Transcript name'
  ];

  const headerRow = sampleData.shift();

  return (
    <div className={styles.wrapper}>
      {sampleData.map((dataRow, resultKey) => {
        return (
          <div key={resultKey} className={styles.resultCard}>
            {headerRow.map((currentHeader: string, rowKey: number) => {
              return (
                <div key={rowKey} className={styles.resultLine}>
                  <div className={styles.lineHeader}>{currentHeader}</div>
                  <div className={styles.lineValue}>{dataRow[rowKey]}</div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default ResultHolder;
