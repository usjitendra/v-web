const express = require('express');
const {
    getProcedureCosts,
    getProcedureCost,
    createProcedureCost,
    updateProcedureCost,
    deleteProcedureCost,
    getProceduresByCategory,
    getProceduresByTreatment
} = require('../controllers/procedureCostController.cjs');

const router = express.Router();

router.get('/all', getProcedureCosts);
router.get('/category/:category', getProceduresByCategory);
router.get('/:id', getProcedureCost);
router.get('/by-treatment/:treatmentId', getProceduresByTreatment);
router.post('/', createProcedureCost);
router.put('/:id', updateProcedureCost);
router.delete('/:id', deleteProcedureCost);


module.exports = router;