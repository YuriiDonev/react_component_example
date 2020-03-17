import React from 'react';
import { Button } from '~common/UI';
import { DocumentsBundlingGrid } from './components/DocumentsBundlingGrid/DocumentsBundlingGrid';
import { DocumentsBundlingService } from './services/documents-bundling.service';

export class DocumentsBundling extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gridUpdateRequired: false,
    };
    const { documents } = this.props;
    this.documents = documents;
  }

  getDocuments = () => Promise.resolve({
    rows: this.documents,
    totalRowCount: this.documents.length,
  });

  handleDocumentsDelete = (deletedDocument) => {
    const updatedDocuments = DocumentsBundlingService.deleteDocument(this.documents, deletedDocument.id);
    if (!updatedDocuments.length) {
      const { onClose } = this.props;
      onClose();
      return;
    }
    this.updateGrid(updatedDocuments);
  };

  handleDocumentsOrderChange = ({ fromIndex, toIndex }) => {
    const documentsCount = this.documents.length;
    const canReorderDocuments = DocumentsBundlingService.canReorderDocuments(documentsCount, toIndex);
    if (canReorderDocuments) {
      const updatedDocuments = DocumentsBundlingService.reorderDocuments(this.documents, fromIndex, toIndex);
      this.updateGrid(updatedDocuments);
    } else {
      DocumentsBundlingService.showDocumentOrderingRangeAlert(documentsCount);
    }
  };

  updateGrid = (updatedDocuments) => {
    this.documents = updatedDocuments;
    this.setState((state) => ({ gridUpdateRequired: !state.gridUpdateRequired }));
  };

  handleSaveClick = () => {
    this.launchDocumentsBundleUpload();
  }

  handlePrintAndSaveClick = () => {
    const { onPrintDocuments } = this.props;
    this.launchDocumentsBundleUpload().then(() => {
      onPrintDocuments(this.documents);
    });
  }

  launchDocumentsBundleUpload = () => {
    const { onDocumentsBundleUpload } = this.props;
    const documentApiKeys = this.documents.map((document) => document.documentApiKey);
    return onDocumentsBundleUpload(documentApiKeys);
  }

  render() {
    const { onClose } = this.props;
    const { gridUpdateRequired } = this.state;

    return (
      <div className="documents-bundling">
        <div className="header">
          <div className="title">Bundle Documents</div>
        </div>
        <DocumentsBundlingGrid
          onClose={onClose}
          getDocuments={this.getDocuments}
          gridUpdateRequired={gridUpdateRequired}
          onDocumentsOrderChange={this.handleDocumentsOrderChange}
          onDocumentsDelete={this.handleDocumentsDelete}
        />
        <div className="footer">
          <Button className="documents-bundling-button cancel-button" color="ghost-red" onClick={onClose}>
            cancel
          </Button>
          <div className="print-save-buttons">
            <Button
              className="documents-bundling-button confirm-button"
              color="green"
              onClick={this.handlePrintAndSaveClick}
            >
              print & save
            </Button>
            <Button
              className="documents-bundling-button save-button"
              onClick={this.handleSaveClick}
            >
              save
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
