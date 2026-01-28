Adds `photos[]` to the `Inspection` model so inspection-level photos are stored.

Adds `POST /api/uploads` (multipart) that stores uploads and updates related documents (building, inspection, task, claim).

Adds `POST /api/buildings/:id/areas` to let the frontend add areas and subareas to buildings.

Adds frontend helpers: `buildings.addArea(id, data)` and `uploads.single(file, relatedType?, relatedId?)`.

Adds tests:
- unit tests for models and route semantics
- integration test to upload a file to `/api/uploads` and assert it attaches to `inspection.photos`

Updates docs (`design/api_spec.md`, `README.md`) to include `photos[]` in inspection payloads.

Adds devDependency `supertest@^6.3.3` and a new integration test file.

Notes:
- All backend tests passed locally (unit + integration).
- To run tests after fetching this branch:
  - cd backend
  - npm install
  - npm test
