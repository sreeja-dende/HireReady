const express = require('express');
const Resource = require('../models/Resource');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /pdf|doc|docx|ppt|pptx|txt|jpg|jpeg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

// File path for persistent storage
const RESOURCES_FILE = path.join(__dirname, '../data/resources.json');

// Helper function to read resources from file
const readResourcesFromFile = () => {
  try {
    if (fs.existsSync(RESOURCES_FILE)) {
      const data = fs.readFileSync(RESOURCES_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error reading resources file:', error);
  }
  return [];
};

// Helper function to write resources to file
const writeResourcesToFile = (resources) => {
  try {
    const dir = path.dirname(RESOURCES_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(RESOURCES_FILE, JSON.stringify(resources, null, 2));
  } catch (error) {
    console.error('Error writing resources file:', error);
  }
};

// Initialize resources from file or use defaults
let mockResources = readResourcesFromFile();
if (mockResources.length === 0) {
  mockResources = [
    {
      id: '1',
      title: 'Resume Building Guide',
      description: 'A comprehensive guide to building an effective resume for tech jobs.',
      type: 'Guide',
      uploadedBy: { username: 'placement1' },
      fileUrl: null,
      createdAt: new Date('2024-01-15')
    },
    {
      id: '2',
      title: 'Interview Tips',
      description: 'Essential tips for technical interviews and behavioral questions.',
      type: 'Tips',
      uploadedBy: { username: 'placement1' },
      fileUrl: null,
      createdAt: new Date('2024-01-20')
    },
    {
      id: '3',
      title: 'Coding Practice Problems',
      description: 'Collection of coding problems from top tech companies.',
      type: 'Problems',
      uploadedBy: { username: 'placement1' },
      fileUrl: null,
      createdAt: new Date('2024-01-25')
    }
  ];
  writeResourcesToFile(mockResources);
}

// Get all resources
router.get('/', async (req, res) => {
  try {
    // Return mock resources for demo
    res.json(mockResources);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Add new resource
router.post('/', upload.single('file'), async (req, res) => {
  try {
    const fileUrl = req.file ? `/uploads/${req.file.filename}` : null;

    // Mock adding resource for demo
    const newResource = {
      id: (mockResources.length + 1).toString(),
      title: req.body.title,
      description: req.body.description,
      type: req.body.type,
      uploadedBy: { username: req.body.uploadedBy || 'placement1' },
      fileUrl: fileUrl,
      createdAt: new Date()
    };
    mockResources.push(newResource);
    writeResourcesToFile(mockResources); // Save to file
    res.status(201).json(newResource);
  } catch (error) {
    console.error('Error adding resource:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update resource
router.put('/:id', upload.single('file'), async (req, res) => {
  try {
    const resourceIndex = mockResources.findIndex(r => r.id === req.params.id);
    if (resourceIndex === -1) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    const fileUrl = req.file ? `/uploads/${req.file.filename}` : mockResources[resourceIndex].fileUrl;

    // Update resource
    mockResources[resourceIndex] = {
      ...mockResources[resourceIndex],
      title: req.body.title || mockResources[resourceIndex].title,
      description: req.body.description || mockResources[resourceIndex].description,
      type: req.body.type || mockResources[resourceIndex].type,
      fileUrl: fileUrl,
      updatedAt: new Date()
    };

    writeResourcesToFile(mockResources); // Save to file
    res.json(mockResources[resourceIndex]);
  } catch (error) {
    console.error('Error updating resource:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete resource
router.delete('/:id', async (req, res) => {
  try {
    const resourceIndex = mockResources.findIndex(r => r.id === req.params.id);
    if (resourceIndex === -1) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    // Remove file if exists
    const resource = mockResources[resourceIndex];
    if (resource.fileUrl) {
      const filePath = path.join(__dirname, '../uploads', path.basename(resource.fileUrl));
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    mockResources.splice(resourceIndex, 1);
    writeResourcesToFile(mockResources); // Save to file
    res.json({ message: 'Resource deleted successfully' });
  } catch (error) {
    console.error('Error deleting resource:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
