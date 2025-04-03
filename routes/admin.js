import express from "express";
import {
  assignStaffToTrain,
  upsertReservation,
  promoteWailList,
  loadFactor,
} from "../controllers/admin.js";

const router = express.Router();

router.post("/assign-staff", assignStaffToTrain);
router.post("/reservation", upsertReservation);
router.post("/promote-waitlist", promoteWailList);
router.post("/load-factor", loadFactor);
export default router;
