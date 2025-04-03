import supabase from "../config/db.js";

const assignStaffToTrain = async (req, res) => {
  const { train_id, staff_id, date } = req.body;
  const { data, error } = await supabase
    .from("trainassignment")
    .upsert([{ train_id, staff_id, date }])
    .select();

  if (error) return res.status(500).json(error);
  res.status(200).json(data);
};
// Staff/Admin: Add/Edit/Cancel Reservations
const upsertReservation = async (req, res) => {
  // update is based on status {pending, confirmed, cancelled  }. or insert a new record.
  const {
    passenger_id,
    schedule_id,
    coach_type,
    seat_number,
    luggage_details,
    status,
  } = req.body;
  const { data, error } = await supabase.from("Reservation").upsert([
    {
      passenger_id,
      schedule_id,
      coach_type,
      seat_number,
      luggage_details,
      status,
    },
  ]);

  if (error) return res.status(500).json(error);
  res.status(200).json(data);
};
// Staff/Admin: Promote Waitlisted Passenger
const promoteWailList = async (req, res) => {
  const { reservation_id } = req.body;

  // Step 1: Validate input
  if (!reservation_id) {
    return res.status(400).json({ error: "reservation_id is required" });
  }

  try {
    // Step 2: Log input and check if reservation exists with status 'active'
    console.log("Reservation ID:", reservation_id);

    const { data: existingEntry, error: fetchError } = await supabase
      .from("waitinglist")
      .select("*") // Select all columns for debugging.
      .eq("reservation_id", reservation_id)
      .eq("status", "active");

    if (fetchError) {
      console.error("Error fetching waitlist entry:", fetchError);
      return res.status(500).json({ error: "Failed to fetch waitlist entry" });
    }

    console.log("Existing Entry:", existingEntry);

    if (!existingEntry || existingEntry.length === 0) {
      return res.status(404).json({
        message: "No active waitlist entry found for the given reservation_id",
      });
    }

    // Step 3: Attempt to update the entry
    const { data, error } = await supabase
      .from("waitinglist")
      .update({ status: "expired" }) // Change the status to expired.
      .eq("reservation_id", reservation_id)
      .eq("status", "active");

    if (error) {
      console.error("Error updating reservation status:", error);
      return res
        .status(500)
        .json({ error: "Failed to promote waitlist entry" });
    }

    console.log("Updated Data:", data);

    // Step 4: Respond with success
    return res.status(200).json(data);
  } catch (err) {
    console.error("Unexpected error:", err);
    return res.status(500).json({ error: "Unexpected server error" });
  }
};
const loadFactor = async (req, res) => {
  const { date } = req.body; // e.g., '2024-12-15'
  console.log(date);
  try {
    // Ensure the parameter is passed as an object in the rpc call
    const { data, error } = await supabase.rpc("calculate_load_factor", {
      date: date,
    });

    // Handle any errors
    if (error) {
      console.error("Error executing query:", error);
      return res.status(500).json({ error: "Error calculating load factor" });
    }

    // Return the result
    return res.json({ data });
  } catch (err) {
    // Catch general errors
    console.error("Error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
export { assignStaffToTrain, upsertReservation, promoteWailList, loadFactor };
