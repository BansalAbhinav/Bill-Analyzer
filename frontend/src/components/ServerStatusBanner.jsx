import React from "react";

export const ServerStatusBanner = ({ status }) => {
  if (status === "ready") {
    return (
      <div >
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex items-center justify-center gap-2">
            <span className="text-green-600 text-lg">🟢</span>
          </div>
        </div>
      </div>
    );
  }

  if (status === "warming") {
    return (
      <div >
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex items-center justify-center gap-2">
            <span className="text-yellow-600 text-lg animate-pulse">🟡</span>
            <p className="text-yellow-800 font-medium text-sm">
              Server is waking up (Render sleeps free instances)
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
};