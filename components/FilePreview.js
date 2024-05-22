import React, { useEffect } from 'react';

const FilePreview = ({ file, preview, pdfData }) => {
    useEffect(() => {
        if (file && file.type === 'application/pdf') {
            const renderPDF = async (pdfData) => {
                const pdfjsLib = await import('pdfjs-dist/build/pdf');
                pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

                const loadingTask = pdfjsLib.getDocument(pdfData);
                loadingTask.promise.then((pdf) => {
                    pdf.getPage(1).then((page) => {
                        const scale = 1.5;
                        const viewport = page.getViewport({ scale: scale });

                        const canvas = document.getElementById('pdf-preview');
                        const context = canvas.getContext('2d');
                        canvas.height = viewport.height;
                        canvas.width = viewport.width;

                        const renderContext = {
                            canvasContext: context,
                            viewport: viewport
                        };
                        page.render(renderContext);
                    });
                });
            };
            renderPDF(pdfData);
        }
    }, [file, pdfData]);

    return (
        <div className="preview-section w-1/2">
            <h2 className="text-lg font-semibold mb-2">Invoice Preview</h2>
            <div className="invoice-preview border p-4 rounded">
                {file && file.type === 'application/pdf' ? (
                    <canvas id="pdf-preview"></canvas>
                ) : (
                    <img src={preview} alt="Invoice Preview" className="max-w-full h-auto" />
                )}
            </div>
        </div>
    );
};

export default FilePreview;
