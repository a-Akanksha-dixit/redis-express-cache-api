````markdown
# Redis Express Server Test Requests

This repository contains a simple Express server integrated with Redis to set and get cached data with TTL (time to live).

---

## Using cURL

### 1. Test the root endpoint
```bash
curl http://localhost:3000/
````

### 2. Set a simple string value

```bash
curl -X POST http://localhost:3000/set \
  -H "Content-Type: application/json" \
  -d '{
    "key": "username",
    "value": "john_doe",
    "ttl": 120
  }'
```

### 3. Set an object value

```bash
curl -X POST http://localhost:3000/set \
  -H "Content-Type: application/json" \
  -d '{
    "key": "user:123",
    "value": {
      "id": 123,
      "name": "Alice Smith",
      "email": "alice@example.com",
      "role": "admin"
    },
    "ttl": 300
  }'
```

### 4. Set with default TTL (60 seconds)

```bash
curl -X POST http://localhost:3000/set \
  -H "Content-Type: application/json" \
  -d '{
    "key": "session:abc123",
    "value": "active"
  }'
```

### 5. Get a value by key

```bash
curl http://localhost:3000/get/username
```

### 6. Get the object value

```bash
curl http://localhost:3000/get/user:123
```

### 7. Try to get a non-existent key

```bash
curl http://localhost:3000/get/nonexistent
```

### 8. Test validation (missing key)

```bash
curl -X POST http://localhost:3000/set \
  -H "Content-Type: application/json" \
  -d '{
    "value": "some value"
  }'
```

### 9. Test validation (missing value)

```bash
curl -X POST http://localhost:3000/set \
  -H "Content-Type: application/json" \
  -d '{
    "key": "test_key"
  }'
```

---

## Using Postman/Insomnia

### POST /set - Set String Value

* **Method:** POST
* **URL:** `http://localhost:3000/set`
* **Headers:** `Content-Type: application/json`
* **Body (JSON):**

```json
{
  "key": "product:456",
  "value": "Premium Coffee Beans",
  "ttl": 86400
}
```

### POST /set - Set Complex Object

* **Method:** POST
* **URL:** `http://localhost:3000/set`
* **Headers:** `Content-Type: application/json`
* **Body (JSON):**

```json
{
  "key": "cart:user789",
  "value": {
    "userId": 789,
    "items": [
      {"id": 1, "name": "Coffee", "quantity": 2, "price": 15.99},
      {"id": 2, "name": "Sugar", "quantity": 1, "price": 3.50}
    ],
    "total": 35.48,
    "currency": "USD"
  },
  "ttl": 1800
}
```

### GET /get/\:key - Retrieve Value

* **Method:** GET
* **URL:** `http://localhost:3000/get/product:456`

---

## Using JavaScript/Node.js (for testing)

```javascript
// Test script you can run with node
const axios = require('axios');

const baseURL = 'http://localhost:3000';

async function testRedisAPI() {
  try {
    // Test setting a value
    console.log('Setting value...');
    const setResponse = await axios.post(`${baseURL}/set`, {
      key: 'test:timestamp',
      value: new Date().toISOString(),
      ttl: 300
    });
    console.log('Set response:', setResponse.data);

    // Test getting the value
    console.log('Getting value...');
    const getResponse = await axios.get(`${baseURL}/get/test:timestamp`);
    console.log('Get response:', getResponse.data);

    // Test getting non-existent key
    console.log('Testing non-existent key...');
    try {
      await axios.get(`${baseURL}/get/nonexistent`);
    } catch (error) {
      console.log('Expected error for non-existent key:', error.response.data);
    }

  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

testRedisAPI();
```

---

## Expected Responses

### Successful SET:

```json
{
  "message": "Stored key 'username' with TTL 120s"
}
```

### Successful GET:

```json
{
  "key": "username",
  "value": "john_doe"
}
```

### Error responses:

```json
// Missing key/value
{
  "error": "Key and value are required"
}

// Key not found
{
  "error": "Key not found"
}
```

---

## Testing TTL (Time To Live)

To test if TTL is working correctly:

1. Set a key with a short TTL (e.g., 10 seconds):

```bash
curl -X POST http://localhost:3000/set \
  -H "Content-Type: application/json" \
  -d '{
    "key": "temp_key",
    "value": "expires_soon",
    "ttl": 10
  }'
```

2. Immediately get the value:

```bash
curl http://localhost:3000/get/temp_key
```

3. Wait 15 seconds and try to get it again — should return "Key not found"

