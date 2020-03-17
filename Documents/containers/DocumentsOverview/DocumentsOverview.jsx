import React from 'react';
import Input from '~common/form/Input';
import {
  Button, ConfirmationModal, Icon, Notification,
} from '~common/UI';
import { DocumentsOverviewGrid } from './components/DocumentsOverviewGrid/DocumentsOverviewGrid';
import { DocumentsOverviewService } from './services/documents-overview.service';
import { documentsModes } from '../../constants/documents.constants';
import {
  pauseForUpdatingGridData, forbiddenFormatsForPrintNotification, forbiddenFormatsForBundleNotification, sortOrder,
} from './constants/documents-overview.constants';

export class DocumentsOverview extends React.Component {
  constructor(props) {
    super(props);
    this.documentsToDelete = [];
    this.state = {
      searchValue: '',
      fetchRequired: false,
      isPrintDisabled: false,
      isBundleDisabled: false,
      isDownloadDisabled: false,
      isDeletingInProgress: false,
      shouldShowNoDocumentsModal: false,
      shouldShowDeleteDocumentsModal: false,
      shouldShowBundleErrorNotification: false,
      shouldShowPrintErrorNotification: false,
    };
    this.gridAPI = null;
  }

  componentWillUnmount() {
    this.gridAPI = null;
  }

  getDocuments = async ({ pageNumber, pageSize, sorting }) => {
    const {
      beneId, caseId, mode, user,
    } = this.props;
    const { searchValue } = this.state;
    const { sort, colId } = sorting[0] || {};
    const { documents, totalCount } = await DocumentsOverviewService.getDocuments(
      mode,
      user,
      {
        beneId,
        caseId,
        pageSize,
        pageNumber,
        searchTerm: searchValue.length >= 3 ? searchValue : '',
        sortOrder: sort === sortOrder.asc.string ? sortOrder.asc.number : sortOrder.desc.number,
        orderBy: colId,
      },
    );
    return { rows: documents, totalRowCount: totalCount };
  };

  handleSearchBlur = () => {
    this.setState(({ fetchRequired }) => ({ fetchRequired: !fetchRequired }));
  };

  handleSearchChange = (event) => {
    this.setState({ searchValue: event.target.value });
  };

  handleDocumentEdit = (documentToEdit) => {
    const { launchDocumentEdit } = this.props;
    launchDocumentEdit(documentToEdit.id).then(() => this.updateGrid());
  };

  handleAddDocument = () => {
    const { launchDocumentUpload } = this.props;
    launchDocumentUpload().then(() => this.updateGrid());
  };

  handleDocumentsDownload = (documentsToDownload) => {
    if (documentsToDownload.length) {
      this.setState({ isDownloadDisabled: true });
      const documentIds = documentsToDownload.map((document) => document.id);
      const { onDownloadDocuments } = this.props;
      onDownloadDocuments(documentIds).finally(() => {
        this.setState({ isDownloadDisabled: false });
      });
    }
  };

  handleDocumentsDelete = (documentsToDelete) => {
    this.documentsToDelete = documentsToDelete;
    this.setState({ shouldShowDeleteDocumentsModal: true });
  };

  handleDeleteConfirmation = () => {
    this.setState({ isDeletingInProgress: true });

    const documentIds = this.documentsToDelete.map(({ id }) => id);
    DocumentsOverviewService.deleteDocuments(documentIds).finally(() => {
      this.handleDeleteConfirmationClose();
      this.updateGrid();
    });
  };

  handleDeleteConfirmationClose = () => {
    this.documentsToDelete = [];
    this.setState({
      isDeletingInProgress: false,
      shouldShowDeleteDocumentsModal: false,
    });
  };

  handleDocumentsBundleClick = (documents) => {
    if (documents.length < 2) {
      this.setState({ shouldShowNoDocumentsModal: true });
    } else {
      const { onDocumentsBundleClick } = this.props;
      onDocumentsBundleClick(documents);
    }
  };

  handleNoDocumentsModalClose = () => {
    this.setState({ shouldShowNoDocumentsModal: false });
  };

  handleSelectionChange = (documents) => {
    const hasForbiddenFileFormatForPrint = DocumentsOverviewService.hasForbiddenFileFormatForPrint(documents);
    const hasForbiddenFileFormatForBundle = DocumentsOverviewService.hasForbiddenFileFormatForBundle(documents);
    const hasAllowedFileFormatForPrint = DocumentsOverviewService.hasAllowedFileFormatForPrint(documents);
    const isPrintDisabled = documents.length && !hasAllowedFileFormatForPrint;

    this.setState({
      isPrintDisabled,
      isBundleDisabled: hasForbiddenFileFormatForBundle,
      shouldShowPrintErrorNotification: hasForbiddenFileFormatForPrint,
      shouldShowBundleErrorNotification: hasForbiddenFileFormatForBundle,
    });
  };

