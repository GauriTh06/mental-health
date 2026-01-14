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
            'No': 0, 'Yes, gained': 1, 'Yes, lost': 1,
            'Yes, definitely': 0, 'Somewhat': 2, 'No, not really': 3,
            'Daily': 0, '3-4 times/week': 1, '1-2 times/week': 2,
            'Never': 0, 'Occasionally': 1, 'Frequently': 2, 'Regularly': 0,
            'Mild': 1, 'Moderate': 2, 'Severe': 3
        };

        if (typeof val === 'string' && textMap[val] !== undefined) v = textMap[val];

        if (inverse) {
            return Math.min(100, (v / (max === 3 ? 3 : 5)) * 100);
        } else {
            return Math.min(100, ((max === 3 ? 3 : 5) - v) / (max === 3 ? 3 : 5) * 100);
        }
    };

    // New Category Distribution based on 7 new R2 questions + R1 metrics

    // Depression (4 items)
    let depSum = 0;
    depSum += mapDistress(a1.q1, 3, true); // Mood (R1)
    depSum += mapDistress(a1.q3, 3, true); // Interest (R1)
    depSum += mapDistress(a2.q4, 3, true); // Hopelessness (R2)
    depSum += mapDistress(a2.q6, 3, true); // Self-harm (R2)
    const depressionScore = Math.round(depSum / 4);

    // Anxiety (3 items)
    let anxSum = 0;
    anxSum += mapDistress(a2.q3, 3, true); // Physical symptoms (R2)
    anxSum += mapDistress(a1.q8, 3, true); // Fatigue (R1)
    anxSum += (a1.q7 === 'Normal' ? 0 : 50); // Appetite (R1)
    const anxietyScore = Math.round(anxSum / 3);

    // Stress (2 items)
    let strSum = 0;
    strSum += mapDistress(a1.q6, 3, true); // Overwhelm (R1)
    strSum += mapDistress(a2.q1, 3, true); // Deadline pressure (R2)
    const stressScore = Math.round(strSum / 2);

    // Wellness Risk (5 items)
    let welRiskSum = 0;
    welRiskSum += mapDistress(a2.q2, 5, false); // Meals (R2)
    welRiskSum += mapDistress(a2.q5, 3, true); // Social isolation (R2)
    welRiskSum += mapDistress(a2.q7, 3, false); // Mindfulness (R2)
    welRiskSum += mapDistress(a1.q5, 3, false); // Support (R1)
    welRiskSum += mapDistress(a1.q9, 3, false); // Exercise (R1)
    const wellnessRiskScore = Math.round((welRiskSum) / 5);

    const totalDistress = Math.round((depressionScore + anxietyScore + stressScore + wellnessRiskScore) / 4);

    // Generate Report Text
    let summary = "";
    let recommendations = [];

    if (a2.q6 && a2.q6 !== 'Never') {
        summary = "URGENT SAFETY ALERT: Markers for immediate intervention detected.";
        recommendations.push("PRO ACTION: Please contact a crisis support specialist immediately. You are not alone.");
    } else if (totalDistress > 80) {
        summary = "CRITICAL: High psychological distress level detected.";
        recommendations.push("URGENT: Schedule a clinical consultation this week.");
    } else if (totalDistress > 50) {
        summary = "MODERATE: Significant mental strain detected.";
        recommendations.push("Consider professional counseling and strict focus on self-care.");
    } else {
        summary = "NORMAL: Mental wellness appears stable.";
        recommendations.push("Maintain your positive habits and routine.");
    }

    const details = [];
    if (a2.q4 && a2.q4 !== 'Not at all') details.push("Anhedonia/Hopelessness: You mentioned feeling unsure about the future. This is a critical marker for low mood.");
    if (a2.q3 && a2.q3 !== 'Never') details.push("Physiological Anxiety: Rapid heartbeat or sweating suggests high autonomic arousal.");
    if (a2.q1 === 'Severe') details.push("High Workplace Distress: Severe pressure from deadlines is significantly affecting your mental balance.");
    if (a2.q7 === 'Never') details.push("Coping Deficit: You mentioned not using relaxation techniques. Learning mindfulness could improve your resilience.");

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

    // Predefined logic for solutions
    if (lowerMsg.includes('suicide') || lowerMsg.includes('kill myself')) {
        botResponse = "CRITICAL: I am an AI and cannot provide crisis support. If you are in danger, please call 988 (Suicide & Crisis Lifeline) or your local emergency services immediately.";
    } else if (lowerMsg.includes('manage stress') || lowerMsg.includes('pressure')) {
        botResponse = "Stress Management: 1. Try Box Breathing (Inhale 4s, Hold 4s, Exhale 4s, Hold 4s). 2. Practice 'Progressive Muscle Relaxation'. 3. Break large tasks into small, manageable steps.";
    } else if (lowerMsg.includes('anxious') || lowerMsg.includes('anxiety')) {
        botResponse = "Anxiety Support: Use the 5-4-3-2-1 Grounding Technique. Name 5 things you see, 4 you can touch, 3 you hear, 2 you can smell, and 1 you can taste. This pulls your mind back to the present.";
    } else if (lowerMsg.includes('assessment results') || lowerMsg.includes('explain my score')) {
        botResponse = "Your Assessment Results: A high 'Distress Index' (80+) suggests you should see a doctor. A score of 50-80 indicates moderate strain where self-care and counseling are recommended.";
    } else if (lowerMsg.includes('breathing exercises')) {
        botResponse = "Breathing Exercise: Try '4-7-8' breathing. Inhale quietly through your nose for 4 seconds, hold for 7, and exhale forcefully through your mouth for 8 seconds. It's a natural tranquilizer for the nervous system.";
    } else if (lowerMsg.includes('improve my sleep') || lowerMsg.includes('insomnia')) {
        botResponse = "Sleep Hygiene: 1. Keep a consistent sleep schedule. 2. Limit blue light (screens) 1 hour before bed. 3. Keep your room cool and dark. 4. Avoid caffeine after 2 PM.";
    } else if (lowerMsg.includes('focus') || lowerMsg.includes('concentration')) {
        botResponse = "Better Focus: Use the Pomodoro Technique (25 mins work, 5 mins break). Clear your physical workspace and minimize digital distractions like notifications.";
    } else if (lowerMsg.includes('loneliness') || lowerMsg.includes('lonely')) {
        botResponse = "Coping with Loneliness: 1. Schedule a short call with a loved one. 2. Join a local or online community based on your hobbies. 3. Volunteer—helping others often helps us feel connected.";
    } else if (lowerMsg.includes('work-life balance')) {
        botResponse = "Work-Life Balance: Set a strict 'log-off' time. Define a dedicated workspace if working from home. Learn to say 'no' to non-essential tasks that overwhelm your schedule.";
    } else if (lowerMsg.includes('self-care for depression')) {
        botResponse = "Self-care for Depression: Start with 'Behavioral Activation'. Even if you don't feel like it, try to do one small positive thing (like a 5-minute walk). Movement often precedes motivation.";
    } else if (lowerMsg.includes('panic attack')) {
        botResponse = "Panic Attack Support: Remind yourself 'This feeling is temporary and I am safe.' Focus on your breath. Splash cold water on your face—this triggers the 'Dive Reflex' which slows your heart rate.";
    } else if (lowerMsg.includes('journaling')) {
        botResponse = "Journaling: Try 'Gratitude Journaling' (write 3 things you're thankful for) or 'Brain Dumping' (write everything that's worrying you to get it out of your head).";
    } else if (lowerMsg.includes('social confidence') || lowerMsg.includes('social anxiety')) {
        botResponse = "Social Confidence: Start small. Practice making brief eye contact or saying 'hello' to a shopkeeper. Focus on the other person rather than your own anxiety.";
    } else if (lowerMsg.includes('negative thoughts') || lowerMsg.includes('overthinking')) {
        botResponse = "Negative Thoughts: Use 'Thought Challenging'. Ask yourself: 'Is there evidence this thought is true?' and 'What would I tell a friend in this situation?'";
    } else if (lowerMsg.includes('physical activity') || lowerMsg.includes('exercise')) {
        botResponse = "Physical Activity: Just 20 minutes of brisk walking can release endorphins that boost mood for hours. You don't need intense workouts; consistency is key.";
    } else if (lowerMsg.includes('diet') || lowerMsg.includes('nutrition')) {
        botResponse = "Nutrition for Mind: Focus on 'Brain Foods' like Omega-3s (walnuts, salmon), leafy greens, and complex carbs. Avoid sugar spikes which can lead to energy and mood crashes.";
    } else if (lowerMsg.includes('mindfulness')) {
        botResponse = "Mindfulness: Try a 'Sense Scan'. Spend 1 minute just noticing your breath, the feeling of your feet on the floor, and the weight of your body. It grounds your nervous system instantly.";
    } else if (lowerMsg.includes('grief')) {
        botResponse = "Coping with Grief: Be patient with yourself. Grief isn't linear. Allow yourself to feel the emotions without judgment. Talking to a professional or a support group can help process the loss.";
    } else if (lowerMsg.includes('self-esteem')) {
        botResponse = "Self-Esteem: Practice 'Positive Self-Talk'. Replace 'I am a failure' with 'I am learning and doing my best.' Keep a 'Win Journal' where you write one small success every day.";
    } else if (lowerMsg.includes('anger')) {
        botResponse = "Anger Management: Try the 'Cool Down' rule. Before reacting, take 10 deep breaths or walk away for 5 minutes. Identify the underlying emotion (often it's hurt or fear).";
    } else if (lowerMsg.includes('social media')) {
        botResponse = "Social Media Impact: Limit your screen time and unfollow accounts that make you feel 'less than'. Remember that social media is a highlight reel, not real life.";
    } else if (lowerMsg.includes('thanks') || lowerMsg.includes('thank you')) {
        botResponse = "You're very welcome! I'm here for you 24/7 if you need to talk or find solutions.";
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
