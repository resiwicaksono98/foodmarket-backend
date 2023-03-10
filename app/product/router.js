const router = require("express").Router();
const multer = require("multer");
const os = require("os");
const { police_check } = require("../../middleware");
const productController = require("./controller");

router.get("/products", productController.index);
router.post(
  "/products",
  multer({ dest: os.tmpdir() }).single("image_url"),
  productController.store
);
router.put(
  "/products/:id",
  multer({ dest: os.tmpdir() }).single("image_url"),
  productController.update
);
router.delete("/products/:id", productController.destroy);
router.post("/products/:id", productController.compressImage);

module.exports = router;
