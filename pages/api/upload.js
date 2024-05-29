import nextConnect from 'next-connect';
import multer from 'multer';
import { extractInvoiceData } from '../../services/openai';

const upload = multer({ storage: multer.memoryStorage() });

const apiRoute = nextConnect({
  onError(error, req, res) {
    console.error('Error:', error);
    res.status(501).json({ error: `Sorry something happened! ${error.message}` });
  },
});

apiRoute.use(upload.single('file'));

apiRoute.post(async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const base64Image = req.file.buffer.toString('base64');
    console.log('File read successfully');

    const structuredData = await extractInvoiceData(base64Image);
    
    res.status(200).json({ structured_data: structuredData });
  } catch (error) {
    console.error('Error during OpenAI API call:', error);
    res.status(500).json({ error: 'Failed to process image', details: error.message });
  }
});

export default apiRoute;

export const config = {
  api: {
    bodyParser: false,
  },
};
