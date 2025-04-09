"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";

function QRCodeModal({ isOpen, onClose, link }) {
  const [qrDataUrl, setQrDataUrl] = useState(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (isOpen && link) {
      generateQRCode();
    }
  }, [isOpen, link]);

  const generateQRCode = async () => {
    if (!link) return;

    try {
      const canvas = canvasRef.current;
      if (canvas) {
        await QRCode.toCanvas(canvas, link.shortUrl, {
          width: 300,
          margin: 2,
          color: {
            dark: "#000000",
            light: "#ffffff",
          },
        });

        setQrDataUrl(canvas.toDataURL("image/png"));
      }
    } catch (error) {
      console.error("Error generating QR code:", error);
    }
  };

  const handleDownload = () => {
    if (!qrDataUrl) return;

    const downloadLink = document.createElement("a");
    downloadLink.href = qrDataUrl;
    downloadLink.download = `qrcode-${link?.shortCode || "link"}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
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
                <h3 className="text-lg leading-6 font-medium text-gray-900 text-center">
                  QR Code for your link
                </h3>
                <p className="mt-2 text-sm text-gray-500 text-center">
                  Scan this QR code to access your shortened link
                </p>
                <div className="mt-4 flex justify-center">
                  <canvas ref={canvasRef} className="hidden" />
                  {qrDataUrl && (
                    <img
                      src={qrDataUrl || "/placeholder.svg"}
                      alt="QR Code"
                      className="w-64 h-64"
                    />
                  )}
                </div>
                {link && (
                  <div className="mt-4 text-center">
                    <p className="font-medium text-gray-900">{link.shortUrl}</p>
                    <p className="text-sm text-gray-500 truncate mt-1">
                      {link.originalUrl}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={handleDownload}
            >
              <svg
                className="mr-2 h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                ></path>
              </svg>
              Download QR Code
            </button>
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QRCodeModal;
