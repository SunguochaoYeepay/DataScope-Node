/**
 * Mock API response
 * @param request 
 * @returns 
 */
private async mockResponse(request: RequestInit, url: string): Promise<Response> {
    if (url.includes('/api/queries/query-') && url.includes('/execute')) {
        // ... existing code ...
    }

    // 处理查询列表API请求
    if (url.includes('/api/queries')) {
        console.log('Mocking /api/queries request');
        
        // 解析URL参数
        const urlObj = new URL(url);
        const page = parseInt(urlObj.searchParams.get('page') || '1');
        const pageSize = parseInt(urlObj.searchParams.get('pageSize') || '10');
        const searchText = urlObj.searchParams.get('searchText') || '';
        
        console.log(`Mock params: page=${page}, pageSize=${pageSize}, searchText=${searchText}`);
        
        // 构造模拟数据
        const items = [];
        for (let i = 0; i < 5; i++) {
            items.push({
                id: `query-${i+1}`,
                name: `测试查询 ${i+1}${searchText ? ` (${searchText})` : ''}`,
                description: `这是一个测试查询描述 ${i+1}`,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                createdBy: 'system',
                updatedBy: 'system',
                status: 'active',
                dataSourceId: 'ds-1',
                dataSourceName: 'MySQL测试数据源'
            });
        }
        
        const response = {
            success: true,
            data: {
                items: items,
                total: 25,
                page: page,
                pageSize: pageSize
            }
        };
        
        console.log('Mock response for /api/queries:', response);
        
        return new Response(JSON.stringify(response), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    return new Response(JSON.stringify({
    // ... existing code ...
    });
} 