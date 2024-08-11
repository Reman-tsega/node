const express = require("express");
const { getUsersData, deleteUser, updateUser, updateRole } = require("../../controlers/authControllers");
const verifyRole = require("../../middleware/roleChecker");
const router = express.Router();


router.get("/", verifyRole('admin',"sub-admin","user"),getUsersData);

router.delete('/delete/:id',verifyRole('admin'), deleteUser)
router.put('/update/:id',verifyRole('admin','sub-admin'),updateUser)
router.put('/update/role/:id',verifyRole('admin'),updateRole)

module.exports = router;
