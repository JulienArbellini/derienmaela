import { Workbook } from 'exceljs';
import fs from 'fs';
import path from 'path';

const save = async (req, res) => {
  if (req.method === 'POST') {
    const data = JSON.parse(req.body.structured_data);

    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Invoice Data');

    const headers = [
      'Entreprise', 'Date', 'Devis', 'Localisation', 'Désignation', 'Montant initial du devis',
      'TS', 'TMA', 'Commentaires', 'OS', 'OBS', 'OS déposé sur DOCUS', 'OS signé MOE', 'Total OS signé', 'Repart OS/TS'
    ];

    worksheet.addRow(headers);

    const row = headers.map(header => data[header] || '');
    worksheet.addRow(row);

    const filePath = path.resolve('./public/uploads', `invoice_${Date.now()}.xlsx`);
    await workbook.xlsx.writeFile(filePath);

    res.status(200).json({ file_path: `/uploads/${path.basename(filePath)}` });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};

export default save;
