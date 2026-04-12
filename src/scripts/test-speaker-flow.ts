import fs from 'fs';
import path from 'path';

const BASE_URL = 'http://localhost:4000/api';
const VERSION_ID = '163c4ae1-5372-4f35-9672-d44d23824b48';
const IMAGE_PATH = '/home/nirjla/.gemini/antigravity/brain/08427c9e-8832-4b71-b6cc-012032f5663e/test_speaker_image_1772363971841.png';

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

      const data = await res.json();
      return { status: res.status, data };
}

interface Category {
      id: string;
      name: string;
}

interface Speaker {
      id: string;
      name: string;
      designation: string;
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

      const categoryNames = ['Mentor', 'Speaker', 'Workshop Lead', 'Technical Expert', 'Keynote Speaker'];
      const createdCategories: Category[] = [];

      // 2. Ensure Categories Exist
      console.log('--- Step 2: Ensure Speaker Categories ---');
      const existingCatsRes = await apiRequest(`/speakers/category?versionId=${VERSION_ID}`);
      let existingItems: Category[] = [];
      if (existingCatsRes.status === 200 && existingCatsRes.data.data) {
            existingItems = existingCatsRes.data.data.items || [];
      }

      for (const catName of categoryNames) {
            const displayOrder = categoryNames.indexOf(catName) + 1;
            const existing = existingItems.find((c: any) => c.name === catName && c.displayOrder === displayOrder);

            if (existing) {
                  console.log(`ℹ️ Category '${catName}' already exists: ${existing.id}`);
                  createdCategories.push(existing);
            } else {
                  const res = await apiRequest('/speakers/category', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                              name: catName,
                              versionId: VERSION_ID,
                              displayOrder: displayOrder
                        })
                  });

                  if (res.status === 201) {
                        console.log(`✅ Category '${catName}' created: ${res.data.data.id}`);
                        createdCategories.push(res.data.data);
                  } else if (res.status === 400 || res.status === 409 || (res.data && res.data.message && res.data.message.includes('already exists'))) {
                        console.log(`ℹ️ Category '${catName}' already exists (caught by error message)`);
                        // Try to find it again in the latest list
                        const refreshCats = await apiRequest(`/speakers/category?versionId=${VERSION_ID}`);
                        if (refreshCats.data && refreshCats.data.data && refreshCats.data.data.items) {
                              const found = refreshCats.data.data.items.find((c: any) => c.name === catName);
                              if (found) createdCategories.push(found);
                        } else {
                              console.error(`❌ Could not refresh categories:`, refreshCats.data);
                        }
                  } else {
                        console.error(`❌ Failed to create category '${catName}':`, res.data);
                  }
            }
      }

      // 3. Create 5 Speakers (one per category)
      console.log('\n--- Step 3: Create 5 Speakers ---');
      console.log(`DEBUG: createdCategories count: ${createdCategories.length}`);

      const createdSpeakers: Speaker[] = [];
      const speakerData = [
            { name: 'Dr. Jane Smith', designation: 'AI Researcher', company: 'Future Labs' },
            { name: 'John Doe', designation: 'Lead Developer', company: 'Tech Solutions' },
            { name: 'Alice Johnson', designation: 'UX Designer', company: 'Creative Agency' },
            { name: 'Bob Wilson', designation: 'Cybersecurity Expert', company: 'Secure Net' },
            { name: 'Sarah Brown', designation: 'Keynote Speaker', company: 'Inspire Global' }
      ];

      for (let i = 0; i < 5; i++) {
            const index = i % createdCategories.length;
            const category = createdCategories[index];

            if (!category) {
                  continue;
            }
            const data = speakerData[i];

            const formData = new FormData();
            formData.append('versionId', VERSION_ID);
            formData.append('categoryId', category.id);
            formData.append('name', `Test ${data.name}`);
            formData.append('designation', data.designation);
            formData.append('company', data.company);
            formData.append('displayOrder', String(Math.floor(Date.now() / 1000) + i));

            const fileBuffer = fs.readFileSync(IMAGE_PATH);
            const fileName = path.basename(IMAGE_PATH);
            const blob = new Blob([fileBuffer], { type: 'image/png' });
            formData.append('image', blob, fileName);

            formData.append('socialLinks', JSON.stringify({
                  linkedin: `https://linkedin.com/in/test-${i}`,
                  instagram: `https://instagram.com/test-${i}`
            }));

            const res = await apiRequest(`/speakers?versionId=${VERSION_ID}`, {
                  method: 'POST',
                  body: formData
            });

            if (res.status === 201 && res.data && res.data.data) {
                  console.log(`✅ Speaker '${data.name}' for category '${category.name}' created: ${res.data.data.id}`);
                  createdSpeakers.push(res.data.data);
            } else {
                  console.error(`❌ Failed to create speaker '${data.name}':`, res.data);
            }
      }

      // 4. GET and Update Speakers
      console.log('\n--- Step 4: GET, UPDATE and Verify Speakers ---');
      for (const speaker of createdSpeakers) {
            // GET by ID
            const getByIdRes = await apiRequest(`/speakers/${speaker.id}`);
            if (getByIdRes.status === 200) {
                  console.log(`✅ GET /speakers/${speaker.id} successful`);
            } else {
                  console.error(`❌ GET /speakers/${speaker.id} failed:`, getByIdRes.data);
            }

            // UPDATE (PATCH)
            const updateName = `${speaker.name} (Updated)`;
            const formData = new FormData();
            formData.append('name', updateName);
            formData.append('designation', 'Senior Consultant');

            const resUpdate = await apiRequest(`/speakers/${speaker.id}`, {
                  method: 'PATCH',
                  body: formData
            });

            if (resUpdate.status === 200) {
                  console.log(`✅ UPDATE /speakers/${speaker.id} successful`);
            } else {
                  console.error(`❌ UPDATE /speakers/${speaker.id} failed:`, resUpdate.data);
            }
      }

      // 5. GET All with Filters
      console.log('\n--- Step 5: GET All Speakers with Filters ---');
      const getAllRes = await apiRequest(`/speakers?versionId=${VERSION_ID}`);
      if (getAllRes.status === 200) {
            console.log(`✅ GET /speakers with versionId filter successful: Found ${getAllRes.data.data.items.length} speakers`);
      }

      const categoryFilterRes = await apiRequest(`/speakers?categoryId=${createdCategories[0].id}`);
      if (categoryFilterRes.status === 200) {
            console.log(`✅ GET /speakers with categoryId filter successful: Found ${categoryFilterRes.data.data.items.length} speakers`);
      }

      // 6. Cleanup
      // console.log('\n--- Step 6: Cleanup (DELETE) ---');
      // for (const speaker of createdSpeakers) {
      //       const res = await apiRequest(`/speakers/${speaker.id}?versionId=${VERSION_ID}`, { method: 'DELETE' });
      //       if (res.status === 200) {
      //             console.log(`✅ DELETE /speakers/${speaker.id} successful`);
      //       } else {
      //             console.log(`❌ DELETE /speakers/${speaker.id} failed: ${res.status}`);
      //       }
      // }

      // Optionally cleanup categories if they were created by this test
      // for (const category of createdCategories) {
      //       const res = await apiRequest(`/speakers/category/${category.id}?versionId=${VERSION_ID}`, { method: 'DELETE' });
      //       console.log(`DELETE /speakers/category/${category.id}: ${res.status}`);
      // }

      console.log('\n🏁 Tests Finished.');
}

runTests().catch(err => {
      console.error('💥 Test execution error:', err.message);
});
