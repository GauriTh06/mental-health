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
    const a1 = answers.round1 || {};
    const a2 = answers.round2 || {};

    const mapDistress = (val, max = 5, inverse = false) => {
        let v = parseInt(val) || 0;
        const textMap = {
            'Not at all': 0, 'Several days': 1, 'More than half the days': 2, 'Nearly every day': 3,
            'Rarely': 0, 'Sometimes': 1, 'Often': 2, 'Always': 3,
            'No': 0, 'Yes, gained': 2, 'Yes, lost': 2,
            'Yes, definitely': 0, 'Somewhat': 2, 'No, not really': 3, // Inverted for "Healthy" answers (e.g., 'Yes, definitely' support is low distress, so 0)
            'Daily': 0, '3-4 times/week': 1, '1-2 times/week': 2, // Inverted for exercise (Daily exercise is low distress, so 0)
            'Never': 0, 'Occasionally': 1, 'Frequently': 2
        };

        if (typeof val === 'string' && textMap[val] !== undefined) v = textMap[val];

        // Now, higher 'v' should always mean higher distress.
        // For 0-3 scales, max distress is 3. For 0-5 scales, max distress is 5.
        // Normalize to 0-100 where 100 is max distress.
        // If inverse is true, the raw value 'v' already represents distress (e.g., 'Nearly every day' = 3 distress).
        // If inverse is false, the raw value 'v' represents wellness (e.g., 'Yes, definitely' support = 0 distress, 'No, not really' = 3 distress).

        if (inverse) { // Raw value directly maps to distress (e.g., PHQ-style questions)
            return Math.min(100, (v / (max === 3 ? 3 : 5)) * 100); // Scale 0-3 or 0-5 to 0-100
        } else { // Raw value maps to wellness, so invert for distress (e.g., support, exercise, confidence)
            return Math.min(100, ((max === 3 ? 3 : 5) - v) / (max === 3 ? 3 : 5) * 100);
        }
    };

    // Calculate Category Distress (0-100, where 100 is HIGHEST RISK)

    // Depression Distress (High = More Depressed)
    let depSum = 0;
    depSum += mapDistress(a1.q1, 3, true); // Mood (0-3 scale, higher = more distress)
    depSum += mapDistress(a1.q3, 3, true); // Interest (0-3 scale, higher = more distress)
    depSum += (a1.q7 === 'Normal' ? 0 : 70); // Appetite (Normal = 0 distress, others = 70 distress)
    depSum += mapDistress(a1.q8, 3, true); // Fatigue (0-3 scale, higher = more distress)
    const depressionScore = Math.round(depSum / 4);

    // Anxiety Distress (High = More Anxious)
    let anxSum = 0;
    anxSum += mapDistress(a2.q1, 3, true); // Nervous (0-3 scale, higher = more distress)
    anxSum += mapDistress(a2.q2, 3, true); // Worry (0-3 scale, higher = more distress)
    anxSum += mapDistress(a2.q5, 3, true); // Fear (0-3 scale, higher = more distress)
    anxSum += mapDistress(a2.q9, 3, true); // Avoidance (0-3 scale, higher = more distress)
    const anxietyScore = Math.round(anxSum / 4);

    // Stress Distress (High = More Stressed)
    let strSum = 0;
    strSum += mapDistress(a1.q6, 3, true); // Overwhelm (0-3 scale, higher = more distress)
    strSum += mapDistress(a2.q3, 3, true); // Relaxing problem (0-3 scale, higher = more distress)
    strSum += mapDistress(a2.q4, 3, true); // Irritable (0-3 scale, higher = more distress)
    strSum += mapDistress(a2.q7, 3, true); // Racing thoughts (0-3 scale, higher = more distress)
    const stressScore = Math.round(strSum / 4);

    // Lifestyle/Wellness Risk (High = Poor Lifestyle)
    let welRiskSum = 0;
    let sleepVal = parseInt(a1.q2) || 0;
    if (sleepVal >= 7 && sleepVal <= 9) welRiskSum += 0; // Optimal sleep = 0 risk
    else if (sleepVal >= 5 && sleepVal <= 11) welRiskSum += 40; // Suboptimal sleep = 40 risk
    else welRiskSum += 80; // Very poor sleep = 80 risk

    welRiskSum += mapDistress(a1.q5, 3, false); // No Support = High Risk (0-3 scale, 0=Yes, definitely, 3=No, not really)
    welRiskSum += mapDistress(a1.q9, 3, false); // No Exercise = High Risk (0-3 scale, 0=Daily, 3=1-2 times/week)
    welRiskSum += mapDistress(a2.q10, 3, false); // No Confidence = High Risk (0-3 scale, 0=Yes, definitely, 3=No, not really)
    const wellnessRiskScore = Math.round((welRiskSum) / 4);

    const totalDistress = Math.round((depressionScore + anxietyScore + stressScore + wellnessRiskScore) / 4);

    // Generate Report Text
    let summary = "";
    let recommendations = [];

    if (totalDistress > 80) {
        summary = "CRITICAL: Your results indicate a high level of psychological distress.";
        recommendations.push("PRO ACTION: We strongly recommend scheduling a clinical consultation immediately.");
        recommendations.push("Our records show you are in a high-risk category. Please visit our 'Consult Doctors' section to connect with a specialist.");
    } else if (totalDistress > 50) {
        summary = "MODERATE: You are showing signs of significant mental strain.";
        recommendations.push("Consider speaking with a counselor to prevent burnout.");
        recommendations.push("Focus on immediate stress-reduction techniques and maintaining a strict sleep schedule.");
    } else {
        summary = "NORMAL: Your mental wellness appears stable.";
        recommendations.push("Continue practicing your healthy habits. You are maintaining a good balance.");
    }

    const details = [];
    if (depressionScore > 60) details.push("High Depression Markers: Persistent low mood detected. Solution: Focus on behavioral activation—start with one small task today.");
    if (anxietyScore > 60) details.push("High Anxiety Markers: Significant worry detected. Solution: Try the cognitive reframing tool in our chat.");
    if (stressScore > 60) details.push("High Stress Level: Overwhelming pressure detected. Solution: Urgent need for boundary setting and digital detox.");

    if (details.length === 0 && totalDistress < 30) {
        details.push("No immediate triggers found. Your current coping mechanisms are highly effective.");
    }

    return JSON.stringify({
        summary,
        details: [...details, ...recommendations],
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
