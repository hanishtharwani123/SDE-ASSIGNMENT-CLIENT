import axios from "axios";

// Login user
export const loginUser = async (email, password) => {
  try {
    const response = await axios.post("https://sde-assignment-server.onrender.com/api/auth/login", {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Login failed";
  }
};

// Get user profile
export const getUserProfile = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get("https://sde-assignment-server.onrender.com/api/auth/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to get user profile";
  }
};
