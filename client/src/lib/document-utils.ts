export function downloadDocument(dataUrl: string, _fileName: string): void {
  console.log('downloadDocument called with:', { dataUrl: dataUrl?.substring(0, 100), _fileName });
  
  if (!dataUrl) {
    console.error('No data URL provided');
    return;
  }

  try {
    if (dataUrl.startsWith('data:')) {
      console.log('Processing data URL...');
      const [header, base64] = dataUrl.split(',');
      const mimeMatch = header.match(/data:([^;]+)/);
      const mimeType = mimeMatch ? mimeMatch[1] : 'application/octet-stream';
      
      const byteCharacters = atob(base64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: mimeType });
      
      const blobUrl = URL.createObjectURL(blob);
      const newWindow = window.open(blobUrl, '_blank');
      
      if (!newWindow) {
        window.location.href = blobUrl;
      }
    } else {
      window.open(dataUrl, '_blank');
    }
  } catch (error) {
    console.error('Error opening document:', error);
    alert('Unable to open document. Please try again.');
  }
}

export function viewDocument(dataUrl: string): void {
  if (!dataUrl) {
    console.error('No data URL provided');
    return;
  }

  try {
    if (dataUrl.startsWith('data:')) {
      const [header, base64] = dataUrl.split(',');
      const mimeMatch = header.match(/data:([^;]+)/);
      const mimeType = mimeMatch ? mimeMatch[1] : 'application/octet-stream';
      
      const byteCharacters = atob(base64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: mimeType });
      
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, '_blank');
    } else {
      window.open(dataUrl, '_blank');
    }
  } catch (error) {
    console.error('Error viewing document:', error);
    alert('Unable to view document. Please try again.');
  }
}
