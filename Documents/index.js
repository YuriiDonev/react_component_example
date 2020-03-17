import { ReactMigrationUtil } from '~common/utils/react-migration.util';
import { Documents } from './Documents';

angular
  .module('case-management')
  .directive('documents', (
    UploadModal, CaseManagementApi, Util, NotificationService, $uibModal, DocumentDownloadService,
  ) => ReactMigrationUtil.createDirectiveConfig('documents', Documents, {
    mapScopeToProps: ($scope) => ({
      user: $scope.user,
      mode: $scope.mode,
      beneId: $scope.beneId,
      caseId: $scope.caseId,

      async launchDocumentUpload() {
        $scope.docId = null;
        const documents = await UploadModal.open($scope, $scope.caseId, $scope.beneId, null, true, true);
        const document = documents[0] || {};
        const documentFormData = Util.getFormDataForDoc(document);
        const { beneId, dependentId, fields } = document;
        if (fields && fields.passportNumber) {
          const passports = await CaseManagementApi.getPassports(beneId, dependentId);
          const isPassportNumberExisted = _.findWhere(passports, { passportNumber: fields.passportNumber });
          if (isPassportNumberExisted) {
            $uibModal.open({
              // eslint-disable-next-line max-len
              template: '<message-modal body="The Passport Number you are trying to submit already exists in Cobalt. Please provide a different Passport Number" />',
            });

            return;
          }
        }

        await CaseManagementApi.uploadCaseDocument(documentFormData);
      },

      async launchDocumentEdit(documentId) {
        $scope.docId = documentId;
        const documents = await UploadModal.open($scope, $scope.caseId, $scope.beneId, null, true, true);
        const document = documents[0];
        if (document) {
          document.docId = documentId;
          const documentFormData = Util.getFormDataForDoc(document);
          try {
            await CaseManagementApi.updateCaseDocument(documentFormData);
          } catch (error) {
            NotificationService.error('Update Failed');
          }
        }
      },

      async printSelectedDocuments(selectedDocuments) {
        CaseManagementApi.writeLogRead($scope.caseId, 'CaseDocument', $scope.caseId);
        const documentIds = selectedDocuments.reduce((result, document) => {
          const isPrintable = document.files.some((filename) => DocumentDownloadService.canPrint(filename));
          if (isPrintable) {
            result.push(Number(document.id));
          }
          return result;
        }, []);
        try {
          await DocumentDownloadService.bundleAsPdf(documentIds);
        } catch (error) {
          NotificationService.error('Printing Failed');
        }
      },

      launchDocumentsBundleUpload() {
        const isBundleDocumentsUploading = true;
        return UploadModal.open($scope, $scope.caseId, $scope.beneId, null, true, true, isBundleDocumentsUploading);
      },
    }),
  }));
