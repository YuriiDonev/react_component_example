export const DocumentsGridUtil = {
  isRowEmpty(row) {
    const objectKeys = Object.keys(row);
    return objectKeys.length === 1;
  },
};
