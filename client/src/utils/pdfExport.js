// Enhanced PDF Export Function with Charts and Tables
if (typeof window === 'undefined') return;

export const exportComprehensivePDF = async (record, user, pieChartRef, barChartRef, radarChartRef) => {
    const jsPDF = (await import('jspdf')).default;
    await import('jspdf-autotable');


    let analysis;
    try {
        analysis = typeof record.analysis === 'string' ? JSON.parse(record.analysis) : record.analysis;
    } catch (e) {
        analysis = { summary: record.analysis || "General Log", metrics: { total: 50, depression: 0, anxiety: 0, stress: 0, wellness: 0 }, insights: [], suggestions: [] };
    }

    const metrics = analysis.metrics || { total: 0, depression: 0, anxiety: 0, stress: 0, wellness: 0 };
    const insights = analysis.insights || analysis.details || [];
    const suggestions = analysis.suggestions || [];

    // Capture charts as images
    const captureChart = async (ref) => {
        if (!ref) return null;

        // Find actual canvas inside chart container
        const canvasElement =
            ref instanceof HTMLCanvasElement
                ? ref
                : ref.querySelector?.('canvas');

        if (!canvasElement) {
            console.warn('Chart canvas not found');
            return null;
        }

        try {
            return canvasElement.toDataURL('image/png', 1.0);
        } catch (error) {
            console.error('Error capturing chart canvas:', error);
            return null;
        }
    };


    const pieChartImage = await captureChart(pieChartRef?.current);
    const barChartImage = await captureChart(barChartRef?.current);
    const radarChartImage = await captureChart(radarChartRef?.current);

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    let yPos = 20;

    const checkPageBreak = (requiredSpace) => {
        if (yPos + requiredSpace > pageHeight - 20) {
            doc.addPage();
            yPos = 20;
            return true;
        }
        return false;
    };

    // ============ HEADER SECTION ============
    doc.setFillColor(74, 129, 128);
    doc.rect(0, 0, pageWidth, 35, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont(undefined, 'bold');
    doc.text('MindWell', pageWidth / 2, 15, { align: 'center' });

    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    doc.text('Mental Health Predictor', pageWidth / 2, 23, { align: 'center' });

    yPos = 45;
    doc.setTextColor(0, 0, 0);

    // Report Title
    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    doc.text('Mental Health Assessment Report', pageWidth / 2, yPos, { align: 'center' });
    yPos += 10;

    // Date and Time
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    const assessmentDate = new Date(record.created_at);
    const reportDate = new Date();
    doc.text(`Assessment Date: ${assessmentDate.toLocaleDateString()} ${assessmentDate.toLocaleTimeString()}`, margin, yPos);
    yPos += 5;
    doc.text(`Report Generated: ${reportDate.toLocaleDateString()} ${reportDate.toLocaleTimeString()}`, margin, yPos);
    yPos += 12;

    // ============ USER PROFILE TABLE ============
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(74, 129, 128);
    doc.text('User Profile Information', margin, yPos);
    yPos += 8;

    const profileData = [
        ['Full Name', user?.name || 'N/A'],
        ['Email Address', user?.email || 'N/A'],
        ['Age', user?.age ? `${user.age} years` : 'N/A'],
        ['Gender', user?.gender || 'N/A'],
        ['Occupation', user?.occupation || 'N/A'],
        ['Native Language', user?.language || 'Not specified'],
        ['Location', user?.location || 'Not specified'],
        ['Blood Group', user?.blood_group || 'Not specified'],
        ['Emergency Contact', user?.emergency_contact || 'Not specified']
    ];

    doc.autoTable({
        startY: yPos,
        head: [['Field', 'Value']],
        body: profileData,
        theme: 'grid',
        headStyles: {
            fillColor: [74, 129, 128],
            textColor: [255, 255, 255],
            fontStyle: 'bold',
            fontSize: 10
        },
        bodyStyles: {
            fontSize: 9,
            cellPadding: 3
        },
        alternateRowStyles: { fillColor: [245, 247, 250] },
        margin: { left: margin, right: margin }
    });

    yPos = doc.lastAutoTable.finalY + 12;

    // ============ ASSESSMENT SCORES TABLE ============
    checkPageBreak(50);
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(74, 129, 128);
    doc.text('Assessment Scores', margin, yPos);
    yPos += 8;

    const scoresData = [
        ['Round 1 Score', record.round1_score || 'N/A'],
        ['Round 2 Score', record.round2_score || 'N/A'],
        ['Total Distress Index', `${metrics.total}%`],
        ['Risk Category', metrics.total >= 80 ? 'High Risk' : metrics.total >= 50 ? 'Moderate Risk' : 'Low Risk']
    ];

    doc.autoTable({
        startY: yPos,
        head: [['Metric', 'Score']],
        body: scoresData,
        theme: 'grid',
        headStyles: {
            fillColor: [74, 129, 128],
            textColor: [255, 255, 255],
            fontStyle: 'bold',
            fontSize: 10
        },
        bodyStyles: {
            fontSize: 9,
            cellPadding: 3
        },
        alternateRowStyles: { fillColor: [245, 247, 250] },
        margin: { left: margin, right: margin }
    });

    yPos = doc.lastAutoTable.finalY + 12;

    // ============ MENTAL HEALTH METRICS TABLE ============
    checkPageBreak(60);
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(74, 129, 128);
    doc.text('Detailed Mental Health Metrics', margin, yPos);
    yPos += 8;

    const metricsTableData = [
        ['Depression Marker', `${metrics.depression}%`, getMetricBar(metrics.depression)],
        ['Anxiety Intensity', `${metrics.anxiety}%`, getMetricBar(metrics.anxiety)],
        ['Stress Load Factor', `${metrics.stress}%`, getMetricBar(metrics.stress)],
        ['Wellness Risk Score', `${metrics.wellness}%`, getMetricBar(metrics.wellness)]
    ];

    doc.autoTable({
        startY: yPos,
        head: [['Metric', 'Score', 'Visual Indicator']],
        body: metricsTableData,
        theme: 'grid',
        headStyles: {
            fillColor: [74, 129, 128],
            textColor: [255, 255, 255],
            fontStyle: 'bold',
            fontSize: 10
        },
        bodyStyles: {
            fontSize: 9,
            cellPadding: 3
        },
        alternateRowStyles: { fillColor: [245, 247, 250] },
        margin: { left: margin, right: margin }
    });

    yPos = doc.lastAutoTable.finalY + 15;

    // ============ CHARTS SECTION ============
    doc.addPage();
    yPos = 20;

    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(74, 129, 128);
    doc.text('Visual Analysis', pageWidth / 2, yPos, { align: 'center' });
    yPos += 15;

    // Add Pie Chart
    if (pieChartImage) {
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(0, 0, 0);
        doc.text('Risk Distribution', margin, yPos);
        yPos += 8;
        doc.addImage(pieChartImage, 'PNG', margin, yPos, 80, 60);
        yPos += 70;
    }

    // Add Bar Chart
    if (barChartImage) {
        checkPageBreak(80);
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.text('Wellness Progression Timeline', margin, yPos);
        yPos += 8;
        doc.addImage(barChartImage, 'PNG', margin, yPos, 170, 60);
        yPos += 70;
    }

    // Add Radar Chart
    if (radarChartImage) {
        checkPageBreak(80);
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.text('Psychological Spectrum Radar', margin, yPos);
        yPos += 8;
        doc.addImage(radarChartImage, 'PNG', margin + 30, yPos, 120, 80);
        yPos += 90;
    }

    // ============ CLINICAL ASSESSMENT ============
    doc.addPage();
    yPos = 20;

    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(74, 129, 128);
    doc.text('Clinical Assessment Summary', margin, yPos);
    yPos += 10;

    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(0, 0, 0);
    const summaryLines = doc.splitTextToSize(analysis.summary || 'No summary available', pageWidth - 2 * margin);
    summaryLines.forEach(line => {
        checkPageBreak(10);
        doc.text(line, margin, yPos);
        yPos += 6;
    });
    yPos += 10;

    // ============ TECHNICAL INSIGHTS ============
    if (insights.length > 0) {
        checkPageBreak(30);
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(74, 129, 128);
        doc.text('Technical Health Insights', margin, yPos);
        yPos += 10;

        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        doc.setTextColor(0, 0, 0);

        insights.forEach((insight, idx) => {
            checkPageBreak(15);
            const insightLines = doc.splitTextToSize(`${idx + 1}. ${insight}`, pageWidth - 2 * margin - 5);
            insightLines.forEach(line => {
                checkPageBreak(8);
                doc.text(line, margin + 5, yPos);
                yPos += 6;
            });
            yPos += 3;
        });
    }

    // ============ RECOMMENDATIONS ============
    if (suggestions.length > 0) {
        checkPageBreak(30);
        yPos += 5;
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(74, 129, 128);
        doc.text('Recommendations', margin, yPos);
        yPos += 10;

        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        doc.setTextColor(0, 0, 0);

        suggestions.forEach((suggestion, idx) => {
            checkPageBreak(15);
            const suggestionLines = doc.splitTextToSize(`${idx + 1}. ${suggestion}`, pageWidth - 2 * margin - 5);
            suggestionLines.forEach(line => {
                checkPageBreak(8);
                doc.text(line, margin + 5, yPos);
                yPos += 6;
            });
            yPos += 3;
        });
    }

    // ============ FOOTER ON ALL PAGES ============
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setFont(undefined, 'italic');
        doc.setTextColor(128, 128, 128);
        doc.text(`MindWell Mental Health Report - Page ${i} of ${pageCount}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
        doc.text('Confidential Medical Document', margin, pageHeight - 10);
    }
    if (!doc.internal.pages || doc.internal.pages.length === 0) {
        throw new Error('PDF generation failed');
    }


    // Save PDF
    const fileName = `MindWell_Report_${user?.name?.replace(/\s+/g, '_')}_${assessmentDate.toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
};

// Helper function to create visual metric bars
function getMetricBar(value) {
    const barLength = Math.floor(value / 10);
    return '█'.repeat(barLength) + '░'.repeat(10 - barLength);
}
