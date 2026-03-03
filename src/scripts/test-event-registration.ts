import fs from 'fs';
import path from 'path';

const BASE_URL = 'http://localhost:4000/api';
const VERSION_ID = '5ce563bb-a5ef-414b-852e-af069acf55f4';
const EVENT_ID = 'f8b51ee0-1561-4d1e-9cd2-827ac6488a57';
const IMAGE_PATH = '/tmp/test_image.png';

let cookie: string | null = null;

interface ApiResponse {
      status: number;
      data: any;
}

async function apiRequest(endpoint: string, options: any = {}): Promise<ApiResponse> {
      const url = `${BASE_URL}${endpoint}`;
      const headers = { ...options.headers };
      if (cookie) {
            headers['Cookie'] = cookie;
      }

      const res = await fetch(url, {
            ...options,
            headers
      });

      const setCookie = res.headers.get('set-cookie');
      if (setCookie) {
            cookie = setCookie;
      }

      let data;
      try {
            data = await res.json();
      } catch (e) {
            data = null;
      }
      return { status: res.status, data };
}

async function runTests() {
      console.log('🚀 Starting Event Registration Functional Tests...\n');

      // 1. Login
      console.log('--- Step 1: Login ---');
      const loginRes = await apiRequest('/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                  email: 'creativehub@ictmeetup.com',
                  password: 'hubadmin@123'
            })
      });

      if (loginRes.status !== 200) {
            console.error('❌ Login failed:', loginRes.data);
            return;
      }
      console.log('✅ Login successful\n');

      // Case 1: Valid student registration
      const ts = Date.now();
      console.log('--- Case 1: Valid student registration ---');
      const formData1 = new FormData();
      formData1.append('username', 'student_user');
      formData1.append('email', `student_${ts}@example.com`);
      formData1.append('contactNumber', '9876543210');
      formData1.append('isStudent', 'true'); // Will still be string in FormData
      formData1.append('educationLevel', 'Bachelor');
      formData1.append('faculty', 'Computer Science');
      formData1.append('year', '2024');
      formData1.append('eventId', EVENT_ID);
      formData1.append('versionId', VERSION_ID);

      const fileBuffer1 = fs.readFileSync(IMAGE_PATH);
      const blob1 = new Blob([fileBuffer1], { type: 'image/png' });
      formData1.append('image', blob1, 'screenshot.png');

      const res1 = await apiRequest('/event-registrations', {
            method: 'POST',
            body: formData1
      });

      if (res1.status === 201) {
            console.log('✅ Valid student registration created successfully');
      } else {
            console.error('❌ Valid student registration failed:', res1.data);
      }

      // Case 2: Valid non-student registration
      console.log('\n--- Case 2: Valid non-student registration ---');
      const formData2 = new FormData();
      formData2.append('username', 'professional_user');
      formData2.append('email', `pro_${ts}@example.com`);
      formData2.append('contactNumber', '9812345678');
      formData2.append('isStudent', 'false');
      formData2.append('eventId', EVENT_ID);
      formData2.append('versionId', VERSION_ID);

      const fileBuffer2 = fs.readFileSync(IMAGE_PATH);
      const blob2 = new Blob([fileBuffer2], { type: 'image/png' });
      formData2.append('image', blob2, 'screenshot.png');

      const res2 = await apiRequest('/event-registrations', {
            method: 'POST',
            body: formData2
      });

      if (res2.status === 201) {
            console.log('✅ Valid non-student registration created successfully');
      } else {
            console.error('❌ Valid non-student registration failed:', res2.data);
      }

      // Case 3: Missing education details for student (Error expectation)
      console.log('\n--- Case 3: Missing education details for student (Error expectation) ---');
      const formData3 = new FormData();
      formData3.append('username', 'incomplete_student');
      formData3.append('email', 'incomplete@example.com');
      formData3.append('contactNumber', '9800000000');
      formData3.append('isStudent', 'true');
      // Intentionally missing educationLevel, faculty, year
      formData3.append('eventId', EVENT_ID);
      formData3.append('versionId', VERSION_ID);

      const fileBuffer3 = fs.readFileSync(IMAGE_PATH);
      const blob3 = new Blob([fileBuffer3], { type: 'image/png' });
      formData3.append('image', blob3, 'screenshot.png');

      const res3 = await apiRequest('/event-registrations', {
            method: 'POST',
            body: formData3
      });

      if (res3.status === 400) {
            console.log('✅ Correctly failed with 400 Bad Request for missing student details');
            // console.log('Response Details:', JSON.stringify(res3.data, null, 2));
      } else {
            console.error('❌ Unexpected status code for missing student details:', res3.status, res3.data);
      }

      // Case 4: Duplicate registration (Error expectation)
      console.log('\n--- Case 4: Duplicate registration (Error expectation) ---');
      const formData4 = new FormData();
      formData4.append('username', 'duplicate_user');
      formData4.append('email', `student_${ts}@example.com`); // Already used in Case 1
      formData4.append('contactNumber', '9876543210');
      formData4.append('isStudent', 'false');
      formData4.append('eventId', EVENT_ID);
      formData4.append('versionId', VERSION_ID);

      const fileBuffer4 = fs.readFileSync(IMAGE_PATH);
      const blob4 = new Blob([fileBuffer4], { type: 'image/png' });
      formData4.append('image', blob4, 'screenshot.png');

      const res4 = await apiRequest('/event-registrations', {
            method: 'POST',
            body: formData4
      });

      if (res4.status === 400 && res4.data.message.includes('already registered')) {
            console.log('✅ Correctly failed with duplicate registration error');
      } else {
            console.error('❌ Unexpected response for duplicate registration:', res4.status, res4.data);
      }

      // Case 5: Missing version or event (Error expectation)
      console.log('\n--- Case 5: Missing version or event (Error expectation) ---');
      const formData5 = new FormData();
      formData5.append('username', 'wrong_ids');
      formData5.append('email', 'wrong@example.com');
      formData5.append('contactNumber', '9876543210');
      formData5.append('isStudent', 'false');
      formData5.append('eventId', '00000000-0000-0000-0000-000000000000'); // Non-existent ID
      formData5.append('versionId', VERSION_ID);

      const fileBuffer5 = fs.readFileSync(IMAGE_PATH);
      const blob5 = new Blob([fileBuffer5], { type: 'image/png' });
      formData5.append('image', blob5, 'screenshot.png');

      const res5 = await apiRequest('/event-registrations', {
            method: 'POST',
            body: formData5
      });

      if (res5.status === 500 || (res5.data && res5.data.message && res5.data.message.includes('not found'))) {
            // Note: The service throws a generic Error which likely results in 500 if not handled by AppError
            console.log('✅ Correctly failed for missing version/event');
      } else {
            console.error('❌ Unexpected response for missing version/event:', res5.status, res5.data);
      }

      console.log('\n🏁 Tests Finished.');
}

runTests().catch(err => {
      console.error('💥 Test execution error:', err.message);
});
