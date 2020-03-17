import React from 'react';
import { Icon, Button } from '~common/UI';

export const DocumentsOverviewGridToolbar = ({
  shouldDisableDocumentsBundling,
  shouldShowBundleDocuments,
  onDocumentsBundleClick,
  onDownloadClick,
  onDeleteClick,
  onPrintClick,
  shouldDisableBulkDelete,
  isDownloadDisabled,
  isPrintDisabled,
}) => (
  <div className="documents-overview-grid-toolbar">
    {
      !shouldShowBundleDocuments ? null
        : (
          <Button
            className={`bundle-documents-button${shouldDisableDocumentsBundling ? ' disabled' : ''}`}
            type="button"
            color="ghost"
            onClick={onDocumentsBundleClick}
          >
            <Icon name="file-text-o" />
            <span className="bundle-documents-button-text">Bundle Documents</span>
          </Button>
        )
    }
    <div className="grid-toolbar-btn-container">
      <Button
        className="grid-toolbar-btn ims-icon-print"
        title="Print"
        type="button"
        color="default"
        onClick={onPrintClick}
        disabled={isPrintDisabled}
      >
        &nbsp;
      </Button>
      <Button
        className="grid-toolbar-btn ims-icon-export"
        title="Download"
        type="button"
        color="default"
        onClick={onDownloadClick}
        disabled={isDownloadDisabled}
      >
        &nbsp;
      </Button>
      <Button
        className="grid-toolbar-btn delete-button"
        title="Delete"
        type="button"
        color="default"
        onClick={onDeleteClick}
        disabled={shouldDisableBulkDelete}
      >
        <Icon name="times-circle" />
      </Button>
    </div>
  </div>
);
