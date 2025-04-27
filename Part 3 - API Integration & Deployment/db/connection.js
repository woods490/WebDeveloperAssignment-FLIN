import fs from 'fs';
import path from 'path';

const tmpDbPath = '/tmp/db.json';
const tmpDirPath = path.dirname(tmpDbPath); 

console.log(tmpDirPath);

async function ensureTmpDB() {
    if (!fs.existsSync(tmpDirPath)) {
        fs.mkdirSync(tmpDirPath, { recursive: true });
    }

    if (!fs.existsSync(tmpDbPath)) {
        const emptyDb = { leads: [], loan_type: [] };
        fs.writeFileSync(tmpDbPath, JSON.stringify(emptyDb, null, 2), 'utf-8');
    }
}

async function readDB() {
    await ensureTmpDB();
    const data = fs.readFileSync(tmpDbPath, 'utf-8');
    return JSON.parse(data);
}

async function writeDB(data) {
    await ensureTmpDB();
    fs.writeFileSync(tmpDbPath, JSON.stringify(data, null, 2), 'utf-8');
}

async function getLeads() {
    const db = await readDB();

    return (db.leads || []).map(lead => {
        let loanType = '';

        if (lead.loan_id === 1) {
            loanType = 'home';
        } else if (lead.loan_id === 2) {
            loanType = 'education';
        } else if (lead.loan_id === 3) {
            loanType = 'business';
        }

        return {
            ...lead,
            loanType: loanType
        };
    });
}

async function addLeads(lead) {
    const db = await readDB();
    db.leads = db.leads || [];
    db.leads.push(lead);
    await writeDB(db); 
}

export default { getLeads, addLeads };