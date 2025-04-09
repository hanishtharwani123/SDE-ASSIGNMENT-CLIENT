"use client";

import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { format } from "date-fns";

function LinkAnalytics({ link, onCopy, onShowQR }) {
  // Calculate clicks by date for the bar chart
  const clicksByDate = useMemo(() => {
    if (!link.clicks || link.clicks.length === 0) return [];

    const dateMap = new Map();

    link.clicks.forEach((click) => {
      const date = format(new Date(click.timestamp), "MMM d");
      dateMap.set(date, (dateMap.get(date) || 0) + 1);
    });

    return Array.from(dateMap.entries())
      .map(([date, clicks]) => ({
        date,
        clicks,
      }))
      .sort((a, b) => {
        // Sort by date
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateA.getTime() - dateB.getTime();
      });
  }, [link]);

  // Calculate device distribution for the pie chart
  const deviceData = useMemo(() => {
    if (!link.clicks || link.clicks.length === 0) return [];

    const deviceMap = new Map();

    link.clicks.forEach((click) => {
      const device = click.deviceType || "unknown";
      deviceMap.set(device, (deviceMap.get(device) || 0) + 1);
    });

    return Array.from(deviceMap.entries()).map(([name, value]) => ({
      name,
      value,
    }));
  }, [link]);

  // Calculate browser distribution for the pie chart
  const browserData = useMemo(() => {
    if (!link.clicks || link.clicks.length === 0) return [];

    const browserMap = new Map();

    link.clicks.forEach((click) => {
      const browser = click.browser || "unknown";
      browserMap.set(browser, (browserMap.get(browser) || 0) + 1);
    });

    return Array.from(browserMap.entries()).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
    }));
  }, [link]);

  // Colors for the pie charts
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="card-header">
          <h2 className="text-xl font-semibold">Link Details</h2>
        </div>
        <div className="card-body">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="text-sm font-medium text-gray-500">
                Original URL
              </h3>
              <p className="mt-1 break-all">{link.originalUrl}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Short URL</h3>
              <div className="mt-1 flex items-center">
                <a
                  href={link.shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-900 mr-2"
                >
                  {link.shortUrl}
                </a>
                <button
                  onClick={() => onCopy(link.shortUrl)}
                  className="text-gray-600 hover:text-gray-900"
                  title="Copy link"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Created</h3>
              <p className="mt-1">{format(new Date(link.createdAt), "PPP")}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Expires</h3>
              <p className="mt-1">
                {link.expiresAt
                  ? format(new Date(link.expiresAt), "PPP")
                  : "Never"}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">
                Total Clicks
              </h3>
              <p className="mt-1 text-2xl font-bold">{link.totalClicks || 0}</p>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => onShowQR(link)}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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
                    d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                  ></path>
                </svg>
                Show QR Code
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="text-xl font-semibold">Clicks Over Time</h2>
          <p className="text-sm text-gray-500">Click distribution by date</p>
        </div>
        <div className="card-body" style={{ height: "300px" }}>
          {clicksByDate.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={clicksByDate}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="clicks" fill="#3B82F6" name="Clicks" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-gray-500">No click data available yet</p>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <div className="card-header">
            <h2 className="text-xl font-semibold">Device Distribution</h2>
            <p className="text-sm text-gray-500">Clicks by device type</p>
          </div>
          <div className="card-body" style={{ height: "300px" }}>
            {deviceData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={deviceData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {deviceData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [`${value} clicks`, "Count"]}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center">
                <p className="text-gray-500">No device data available yet</p>
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="text-xl font-semibold">Browser Distribution</h2>
            <p className="text-sm text-gray-500">Clicks by browser</p>
          </div>
          <div className="card-body" style={{ height: "300px" }}>
            {browserData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={browserData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {browserData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [`${value} clicks`, "Count"]}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center">
                <p className="text-gray-500">No browser data available yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LinkAnalytics;
