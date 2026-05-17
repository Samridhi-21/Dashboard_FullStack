import { body, param, query } from 'express-validator';
import { LEAD_SOURCES, LEAD_STATUSES } from '../models/Lead';

export const createLeadValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Lead name is required')
    .isLength({ max: 150 })
    .withMessage('Name cannot exceed 150 characters'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('status')
    .optional()
    .isIn(LEAD_STATUSES)
    .withMessage(`Status must be one of: ${LEAD_STATUSES.join(', ')}`),
  body('source')
    .notEmpty()
    .withMessage('Source is required')
    .isIn(LEAD_SOURCES)
    .withMessage(`Source must be one of: ${LEAD_SOURCES.join(', ')}`),
];

export const updateLeadValidation = [
  param('id').isMongoId().withMessage('Invalid lead ID'),
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Name cannot be empty')
    .isLength({ max: 150 })
    .withMessage('Name cannot exceed 150 characters'),
  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('status')
    .optional()
    .isIn(LEAD_STATUSES)
    .withMessage(`Status must be one of: ${LEAD_STATUSES.join(', ')}`),
  body('source')
    .optional()
    .isIn(LEAD_SOURCES)
    .withMessage(`Source must be one of: ${LEAD_SOURCES.join(', ')}`),
];

export const leadIdValidation = [param('id').isMongoId().withMessage('Invalid lead ID')];

export const leadQueryValidation = [
  query('status')
    .optional()
    .isIn(LEAD_STATUSES)
    .withMessage(`Status must be one of: ${LEAD_STATUSES.join(', ')}`),
  query('source')
    .optional()
    .isIn(LEAD_SOURCES)
    .withMessage(`Source must be one of: ${LEAD_SOURCES.join(', ')}`),
  query('search').optional().trim().isLength({ max: 100 }).withMessage('Search term too long'),
  query('sort')
    .optional()
    .isIn(['latest', 'oldest'])
    .withMessage('Sort must be latest or oldest'),
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer')
    .toInt(),
];
