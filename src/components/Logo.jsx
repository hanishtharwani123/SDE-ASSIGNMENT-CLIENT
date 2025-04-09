function Logo({ size = "medium" }) {
  const sizeClasses = {
    small: "h-6 w-6",
    medium: "h-8 w-8",
    large: "h-12 w-12",
  };

  return (
    <div className="flex items-center">
      <svg
        className={`${sizeClasses[size]} text-blue-600`}
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M10 17l-5-5 5-5v10zm4-10l5 5-5 5V7z" />
      </svg>
      <span
        className={`font-bold ${
          size === "large" ? "text-2xl ml-2" : "text-xl ml-1"
        } text-gray-900`}
      >
        URL Analytics
      </span>
    </div>
  );
}

export default Logo;
