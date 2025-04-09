"use client";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { redirectToOriginalUrl } from "../api/redirect";

function RedirectPage() {
  const { shortCode } = useParams();
  const [error, setError] = useState(null);

  useEffect(() => {
    const redirect = async () => {
      try {
        // Get device and browser info
        const userAgent = navigator.userAgent;
        const deviceType = /mobile|tablet|android|iphone|ipad/i.test(userAgent)
          ? "mobile"
          : "desktop";

        // Get browser info
        const browserInfo = {
          chrome: /chrome/i.test(userAgent),
          firefox: /firefox/i.test(userAgent),
          safari: /safari/i.test(userAgent),
          edge: /edge/i.test(userAgent),
          ie: /msie|trident/i.test(userAgent),
        };

        // Find the browser
        let browser = "other";
        for (const [key, value] of Object.entries(browserInfo)) {
          if (value) {
            browser = key;
            break;
          }
        }

        const data = await redirectToOriginalUrl(shortCode, {
          deviceType,
          browser,
        });

        // Redirect to the original URL
        window.location.href = data.originalUrl;
      } catch (error) {
        console.error("Redirect error:", error);
        setError(error.toString());
      }
    };

    redirect();
  }, [shortCode]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {error ? (
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-2">Error</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      ) : (
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">
            Redirecting you to your destination...
          </p>
        </div>
      )}
    </div>
  );
}

export default RedirectPage;
