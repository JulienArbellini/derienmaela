import { useEffect } from 'react';

const Preview = ({ file, preview, pdfData }) => {
  useEffect(() => {
    if (file && file.type === 'application/pdf') {
      const renderPDF = async (pdfData) => {
        const pdfjsLib = await import('pdfjs-dist/build/pdf');
        pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

        const loadingTask = pdfjsLib.getDocument(pdfData);
        loadingTask.promise.then((pdf) => {
          pdf.getPage(1).then((page) => {
            const scale = 1.5;
            const viewport = page.getViewport({ scale });

            const canvas = document.getElementById('pdf-preview');
            const context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            const renderContext = {
              canvasContext: context,
              viewport,
            };
            page.render(renderContext);
          });
        });
      };

      renderPDF(pdfData);
    }
  }, [file, pdfData]);

  return (
    <div className="w-full lg:w-1/2 mb-4 lg:mb-0 h-[70%] max-h-[70%]">
      <h2 className="text-lg font-semibold mb-2">Invoice Preview</h2>
      <div className="border p-4 rounded bg-base-100 flex justify-center items-center h-full max-h-screen overflow-hidden">
        {file && file.type === 'application/pdf' ? (
          <canvas id="pdf-preview"></canvas>
        ) : (
          <img src={preview} alt="Invoice Preview" className="max-w-full h-auto" />
        )}
      </div>
    </div>
  );
};

export default Preview;
