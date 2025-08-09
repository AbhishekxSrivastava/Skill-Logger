import express from "express";
import { logSkill, getSkills, deleteSkill, updateSkill, getStats } from "../controllers/skillController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/log", protect, logSkill);
router.get("/", protect, getSkills);
router.put("/:id", protect, updateSkill);
router.delete("/:id", protect, deleteSkill);
router.get("/stats", protect, getStats);


export default router;
