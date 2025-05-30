
/**
 * Utility functions for downloading files
 */

/**
 * Downloads a file from the specified URL
 * @param url The URL of the file to download
 * @param filename The name to give the downloaded file
 */
export const downloadFile = (url: string, filename: string = ''): void => {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename || getFilenameFromUrl(url);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Extracts the filename from a URL
 * @param url The URL to extract the filename from
 * @returns The extracted filename
 */
const getFilenameFromUrl = (url: string): string => {
  const urlParts = url.split('/');
  const filename = urlParts[urlParts.length - 1];
  return filename || 'download';
};
