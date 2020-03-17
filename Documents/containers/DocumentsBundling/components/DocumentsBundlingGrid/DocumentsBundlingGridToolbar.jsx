import React from 'react';
import { Button } from '~common/UI';

export const DocumentsBundlingGridToolbar = ({
  onClose,
}) => (
  <div className="documents-bundling-grid-toolbar">
    <Button
      className="exit-bundling-button"
      type="button"
      color="ghost"
      onClick={onClose}
    >
      exit document bundling
    </Button>
  </div>
);
