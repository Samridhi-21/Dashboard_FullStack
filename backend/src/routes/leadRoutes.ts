import { Router } from 'express';
import * as leadController from '../controllers/leadController';
import { authenticate } from '../middleware/auth';
import { roleGuard } from '../middleware/roleGuard';
import { validate } from '../middleware/validate';
import {
  createLeadValidation,
  leadIdValidation,
  leadQueryValidation,
  updateLeadValidation,
} from '../validators/leadValidators';

const router = Router();

router.use(authenticate);

router.get('/', validate(leadQueryValidation), leadController.getLeads);
router.get('/export', validate(leadQueryValidation), leadController.exportLeads);
router.get('/:id', validate(leadIdValidation), leadController.getLead);
router.post('/', validate(createLeadValidation), leadController.createLead);
router.put(
  '/:id',
  roleGuard('admin'),
  validate(updateLeadValidation),
  leadController.updateLead
);
router.delete('/:id', roleGuard('admin'), validate(leadIdValidation), leadController.deleteLead);

export default router;
