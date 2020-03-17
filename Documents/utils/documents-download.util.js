export const DocumentsDownloadUtil = {
  readFilename(disposition) {
    const filenamePattern = /filename="?([^"]+)"?/;
    const filename = filenamePattern.exec(disposition)[1];
    if (!filename) {
      return 'unknown';
    }
    const cleanupPattern = /(.+)_--_\d+-\d+(\.[^_]+)/;
    const capture = cleanupPattern.exec(filename);
    return capture ? capture[1] + capture[2] : filename;
  },

  downloadArrayBuffer(arrayBuffer, type, filename) {
    const blob = new window.Blob(arrayBuffer, { type });
    if (typeof (window.navigator.msSaveBlob) === 'function') {
      window.navigator.msSaveBlob(blob, filename);
    } else {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    }
  },
};
