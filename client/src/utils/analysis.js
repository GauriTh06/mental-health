// Helper to get color based on score
export const getScoreColor = (score) => {
    if (score < 30) return 'text-green-600 bg-green-100';
    if (score < 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
};

// Helper for actionable insights (Client-side fallback)
export const getInsights = (r1, r2) => {
    const insights = [];
    if (r1 > 40) insights.push("Try mindfulness meditation for 10 minutes daily.");
    if (r1 < 20) insights.push("Great job managing stress! Keep up your current routine.");
    if (r2 < 30) insights.push("Consider increasing your physical activity to boost endorphins.");
    if (insights.length === 0) insights.push("Maintain a balanced diet and regular sleep schedule.");
    return insights;
};
