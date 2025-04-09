import axios from "axios";

// Create a new link
export const createLink = async (linkData) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.post(
      "https://sde-assignment-server.onrender.com/api/links",
      linkData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to create link";
  }
};

// Get all links
export const getLinks = async (page = 1, search = "") => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(
      `https://sde-assignment-server.onrender.com/api/links?page=${page}&search=${search}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch links";
  }
};

// Get a single link by ID
export const getLinkById = async (id) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(`https://sde-assignment-server.onrender.com/api/links/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch link";
  }
};

// Delete a link
export const deleteLink = async (id) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.delete(
      `https://sde-assignment-server.onrender.com/api/links/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to delete link";
  }
};
