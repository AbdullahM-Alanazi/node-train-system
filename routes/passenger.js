import express from "express";
import {
  searchTrains,
  bookSeat,
  completePayment,
} from "../controllers/passenger.js";
// import authenticate from "../middleware/auth.js";

const router = express.Router();

// router.get("/trains", authenticate, searchTrains);
// router.post("/reservation", authenticate, bookSeat);

router.get("/trains", searchTrains);
router.post("/reservation", bookSeat);
router.post("/payment", completePayment);

export default router;
