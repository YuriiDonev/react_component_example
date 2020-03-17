import { DocumentsHttpClient } from '../api/documents-http-client';
import { DocumentsDownloadUtil } from '../utils/documents-download.util';

export const DocumentsService = {
  async downloadDocuments(documentIds, caseId) {
    DocumentsHttpClient.writeAuditLog(caseId, 'CaseDocument', caseId);
    try {
      const { ticket } = await DocumentsHttpClient.getDownloadTicket(documentIds);
      const { headers, data } = await DocumentsHttpClient.getDocumentData(ticket);
      const arrayBuffer = [data];
      const filename = DocumentsDownloadUtil.readFilename(headers['content-disposition']);
      await DocumentsDownloadUtil.downloadArrayBuffer(arrayBuffer, headers['content-type'], filename);
    } catch (error) {
      console.error(error);
    }
  },

  uploadBundleDocuments(documentApiKeys, documentInfo) {
    const {
      roles, userTypes, name, type, companyId, beneId, clientCaseIds,
    } = documentInfo;
    const visibility = roles.concat(userTypes);
    const documentsBundleData = {
      visibility,
      documentApiKeys,
      createdDate: moment().toDate(),
      docName: name,
      docTypeId: type,
      companyId,
      beneId: Number(beneId),
      clientCaseIds,
    };
    return DocumentsHttpClient.uploadBundleDocuments(documentsBundleData);
  },
};
