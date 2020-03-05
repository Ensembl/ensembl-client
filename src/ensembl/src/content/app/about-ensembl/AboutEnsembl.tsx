import React from 'react';

import { DocLayout } from 'src/shared/components/layout';
import docStyles from 'src/shared/components/layout/DocLayout.scss';
import styles from './AboutEnsembl.scss';

const AboutEnsembl = () => {
  return (
    <div className={styles.aboutEnsembl}>
      <DocLayout mainContent={<Page />} sidebarContent={<Links />} />
    </div>
  );
};

const Page = () => {
  return (
    <>
      <h1>The Ensembl project</h1>
      <p>
        The Ensembl project was started in 1999, some years before the draft
        human genome was completed. Even at that early stage it was clear that
        manual annotation of 3 billion base pairs of sequence would not be able
        to offer researchers timely access to the latest data. The goal of
        Ensembl was therefore to automatically annotate the genome, integrate
        this annotation with other available biological data and make all this
        publicly available via the web.
      </p>
      <p>
        Since the original website's launch in July 2000, many more genomes have
        been added to Ensembl and the range of available data has also expanded
        to include comparative genomics, variation and regulatory data. This new
        site will bring together all Ensembl species from across the taxonomic
        range and provide new interactive displays to enhance analysis of our
        genomic data.
      </p>
    </>
  );
};

const Links = () => {
  return (
    <>
      <p className={docStyles.runningHeader}>About Ensembl</p>
      <ul>
        <li className={docStyles.current}>
          <a href="/app/about-ensembl">The Ensembl project</a>
        </li>
        <li>Contact Us</li>
        <li>
          <a href="https://www.ensembl.info">Blog</a>
        </li>
      </ul>
    </>
  );
};

export default AboutEnsembl;
