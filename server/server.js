const express = require('express');
const cors = require('cors');
const db = require('./database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 5000;
const SECRET_KEY = 'super_secret_key_change_this';

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
    // Parse answers if they are strings (just in case)
    const a1 = answers.round1 || {};
    const a2 = answers.round2 || {};

    // Calculate sub-scores (Max 25 per category for simple normalization to 100 total)
    // Depression Indicators: R1.Q1(Mood), R1.Q3(Interest), R1.Q7(Appetite), R1.Q8(Fatigue)
    // Anxiety Indicators: R2.Q1(Nervous), R2.Q2(Worry), R2.Q5(Fear), R2.Q9(Avoidance)
    // Stress Indicators: R1.Q6(Overwhelm), R2.Q3(Relaxing), R2.Q4(Irritable), R2.Q7(Racing Thoughts)
    // Wellness/Resilience: R1.Q2(Sleep), R1.Q5(Support), R1.Q9(Exercise), R2.Q10(Confidence)

    const mapVal = (val, max = 5, inverse = false) => {
        let v = parseInt(val) || 0;
        // Text to val mappings for select inputs
        const textMap = {
            'Not at all': 0, 'Several days': 1, 'More than half the days': 2, 'Nearly every day': 3, // PHQ-style 0-3
            'Rarely': 0, 'Sometimes': 1, 'Often': 2, 'Always': 3, // General freq
            'No': 0, 'Yes, gained': 2, 'Yes, lost': 2,
            'Yes, definitely': 4, 'Somewhat': 2, 'No, not really': 0,
            'Daily': 4, '3-4 times/week': 3, '1-2 times/week': 1,
            'Never': 0, 'Occasionally': 1, 'Frequently': 2
        };

        if (typeof val === 'string' && textMap[val] !== undefined) v = textMap[val];

        // Normalize to 0-1 range
        // For 1-5 scales: (v-1)/4
        // For 0-3 scales: v/3
        // Simplified: assume 0-5 roughly

        if (inverse) return Math.max(0, 100 - (v * 20)); // High val = Low Score
        return Math.min(100, v * 20); // High val = High Score
    };

    // Calculate Category Scores (0-100, where 100 is HEALTHY)
    // Note: Inputs are mix of strings/numbers. 

    // Depression (Low score = Depressed)
    let depSum = 0;
    depSum += mapVal(a1.q1, 5, true); // Mood (Inv)
    depSum += mapVal(a1.q3, 5, true); // Interest (Inv)
    // Q7 Appetite: 'Normal' is good. Others bad.
    depSum += (a1.q7 === 'Normal' ? 100 : 50);
    // Q8 Fatigue: 'Rarely' is good.
    depSum += mapVal(a1.q8, 3, true);
    const depressionScore = Math.round(depSum / 4);

    // Anxiety (Low score = Anxious)
    let anxSum = 0;
    anxSum += mapVal(a2.q1, 3, true); // Nervous
    anxSum += mapVal(a2.q2, 3, true); // Control Worry
    anxSum += mapVal(a2.q5, 5, true); // Fear
    anxSum += mapVal(a2.q9, 3, true); // Avoidance
    const anxietyScore = Math.round(anxSum / 4);

    // Stress (Low score = Stressed)
    let strSum = 0;
    strSum += mapVal(a1.q6, 5, true); // Overwhelm
    strSum += mapVal(a2.q3, 5, true); // Relaxing problem
    strSum += mapVal(a2.q4, 3, true); // Irritable
    strSum += mapVal(a2.q7, 3, true); // Racing thoughts
    const stressScore = Math.round(strSum / 4);

    // Wellness (High score = Good)
    let welSum = 0;
    // Sleep: 7-9 is 100, others lower
    let sleepVal = parseInt(a1.q2) || 0;
    if (sleepVal >= 7 && sleepVal <= 9) welSum += 100;
    else if (sleepVal >= 5 && sleepVal <= 10) welSum += 70;
    else welSum += 40;

    welSum += mapVal(a1.q5, 2, false); // Support
    welSum += mapVal(a1.q9, 3, false); // Exercise
    welSum += mapVal(a2.q10, 5, false); // Confidence
    const wellnessScore = Math.round(welSum / 4);

    const totalScore = Math.round((depressionScore + anxietyScore + stressScore + wellnessScore) / 4);

    // Generate Report Text
    let summary = "";
    if (totalScore > 80) summary = "You are thriving! Your mental resilience is high.";
    else if (totalScore > 50) summary = "You are doing okay, but there are some areas causing strain.";
    else summary = "You seem to be going through a tough time. It's important to prioritize self-care right now.";

    const details = [];
    if (depressionScore < 60) details.push("Mood: You've indicated signs of low mood or lack of interest. Connecting with loved ones or engaging in small hobbies can help.");
    if (anxietyScore < 60) details.push("Anxiety: Frequent nervousness was noted. Grounding techniques like 5-4-3-2-1 can be very effective.");
    if (stressScore < 60) details.push("Stress: You seem overwhelmed. Try to break tasks into smaller steps and take short breaks.");
    if (wellnessScore < 50) details.push("Lifestyle: Sleep and exercise are foundational. Improving these slightly can have a huge impact on your mood.");

    if (details.length === 0) details.push("Keep up the great work maintaining your mental hygiene!");

    return JSON.stringify({
        summary,
        details,
        metrics: {
            depression: depressionScore,
            anxiety: anxietyScore,
            stress: stressScore,
            wellness: wellnessScore,
            total: totalScore
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

app.post('/api/chat', authenticateToken, (req, res) => {
    const { message } = req.body;
    const userId = req.user.id;

    // Logic for smarter responses
    const lowerMsg = message.toLowerCase();
    let botResponse = "I'm listening. Please go on.";

    if (lowerMsg.includes('suicide') || lowerMsg.includes('kill myself')) {
        botResponse = "I am an AI and cannot provide crisis support. If you are in danger, please call emergency services or a suicide hotline immediately.";
    } else if (lowerMsg.includes('stress') || lowerMsg.includes('pressure')) {
        botResponse = "Stress is a heavy burden. Have you tried the 'Box Breathing' technique? Inhale for 4, hold for 4, exhale for 4, hold for 4.";
    } else if (lowerMsg.includes('bad') || lowerMsg.includes('awful')) {
        botResponse = "I'm sorry you're having a hard time. Can you identify one small thing that is causing this feeling right now?";
    } else if (lowerMsg.includes('thanks') || lowerMsg.includes('thank you')) {
        botResponse = "You're very welcome. I'm here whenever you need.";
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
