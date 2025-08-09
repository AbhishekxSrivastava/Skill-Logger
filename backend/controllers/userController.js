export const getUserProfile = async (req, res) => {
  try {
    const user = req.user;
    res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    });
  } catch (error) {
    console.error("Profile Error:", error.message);
    res.status(500).json({ error: "Failed to get user profile" });
  }
};
