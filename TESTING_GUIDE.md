# MindWell - Quick Testing Guide

## 🧪 How to Test All New Features

### 1. Email & Password Validation

**Registration Page** (`/register`)
1. Try registering with invalid email (e.g., "test@test" or "test.com")
   - ✅ Should show: "Please enter a valid email address"
2. Try password with less than 8 characters
   - ✅ Should show: "Password must contain at least 8 characters..."
3. Try password without numbers (e.g., "Password!")
   - ✅ Should show: "Password must contain... at least 1 number..."
4. Try password without special characters (e.g., "Password123")
   - ✅ Should show: "Password must contain... at least 1 special character"
5. Valid example: `test@example.com` / `Password123!`
   - ✅ Should register successfully

**Login Page** (`/login`)
1. Try logging in with invalid email format
   - ✅ Should show: "Please enter a valid email address"

### 2. Native Language Selection

**Registration Page** (`/register`)
1. Try submitting form without selecting language
   - ✅ Should show: "Please select your native language"
2. Select any language (e.g., "Hindi (हिन्दी)")
   - ✅ Should save and appear on profile page

**Profile Page** (`/profile`)
1. Check "Native Lexicon" field
   - ✅ Should display selected language

### 3. Hindi Translations

**Round 1 Assessment** (`/round1`)
1. Start assessment
   - ✅ Should see page title: "Mental Health Assessment – Round 1"
2. Check each question
   - ✅ English question should appear
   - ✅ Hindi translation should appear below in italics and gray
   - Example: "How often have you been bothered by feeling down, depressed, or hopeless?"
   - Below: "(आप कितनी बार उदास, निराश या हताश महसूस करते हैं?)"

**Round 2 Assessment** (`/round2`)
1. Navigate to Round 2
   - ✅ Should see page title: "Mental Health Assessment – Round 2"
2. Check each question
   - ✅ Hindi translation should appear below each question

### 4. Conditional Navigation After Round 1

**Round 1 Completion**
1. Complete all 10 questions in Round 1
2. After last question, click "Continue" or "Next Round →"
   - ✅ Should see prompt: "Round 1 Complete!"
   - ✅ Should see message: "Do you want to continue to Round 2 for a more comprehensive assessment?"
   - ✅ Should see two buttons: "No, Exit" and "Yes, Continue →"

3. Click "No, Exit"
   - ✅ Should redirect to Dashboard

4. Start Round 1 again and click "Yes, Continue →"
   - ✅ Should navigate to Round 2

### 5. PDF Export

**Results Page** (`/results`)
1. Complete both Round 1 and Round 2 assessments
2. Navigate to Results/Analytics page
3. Click "Export PDF" button (white button with download icon)
   - ✅ PDF should download automatically

**Verify PDF Contents:**
1. Open downloaded PDF
2. Check it includes:
   - ✅ Title: "Mental Health Assessment Report"
   - ✅ Assessment Date and Time
   - ✅ **User Profile Section** with:
     - Full Name
     - Email
     - Age
     - Gender
     - Occupation
     - Native Language
     - Location
     - Blood Group
     - Emergency Contact
   - ✅ **Assessment Scores**:
     - Round 1 Score
     - Round 2 Score
   - ✅ **Mental Health Metrics**:
     - Total Distress Index
     - Depression Marker
     - Anxiety Intensity
     - Stress Load Factor
     - Wellness Risk Score
   - ✅ **Clinical Assessment** (summary text)
   - ✅ **Technical Health Insights** (bullet points)
   - ✅ Footer with page numbers

## 🎯 Complete Test Flow

### Full User Journey Test
1. **Register** with:
   - Email: `testuser@example.com`
   - Password: `TestPass123!`
   - Native Language: `Hindi (हिन्दी)`
   - Fill other required fields

2. **Login** with same credentials

3. **Update Profile** (`/profile`):
   - Add bio, location, blood group, emergency contact
   - Verify language shows as "Hindi"

4. **Start Assessment** (`/round1`):
   - Verify page title appears
   - Verify Hindi translations appear below each question
   - Complete all 10 questions
   - At end, click "Yes, Continue →"

5. **Complete Round 2** (`/round2`):
   - Verify page title appears
   - Verify Hindi translations appear
   - Complete all 7 questions

6. **View Results** (`/results`):
   - Check analytics dashboard loads
   - Click "Export PDF"
   - Open PDF and verify all profile data is included

## ✅ Expected Behavior Summary

| Feature | Location | Expected Behavior |
|---------|----------|-------------------|
| Email Validation | Registration & Login | Red border + error message for invalid format |
| Password Validation | Registration | Error message listing missing requirements |
| Language Selection | Registration | Required field, no default, 12 options |
| Language Display | Profile | Shows selected language |
| Language in PDF | Results PDF | Included in User Profile section |
| Hindi Translations | Round 1 & 2 | Below every question in gray italics |
| Round 1 Title | Round 1 Page | "Mental Health Assessment – Round 1" |
| Round 2 Title | Round 2 Page | "Mental Health Assessment – Round 2" |
| Continuation Prompt | After Round 1 | "Do you want to continue to Round 2?" |
| PDF Export | Results Page | Downloads comprehensive report with all profile data |

## 🐛 Common Issues to Check

1. **PDF not downloading?**
   - Check browser's download settings
   - Ensure pop-ups are allowed
   - Check console for errors

2. **Hindi text not displaying?**
   - Ensure browser supports Unicode
   - Check if font rendering is enabled

3. **Validation not working?**
   - Check browser console for JavaScript errors
   - Ensure form submission is not bypassing validation

4. **Language not saving?**
   - Check network tab to see if API call succeeds
   - Verify database has `language` column

## 📱 Browser Testing

Test on:
- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)

## 🔧 Developer Testing

Run in development mode:
```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm run dev
```

Access at: `http://localhost:5173` (or port shown in terminal)

## 📊 Test Data Examples

**Valid Registration:**
- Name: John Doe
- Email: john.doe@example.com
- Password: SecurePass123!
- Age: 30
- Gender: Male
- Occupation: Software Engineer
- Language: English

**Invalid Registration Examples:**
- Email: john@test (invalid format)
- Password: short (too short)
- Password: NoNumbers! (missing number)
- Password: NoSpecial123 (missing special char)
- Language: (not selected)

---

**Happy Testing! 🎉**

If you encounter any issues, check the browser console for error messages and verify all dependencies are installed (`npm install` in both client and server directories).
