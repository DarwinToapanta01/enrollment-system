const service = require('../services/courseService');

async function list(req, res) { res.json(await service.listCourses()); }
async function create(req, res) { res.status(201).json(await service.createCourse(req.body)); }

module.exports = { list, create };
