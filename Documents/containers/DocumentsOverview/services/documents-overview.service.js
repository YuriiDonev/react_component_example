import { UserUtil } from '~common/utils/user.util';
import { FeatureToggleUtil } from '~common/utils/feature-toggle.util';
import { featureFlags } from '~common/constants/feature-toggle.constants';
import { DocumentsHttpClient } from '../../../api/documents-http-client';
import { documentsModes } from '../../../constants/documents.constants';
import { DocumentsGridUtil } from '../utils/documents-grid.util';
import {
  allowedUserTypesForBundling, allowedFileTypesForPrinting, allowedFileTypesForBundling, dateFormat,
} from '../constants/documents-overview.constants';

export const DocumentsOverviewService = {
  getDocuments(mode, user, params) {
    let documentsPromise;
    if (mode === documentsModes.profileDocuments) {
      documentsPromise = DocumentsHttpClient.getProfileDocuments(params);
    } else {
      documentsPromise = DocumentsHttpClient.getCaseDocuments(params);
    }
    const isUserAllowedToManageDocuments = UserUtil.hasUserType(user, allowedUserTypesForBundling);
    return documentsPromise
      .then(({ results, total }) => ({
        totalCount: total,
        documents: results.map((document) => {
          const { createdEpochTime, createdBy } = document;
          const dateUploaded = createdEpochTime ? moment.unix(createdEpochTime).format(dateFormat) : '-';
          return {
            ...document,
            createdEpochTime: dateUploaded,
            hasPermission: createdBy === user.userId || isUserAllowedToManageDocuments,
          };
        }),
      }))
      .catch(() => ({ documents: [], totalCount: 0 }));
  },

  deleteDocuments(documentIds) {
    return Promise.all(documentIds.map((documentId) => DocumentsHttpClient.deleteDocument(documentId)));
  },

  shouldShowBundleDocuments(user, mode) {
    if (FeatureToggleUtil.isFeatureDisabled(featureFlags.documentBundling)) {
      return false;
    }

    const isProfileDocumentsMode = mode === documentsModes.profileDocuments;
    return isProfileDocumentsMode && UserUtil.hasUserType(user, allowedUserTypesForBundling);
  },

  shouldShowAddDocuments(mode) {
    return mode === documentsModes.caseDocuments;
  },

  shouldDisableBulkDelete(user) {
    return !UserUtil.hasUserType(user, allowedUserTypesForBundling);
  },

  hasForbiddenFileFormatForPrint(documents) {
    return documents.some((document) => {
      if (DocumentsGridUtil.isRowEmpty(document)) {
        return false;
      }

      return document.files.some((filename) => {
        const extension = filename.substring(filename.lastIndexOf('.') + 1).toLowerCase();
        return !allowedFileTypesForPrinting.includes(extension);
      });
    });
  },

  hasForbiddenFileFormatForBundle(documents) {
    return documents.some((document) => {
      if (DocumentsGridUtil.isRowEmpty(document)) {
        return false;
      }

      return document.files.some((filename) => {
        const extension = filename.substring(filename.lastIndexOf('.') + 1).toLowerCase();
        return !allowedFileTypesForBundling.includes(extension);
      });
    });
  },

  hasAllowedFileFormatForPrint(documents) {
    return documents.some((document) => document.files.some((filename) => {
      const extension = filename.substring(filename.lastIndexOf('.') + 1).toLowerCase();
      return allowedFileTypesForPrinting.includes(extension);
    }));
  },
};
