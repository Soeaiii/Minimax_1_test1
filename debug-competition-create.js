const fetch = require('fetch');

async function testCreateCompetition() {
  // First login to get session
  const loginResponse = await fetch('http://localhost:3000/api/auth/callback/credentials', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@example.com', password: 'system1123' }),
    redirect: 'manual'
  });

  console.log('Login status:', loginResponse.status);
  const loginCookies = loginResponse.headers.get('set-cookie');
  console.log('Login cookies:', loginCookies);

  if (!loginCookies) {
    console.log('No cookies returned from login');
    return;
  }

  // Extract session token
  const sessionMatch = loginCookies.match(/next-auth\.session-token=([^;]+)/);
  if (!sessionMatch) {
    console.log('No session token found in cookies');
    return;
  }

  const sessionToken = sessionMatch[1];
  console.log('Session token found:', sessionToken.substring(0, 20) + '...');

  // Now try to create competition
  const createResponse = await fetch('http://localhost:3000/api/competitions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': `next-auth.session-token=${sessionToken}`
    },
    body: JSON.stringify({
      name: 'Test Competition Debug',
      startTime: '2026-04-25T10:00:00Z',
      endTime: '2026-04-25T18:00:00Z',
      status: 'PENDING',
      rankingUpdateMode: 'BATCH'
    })
  });

  console.log('Create competition status:', createResponse.status);
  const responseText = await createResponse.text();
  console.log('Response:', responseText);
}

testCreateCompetition().catch(console.error);