const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

test('models: create and relate basic documents', async () => {
  const User = require('../src/models/user.model');
  const Building = require('../src/models/building.model');
  const Inspection = require('../src/models/inspection.model');
  const Task = require('../src/models/task.model');
  const Claim = require('../src/models/claim.model');
  const Report = require('../src/models/report.model');
  const Upload = require('../src/models/upload.model');

  // Create a user
  const user = await User.create({ name: 'Test User', email: 'u@example.com', passwordHash: 'hash', role: 'inspector' });
  expect(user._id).toBeDefined();

  // Create a building with area and subarea
  const building = await Building.create({
    name: 'Test Building',
    address: '123 Test St',
    areas: [{ name: 'Floor 1', subareas: [{ name: 'Lobby' }, { name: 'Room 101' }] }],
    createdBy: user._id
  });
  expect(building.areas.length).toBe(1);
  const area = building.areas[0];
  const subarea = area.subareas[0];

  // Create an inspection
  const inspection = await Inspection.create({
    buildingId: building._id,
    areaId: area._id,
    subareaId: subarea._id,
    inspectorId: user._id,
    items: [{ criterion: 'Clean floor', result: 'ok' }],
    status: 'finalized',
    overallResult: 'pass'
  });
  expect(inspection.items.length).toBe(1);

  // Create a task from inspection
  const task = await Task.create({ source: 'inspection', sourceId: inspection._id, buildingId: building._id, areaId: area._id, assignedBy: user._id, status: 'pending' });
  expect(task.source).toBe('inspection');

  // Create a claim and link to a task
  const claim = await Claim.create({ clientName: 'Client A', clientContact: '555-0100', buildingId: building._id, description: 'Dirty carpet' });
  expect(claim.status).toBe('pending');

  // Create upload and report
  const upload = await Upload.create({ filename: 'photo.jpg', url: '/uploads/photo.jpg', uploaderId: user._id, relatedType: 'inspection', relatedId: inspection._id });
  expect(upload.url).toBe('/uploads/photo.jpg');

  // Ensure inspection stores top-level photos array when uploads are related to inspections
  const updatedInspection = await Inspection.findByIdAndUpdate(inspection._id, { $push: { photos: '/uploads/photo.jpg' } }, { new: true });
  expect(updatedInspection.photos).toContain('/uploads/photo.jpg');

  const report = await Report.create({ type: 'daily', generatedBy: user._id, filters: { buildingId: building._id }, dataSummary: { inspections: 1 } });
  expect(report.type).toBe('daily');
});
