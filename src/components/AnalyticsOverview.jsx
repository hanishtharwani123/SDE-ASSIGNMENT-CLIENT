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

function AnalyticsOverview({ links }) {
  // Calculate total clicks across all links
  const totalClicks = useMemo(() => {
    return links.reduce((sum, link) => sum + (link.totalClicks || 0), 0);
  }, [links]);

  // Calculate clicks by date for the bar chart
  const clicksByDate = useMemo(() => {
    const dateMap = new Map();

    links.forEach((link) => {
      if (link.clicks && link.clicks.length > 0) {
        link.clicks.forEach((click) => {
          const date = format(new Date(click.timestamp), "MMM d");
          dateMap.set(date, (dateMap.get(date) || 0) + 1);
        });
      }
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
      })
      .slice(-7); // Last 7 days
  }, [links]);

  // Calculate device distribution for the pie chart
  const deviceData = useMemo(() => {
    const deviceMap = new Map();

    links.forEach((link) => {
      if (link.clicks && link.clicks.length > 0) {
        link.clicks.forEach((click) => {
          const device = click.deviceType || "unknown";
          deviceMap.set(device, (deviceMap.get(device) || 0) + 1);
        });
      }
    });

    return Array.from(deviceMap.entries()).map(([name, value]) => ({
      name,
      value,
    }));
  }, [links]);

  // Calculate browser distribution for the pie chart
  const browserData = useMemo(() => {
    const browserMap = new Map();

    links.forEach((link) => {
      if (link.clicks && link.clicks.length > 0) {
        link.clicks.forEach((click) => {
          const browser = click.browser || "unknown";
          browserMap.set(browser, (browserMap.get(browser) || 0) + 1);
        });
      }
    });

    return Array.from(browserMap.entries()).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
    }));
  }, [links]);

  // Colors for the pie charts
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="card-header">
          <h2 className="text-xl font-semibold">Total Clicks</h2>
        </div>
        <div className="card-body">
          <div className="text-3xl font-bold">{totalClicks}</div>
          <p className="text-sm text-gray-500">Across {links.length} links</p>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="text-xl font-semibold">Clicks Over Time</h2>
          <p className="text-sm text-gray-500">
            Click distribution for the last 7 days
          </p>
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

export default AnalyticsOverview;
