const designService = require("../services/designService");

class DesignController {
  async getAllCategories(req, res, next) {
    try {
      const categories = designService.getAllCategories();
      return res.status(200).json(categories);
    } catch (error) {
      next(error);
    }
  }

  // GET /api/designs/:categoryId
  async getDesignsByCategory(req, res, next) {
    try {
      const { categoryId } = req.params;
      const designs = await designService.getDesignsByCategory(categoryId);

      if (!designs || designs.length === 0) {
        return res
          .status(404)
          .json({ success: false, message: "No designs found." });
      }

      return res.status(200).json({
        success: true,
        category: categoryId,
        totalDesigns: designs.length,
        data: designs,
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/designs/:categoryId/:designSlug
  async getDesignDetails(req, res, next) {
    try {
      const { designSlug } = req.params;
      const design = await designService.getDesignDetails(designSlug);
      if (!design) {
        return res
          .status(404)
          .json({ success: false, message: "Design not found." });
      }
      return res.status(200).json({ success: true, data: design });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new DesignController();
