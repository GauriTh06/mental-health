const http = require('http');

const runTest = async () => {
    // 1. Register to get user and token
    const regData = JSON.stringify({
        name: "Test Assess3", email: "assess3@example.com", password: "password",
        age: 30, gender: "Male", occupation: "Test", language: "English",
        working_time: "9-5", week_off: "Sun", hobbies: "Read", user_type: "Student"
    });

    const token = await new Promise((resolve, reject) => {
        const req = http.request({
            hostname: 'localhost', port: 5000, path: '/api/auth/register',
            method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': regData.length }
        }, res => {
            let body = '';
            res.on('data', d => body += d);
            res.on('end', () => {
                const loginData = JSON.stringify({email: 'assess3@example.com', password: 'password'});
                const loginReq = http.request({
                    hostname: 'localhost', port: 5000, path: '/api/auth/login',
                    method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': loginData.length}
                }, lres => {
                    let lbody = '';
                    lres.on('data', d => lbody+=d);
                    lres.on('end', () => resolve(JSON.parse(lbody).token));
                });
                loginReq.write(loginData);
                loginReq.end();
            });
        });
        req.write(regData);
        req.end();
    });

    // 2. Submit Assessment
    const assessData = JSON.stringify({
        round1_score: 10,
        round2_score: 20,
        answers: { round1: { q1: 1 }, round2: { q1: 2 } }
    });

    await new Promise(resolve => {
        const req2 = http.request({
            hostname: 'localhost', port: 5000, path: '/api/assessment',
            method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': assessData.length, 'Authorization': 'Bearer ' + token }
        }, () => resolve());
        req2.write(assessData);
        req2.end();
    });

    // 3. Get History
    const req3 = http.request({
        hostname: 'localhost', port: 5000, path: '/api/history',
        method: 'GET', headers: { 'Authorization': 'Bearer ' + token }
    }, res => {
        console.log("History Status:", res.statusCode);
        res.on('data', d => process.stdout.write(d));
    });
    req3.end();
};
runTest();
