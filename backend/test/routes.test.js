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

test('uploads.controller.single stores upload and updates inspection photos', async () => {
  const User = require('../src/models/user.model');
  const Building = require('../src/models/building.model');
  const Inspection = require('../src/models/inspection.model');
  const Upload = require('../src/models/upload.model');
  const UploadsController = require('../src/controllers/uploads.controller');

  const user = await User.create({ name: 'Uploader', email: 'uploader@example.com', passwordHash: 'hash' });
  const building = await Building.create({ name: 'B1' });
  const inspection = await Inspection.create({ buildingId: building._id, areaId: new mongoose.Types.ObjectId(), inspectorId: user._id, items: [] });

  // Mock req/res
  const req = {
    file: { originalname: 'photo.jpg', filename: 'photo.jpg' },
    user: user,
    body: { relatedType: 'inspection', relatedId: inspection._id }
  };

  let resStatus = null;
  let resJson = null;
  const res = {
    status: (s) => { resStatus = s; return { json: (j) => { resJson = j } } }
  };

  await UploadsController.single(req, res);

  expect(resStatus).toBe(201);
  expect(resJson).toBeDefined();
  const dbUpload = await Upload.findOne({ filename: 'photo.jpg' });
  expect(dbUpload).toBeDefined();
  const updatedInspection = await Inspection.findById(inspection._id);
  expect(updatedInspection.photos).toContain('/uploads/photo.jpg');
});

test('building area add logic pushes area with subareas', async () => {
  const User = require('../src/models/user.model');
  const Building = require('../src/models/building.model');

  const user = await User.create({ name: 'Manager', email: 'mgr@example.com', passwordHash: 'hash', role: 'admin' });
  const b = await Building.create({ name: 'Building A', createdBy: user._id });

  const area = { name: 'Floor 2', subareas: [{ name: 'Lobby' }, { name: 'Corridor' }] };
  const updated = await Building.findByIdAndUpdate(b._id, { $push: { areas: area } }, { new: true });

  expect(updated.areas.length).toBe(1);
  expect(updated.areas[0].name).toBe('Floor 2');
  expect(updated.areas[0].subareas.length).toBe(2);
});
