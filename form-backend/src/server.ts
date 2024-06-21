import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import { Submission } from './interfaces';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = 3000;

const dbPath = path.join(__dirname, 'db.json');

app.use(bodyParser.json());

// Ensure db.json exists
if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, '[]', 'utf8');
}

// Read submissions from db.json
const readSubmissions = (): Submission[] => {
    const jsonData = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(jsonData);
};

// Save submissions to db.json
const saveSubmissions = (submissions: Submission[]) => {
    const jsonData = JSON.stringify(submissions, null, 2);
    fs.writeFileSync(dbPath, jsonData, 'utf8');
};

// /ping endpoint
app.get('/ping', (req: Request, res: Response) => {
    res.send(true);
});

// /submit endpoint
app.post('/submit', (req: Request, res: Response) => {
    const submission: Submission = req.body;
    const submissions = readSubmissions();
    submissions.push(submission);
    saveSubmissions(submissions);
    res.status(201).send('Submission saved');
});

// /read endpoint
app.get('/read', (req: Request, res: Response) => {
    const index = parseInt(req.query.index as string, 10);
    const submissions = readSubmissions();
    if (index >= 0 && index < submissions.length) {
        res.json(submissions[index]);
    } else {
        res.status(404).send('Submission not found');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
