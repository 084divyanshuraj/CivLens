# API Documentation

Next.js Route Handlers (App Router)

### `POST /api/issues/analyze`
**Purpose**: Handles the image upload, calls Gemini, and saves to Firestore.
**Request Body**:
```json
{
  "imageUrl": "https://firebasestorage...",
  "location": {
    "lat": 37.7749,
    "lng": -122.4194
  }
}
```
**Response (200 OK)**:
```json
{
  "success": true,
  "issueId": "doc_id_123",
  "data": { /* Full agent payload from Gemini */ }
}
```

### `GET /api/issues`
**Purpose**: Fetches issues for the dashboard.
**Query Params**: `status`, `limit`
**Response (200 OK)**: Array of Issue objects.

### `POST /api/issues/[id]/upvote`
**Purpose**: Community Validation agent action. Increments upvote counter.
**Request Body**: None (auth token required).
**Response (200 OK)**: Updated upvote count.
