import React from 'react';
import GridWrapper from '~common/gridwrapper/GridWrapper';
import { DocumentsOverviewGridToolbar } from './DocumentsOverviewGridToolbar';
import { documentsGridSettings } from '../../constants/documents-overview-grid.constants';
import { columnNames } from '../../../../constants/documents-grid.constants';
import { DocumentsGridUtil } from '../../utils/documents-grid.util';

export class DocumentsOverviewGrid extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedDocuments: [],
      isPrintDisabled: false,
    };
  }

  fetchRows = (...params) => {
    const { getDocuments } = this.props;
    this.setState({ selectedDocuments: [] });
    return getDocuments(...params);
  };

  handleDocumentsBundleClick = () => {
    const { isBundleForceDisabled, onDocumentsBundle } = this.props;
    const { selectedDocuments } = this.state;
    if (!isBundleForceDisabled) {
      onDocumentsBundle(selectedDocuments);
    }
  };

  handleDownloadClick = () => {
    const { onDocumentsDownload } = this.props;
    const { selectedDocuments } = this.state;
    onDocumentsDownload(selectedDocuments);
  };

  handleMultiSelectDelete = () => {
    const { onDocumentsDelete } = this.props;
    const { selectedDocuments } = this.state;
    if (selectedDocuments.length) {
      onDocumentsDelete(selectedDocuments);
    }
  };

  handleCellClick = (event) => {
    const { data, colDef } = event;
    const { field } = colDef;
    const { onDocumentEdit, onDocumentsDelete } = this.props;

    if (!data.hasPermission) return;
    if (field === columnNames.editItem) {
      onDocumentEdit(data);
    } else if (field === columnNames.deleteItem) {
      onDocumentsDelete([data]);
    }
  };

  handleCellFocus = (event) => {
    if (!event.column) return;
    const isDeleteItemColumn = event.column.colId === columnNames.deleteItem;
    const isEditItemColumn = event.column.colId === columnNames.editItem;

    // eslint-disable-next-line no-param-reassign
    event.api.gridOptionsWrapper.gridOptions.suppressRowClickSelection = isDeleteItemColumn || isEditItemColumn;
  };

  handleSelectionChange = (params) => {
    const selectedDocuments = params.api.getSelectedRows();
    const { onSelectionChange } = this.props;
    onSelectionChange(selectedDocuments);
    const hasSelectedDocuments = selectedDocuments[0] && !DocumentsGridUtil.isRowEmpty(selectedDocuments[0]);
    this.setState({ selectedDocuments: hasSelectedDocuments ? selectedDocuments : [] });
  };

  handlePrintSelectedDocuments = () => {
    const { selectedDocuments } = this.state;
    const { onPrintDocuments } = this.props;
    if (selectedDocuments.length) {
      this.setState({ isPrintDisabled: true });
      onPrintDocuments(selectedDocuments).finally(() => {
        this.setState({ isPrintDisabled: false });
      });
    }
  };

  renderCustomToolbar = () => {
    const {
      shouldShowBundleDocuments,
      shouldDisableBulkDelete,
      isDownloadDisabled,
      isPrintForceDisabled,
      isBundleForceDisabled,
    } = this.props;
    const { selectedDocuments, isPrintDisabled } = this.state;

    return (
      <DocumentsOverviewGridToolbar
        shouldShowBundleDocuments={shouldShowBundleDocuments}
        shouldDisableDocumentsBundling={isBundleForceDisabled || selectedDocuments.length < 2}
        onDeleteClick={this.handleMultiSelectDelete}
        onDownloadClick={this.handleDownloadClick}
        onDocumentsBundleClick={this.handleDocumentsBundleClick}
        shouldDisableBulkDelete={shouldDisableBulkDelete}
        onPrintClick={this.handlePrintSelectedDocuments}
        isDownloadDisabled={isDownloadDisabled}
        isPrintDisabled={isPrintForceDisabled || isPrintDisabled}
      />
    );
  };

  render() {
    const { fetchRequired, onGridUpdated } = this.props;

    return (
      <div className="documents-overview-grid">
        <GridWrapper
          gridName={documentsGridSettings.gridName}
          columns={documentsGridSettings.documentsColumnSettingsList}
          rowClassRules={documentsGridSettings.rowClassRules}
          rowSelection={documentsGridSettings.rowSelection}
          filteringOptions={documentsGridSettings.filteringOptions}
          showCustomFilters={documentsGridSettings.showCustomFilters}
          onSelectionChanged={this.handleSelectionChange}
          onCellClicked={this.handleCellClick}
          onCellFocused={this.handleCellFocus}
          onGridUpdated={onGridUpdated}
          fetchRows={this.fetchRows}
          renderCustomToolbar={this.renderCustomToolbar}
          fetchRequired={fetchRequired}
        />
      </div>
    );
  }
}
