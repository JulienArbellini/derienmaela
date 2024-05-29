import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const extractInvoiceData = async (base64Image) => {
  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo',
    messages: [
      {
        role: 'user',
        content: [
          { type: 'text', text: "Extrait les informations suivantes de cette image de facture et retourne les au format JSON. Chaque champ doit contenir uniquement du texte simple et ne doit pas être imbriqué. Si un champ n'a pas de données, il doit être laissé vide : Entreprise, Date, Devis, Localisation, Désignation (résumé concis des articles), Montant initial du devis, TS, TMA, Commentaires, OS, OBS, OS déposé sur DOCUS, OS signé MOE, Total OS signé, Repart OS/TS." },
          { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${base64Image}` } }
        ]
      }
    ]
  });

  if (!response || !response.choices || response.choices.length === 0) {
    throw new Error('No choices returned from OpenAI API');
  }

  return JSON.parse(response.choices[0].message.content.match(/```json(.*?)```/s)[1].trim());
};
