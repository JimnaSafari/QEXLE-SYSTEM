import { Document, Case, Team } from '../models/index.js';
import { logger } from '../utils/logger.js';
import path from 'path';
import fs from 'fs/promises';

// @desc    Upload document
// @route   POST /api/documents/upload
// @access  Private
export const uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const {
      title,
      description,
      category,
      caseId
    } = req.body;

    const document = await Document.create({
      title,
      description,
      category,
      caseId,
      filePath: req.file.path,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      uploadedBy: req.teamMember.id
    });

    res.status(201).json(document);
  } catch (error) {
    logger.error('Error in uploadDocument:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all documents
// @route   GET /api/documents
// @access  Private
export const getDocuments = async (req, res) => {
  try {
    const { caseId, category, uploadedBy } = req.query;
    const where = {};

    if (caseId) where.caseId = caseId;
    if (category) where.category = category;
    if (uploadedBy) where.uploadedBy = uploadedBy;

    const documents = await Document.findAll({
      where,
      include: [
        {
          model: Case,
          as: 'case',
          attributes: ['id', 'caseNumber', 'title']
        },
        {
          model: Team,
          as: 'uploader',
          attributes: ['id', 'firstName', 'lastName']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(documents);
  } catch (error) {
    logger.error('Error in getDocuments:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get document by ID
// @route   GET /api/documents/:id
// @access  Private
export const getDocumentById = async (req, res) => {
  try {
    const document = await Document.findByPk(req.params.id, {
      include: [
        {
          model: Case,
          as: 'case',
          attributes: ['id', 'caseNumber', 'title']
        },
        {
          model: Team,
          as: 'uploader',
          attributes: ['id', 'firstName', 'lastName']
        }
      ]
    });

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    res.json(document);
  } catch (error) {
    logger.error('Error in getDocumentById:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Download document
// @route   GET /api/documents/:id/download
// @access  Private
export const downloadDocument = async (req, res) => {
  try {
    const document = await Document.findByPk(req.params.id);

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    const filePath = path.resolve(document.filePath);
    
    try {
      await fs.access(filePath);
    } catch (error) {
      return res.status(404).json({ message: 'File not found' });
    }

    res.download(filePath, document.title);
  } catch (error) {
    logger.error('Error in downloadDocument:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update document
// @route   PUT /api/documents/:id
// @access  Private
export const updateDocument = async (req, res) => {
  try {
    const document = await Document.findByPk(req.params.id);

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    const { title, description, category, status } = req.body;
    
    const updatedDocument = await document.update({
      title: title || document.title,
      description: description || document.description,
      category: category || document.category,
      status: status || document.status
    });

    res.json(updatedDocument);
  } catch (error) {
    logger.error('Error in updateDocument:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete document
// @route   DELETE /api/documents/:id
// @access  Private
export const deleteDocument = async (req, res) => {
  try {
    const document = await Document.findByPk(req.params.id);

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Delete file from storage
    try {
      await fs.unlink(document.filePath);
    } catch (error) {
      logger.error('Error deleting file:', error);
    }

    await document.destroy();
    res.json({ message: 'Document removed' });
  } catch (error) {
    logger.error('Error in deleteDocument:', error);
    res.status(500).json({ message: 'Server error' });
  }
}; 