export const columnNames = {
  rowSelect: 'rowSelect',
  name: 'documentName',
  visibility: 'documentVisibility',
  documentType: 'documentType',
  createdByName: 'createdByName',
  createdEpochTime: 'createdEpochTime',
  deleteItem: 'deleteItem',
  editItem: 'editItem',
  rowNumber: 'rowNumber',
};

export const baseColumnSettings = {
  headerName: '',
  hide: false,
  sortable: false,
  suppressMovable: true,
  resizable: false,
  width: 140,
};

export const baseDocumentsGridSettings = {
  rowSelection: 'multiple',
  suppressKeyboardEvent: () => true,
  rowClassRules: {
    'text-red': 'data.isUrgent || data.isUserUrgent',
  },
  showCustomFilters: () => {},
  filteringOptions: {
    filterableColumns: [{ column: '', display: '', type: '' }],
    newFilterCustomLogic: () => {},
  },
  defaultPageSize: 20,
  defaultPageNumber: 1,
  documentsColumnSettingsList: [
    {
      ...baseColumnSettings,
      groupId: 1,
      headerName: 'Name',
      field: columnNames.name,
      tooltipField: columnNames.name,
      width: 200,
    },
    {
      ...baseColumnSettings,
      groupId: 2,
      headerName: 'Visibility',
      field: columnNames.visibility,
      tooltipField: columnNames.visibility,
    },
    {
      ...baseColumnSettings,
      groupId: 3,
      headerName: 'Document Type',
      field: columnNames.documentType,
      tooltipField: columnNames.documentType,
    },
    {
      ...baseColumnSettings,
      groupId: 4,
      headerName: 'Uploaded By',
      field: columnNames.createdByName,
      tooltipField: columnNames.createdByName,
    },
    {
      ...baseColumnSettings,
      groupId: 5,
      headerName: 'Date Uploaded',
      field: columnNames.createdEpochTime,
      tooltipField: columnNames.createdEpochTime,
    },
  ],
};
