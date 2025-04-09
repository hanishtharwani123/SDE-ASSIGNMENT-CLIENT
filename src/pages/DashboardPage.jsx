"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { getLinks } from "../api/links";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import LinkTable from "../components/LinkTable";
import CreateLinkModal from "../components/CreateLinkModal";
import QRCodeModal from "../components/QRCodeModal";
import AnalyticsOverview from "../components/AnalyticsOverview";
import LinkAnalytics from "../components/LinkAnalytics";

function DashboardPage() {
  const { logout } = useAuth();
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [selectedLink, setSelectedLink] = useState(null);
  const [activeTab, setActiveTab] = useState("links");

  // Fetch links on initial load and when search/page changes
  useEffect(() => {
    fetchLinks();
  }, [currentPage, searchTerm]);

  const fetchLinks = async () => {
    setLoading(true);
    try {
      const data = await getLinks(currentPage, searchTerm);
      setLinks(data.links);
      setTotalPages(data.totalPages);
    } catch (error) {
      toast.error("Failed to load links");
      console.error("Error fetching links:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLink = () => {
    setShowCreateModal(true);
  };

  const handleLinkCreated = () => {
    fetchLinks();
    setShowCreateModal(false);
    toast.success("Link created successfully");
  };

  const handleCopyLink = (shortUrl) => {
    navigator.clipboard.writeText(shortUrl);
    toast.success("Link copied to clipboard");
  };

  const handleShowQRCode = (link) => {
    setSelectedLink(link);
    setShowQRModal(true);
  };

  const handleViewAnalytics = (link) => {
    setSelectedLink(link);
    setActiveTab("analytics");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header onLogout={logout} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onCreateLink={handleCreateLink}
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {activeTab === "links" && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl font-bold">My Links</h1>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <input
                    type="text"
                    placeholder="Search links..."
                    className="input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <button
                    className="btn btn-primary whitespace-nowrap"
                    onClick={handleCreateLink}
                  >
                    Create Link
                  </button>
                </div>
              </div>

              <LinkTable
                links={links}
                loading={loading}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                onCopy={handleCopyLink}
                onShowQR={handleShowQRCode}
                onViewAnalytics={handleViewAnalytics}
                onRefresh={fetchLinks}
              />
            </div>
          )}

          {activeTab === "overview" && (
            <div className="space-y-4">
              <h1 className="text-2xl font-bold">Analytics Overview</h1>
              <AnalyticsOverview links={links || []} />
            </div>
          )}

          {activeTab === "analytics" && selectedLink && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Link Analytics</h1>
                <button
                  className="btn btn-secondary"
                  onClick={() => setActiveTab("links")}
                >
                  Back to Links
                </button>
              </div>
              <LinkAnalytics
                link={selectedLink}
                onCopy={handleCopyLink}
                onShowQR={handleShowQRCode}
              />
            </div>
          )}
        </main>
      </div>

      <CreateLinkModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onLinkCreated={handleLinkCreated}
      />

      <QRCodeModal
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
        link={selectedLink}
      />
    </div>
  );
}

export default DashboardPage;
