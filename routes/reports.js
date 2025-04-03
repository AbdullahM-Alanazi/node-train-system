import express from "express";
import {
  activeTrains,
  stationsForTrain,
  reservationDetails,
} from "../controllers/reports.js";

const router = express.Router();

// Routes for reports
router.get("/active-trains", activeTrains);
router.get("/stations", stationsForTrain);
router.post("/reservation", reservationDetails);

export default router;
