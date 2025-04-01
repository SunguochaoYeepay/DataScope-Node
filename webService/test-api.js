async function testAPI() {
  try {
    const response = await fetch('http://localhost:5000/api/queries/execute', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        dataSourceId: 'test-ds',
        sql: 'SELECT COUNT(*) FROM users',
        id: 'testquery123',
        createHistory: true
      })
    });
    
    const data = await response.json();
    console.log('Response:', JSON.stringify(data, null, 2));
    
    // 查询历史记录
    const historyResponse = await fetch('http://localhost:5000/api/queries/history?limit=5');
    const historyData = await historyResponse.json();
    console.log('History Response:', JSON.stringify(historyData, null, 2));
  } catch (error) {
    console.error('Error:', error);
  }
}

testAPI();