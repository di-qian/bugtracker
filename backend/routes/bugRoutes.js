import express from 'express';
const router = express.Router();
import { getBugs, getBugById } from '../controllers/bugController.js';

router.route('/').get(getBugs);
router.route('/:id').get(getBugById);

export default router;
