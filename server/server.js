const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const db = require('./database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 5000;
const SECRET_KEY = process.env.JWT_SECRET || 'super_secret_key_change_this';

console.log("------------------------------------------");
console.log("Server Starting...");
console.log("Config Path:", path.join(__dirname, '.env'));
console.log("API Key Present:", !!process.env.OPENAI_API_KEY);
console.log("------------------------------------------");


app.use(cors());
app.use(express.json());

// --- HELPERS ---
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Mock AI Logic Engine
const generateAnalysis = (r1, r2, answers) => {
    const a1 = answers.round1 || {};
    const a2 = answers.round2 || {};

    const mapDistress = (val, maxVal = 3, inverse = true) => {
        const textMap = {
            'Not at all': 0, 'Several days': 1, 'More than half the days': 2, 'Nearly every day': 3,
            'Rarely': 0, 'Sometimes': 1, 'Often': 2, 'Always': 3, 'Constantly': 3,
            'No': 0, 'Yes, gained': 1, 'Yes, lost': 1, 'Poor': 1, 'Overeating': 1,
            'Yes, definitely': 3, 'Somewhat': 2, 'No, not really': 0,
            'Daily': 3, '3-4 times/week': 2, '1-2 times/week': 1,
            'Never': 0, 'Rarely': 1, 'Sometimes': 2, 'Often': 3,
            'Very irregular': 0, 'Somewhat irregular': 1, 'Mostly regular': 3, 'Very regular': 4,
            'Mild': 1, 'Moderate': 2, 'Severe': 3,
            'Regularly': 3, 'Occasionally': 1
        };

        let v = 0;
        if (!isNaN(val)) {
            v = parseInt(val) - 1; // Convert 1-5 scale to 0-4
            if (v < 0) v = 0;
        } else if (textMap[val] !== undefined) {
            v = textMap[val];
        }

        if (inverse) {
            return Math.min(100, Math.round((v / maxVal) * 100));
        } else {
            return Math.min(100, Math.round(((maxVal - v) / maxVal) * 100));
        }
    };

    // Calculate Category Distress
    let depSum = 0;
    depSum += mapDistress(a1.q1, 3, true);   // Mood (R1)
    depSum += mapDistress(a1.q3, 3, true);   // Interest (R1)
    depSum += mapDistress(a2.q4, 2, true);   // Hopelessness (R2)
    depSum += mapDistress(a2.q6, 3, true);   // Self-harm (R2)
    const depressionScore = Math.round(depSum / 4);

    let anxSum = 0;
    anxSum += mapDistress(a2.q3, 2, true);   // Phys symptoms
    anxSum += mapDistress(a1.q8, 3, true);   // Fatigue
    anxSum += (a1.q7 === 'Normal' ? 0 : 100);
    const anxietyScore = Math.round(anxSum / 3);

    let strSum = 0;
    strSum += mapDistress(a1.q6, 3, true);   // Overwhelm (R1)
    anxSum += mapDistress(a1.q2, 3, true);   // Sleep (R1) - shared marker
    strSum += mapDistress(a2.q1, 3, true);   // Deadline pressure (R2)
    const stressScore = Math.round(strSum / 2);

    let welRiskSum = 0;
    welRiskSum += mapDistress(a2.q2, 4, false);  // Meals
    welRiskSum += mapDistress(a2.q5, 2, true);   // Isolation
    welRiskSum += mapDistress(a2.q7, 3, false);  // Mindfulness (R2)
    welRiskSum += mapDistress(a1.q5, 3, false);  // Support (R1)
    welRiskSum += mapDistress(a1.q9, 3, false);  // Exercise (R1)
    const wellnessRiskScore = Math.round(welRiskSum / 5);

    const totalDistress = Math.round((depressionScore + anxietyScore + stressScore + wellnessRiskScore) / 4);

    // Enhanced Insights
    let summary = "";
    let recommendations = [];
    let technicalInsights = [];

    if (a2.q6 && a2.q6 !== 'Never') {
        summary = "CRITICAL ALERT: immediate Clinical Attention Advised.";
        recommendations.push("EMERGENCY: Contact a crisis helpline or mental health emergency service immediately.", "Do not stay alone; reach out to a trusted individual.", "Consult with a psychiatrist within the next 24 hours.");
        technicalInsights.push("Acute suicidal ideation detected: High-risk neurocognitive markers identified.", "Immediate crisis intervention protocol activated based on safety markers.");
    } else if (totalDistress >= 80) {
        summary = "Clinical Impression: Severe Adjustment & Distress Syndrome.";
        recommendations.push("Schedule a consultation with a clinical psychologist this week.", "Begin a daily mood-tracking journal for diagnostic clarity.", "Implement an 'emergency rest' protocol—minimize all non-essential professional commitments.");
        technicalInsights.push("High Sympathetic Nervous System (SNS) arousal: Your body is in a persistent 'fight or flight' state.", "Cognitive load exceeds current emotional buffering capacity.");
    } else if (totalDistress > 50) {
        summary = "Clinical Impression: Moderate Emotional Strain & Burnout Risk.";
        recommendations.push("Practice 15 minutes of structured mindfulness or deep breathing daily.", "Limit screen time and caffeine intake to stabilize the nervous system.", "Consider a session with a wellness coach to discuss work-life boundaries.");
        technicalInsights.push("Cumulative stress load is impacting somatic health (sleep/appetite).", "Incipient burnout markers detected in interest and energy levels.");
    } else {
        summary = "Healthy Psychosocial Profile: Resilient Engagement.";
        recommendations.push("Continue your current self-care and exercise routines.", "Build on your strengths by mentoring others or starting a new hobby.", "Perform a monthly 'wellness check' assessment to maintain this state.");
        technicalInsights.push("High psychological resilience markers observed.", "Strong emotional regulation and proactive coping mechanisms are evident.");
    }

    // Specific Actionable Insights
    if (a2.q4 === 'Often') technicalInsights.push("Pessimistic Attribution Bias: Tendency to view challenges as permanent and pervasive.");
    if (a2.q3 === 'Often') technicalInsights.push("Somatic Manifestation: Emotional stress is converting into physical symptoms (heart rate, sweating).");
    if (a1.q2 === 'Restless') technicalInsights.push("Sleep Architecture Disruption: Restless sleep is preventing full cognitive recovery.");
    if (a2.q5 === 'Often') technicalInsights.push("Social Withdrawal Pattern: Isolation is significantly reducing your emotional support network.");

    // Additional Suggestions
    const suggestions = [...recommendations];
    if (a1.q9 === 'Never') suggestions.push("Bio-Suggestion: Start with 10 minutes of light walking to boost endorphin production.");
    if (a1.q8 === 'Often') suggestions.push("Energy Audit: Your fatigue markers suggest you need a comprehensive 'de-load' week.");
    if (a2.q7 === 'Never') suggestions.push("Mindfulness: Use apps like Calm or Headspace to build foundational relaxation skills.");

    return JSON.stringify({
        summary,
        insights: technicalInsights,
        suggestions: suggestions,
        metrics: {
            depression: depressionScore,
            anxiety: anxietyScore,
            stress: stressScore,
            wellness: wellnessRiskScore,
            total: totalDistress
        }
    });
};

// --- AUTH ROUTES ---
app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, password, age, gender, occupation } = req.body;
        if (!email || !password) return res.status(400).json({ error: "Email and password required" });

        const hashedPassword = await bcrypt.hash(password, 10);
        // Check compatibility
        const isPostgres = !!process.env.DATABASE_URL;
        let query = `INSERT INTO users (name, email, password, age, gender, occupation) VALUES (?, ?, ?, ?, ?, ?)`;
        if (isPostgres) query += ` RETURNING id`;

        db.run(query, [name, email, hashedPassword, age, gender, occupation], function (err) {
            if (err) {
                // Determine constraint violation message based on DB type
                const msg = err.message || "";
                if (msg.includes('UNIQUE constraint failed') || msg.includes('duplicate key')) {
                    return res.status(400).json({ error: 'Email already exists' });
                }
                return res.status(500).json({ error: err.message });
            }
            // For Postgres, our adapter puts the returned ID in 'this.lastID' via callback.call() logic
            res.status(201).json({ message: 'User registered successfully', userId: this.lastID });
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/auth/login', (req, res) => {
    try {
        const { email, password } = req.body;
        db.get(`SELECT * FROM users WHERE email = ?`, [email], async (err, user) => {
            if (err) return res.status(500).json({ error: "Database error" });
            if (!user) return res.status(400).json({ error: 'User not found' });

            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) return res.status(401).json({ error: 'Invalid credentials' });

            const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '7d' }); // 7 Days Persistence
            res.json({ token, user: { id: user.id, name: user.name, age: user.age, gender: user.gender, occupation: user.occupation, email: user.email } });
        });
    } catch (e) {
        res.status(500).json({ error: "Login failed" });
    }
});

