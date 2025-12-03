const projectService = require('../services/projectService');

class ProjectController {
    // GET /api/projects/delivered
    async getDelivered(req, res, next) {
        try {
            const response = await projectService.getDelivered();
            if (!response || response.length === 0) {
                return res.status(404).json({ message: 'No delivered projects found' });
            }
            return res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }

    // GET /api/projects/delivered/:id
    async getDeliveredById(req, res, next) {
        try {
            const { id } = req.params;
            const response = await projectService.getDeliveredById(id);
            if (!response) {
                return res.status(404).json({ message: 'Delivered project not found' });
            }
            return res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new ProjectController();

