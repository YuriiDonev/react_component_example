import React from 'react';
import { Icon } from '~common/UI';
import { DocumentsGridUtil } from '../utils/documents-grid.util';
import {
  columnNames,
  baseColumnSettings,
  baseDocumentsGridSettings,
} from '../../../constants/documents-grid.constants';

export const documentsGridSettings = {
  ...baseDocumentsGridSettings,
  gridName: 'DocumentsOverviewGrid',
  documentsColumnSettingsList: [
    {
      ...baseColumnSettings,
      groupId: 0,
      field: columnNames.rowSelect,
      headerCheckboxSelection: true,
      checkboxSelection: true,
      suppressMenu: true,
      maxWidth: 40,
      minWidth: 40,
      width: 40,
    },
    ...baseDocumentsGridSettings.documentsColumnSettingsList.map((column) => ({ ...column, sortable: true })),
    {
      ...baseColumnSettings,
      groupId: 6,
      field: columnNames.editItem,
      suppressMenu: true,
      maxWidth: 42,
      minWidth: 42,
      width: 42,
      cellRendererFramework: (params) => {
        const isRowEmpty = DocumentsGridUtil.isRowEmpty(params.data);
        return isRowEmpty || !params.data.hasPermission ? null : React.createElement(Icon, {
          name: 'info-circle',
          className: 'edit-icon',
        });
      },
    },
    {
      ...baseColumnSettings,
      groupId: 7,
      field: columnNames.deleteItem,
      maxWidth: 42,
      minWidth: 42,
      width: 42,
      cellRendererFramework: (params) => {
        const isRowEmpty = DocumentsGridUtil.isRowEmpty(params.data);
        return isRowEmpty || !params.data.hasPermission ? null : React.createElement(Icon, {
          name: 'times-circle',
          className: 'delete-icon',
        });
      },
    },
  ],
};
