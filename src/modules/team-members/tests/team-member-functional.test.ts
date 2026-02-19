// import axios from 'axios';
// import { wrapper } from 'axios-cookiejar-support';
// import { CookieJar } from 'tough-cookie';

// const jar = new CookieJar();
// const client = wrapper(axios.create({
//       baseURL: 'http://localhost:4000/api',
//       jar,
//       withCredentials: true,
//       validateStatus: () => true, // Don't throw on error status codes
// }));

// const VERSION_ID = '03dbda95-dc51-4335-be4c-fe2730b5889f'; // From DB research

// async function runTests() {
//       console.log('🚀 Starting Team Member Functional Tests (V5 - Alignment Fixes)...\n');

//       // 1. Login
//       console.log('--- Step 1: Login ---');
//       const loginRes = await client.post('/auth/login', {
//             email: 'creativehub@ictmeetup.com',
//             password: 'hubadmin@123'
//       });
//       if (loginRes.status !== 200) {
//             console.error('❌ Login failed:', loginRes.data);
//             process.exit(1);
//       }
//       console.log('✅ Login successful\n');

//       // 2. Team Member Categories
//       console.log('--- Step 2: Team Member Categories ---');
//       let categoryId: string;
//       const createCatRes = await client.post('/team-members/category', {
//             name: 'Test Category ' + Date.now(),
//             type: 'test-type',
//             displayOrder: 1
//       });
//       console.log('POST /category:', createCatRes.status, createCatRes.data.message || JSON.stringify(createCatRes.data.error || createCatRes.data));
//       categoryId = createCatRes.data.data?.id;

//       // GET /category
//       const getCatsRes = await client.get('/team-members/category');
//       console.log('GET /category:', getCatsRes.status, `Found ${getCatsRes.data.data?.length || 0} categories`);

//       if (categoryId) {
//             const updateCatRes = await client.put(`/team-members/category/${categoryId}`, {
//                   name: 'Updated Test Category'
//             });
//             console.log('PUT /category/:id:', updateCatRes.status, updateCatRes.data.message);
//       }

//       // 3. Team Member Designations
//       console.log('\n--- Step 3: Team Member Designations ---');
//       let designationId: string;
//       const createDesRes = await client.post('/team-members/designation', {
//             name: 'Test Designation ' + Date.now()
//       });
//       console.log('POST /designation:', createDesRes.status, createDesRes.data.message || JSON.stringify(createDesRes.data.error || createDesRes.data));
//       designationId = createDesRes.data.data?.id;

//       // GET /designation
//       const getDesRes = await client.get('/team-members/designation');
//       console.log('GET /designation:', getDesRes.status, `Found ${getDesRes.data.data?.length || 0} designations`);

//       if (designationId) {
//             const updateDesRes = await client.put(`/team-members/designation/${designationId}`, {
//                   name: 'Updated Test Designation'
//             });
//             console.log('PUT /designation/:id:', updateDesRes.status, updateDesRes.data.message || JSON.stringify(updateDesRes.data.error || updateDesRes.data));
//       }

//       // 4. Team Members
//       console.log('\n--- Step 4: Team Members ---');
//       let memberId: string;
//       if (categoryId && designationId) {
//             const createMemberRes = await client.post('/team-members', {
//                   versionId: VERSION_ID,
//                   categoryId: categoryId,
//                   designationId: designationId,
//                   name: 'Test Member ' + Date.now(),
//                   designationOrder: 1
//             });
//             console.log('POST /:', createMemberRes.status, createMemberRes.data.message || JSON.stringify(createMemberRes.data.error || createMemberRes.data));
//             memberId = createMemberRes.data.data?.id;
//       }

//       // GET /
//       const getAllRes = await client.get(`/team-members?versionId=${VERSION_ID}`);
//       console.log('GET /:', getAllRes.status, `Found ${getAllRes.data.data?.length || 0} members`);

//       // 5. Cleanup
//       console.log('\n--- Step 5: Cleanup ---');
//       if (memberId) {
//             await client.delete(`/team-members/${memberId}`);
//             console.log('DELETE /member: OK');
//       }
//       if (designationId) {
//             await client.delete(`/team-members/designation/${designationId}`);
//             console.log('DELETE /designation: OK');
//       }
//       if (categoryId) {
//             await client.delete(`/team-members/category/${categoryId}`);
//             console.log('DELETE /category: OK');
//       }

//       console.log('\n🏁 Tests Finished.');
// }

// runTests().catch(err => {
//       console.error('💥 Test execution error:', err.message);
// });
