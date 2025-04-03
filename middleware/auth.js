import supabase from "../config/db.js";

// Middleware to check if the user is authenticated
const authenticate = async (req, res, next) => {
  const { authorization } = req.headers;

  // If no token is provided, return an unauthorized error
  if (!authorization) {
    return res.status(403).json({ message: "No token provided" });
  }

  const token = authorization.split(" ")[1]; // Extract token from "Bearer <token>"

  try {
    // Use Supabase to verify the session using the token
    const {
      data: { user },
      error,
    } = await supabase.auth.api.getUser(token);

    if (error || !user) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }

    // Attach user data to the request for use in the route handlers
    req.user = user;
    next(); // Continue to the next middleware or route handler
  } catch (error) {
    res.status(500).json({ message: "Error verifying token" });
  }
};

export default authenticate;
