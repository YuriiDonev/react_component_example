import React from 'react';
import { Icon } from '~common/UI';
import {
  columnNames,
  baseColumnSettings,
  baseDocumentsGridSettings,
} from '../../../constants/documents-grid.constants';

export const documentsBundlingGridSettings = {
  ...baseDocumentsGridSettings,
  gridName: 'DocumentsBundlingGrid',
  preventSaveUserSessionCurrentPage: true,
  rowDragManaged: true,
  animateRows: true,
  documentsColumnSettingsList: [
    {
      ...baseColumnSettings,
      groupId: 0,
      field: columnNames.rowNumber,
      maxWidth: 40,
      minWidth: 40,
      width: 40,
      cellClass: 'document-row-number',
    },
    ...baseDocumentsGridSettings.documentsColumnSettingsList,
    {
      ...baseColumnSettings,
      groupId: 6,
      field: columnNames.deleteItem,
      suppressMenu: true,
      maxWidth: 42,
      minWidth: 42,
      width: 42,
      cellRendererFramework: () => React.createElement(Icon, {
        name: 'times-circle',
        className: 'delete-icon',
      }),
    },
    {
      ...baseColumnSettings,
      groupId: 7,
      field: columnNames.name,
      maxWidth: 42,
      minWidth: 42,
      width: 42,
      rowDrag: true,
    },
  ],
};
