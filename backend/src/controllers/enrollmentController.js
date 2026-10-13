const service = require('../services/enrollmentService');
async function list(req, res) { res.json(await service.listEnrollments()); }
async function listMine(req, res) { res.json(await service.listMyEnrollments(req.auth.studentId)); }
async function createMine(req, res) { res.status(201).json(await service.createMyEnrollment(req.auth.studentId, req.body)); }
async function report(req, res) { res.json(await service.getReport()); }
module.exports = { list, listMine, createMine, report };
