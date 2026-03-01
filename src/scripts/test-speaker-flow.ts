import fs from 'fs';
import path from 'path';

const BASE_URL = 'http://localhost:4000/api';
const VERSION_ID = '03dbda95-dc51-4335-be4c-fe2730b5889f';
const IMAGE_PATH = '/home/nirjla/.gemini/antigravity/brain/08427c9e-8832-4b71-b6cc-012032f5663e/test_speaker_image_1772363971841.png';

let cookie: string | null = null;

async function apiRequest(endpoint: string, options: any = {}) {
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

      const data = await res.json();
      return { status: res.status, data };
}

async function runTests() {
      console.log('🚀 Starting Speaker Functional Tests...\n');

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

      const categories = ['Mentor', 'Speaker', 'Workshop Lead'];
      const createdCategories = [];

      // Pre-cleanup: Find and delete any existing categories with these names
      console.log('--- Step 1b: Pre-cleanup existing test categories ---');
      const existingCatsRes = await apiRequest(`/speakers/category`);
      console.log(`GET /speakers/category status: ${existingCatsRes.status}`);
      let existingItems = [];
      if (existingCatsRes.status === 200) {
            existingItems = existingCatsRes.data.data.items;
            console.log(`Found ${existingItems.length} total speaker categories`);
            for (const item of existingItems) {
                  console.log(`Checking category: ${item.name} (ID: ${item.id})`);
                  if (categories.includes(item.name)) {
                        console.log(`Cleaning up existing category: ${item.name}`);
                        const delRes = await apiRequest(`/speakers/category/${item.id}?versionId=${VERSION_ID}`, { method: 'DELETE' });
                        console.log(`DELETE status: ${delRes.status}`);
                  }
            }
      }

      // 2. Create Categories
      // console.log('--- Step 2: Create Speaker Categories ---');
      // for (const catName of categories) {
      //       const res = await apiRequest('/speakers/category', {
      //             method: 'POST',
      //             headers: { 'Content-Type': 'application/json' },
      //             body: JSON.stringify({
      //                   name: catName,
      //                   type: 'speakers',
      //                   versionId: VERSION_ID,
      //                   displayOrder: categories.indexOf(catName) + 1
      //             })
      //       });

      //       if (res.status === 201) {
      //             console.log(`✅ Category '${catName}' created: ${res.data.data.id}`);
      //             createdCategories.push(res.data.data);
      //       } else {
      //             console.error(`❌ Failed to create category '${catName}':`, res.data);
      //       }
      // }

      // 3. Create Speakers
      console.log('\n--- Step 3: Create Speakers ---');
      const createdSpeakers = [];
      for (const category of existingItems) {
            const formData = new FormData();
            formData.append('versionId', VERSION_ID);
            formData.append('categoryId', category.id);
            formData.append('name', `Test ${category.name} 1`);
            formData.append('designation', `${category.name} Expert`);
            formData.append('company', 'Test Tech Corp');
            formData.append('displayOrder', '1');

            const fileBuffer = fs.readFileSync(IMAGE_PATH);
            const fileName = path.basename(IMAGE_PATH);
            const blob = new Blob([fileBuffer], { type: 'image/png' });
            formData.append('image', blob, fileName);

            formData.append('socialLinks', JSON.stringify({
                  linkedin: 'https://linkedin.com/in/test'
            }));

            const res = await apiRequest('/speakers', {
                  method: 'POST',
                  body: formData
            });

            if (res.status === 201) {
                  console.log(`✅ Speaker for category '${category.name}' created`);
            } else {
                  console.error(`❌ Failed to create speaker for '${category.name}':`, res.data);
            }
      }

      // 4. Fetch and Verify
      console.log('\n--- Step 4: Fetch and Verify ---');
      const getAllRes = await apiRequest(`/speakers?versionId=${VERSION_ID}`);
      console.log(`GET /speakers: ${getAllRes.status}`);
      if (getAllRes.status === 200) {
            const speakers = getAllRes.data.data.items;
            console.log(`✅ Found ${speakers.length} speakers`);
            for (const s of speakers) {
                  if (s.name && s.name.startsWith('Test')) {
                        createdSpeakers.push(s);
                  }
            }
      }

      for (const category of createdCategories) {
            const getByCatRes = await apiRequest(`/speakers?versionId=${VERSION_ID}&categoryId=${category.id}`);
            if (getByCatRes.status === 200) {
                  console.log(`✅ Verified category '${category.name}': Found ${getByCatRes.data.data.items.length} speakers`);
            } else {
                  console.error(`❌ Failed to verify category '${category.name}'`);
            }
      }

      // 5. Cleanup
      // console.log('\n--- Step 5: Cleanup ---');
      // for (const speaker of createdSpeakers) {
      //       const res = await apiRequest(`/speakers/${speaker.id}`, { method: 'DELETE' });
      //       console.log(`DELETE /speakers/${speaker.id}: ${res.status}`);
      // }

      // for (const category of createdCategories) {
      //       const res = await apiRequest(`/speakers/category/${category.id}?versionId=${VERSION_ID}`, { method: 'DELETE' });
      //       console.log(`DELETE /speakers/category/${category.id}: ${res.status}`);
      // }

      // console.log('\n🏁 Tests Finished.');
}

runTests().catch(err => {
      console.error('💥 Test execution error:', err.message);
});
