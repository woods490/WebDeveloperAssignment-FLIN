const express = require('express');
const app = express();
const db = require('./db/connection');
const path = require('path');
const PORT = 3000;
require('dotenv').config();

app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/leads', async (req, res) => {
    try {
        const { name, phone_number, email, loan_id } = req.body;

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

        const result = await db.query(
            'INSERT INTO leads (name, phone_number, email, loan_id) VALUES ($1, $2, $3, $4) RETURNING *', 
            [name, phone_number, email, loan_id]
        );      

        res.status(201).json({ status: 201, message: 'Data berhasil disimpan!', data: result.rows[0] });
    } catch (error) {
        console.error('Error menambah data:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/leads', async (req, res) => {
    try {
        const { passkey } = req.query;

        if (passkey !== process.env.PASSKEY) {
            res.status(403).send('Passkey salah!');
        }

        const result = await db.query('SELECT * FROM leads');

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

        result.rows.forEach(row => {
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

        res.send(tableHTML);
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

process.on('SIGINT', async () => {
    console.log('\Close connection down...');
    await db.end(); 
    console.log('Database pool has ended');
    process.exit(0);
});