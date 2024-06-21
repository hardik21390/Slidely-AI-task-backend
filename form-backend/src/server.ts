import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import fs from 'fs';

const app = express();
const PORT = 3000;
const DB_FILE = './db.json';

app.use(cors());
app.use(bodyParser.json());

const readDatabase = (): any[] => {
    try {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading database:', error);
      return [];
    }
};

const writeDatabase = (data: any[]): void => {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('Error writing to database:', error);
    }
};

app.get('/ping', (req: Request, res: Response) => {
    res.json({ success: true });
});

app.post('/submit', (req: Request, res: Response) => {
    const { name, email, phone, github_link, stopwatch_time } = req.body;
  
    if (!name || !email || !phone || !github_link || !stopwatch_time) {
      return res.status(400).json({ error: 'All fields are required' });
    }
  
    const newSubmission = { name, email, phone, github_link, stopwatch_time };
    const submissions = readDatabase();
    submissions.push(newSubmission);
    writeDatabase(submissions);
  
    res.status(201).json({ message: 'Submission saved successfully' });
});

app.get('/read', (req: Request, res: Response) => {
    const { index } = req.query;
  
    if (typeof index !== 'string' || isNaN(parseInt(index))) {
      return res.status(400).json({ error: 'Invalid index' });
    }
  
    const submissions = readDatabase();
    const submissionIndex = parseInt(index);
  
    if (submissionIndex < 0 || submissionIndex >= submissions.length) {
      return res.status(404).json({ error: 'Submission not found' });
    }
  
    res.json(submissions[submissionIndex]);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`); //3000
  });
