import { GridUtil } from '~common/utils/grid.util';

export const DocumentsBundlingService = {
  showDocumentOrderingRangeAlert(documentsCount) {
    // eslint-disable-next-line max-len
    const message = `You have selected ${documentsCount} documents to bundle. Please enter a valid number between 1 - ${documentsCount}.`;
    window.alert(message);
  },

  canReorderDocuments(documentsCount, newDocumentIndex) {
    const isIndexValid = newDocumentIndex >= 0;
    const isIndexLessThanDocumentsCount = documentsCount > newDocumentIndex;
    return isIndexValid && isIndexLessThanDocumentsCount;
  },

  reorderDocuments(documentsToBundle, fromIndex, toIndex) {
    return GridUtil.moveItemsInArray(documentsToBundle, fromIndex, toIndex);
  },

  deleteDocument(documents, documentIdToDelete) {
    return documents.filter((document) => document.id !== documentIdToDelete);
  },
};
