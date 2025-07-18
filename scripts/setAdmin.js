// scripts/setAdmin.js
import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// --- 설정 ---
// 관리자로 지정할 사용자의 이메일을 여기에 입력하세요.
// 또는 명령어의 인자로 전달할 수 있습니다. (node scripts/setAdmin.js new-admin@example.com)
const targetEmail = process.argv[2];
// ------------

if (!targetEmail) {
    console.error('❌ Error: Please provide an email address as an argument.');
    console.log('Usage: node scripts/setAdmin.js <email>');
    process.exit(1);
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

async function setAdminClaim() {
    try {
        const user = await admin.auth().getUserByEmail(targetEmail);
        await admin.auth().setCustomUserClaims(user.uid, { admin: true });
        console.log(`✅ Successfully set admin claim for user: ${targetEmail}`);
    } catch (error) {
        console.error(`❌ Error setting admin claim for ${targetEmail}:`, error.message);
    }
}

setAdminClaim();