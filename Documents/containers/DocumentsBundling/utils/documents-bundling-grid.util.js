import { columnNames } from '../../../constants/documents-grid.constants';

export const DocumentsBundlingGridUtil = {
  addRowNumberRenderer(columnSettingsList, renderer) {
    return columnSettingsList.map((column) => {
      const isRowNumber = column.field === columnNames.rowNumber;
      return {
        ...column,
        cellRendererFramework: isRowNumber ? renderer : column.cellRendererFramework,
      };
    });
  },
};