  handleClosePrintErrorNotification = () => {
    this.setState({ shouldShowPrintErrorNotification: false });
  };

  handleCloseBundleErrorNotification = () => {
    this.setState({ shouldShowBundleErrorNotification: false });
  };

  handleGridUpdated = ({ api }) => {
    this.gridAPI = api;
    this.setState({
      isPrintDisabled: false,
      isBundleDisabled: false,
      shouldShowPrintErrorNotification: false,
      shouldShowBundleErrorNotification: false,
    });
  };

  updateGrid() {
    this.gridAPI.showLoadingOverlay();
    this.gridAPI.selectionController.deselectAllRowNodes();
    window.setTimeout(() => {
      this.setState(({ fetchRequired }) => ({
        fetchRequired: !fetchRequired,
      }));
    }, pauseForUpdatingGridData);
  }

  render() {
    const { user, mode, onPrintDocuments } = this.props;
    const title = mode === documentsModes.profileDocuments ? 'Profile Documents' : 'Case Documents';
    const {
      searchValue,
      fetchRequired,
      isPrintDisabled,
      isBundleDisabled,
      isDownloadDisabled,
      isDeletingInProgress,
      shouldShowNoDocumentsModal,
      shouldShowDeleteDocumentsModal,
      shouldShowPrintErrorNotification,
      shouldShowBundleErrorNotification,
    } = this.state;
    const shouldShowBundleDocuments = DocumentsOverviewService.shouldShowBundleDocuments(user, mode);
    const shouldShowAddDocuments = DocumentsOverviewService.shouldShowAddDocuments(mode);
    const shouldDisableBulkDelete = DocumentsOverviewService.shouldDisableBulkDelete(user);

    return (
      <React.Fragment>
        <div className="documents-overview">
          <div className="header">
            <div className="topbar">
              <div className="documents-search">
                <Icon name="search" className="search-icon" />
                <Input
                  customClassName="search-input"
                  placeholder="Search documents by name or type"
                  onChange={this.handleSearchChange}
                  value={searchValue}
                  onBlur={this.handleSearchBlur}
                />
              </div>
              {
                !shouldShowAddDocuments ? null : (
                  <div>
                    <Button className="add-document-button" color="green" onClick={this.handleAddDocument}>
                      <Icon className="add-document-icon" name="cloud-upload" />
                      <span>Add Document</span>
                    </Button>
                  </div>
                )
              }
            </div>
            {
              !shouldShowPrintErrorNotification ? null : (
                <Notification
                  type="warning"
                  className="forbidden-documents-formats"
                  onClose={this.handleClosePrintErrorNotification}
                >
                  {forbiddenFormatsForPrintNotification}
                </Notification>
              )
            }
            {
              !shouldShowBundleErrorNotification ? null : (
                <Notification
                  type="warning"
                  className="forbidden-documents-formats"
                  onClose={this.handleCloseBundleErrorNotification}
                >
                  {forbiddenFormatsForBundleNotification}
                </Notification>
              )
            }
            <div className="title">{title}</div>
          </div>
          <DocumentsOverviewGrid
            onDocumentEdit={this.handleDocumentEdit}
            onDocumentsDelete={this.handleDocumentsDelete}
            onDocumentsDownload={this.handleDocumentsDownload}
            onDocumentsBundle={this.handleDocumentsBundleClick}
            shouldShowBundleDocuments={shouldShowBundleDocuments}
            getDocuments={this.getDocuments}
            fetchRequired={fetchRequired}
            shouldDisableBulkDelete={shouldDisableBulkDelete}
            onPrintDocuments={onPrintDocuments}
            isDownloadDisabled={isDownloadDisabled}
            onSelectionChange={this.handleSelectionChange}
            isPrintForceDisabled={isPrintDisabled}
            isBundleForceDisabled={isBundleDisabled}
            onGridUpdated={this.handleGridUpdated}
          />
        </div>
        <div className="documents-overview-modal">
          {
            !shouldShowDeleteDocumentsModal ? null : (
              <ConfirmationModal
                className="document-delete-modal"
                title="Are you sure you want to delete these documents?"
                texts={{ confirm: 'YES', cancel: 'NO' }}
                onClose={this.handleDeleteConfirmationClose}
                onConfirm={this.handleDeleteConfirmation}
                disabled={isDeletingInProgress}
              >
                These documents will be deleted from all cases
              </ConfirmationModal>
            )
          }
          {
            !shouldShowNoDocumentsModal ? null : (
              <ConfirmationModal
                className="document-delete-modal"
                title="No selected documents​​​​​​​"
                texts={{ confirm: '', cancel: 'OK' }}
                onClose={this.handleNoDocumentsModalClose}
              >
                In order to proceed to the Bundle Documents page, please select more than one document
              </ConfirmationModal>
            )
          }
        </div>
      </React.Fragment>
    );
  }
}
