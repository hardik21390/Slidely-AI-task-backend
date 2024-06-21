"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
const PORT = 3000;
const dbPath = path_1.default.join(__dirname, 'db.json');
app.use(body_parser_1.default.json());
// Ensure db.json exists
if (!fs_1.default.existsSync(dbPath)) {
    fs_1.default.writeFileSync(dbPath, '[]', 'utf8');
}
// Read submissions from db.json
const readSubmissions = () => {
    const jsonData = fs_1.default.readFileSync(dbPath, 'utf8');
    return JSON.parse(jsonData);
};
// Save submissions to db.json
const saveSubmissions = (submissions) => {
    const jsonData = JSON.stringify(submissions, null, 2);
    fs_1.default.writeFileSync(dbPath, jsonData, 'utf8');
};
// /ping endpoint
app.get('/ping', (req, res) => {
    res.send(true);
});
// /submit endpoint
app.post('/submit', (req, res) => {
    const submission = req.body;
    const submissions = readSubmissions();
    submissions.push(submission);
    saveSubmissions(submissions);
    res.status(201).send('Submission saved');
});
// /read endpoint
app.get('/read', (req, res) => {
    const index = parseInt(req.query.index, 10);
    const submissions = readSubmissions();
    if (index >= 0 && index < submissions.length) {
        res.json(submissions[index]);
    }
    else {
        res.status(404).send('Submission not found');
    }
});
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
