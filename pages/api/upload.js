import nextConnect from 'next-connect';
import multer from 'multer';
import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';

const upload = multer({ dest: 'public/uploads/' });

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

    const filePath = path.join(process.cwd(), 'public/uploads', req.file.filename);
    console.log(`File uploaded to: ${filePath}`);

    const fileData = fs.readFileSync(filePath);
    const base64Image = fileData.toString('base64');
    console.log('File read successfully');

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: "Extrait les informations suivantes de cette image de facture et retourne les au format JSON. Chaque champ doit contenir uniquement du texte simple et ne doit pas être imbriqué. Si un champ n'a pas de données, il doit être laissé vide : Entreprise, Date, Devis, Localisation, Désignation (résumé concis des articles), Montant initial du devis, TS, TMA, Commentaires, OS, OBS, OS déposé sur DOCUS, OS signé MOE, Total OS signé, Repart OS/TS." },
            { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${base64Image}` } },
          ],
        },
      ],
    });

    if (!response || !response.choices || response.choices.length === 0) {
      throw new Error('No choices returned from OpenAI API');
    }

    const content = response.choices[0].message.content;

    // Assuming the response content is already in JSON format
    const structuredData = JSON.parse(content.match(/```json(.*?)```/s)[1].trim());

    res.status(200).json({ structured_data: structuredData });
  } catch (error) {
    console.error('Error during OpenAI API call:', error);
    res.status(500).json({ error: 'Failed to process image', details: error.message });
  }
});

export default apiRoute;

export const config = {
  api: {
    bodyParser: false, // Désactiver le bodyParser par défaut pour Multer
  },
};
