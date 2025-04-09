import axios from "axios";

// Create a new link
export const createLink = async (linkData) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.post(
      "http://localhost:5000/api/links",
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
      `http://localhost:5000/api/links?page=${page}&search=${search}`,
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

    const response = await axios.get(`http://localhost:5000/api/links/${id}`, {
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
      `http://localhost:5000/api/links/${id}`,
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
