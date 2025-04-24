# AIStudyPlans API Documentation

This document provides detailed information about the API endpoints available in the AIStudyPlans (SchedulEd) application.

## Base URL

For local development:
```
http://localhost:3000/api
```

For production:
```
https://aistudyplans.com/api
```

## Authentication

**Note**: Authentication is not yet implemented. All currently available endpoints are public.

Future authentication system will use:
- JWT tokens
- OAuth providers (Google, Microsoft)
- Email/password

## API Endpoints

### Waitlist Signup

Allows users to join the waitlist for the application.

**Endpoint**: `/api/waitlist`  
**Method**: POST  
**Content-Type**: application/json

#### Request Body Parameters

| Parameter | Type   | Required | Description                    |
|-----------|--------|----------|--------------------------------|
| name      | string | Yes      | User's full name               |
| email     | string | Yes      | User's email address (valid format required) |

#### Example Request

```json
{
  "name": "John Doe",
  "email": "john.doe@example.com"
}
```

#### Responses

**Success Response: 200 OK**

```json
{
  "success": true,
  "message": "Successfully joined the waitlist",
  "name": "John Doe",
  "email": "john.doe@example.com"
}
```

**Error Response: 400 Bad Request (Missing Fields)**

```json
{
  "error": "Name and email are required"
}
```

**Error Response: 400 Bad Request (Invalid Email)**

```json
{
  "error": "Invalid email format"
}
```

**Error Response: 500 Internal Server Error**

```json
{
  "error": "Internal server error"
}
```

#### Implementation Details

- Email validation uses a simple regex pattern: `/^\S+@\S+\.\S+$/`
- The API currently logs the waitlist signup but does not store it in a database
- A confirmation email is sent to the user, but API success does not depend on email delivery
- Sensitive operations are wrapped in try/catch blocks for error handling

## Planned API Endpoints

The following API endpoints are planned for future implementation:

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/reset-password` - Request password reset
- `POST /api/auth/reset-password/confirm` - Confirm password reset

### Study Plans

- `GET /api/plans` - Get all study plans for the authenticated user
- `GET /api/plans/:id` - Get a specific study plan
- `POST /api/plans` - Create a new study plan
- `PUT /api/plans/:id` - Update a study plan
- `DELETE /api/plans/:id` - Delete a study plan
- `POST /api/plans/generate` - Generate a study plan using AI

### User Profile

- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `GET /api/user/preferences` - Get user preferences
- `PUT /api/user/preferences` - Update user preferences

## Testing the API

### Using the Testing HTML Page

A test page is available for testing the waitlist API:

1. Open `test-waitlist.html` in a browser
2. Fill in the name and email fields
3. Submit the form to test the API endpoint

### Using cURL

```bash
curl -X POST \
  http://localhost:3000/api/waitlist \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "John Doe",
    "email": "john.doe@example.com"
  }'
```

### Using JavaScript Fetch

```javascript
fetch('http://localhost:3000/api/waitlist', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john.doe@example.com',
  }),
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
```

## API Implementation Notes

- The API is implemented using Next.js 14 App Router API routes
- Each API route is defined in a separate file with the name `route.ts`
- The API follows RESTful principles
- Error handling follows consistent patterns
- The API is designed to be extensible as new features are added 