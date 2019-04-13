export type CustomDownloadState = Readonly<{
  preFilterStatuses: {};
  showPreFiltersPanel: boolean;
  selectedTabButton: string;
  dataToDownload: {};
  resultFilters: {};
}>;

export const defaultCustomDownloadState: CustomDownloadState = {
  preFilterStatuses: {},
  showPreFiltersPanel: true,
  selectedTabButton: 'data',
  dataToDownload: {
    gene: {
      default: {
        gene_symbol: {
          id: 'gene_symbol',
          label: 'Gene symbol',
          checkedStatus: false
        },
        gene_stable_id: {
          id: 'gene_stable_id',
          label: 'Gene stable ID',
          checkedStatus: false
        },
        gene_stable_id_version: {
          id: 'gene_stable_id_version',
          label: 'Gene stable ID version',
          checkedStatus: false
        },
        gene_name: {
          id: 'gene_name',
          label: 'Gene name',
          checkedStatus: false
        },
        gene_type: {
          id: 'gene_type',
          label: 'Gene type',
          checkedStatus: false
        },
        version_gene: {
          id: 'version_gene',
          label: 'Version (gene)',
          checkedStatus: false
        }
      },
      External: {
        gencode_basic_annotation: {
          id: 'gencode_basic_annotation',
          label: 'GENCODE basic annotation',
          checkedStatus: false
        },
        uniparc_id: {
          id: 'uniparc_id',
          label: 'UniParc ID',
          checkedStatus: false
        },
        ncbi_gene_id: {
          id: 'ncbi_gene_id',
          label: 'NCBI gene ID',
          checkedStatus: false
        },
        hgnc_symbol: {
          id: 'hgnc_symbol',
          label: 'HGNC symbol',
          checkedStatus: false
        },
        go_domain: { id: 'go_domain', label: 'GO domain', checkedStatus: false }
      }
    }
  },
  resultFilters: {}
};
