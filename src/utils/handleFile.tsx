const base64ToBlob = (base64: string) => {
    const base64Data = base64.replace(/^data:.*;base64,/, '');
    const byteCharacters = atob(base64Data);
    const byteArray = new Uint8Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteArray[i] = byteCharacters.charCodeAt(i);
    }
    const blob = new Blob([byteArray], { type: 'application/zip' });
    return blob;
}

const downloadZipFile = (zipFile: Blob | null) => {
    if (zipFile) {
        const url = URL.createObjectURL(zipFile);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'sources.zip';
        document.body.appendChild(link);
        link.click();
        URL.revokeObjectURL(url);
        document.body.removeChild(link);
    }
}

export default {
    base64ToBlob,
    downloadZipFile
}