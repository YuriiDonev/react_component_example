export const pauseForUpdatingGridData = 5000;
export const dateFormat = 'MMM DD, YYYY';
export const allowedFileTypesForPrinting = window.APP_CONFIG.SUPPORTED_PRINT_FILE_TYPES;
export const allowedFileTypesForBundling = window.APP_CONFIG.SUPPORTED_BUNDLE_FILE_TYPES || [
  'docx', 'jpg', 'jpeg', 'pdf', 'png',
];

export const allowedUserTypesForBundling = [
  'BAL_ADMIN',
  'SUPER_ADMIN',
  'KM_TEAM',
  'BAL_ASSISTANT',
  'COUNTRY_CASE_MANAGER',
  'BAL_MANAGER',
];

export const forbiddenFormatsForPrintNotification = `Only the following file types are supported for bulk printing:
 PDF, DOCX, PNG, JPG. Any other file type must be downloaded and then printed.`;

export const forbiddenFormatsForBundleNotification = `Only the following file types are supported for document bundling:
 PDF, Word, Image files.`;

export const sortOrder = {
  asc: {
    string: 'asc',
    number: 0,
  },
  desc: {
    string: 'desc',
    number: 1,
  },
};
