const express = require("express");
const c = require("../controllers/bookingController");
const { protect, allowRoles } = require("../middleware/auth");

const router = express.Router();

router.use(protect);

router.post("/", c.create);
router.get("/mine", c.mine);
router.get("/host", allowRoles("host", "admin"), c.forHost);
router.get("/:reference", c.getOne);
router.patch("/:id/cancel", c.cancel);

module.exports = router;
