const express = require("express");
const c = require("../controllers/propertyController");
const { protect, allowRoles } = require("../middleware/auth");

const router = express.Router();

router.get("/", c.list);
router.get("/mine", protect, allowRoles("host", "admin"), c.mine);
router.get("/:id", c.getOne);
router.post("/", protect, c.create);
router.put("/:id", protect, c.update);
router.delete("/:id", protect, c.remove);

module.exports = router;
