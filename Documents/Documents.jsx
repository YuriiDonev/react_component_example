import React from 'react';
import PropTypes from 'prop-types';
import { documentsModes } from './constants/documents.constants';
import { DocumentsService } from './services/documents.service';
import { DocumentsOverview } from './containers/DocumentsOverview/DocumentsOverview';
import { DocumentsBundling } from './containers/DocumentsBundling/DocumentsBundling';

export class Documents extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      documentsToBundle: [],
    };
  }

  handleDocumentsBundleOpen = (documentsToBundle) => {
    this.setState({ documentsToBundle });
  };

  handleDocumentsBundlingClose = () => {
    this.setState({ documentsToBundle: [] });
  };

  handleDownloadDocuments = (documentIds) => {
    const { caseId } = this.props;
    return DocumentsService.downloadDocuments(documentIds, caseId);
  };

  handleDocumentsBundleUpload = async (documentApiKeys) => {
    const { launchDocumentsBundleUpload } = this.props;
    const documents = await launchDocumentsBundleUpload();
    await DocumentsService.uploadBundleDocuments(documentApiKeys, documents[0] || {});
  };

  render() {
    const {
      mode,
      caseId,
      beneId,
      user,
      launchDocumentEdit,
      launchDocumentUpload,
      printSelectedDocuments,
    } = this.props;
    const { documentsToBundle } = this.state;

    return documentsToBundle.length ? (
      <DocumentsBundling
        documents={documentsToBundle}
        onClose={this.handleDocumentsBundlingClose}
        onDocumentsBundleUpload={this.handleDocumentsBundleUpload}
        onPrintDocuments={printSelectedDocuments}
      />
    ) : (
      <DocumentsOverview
        user={user}
        beneId={beneId}
        caseId={caseId}
        mode={mode}
        launchDocumentEdit={launchDocumentEdit}
        launchDocumentUpload={launchDocumentUpload}
        onDocumentsBundleClick={this.handleDocumentsBundleOpen}
        onPrintDocuments={printSelectedDocuments}
        onDownloadDocuments={this.handleDownloadDocuments}
      />
    );
  }
}

Documents.defaultProps = {
  caseId: undefined,
  beneId: undefined,
};

Documents.propTypes = {
  caseId: PropTypes.string,
  beneId: PropTypes.string,
  launchDocumentUpload: PropTypes.func.isRequired,
  launchDocumentEdit: PropTypes.func.isRequired,
  printSelectedDocuments: PropTypes.func.isRequired,
  mode: PropTypes.oneOf([
    documentsModes.caseDocuments,
    documentsModes.profileDocuments,
  ]).isRequired,
};
