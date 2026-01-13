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
    let report = [];
    const total = r1 + r2;

    // 1. Overall Status
    if (total < 40) report.push("Your overall mental wellness appears strong. You seem to have effective coping mechanisms in place.");
    else if (total < 80) report.push("You are showing signs of moderate strain. While you are managing, there are areas of your life that may need attention to prevent further stress.");
    else report.push("Your results indicate high levels of distress. It is important to treat this seriously and consider seeking professional support.");

    // 2. Specific Factor Analysis (Logic assuming specific question keys exist)
    // Round 1 Mock Keys: q2=Sleep, q3=Focus
    const sleepScore = parseInt(answers.round1?.q2 || 0); // Assuming Q2 is sleep (0-5 scale)
    if (sleepScore < 6 && sleepScore > 0) {
        report.push("Sleep Deprivation: Your reported sleep duration is below recommended levels. This is a critical factor often amplifying stress and anxiety.");
    }

    // Round 2 Mock Keys: q1=AnxietyFreq, q5=Social
    const anxietyFreq = answers.round2?.q1;
    if (anxietyFreq === 'Often' || anxietyFreq === 'Always') {
        report.push("Anxiety Patterns: You reported frequent feelings of anxiety. This suggests a need for grounding techniques or Cognitive Behavioral Therapy (CBT) exercises.");
    }

    // 3. Recommendation
    if (total > 80) {
        report.push("Recommendation: We strongly advise speaking with a healthcare provider. In the meantime, focus on the 'Immediate Calm' exercises in our chatbot.");
    } else {
        report.push("Recommendation: Try to incorporate 15 minutes of 'me-time' daily. Our AI assistant can guide you through simple breathing exercises.");
    }

    return report.join("\n\n");
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
