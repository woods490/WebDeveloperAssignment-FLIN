import express from 'express';
import serverless from 'serverless-http';
import dotenv from 'dotenv';
import db from './db/connection.js';
import path from 'path';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/index', async (req, res) => {
    try {
        const filePath = path.resolve('public', 'index.html');
        res.sendFile(filePath);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.post('/leads', async (req, res) => {
    try {
        
        let body;
        if (process.env.NODE_ENV === 'local') {
            body = req.body;
        } else {
            body = JSON.parse(req.apiGateway.event.body);
        }
        
        const { name, phone_number, email, loan_id } = body;

        if (!name || typeof name !== 'string' || name.trim() === '') {
            return res.status(400).json({ error: 'Nama wajib diisi!' });
        }

        if (!phone_number || typeof phone_number !== 'string' || phone_number.trim() === '') {
            return res.status(400).json({ error: 'Nomor telepon wajib diisi!' });
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!email || !emailRegex.test(email)) {
            return res.status(400).json({ error: 'Email wajib diisi dengan format yang benar!' });
        }

        if (!loan_id || isNaN(Number(loan_id))) {
            return res.status(400).json({ error: 'Tipe pinjaman harus diisi!' });
        }

        const lead = {
            name: name,
            phone_number: phone_number,
            email: email,
            loan_id: loan_id
        };

        const result = await db.addLeads(lead);

        res.status(201).json({ status: 201, message: 'Data berhasil disimpan!', data: result });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.get('/leads', async (req, res) => {
    try {
        const { passkey } = req.query;

        if (passkey !== process.env.PASSKEY) {
            return res.status(403).send('Passkey salah!');
        }

        const result = await db.getLeads();

        const loanTypeMap = {
            1: 'Home',
            2: 'Education',
            3: 'Business',
        };

        let tableHTML = `
            <table border="1" cellpadding="5" cellspacing="0">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Phone Number</th>
                        <th>Email</th>
                        <th>Loan Type</th>
                    </tr>
                </thead>
                <tbody>
        `;

        result.forEach(row => {
            const loanType = loanTypeMap[row.loan_id] || 'Unknown';
            tableHTML += `
                <tr>
                    <td>${row.name}</td>
                    <td>${row.phone_number}</td>
                    <td>${row.email}</td>
                    <td>${loanType}</td>
                </tr>
            `;
        });

        tableHTML += `
                </tbody>
            </table>
        `;

        res.status(200).send(tableHTML);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

if (process.env.NODE_ENV == 'local') {
    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
}

const handleRequest = serverless(app);

export const handler = async (event, context) => {
    return await handleRequest(event, context);
};