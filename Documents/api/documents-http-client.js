import { SearchHttpClient } from '~common/api/search-http-client';
import { ImsHttpClient } from '~common/api/ims-http-client';
import { DocumentsHttpClient as BaseDocumentsHttpClient } from '~common/api/documents-http-client';
import { HttpClientUtil } from '~common/utils/http-client.util';

const { getData } = HttpClientUtil;

export const DocumentsHttpClient = {
  getProfileDocuments(params) {
    return this.getDocuments({
      ...params,
      includeProfileDoc: true,
    });
  },

  getCaseDocuments(params) {
    return this.getDocuments({
      ...params,
      includeProfileDoc: false,
    });
  },

  getDocuments(params) {
    return SearchHttpClient
      .get('/documents', { params })
      .then(getData);
  },

  uploadDocument(documentUploadData) {
    return ImsHttpClient
      .post('/Documents', documentUploadData)
      .then(getData);
  },

  deleteDocument(documentId) {
    return ImsHttpClient
      .delete(`/Documents/${documentId}`)
      .then(getData);
  },

  writeAuditLog(resourceId, resourceType, paramId) {
    const logData = {
      paramId,
      resourceId,
      resourceType,
      auditType: 'ProfileAndCase',
    };

    return ImsHttpClient
      .post('/AuditLogs/WriteAccess', logData)
      .then(getData);
  },

  getDownloadTicket(documentIds) {
    return ImsHttpClient
      .post('/DownloadTickets', documentIds)
      .then(getData);
  },

  getDocumentData(ticket) {
    return ImsHttpClient
      .get('/CaseDocuments/Download', {
        responseType: 'arraybuffer',
        params: {
          ticket,
        },
      });
  },

  uploadBundleDocuments(bundleDocumentsData) {
    return BaseDocumentsHttpClient.post('/bundles', bundleDocumentsData);
  },
};
