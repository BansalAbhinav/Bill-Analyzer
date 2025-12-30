import React from "react";
export const ServerStatusBanner = ({ status }) => {
  const [hasShownMessage, setHasShownMessage] = React.useState(false);

  React.useEffect(() => {
    if (status === "warming" && !hasShownMessage) {
      setHasShownMessage(true);
    }
  }, [status, hasShownMessage]);

  if (status === "ready") {
    return (
      <div>
        <div>
          <span className="text-green-600 text-xl">🟢</span>
        </div>
      </div>
    );
  }

  if (status === "warming") {
    return (
      <div>
        <div>
          <span className="text-yellow-600 text-xl animate-pulse">🟡</span>
          {!hasShownMessage && (
            <p className="text-yellow-800 font-medium">
              Server is waking up...
            </p>
          )}
        </div>
      </div>
    );
  }

  return null;
};