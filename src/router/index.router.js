const router = require("express").Router();
const controller = require("../controller/index.controller");

router.get("/", controller.get);
router.post("/", controller.post);
router.post("/auth/login", controller.user);
router.get("/user/:id", controller.checkTokenMiddleware, controller.privateRoute);

module.exports = router;
