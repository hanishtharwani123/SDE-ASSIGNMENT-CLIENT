import axios from "axios";

// Redirect to original URL
export const redirectToOriginalUrl = async (shortCode, deviceInfo) => {
  try {
    const response = await axios.post(
      `http://localhost:5000/api/redirect/${shortCode}`,
      deviceInfo
    );
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Redirect failed";
  }
};

// Get analytics for all links
export const getAnalytics = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(
      "http://localhost:5000/api/redirect/analytics",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch analytics";
  }
};
