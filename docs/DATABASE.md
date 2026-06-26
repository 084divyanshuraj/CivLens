# Database Schema (Firestore)

## Collections

### `issues`
Stores all reported civic issues.

**Schema:**
- `id` (string): Auto-generated UUID.
- `userId` (string, optional): ID of reporting citizen.
- `imageUrl` (string): Firebase Storage URL.
- `location`: 
  - `lat` (number)
  - `lng` (number)
  - `address` (string)
- `status` (string): 'PENDING', 'IN_PROGRESS', 'RESOLVED', 'REJECTED'.
- `createdAt` (timestamp)
- `updatedAt` (timestamp)
- `upvotes` (number): For Community Validation.
- `agentData` (map): The structured data returned by Gemini.
  - `vision`:
    - `issueType` (string)
    - `severity` (string: 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL')
    - `risk` (string)
    - `confidence` (number)
  - `context`:
    - `surroundings` (string)
    - `impact` (string)
  - `priority`:
    - `score` (number 0-100)
    - `level` (string)
  - `recommendation`:
    - `department` (string)
    - `action` (string)
    - `estimatedTime` (string)

### `users`
Stores citizen and admin profiles.

**Schema:**
- `uid` (string): Firebase Auth UID.
- `role` (string): 'CITIZEN', 'ADMIN'.
- `email` (string)
- `displayName` (string)

## Indexes
- `issues`: Indexed by `status` and `createdAt` (desc) for the dashboard feed.
- `issues`: Indexed by `agentData.priority.score` (desc) for Priority Queue.
