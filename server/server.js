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
const generateAnalysis = (r1, r2, answers, userProfile = {}) => {
    const a1 = answers.round1 || {};
    const a2 = answers.round2 || {};
    const { hobbies, user_type, working_time, preferred_relief_style } = userProfile;

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

    // Personalization helpers
    const addHobbyRecommendation = () => {
        if (!hobbies) return;
        const lowHobby = hobbies.toLowerCase();
        
        // Comprehensive hobby-based mapping
        if (lowHobby.includes('danc')) {
            recommendations.push("Try dancing for 10–15 minutes daily to refresh your mind and reduce stress.");
            recommendations.push("Use dance as a quick stress-relief activity during your free time.");
        }
        if (lowHobby.includes('draw') || lowHobby.includes('paint') || lowHobby.includes('sketch') || lowHobby.includes('art')) {
            recommendations.push("Spend 10–15 minutes drawing or sketching daily to relax your mind.");
        }
        if (lowHobby.includes('sing') || lowHobby.includes('music') || lowHobby.includes('listen')) {
            recommendations.push("Sing or listen to calming music for 10–15 minutes daily to release tension.");
        }
        if (lowHobby.includes('sport') || lowHobby.includes('run') || lowHobby.includes('gym') || lowHobby.includes('exercise')) {
            recommendations.push("Do light physical activity or play a sport for a short time daily to boost your mood.");
        }
        if (lowHobby.includes('read')) {
            recommendations.push("Read for 10–20 minutes daily to reduce stress and disconnect from worries.");
        }
        if (lowHobby.includes('talk') || lowHobby.includes('friend') || lowHobby.includes('family') || lowHobby.includes('social')) {
            recommendations.push("Try calling or chatting with a loved one for a few minutes daily for emotional support.");
        }
        if (lowHobby.includes('meditat') || lowHobby.includes('yoga') || lowHobby.includes('breath')) {
            recommendations.push("Spend 5–10 minutes in meditation or breathing exercises daily to center yourself.");
        }
        if (lowHobby.includes('cook')) {
            recommendations.push("Use cooking as a calming and creative break activity to refresh your focus.");
        }
        if (lowHobby.includes('garden') || lowHobby.includes('plant')) {
            recommendations.push("Spend a few minutes with plants or gardening to refresh your mood and connect with nature.");
        }
        if (lowHobby.includes('walk')) {
            recommendations.push("Take a short walk daily to release stress and improve your mental clarity.");
        }

        // Catch-all for other hobbies if none of the above matched specifically
        if (recommendations.filter(r => r.includes(hobbies)).length === 0) {
            recommendations.push(`Take some time today to enjoy your hobby: ${hobbies}. It's a great way to disconnect and recharge.`);
        }
    };

    const addUserTypeRecommendation = () => {
        if (!user_type) return;
        const lowType = user_type.toLowerCase();
        if (lowType.includes('student')) {
            recommendations.push("Implement the Pomodoro technique (25 min study, 5 min break) to balance your study load.");
        } else if (lowType.includes('employee') || lowType.includes('work')) {
            recommendations.push("Take regular short breaks from your desk to stretch and decompress from work.");
        }
    };

    if (a2.q6 && a2.q6 !== 'Never') {
        summary = "CRITICAL: Immediate Support Needed.";
        recommendations.push("Please contact a mental health professional immediately.");
        recommendations.push("Reach out to a trusted individual—do not navigate this alone.");
        addHobbyRecommendation(); // Still include for gentle distraction
    } else if (totalDistress >= 80) {
        summary = "High Stress & Overload Pattern.";
        addHobbyRecommendation(); // High priority
        recommendations.push("We strongly recommend consulting a wellness specialist to help manage this stress load.");
        if (working_time) recommendations.push(`Evaluate your schedule (${working_time}) for immediate stress-reduction opportunities.`);
        addUserTypeRecommendation();
    } else if (totalDistress > 50) {
        summary = "Moderate Stress & Lifestyle Imbalance.";
        addHobbyRecommendation(); // High priority
        recommendations.push("Consider a structured 15-minute relaxation or meditation routine daily.");
        addUserTypeRecommendation();
        if (preferred_relief_style) recommendations.push(`Focus on ${preferred_relief_style} as your primary relief method.`);
    } else {
        summary = "Healthy Lifestyle Balance & Low Stress.";
        addHobbyRecommendation(); 
        recommendations.push("Maintain your current balanced routine and focus on consistent self-care.");
    }

    // Specific Actionable Insights
    if (a2.q4 === 'Often') technicalInsights.push("Pessimistic viewpoints may be increasing your feeling of stress.");
    if (a2.q3 === 'Often') technicalInsights.push("Physical stress signs (e.g. tension, heart rate) are noticeably active.");
    if (a1.q2 === 'Restless') technicalInsights.push("Restless sleep might be preventing you from fully recovering your energy.");
    if (a2.q5 === 'Often') technicalInsights.push("You seem to be withdrawing socially; connecting with others can help alleviate pressure.");

    const suggestions = [...recommendations];
    if (a1.q9 === 'Never') suggestions.push("Bio-Suggestion: Start with 10 minutes of light walking to boost your mood.");
    if (a1.q8 === 'Often') suggestions.push("Energy Audit: Your energy levels suggest you need a comprehensive rest weekend.");
    if (a2.q7 === 'Never') suggestions.push("Mindfulness: Consider spending a few minutes quietly reflecting or using an app like Calm or Headspace.");

    return JSON.stringify({
        summary,
        insights: technicalInsights,
        suggestions: suggestions,
        recommendations: suggestions, // Added for compatibility
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
        const { name, email, password, age, gender, occupation, language, working_time, week_off, hobbies, preferred_relief_style, user_type } = req.body;
        if (!email || !password) return res.status(400).json({ error: "Email and password required" });

        const hashedPassword = await bcrypt.hash(password, 10);
        // Check compatibility
        const isPostgres = !!process.env.DATABASE_URL;
        let query = `INSERT INTO users (name, email, password, age, gender, occupation, language, working_time, week_off, hobbies, preferred_relief_style, user_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        if (isPostgres) query += ` RETURNING id`;

        db.run(query, [name, email, hashedPassword, age, gender, occupation, language, working_time, week_off, hobbies, preferred_relief_style, user_type], function (err) {
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
            res.json({
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    age: user.age,
                    gender: user.gender,
                    occupation: user.occupation,
                    email: user.email,
                    language: user.language,
                    bio: user.bio,
                    wellness_goals: user.wellness_goals,
                    emergency_contact: user.emergency_contact,
                    location: user.location,
                    blood_group: user.blood_group,
                    working_time: user.working_time,
                    week_off: user.week_off,
                    hobbies: user.hobbies,
                    preferred_relief_style: user.preferred_relief_style,
                    user_type: user.user_type
                }
            });
        });
    } catch (e) {
        res.status(500).json({ error: "Login failed" });
    }
});

app.put('/api/auth/profile', authenticateToken, (req, res) => {
    const {
        name, age, gender, occupation,
        bio, wellness_goals, emergency_contact,
        language, location, blood_group,
        working_time, week_off, hobbies, preferred_relief_style, user_type
    } = req.body;
    const userId = req.user.id;

    db.run(
        `UPDATE users SET 
            name = ?, age = ?, gender = ?, occupation = ?, 
            bio = ?, wellness_goals = ?, emergency_contact = ?, 
            language = ?, location = ?, blood_group = ?,
            working_time = ?, week_off = ?, hobbies = ?, preferred_relief_style = ?, user_type = ?
         WHERE id = ?`,
        [
            name, age, gender, occupation,
            bio, wellness_goals, emergency_contact,
            language, location, blood_group,
            working_time, week_off, hobbies, preferred_relief_style, user_type,
            userId
        ],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });

            // Return updated user object
            db.get(`SELECT id, name, email, age, gender, occupation, bio, wellness_goals, emergency_contact, language, location, blood_group, working_time, week_off, hobbies, preferred_relief_style, user_type FROM users WHERE id = ?`, [userId], (err, row) => {
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
                working_time TEXT,
                week_off TEXT,
                hobbies TEXT,
                preferred_relief_style TEXT,
                user_type TEXT,
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

        // Fetch full user profile to pass to generator
        db.get(`SELECT * FROM users WHERE id = ?`, [userId], (err, row) => {
            if (err) return res.status(500).json({ error: "Failed to load user profile" });

            // Use the robust analysis engine
            const analysis = generateAnalysis(round1_score, round2_score, answers, row || {});

            const isPostgres = !!process.env.DATABASE_URL;
            let query = `INSERT INTO assessments (user_id, round1_score, round2_score, answers, analysis) VALUES (?, ?, ?, ?, ?)`;
            if (isPostgres) query += ` RETURNING id`;

            db.run(query, [userId, round1_score, round2_score, JSON.stringify(answers), analysis], function (err) {
                if (err) {
                     console.error("DEBUG: db.run error:", err);
                     return res.status(500).json({ error: err.message });
                }
                console.log("DEBUG: Assessment saved successfully!", this.lastID);
                res.json({ message: 'Assessment saved', id: this.lastID, analysis });
            });
        });
    } catch (e) {
        console.error("DEBUG: Catch block in /api/assessment:", e);
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
        const cohereKey = process.env.COHERE_API_KEY;
        const systemPrompt = "You are MindWell, a stress support and lifestyle guidance assistant for students and employees. Your goal is to provide supportive, non-judgmental advice, suggest hobby-based activities, give practical day-to-day stress relief ideas, and explain stress reports in simple terms. Avoid medical diagnosis tone, medication suggestions, or clinical treatment advice. Only if stress seems persistently high, gently suggest consulting a doctor or mental health professional. Keep your responses concise and supportive.";

        if (cohereKey) {
            const { CohereClient } = require('cohere-ai');
            const cohere = new CohereClient({ token: cohereKey });
            
            // Using a stable, versioned model name for high quality and reliability
            const response = await cohere.chat({
                message: message,
                preamble: systemPrompt,
                model: 'command-r-plus-08-2024'
            });
            botResponse = response.text;
        } else {
            throw new Error("Cohere key missing");
        }
    } catch (err) {
        console.error("Chatbot Error:", err.message);
        const lower = message.toLowerCase();
        if (lower.includes('stress') || lower.includes('anxious') || lower.includes('help')) {
            botResponse = "I hear that you're feeling a bit overwhelmed. It's really important to take a moment for yourself—try a deep breathing exercise or step outside for a short 5-minute walk. I'm here to listen.";
        } else {
            botResponse = "Hello! I'm your MindWell assistant. How can I help you find more balance today?";
        }
    }

    // Save to Database
    db.run(`INSERT INTO messages (user_id, content, sender) VALUES (?, ?, ?)`, [userId, message, 'user']);
    db.run(`INSERT INTO messages (user_id, content, sender) VALUES (?, ?, ?)`, [userId, botResponse, 'ai'], function (err) {
        if (err) return res.status(500).json({ error: "Chat DB error" });
        res.json({ response: botResponse });
    });
});

if (require.main === module) {
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}
module.exports = app;
