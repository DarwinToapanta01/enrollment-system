const service = require('../services/studentService');

async function list(req, res) { res.json(await service.listStudents()); }
async function create(req, res) { res.status(201).json(await service.createStudent(req.body)); }

module.exports = { list, create };
