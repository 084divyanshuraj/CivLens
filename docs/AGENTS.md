# Logical AI Agents

For implementation speed, these "Agents" are logical modules (TypeScript functions) that process the single monolithic JSON returned by the Gemini API.

## 1. Vision Agent
- **Purpose**: Identify the physical issue from the image.
- **Input**: `rawGeminiJson.vision`
- **Output**: Typed `VisionData` object.
- **Responsibilities**: Extracts `issueType`, `severity`, and calculates `confidence`.

## 2. Context Agent
- **Purpose**: Provide situational awareness.
- **Input**: `rawGeminiJson.context` (and geolocation data).
- **Output**: Typed `ContextData` object.
- **Responsibilities**: Defines surrounding risks (e.g., "near school") based on visual cues.

## 3. Priority Agent
- **Purpose**: Rank the issue for the municipality.
- **Input**: `rawGeminiJson.priority` + community upvotes.
- **Output**: Final Priority Score (0-100).
- **Responsibilities**: Weighs severity vs. context to generate a dynamic score.

## 4. Recommendation Agent
- **Purpose**: Suggest actionable steps.
- **Input**: `rawGeminiJson.recommendation`
- **Output**: Typed `RecommendationData`.
- **Responsibilities**: Identifies the responsible department and repair strategy.

## 5. Duplicate Detection Agent
- **Implementation**: A geospatial query in Firestore checking if an issue of the same `issueType` exists within a 50m radius of the new upload.

## 6. Community Validation Agent
- **Implementation**: Standard upvote/downvote mechanism in the UI, updating the `upvotes` field in Firestore, which dynamically bumps the Priority Score.

## 7. Analytics Agent
- **Implementation**: Frontend data aggregation over the fetched `issues` collection to generate charts (Total vs. Resolved, Category distribution).