app.put('/api/auth/profile', authenticateToken, (req, res) => {
    const { name, age, gender, occupation } = req.body;
    const userId = req.user.id;

    db.run(
        `UPDATE users SET name = ?, age = ?, gender = ?, occupation = ? WHERE id = ?`,
        [name, age, gender, occupation, userId],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });

            // Return updated user object
            db.get(`SELECT id, name, email, age, gender, occupation FROM users WHERE id = ?`, [userId], (err, row) => {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ user: row, message: "Profile updated successfully" });
            });
        }
    );
});

// --- API ROUTES ---
// Init Endpoint
app.get('/api/init', async (req, res) => {
    try {
        const isPostgres = !!process.env.DATABASE_URL;
        if (!isPostgres) return res.json({ message: "Running in SQLite mode (tables auto-created)" });

        const queries = [
            `CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                age INTEGER,
                gender TEXT,
                occupation TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );`,
            `CREATE TABLE IF NOT EXISTS assessments (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL REFERENCES users(id),
                round1_score INTEGER,
                round2_score INTEGER,
                answers TEXT,
                analysis TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );`,
            `CREATE TABLE IF NOT EXISTS messages (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL REFERENCES users(id),
                content TEXT NOT NULL,
                sender TEXT NOT NULL,
                context TEXT,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );`
        ];

        // Helper for sequential execution
        const runQuery = (q) => new Promise((resolve, reject) => {
            db.run(q, [], (err) => {
                if (err) reject(err);
                else resolve();
            });
        });

        for (const q of queries) {
            await runQuery(q);
        }
        res.json({ message: "Tables initialized successfully" });

    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// --- API ROUTES ---
app.post('/api/assessment', authenticateToken, (req, res) => {
    try {
        const { round1_score, round2_score, answers } = req.body;
        const userId = req.user.id;

        // Use the robust analysis engine
        const analysis = generateAnalysis(round1_score, round2_score, answers);

        const isPostgres = !!process.env.DATABASE_URL;
        let query = `INSERT INTO assessments (user_id, round1_score, round2_score, answers, analysis) VALUES (?, ?, ?, ?, ?)`;
        if (isPostgres) query += ` RETURNING id`;

        db.run(query, [userId, round1_score, round2_score, JSON.stringify(answers), analysis], function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Assessment saved', id: this.lastID, analysis });
        });
    } catch (e) {
        res.status(500).json({ error: "Submission failed" });
    }
});

app.get('/api/history', authenticateToken, (req, res) => {
    db.all(`SELECT * FROM assessments WHERE user_id = ? ORDER BY created_at DESC`, [req.user.id], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

const { OpenAI } = require('openai');

// Initialize OpenAI (Make sure to set OPENAI_API_KEY in .env)
const apiKey = process.env.OPENAI_API_KEY;
console.log("Initializing OpenAI with Key:", apiKey ? `${apiKey.substring(0, 5)}...` : "MISSING");

const openai = new OpenAI({
    apiKey: apiKey || 'mock-key', // Fallback for safety, but user needs to set it
});

app.post('/api/chat', authenticateToken, async (req, res) => {
    const { message } = req.body;
    const userId = req.user.id;

    let botResponse = "";

    try {
        const openaiKey = process.env.OPENAI_API_KEY;
        const groqKey = process.env.GROQ_API_KEY;

        if (groqKey && (groqKey.startsWith('gsk_'))) {
            // --- USE FREE GROQ ---
            const groqOpenai = new OpenAI({
                apiKey: groqKey,
                baseURL: "https://api.groq.com/openai/v1"
            });

            const completion = await groqOpenai.chat.completions.create({
                messages: [
                    { role: "system", content: "You are MindWell, a compassionate mental health AI. Provide supportive, non-judgmental advice. You are NOT a doctor. If the user is in danger, provide crisis resources. Keep responses concise and empathetic." },
                    { role: "user", content: message }
                ],
                model: "llama-3.3-70b-versatile",
            });
            botResponse = completion.choices[0].message.content;

        } else if (openaiKey && !openaiKey.includes('mock-key')) {
            // --- USE OPENAI ---
            const activeOpenai = new OpenAI({ apiKey: openaiKey });
            const completion = await activeOpenai.chat.completions.create({
                messages: [
                    { role: "system", content: "You are MindWell, a compassionate and professional mental health AI assistant. Your goal is to provide supportive, non-judgmental, and evidence-based advice. You are NOT a replacement for a doctor. If a user expresses severe distress or self-harm intent, provide crisis resources immediately. Keep responses concise, empathetic, and actionable." },
                    { role: "user", content: message }
                ],
                model: "gpt-3.5-turbo",
            });
            botResponse = completion.choices[0].message.content;
        } else {
            botResponse = "I'm currently in offline mode. Please configure a GROQ_API_KEY (Free) or OPENAI_API_KEY in Vercel settings to unlock my full potential!";
        }
    } catch (err) {
        console.error("AI Service Error:", err.message);

        if (err.message.includes('429') || err.message.includes('quota')) {
            // Compassionate Fallback instead of raw error
            botResponse = "I'm currently moving at a slower pace than usual, but I'm still here for you. Remember that taking things one step at a time is a victory in itself. How are you feeling in this moment?";
        } else {
            botResponse = `MindWell is temporarily unavailable (Error: ${err.message}). Please try again shortly.`;
        }
    }

    db.run(`INSERT INTO messages (user_id, content, sender) VALUES (?, ?, ?)`, [userId, message, 'user']);
    db.run(`INSERT INTO messages (user_id, content, sender) VALUES (?, ?, ?)`, [userId, botResponse, 'ai'], function (err) {
        if (err) return res.status(500).json({ error: "Chat error" });
        res.json({ response: botResponse });
    });
});

if (require.main === module) {
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}
module.exports = app;
