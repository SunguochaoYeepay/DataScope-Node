# Low Code Integration Protocol

## Overview
This document defines the integration protocol between DataScope and low-code platforms, enabling seamless integration of data querying capabilities into low-code applications.

## Protocol Format
All interactions use JSON format for data exchange. UTF-8 encoding is required for all text.

## API Endpoints

### 1. Query Configuration

#### Request
```json
{
    "queryId": "string",
    "version": "number",
    "displayConfig": {
        "queryForm": {
            "layout": "string",  // HORIZONTAL, VERTICAL, GRID
            "conditions": [
                {
                    "field": "string",
                    "label": "string",
                    "type": "string",  // TEXT, NUMBER, DATE, SELECT, etc.
                    "required": "boolean",
                    "defaultValue": "any",
                    "validation": {
                        "pattern": "string",
                        "message": "string"
                    },
                    "displayOrder": "number",
                    "visibility": "string",  // VISIBLE, HIDDEN, CONDITIONAL
                    "dependsOn": {
                        "field": "string",
                        "value": "any"
                    }
                }
            ],
            "buttons": [
                {
                    "type": "string",  // SUBMIT, RESET, EXPORT
                    "label": "string",
                    "style": "string",  // PRIMARY, SECONDARY, DANGER
                    "icon": "string"
                }
            ]
        },
        "resultTable": {
            "columns": [
                {
                    "field": "string",
                    "label": "string",
                    "type": "string",  // TEXT, NUMBER, DATE, CURRENCY, etc.
                    "format": "string",
                    "sortable": "boolean",
                    "filterable": "boolean",
                    "width": "string",
                    "align": "string",  // LEFT, CENTER, RIGHT
                    "maskType": "string",  // NONE, FULL, PARTIAL
                    "maskPattern": "string",
                    "visible": "boolean",
                    "displayOrder": "number"
                }
            ],
            "actions": [
                {
                    "type": "string",  // LINK, BUTTON, MENU
                    "label": "string",
                    "icon": "string",
                    "style": "string",
                    "handler": "string",  // JavaScript function name
                    "condition": {
                        "field": "string",
                        "operator": "string",
                        "value": "any"
                    }
                }
            ],
            "pagination": {
                "enabled": "boolean",
                "pageSize": "number",
                "pageSizeOptions": ["number"]
            },
            "export": {
                "enabled": "boolean",
                "formats": ["string"],  // CSV, EXCEL, etc.
                "maxRows": "number"
            }
        }
    }
}
```

#### Response
```json
{
    "success": "boolean",
    "code": "string",
    "message": "string",
    "data": {
        "configId": "string",
        "queryEndpoint": "string",
        "downloadEndpoint": "string"
    }
}
```

### 2. Query Execution

#### Request
```json
{
    "configId": "string",
    "parameters": {
        "field1": "value1",
        "field2": "value2"
    },
    "pagination": {
        "pageSize": "number",
        "pageNumber": "number"
    },
    "sorting": [
        {
            "field": "string",
            "direction": "string"  // ASC, DESC
        }
    ]
}
```

#### Response
```json
{
    "success": "boolean",
    "code": "string",
    "message": "string",
    "data": {
        "total": "number",
        "pageSize": "number",
        "pageNumber": "number",
        "records": [
            {
                "field1": "value1",
                "field2": "value2"
            }
        ]
    }
}
```

## Data Types

### Form Element Types
- TEXT: Text input
- NUMBER: Numeric input
- DATE: Date picker
- DATETIME: Date-time picker
- SELECT: Dropdown selection
- MULTISELECT: Multiple selection
- CHECKBOX: Boolean checkbox
- RADIO: Radio button group
- TEXTAREA: Multi-line text

### Column Data Types
- TEXT: Plain text
- NUMBER: Numeric value
- DATE: Date value
- DATETIME: Date-time value
- CURRENCY: Monetary value
- PERCENTAGE: Percentage value
- BOOLEAN: True/false value
- LINK: Hyperlink
- IMAGE: Image URL
- ENUM: Enumerated value

### Mask Types
- NONE: No masking
- FULL: Complete masking
- PARTIAL: Partial masking (configurable pattern)
- CUSTOM: Custom masking function

## Error Codes

### General Errors
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 429: Too Many Requests
- 500: Internal Server Error

### Business Errors
- QUERY_001: Invalid query configuration
- QUERY_002: Query execution failed
- QUERY_003: Parameter validation failed
- QUERY_004: Export limit exceeded
- QUERY_005: Query timeout

## Security Considerations

### Authentication
- All requests must include valid authentication tokens
- Token format and validation mechanism defined by platform

### Authorization
- Access control based on user roles and permissions
- Data visibility rules enforced at query level

### Data Protection
- Sensitive data automatically masked based on configuration
- Export restrictions enforced
- Rate limiting applied

## Integration Guidelines

### Implementation Steps
1. Configure query and display settings
2. Generate integration configuration
3. Implement UI components
4. Handle query execution
5. Process and display results

### Best Practices
1. Cache query configurations
2. Implement error handling
3. Add loading indicators
4. Validate input parameters
5. Handle timeout scenarios

### Performance Optimization
1. Use pagination for large datasets
2. Implement result caching
3. Optimize query parameters
4. Compress response data
5. Monitor execution times

## Example Integration

### JavaScript
```javascript
class DataScopeClient {
    constructor(config) {
        this.baseUrl = config.baseUrl;
        this.token = config.token;
    }

    async executeQuery(configId, params) {
        const response = await fetch(`${this.baseUrl}/api/v1/query/execute`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.token}`
            },
            body: JSON.stringify({
                configId: configId,
                parameters: params
            })
        });
        return await response.json();
    }
}
```

### React Component
```jsx
function QueryComponent({ configId }) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    async function handleSubmit(params) {
        try {
            setLoading(true);
            const result = await client.executeQuery(configId, params);
            setData(result.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <QueryForm onSubmit={handleSubmit} />
            {loading && <LoadingSpinner />}
            {error && <ErrorMessage message={error} />}
            {data && <ResultTable data={data} />}
        </div>
    );
}