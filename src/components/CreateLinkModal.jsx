"use client";

import { useState } from "react";
import { createLink } from "../api/links";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function CreateLinkModal({ isOpen, onClose, onLinkCreated }) {
  const [originalUrl, setOriginalUrl] = useState("");
  const [alias, setAlias] = useState("");
  const [expirationDate, setExpirationDate] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate URL
      try {
        new URL(originalUrl);
      } catch (error) {
        toast.error("Please enter a valid URL");
        setLoading(false);
        return;
      }

      await createLink({
        originalUrl,
        alias: alias || undefined,
        expiresAt: expirationDate ? expirationDate.toISOString() : undefined,
      });

      // Reset form
      setOriginalUrl("");
      setAlias("");
      setExpirationDate(null);

      // Notify parent component
      onLinkCreated();
    } catch (error) {
      toast.error(error.toString());
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-10 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Create New Shortened Link
                </h3>
                <div className="mt-4">
                  <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <label
                        htmlFor="originalUrl"
                        className="block text-sm font-medium text-gray-700"
                      >
                        URL to Shorten
                      </label>
                      <input
                        type="text"
                        id="originalUrl"
                        className="mt-1 input"
                        placeholder="https://example.com/very-long-url"
                        value={originalUrl}
                        onChange={(e) => setOriginalUrl(e.target.value)}
                        required
                      />
                    </div>

                    <div className="mb-4">
                      <label
                        htmlFor="alias"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Custom Alias (Optional)
                      </label>
                      <input
                        type="text"
                        id="alias"
                        className="mt-1 input"
                        placeholder="my-custom-link"
                        value={alias}
                        onChange={(e) => setAlias(e.target.value)}
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Leave blank to generate a random code
                      </p>
                    </div>

                    <div className="mb-4">
                      <label
                        htmlFor="expirationDate"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Expiration Date (Optional)
                      </label>
                      <DatePicker
                        id="expirationDate"
                        selected={expirationDate}
                        onChange={setExpirationDate}
                        minDate={new Date()}
                        placeholderText="No expiration"
                        className="mt-1 input"
                        dateFormat="MMMM d, yyyy"
                      />
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Link"}
            </button>
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateLinkModal;
