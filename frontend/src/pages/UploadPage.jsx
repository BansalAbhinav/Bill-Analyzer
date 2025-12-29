import React, { useState } from "react";
import { DNA } from "react-loader-spinner";
import { api, endpoints } from "../services/api";

// Upload Page - Protected (requires login)
export const UploadPage = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    // Validate file type
    if (selectedFile) {
      const validTypes = [
        "application/pdf",
        "image/jpeg",
        "image/png",
        "image/jpg",
      ];
      if (!validTypes.includes(selectedFile.type)) {
        setError("Please select a PDF or image file (JPG, PNG)");
        setFile(null);
        return;
      }

      setFile(selectedFile);
      setError("");
      setResult(null);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setError("Please select a file");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append("file", file);

      // Send request to backend
      const response = await api.post(endpoints.bills.process, formData);

      // Show results - backend returns { message, Data: { analysis, rawText } }
      setResult(response.Data.analysis);
      setFile(null);
    } catch (err) {
      setError(err.message || "Failed to analyze bill");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-3">
            Upload Your Bill
          </h1>
          <p className="text-base sm:text-lg text-slate-600">
            Upload a PDF or image of your hospital bill for instant AI analysis
          </p>
        </div>

        {/* Upload Form */}
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 mb-8 border border-slate-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* File Input */}
            <div className="relative">
              <label
                htmlFor="file-upload"
                className={`block p-8 sm:p-12 border-2 border-dashed rounded-xl text-center cursor-pointer transition-all duration-200 ${
                  file
                    ? "border-blue-500 bg-blue-50"
                    : "border-slate-300 bg-slate-50 hover:border-blue-400 hover:bg-slate-100"
                }`}
              >
                <div className="flex flex-col items-center gap-3">
                  <svg
                    className="w-10 h-10 sm:w-12 sm:h-12 text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <div>
                    <span className="text-base sm:text-lg font-semibold text-slate-700 break-all px-2">
                      {file ? file.name : "Choose a file"}
                    </span>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                      PDF, JPG, PNG (Max 10MB)
                    </p>
                  </div>
                </div>
              </label>
              <input
                id="file-upload"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                className="absolute opacity-0 w-0 h-0"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm text-center">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !file}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-blue-600 disabled:hover:to-blue-700"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-3"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Analyzing...
                </span>
              ) : (
                "Analyze Bill"
              )}
            </button>
          </form>
        </div>

        {/* Loading State with DNA Loader */}
        {loading && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 text-center mb-8 border border-blue-200">
            <div className="flex flex-col items-center justify-center">
              <DNA
                visible={true}
                height="80"
                width="80"
                ariaLabel="dna-loading"
                wrapperStyle={{}}
                wrapperClass="dna-wrapper"
              />
              <p className="text-lg font-semibold text-blue-900 mb-2 mt-4">
                Extracting text and analyzing with AI...
              </p>
              <p className="text-sm text-blue-700">
                This may take 5-10 seconds
              </p>
            </div>
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-slate-200">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-6">
              Analysis Results
            </h2>

            {/* Overall Summary */}
            {result?.overall_summary && (
              <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  📊 Overall Summary
                </h3>
                <div className="space-y-2 text-sm sm:text-base text-slate-700">
                  <p>
                    <strong className="font-semibold">Verdict:</strong>{" "}
                    {result.overall_summary.verdict}
                  </p>
                  <p>
                    <strong className="font-semibold">Confidence:</strong>{" "}
                    {result.overall_summary.confidence_level}
                  </p>
                  <p className="mt-3 text-slate-900">
                    {result.overall_summary.one_line_summary}
                  </p>
                </div>
              </div>
            )}

            {/* Positive Points */}
            {result?.positive_points?.length > 0 && (
              <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-green-50 rounded-xl border border-green-200">
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  ✅ Positive Points
                </h3>
                <div className="space-y-3 sm:space-y-4">
                  {result.positive_points.map((point, index) => (
                    <div
                      key={index}
                      className="bg-white p-3 sm:p-4 rounded-lg shadow-sm border border-green-100"
                    >
                      <strong className="text-green-900 font-semibold block mb-2 text-sm sm:text-base">
                        {point.title}
                      </strong>
                      <p className="text-slate-700 text-sm sm:text-base">
                        {point.explanation}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Potential Issues */}
            {result?.potential_issues?.length > 0 && (
              <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-amber-50 rounded-xl border border-amber-200">
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  ⚠️ Potential Issues
                </h3>
                <div className="space-y-3 sm:space-y-4">
                  {result.potential_issues.map((issue, index) => (
                    <div
                      key={index}
                      className="bg-white p-3 sm:p-4 rounded-lg shadow-sm border-l-4 border-amber-500"
                    >
                      <strong className="text-amber-900 font-semibold block mb-2 text-sm sm:text-base">
                        {issue.item_name}
                      </strong>
                      <p className="mb-2">
                        <span className="inline-block px-2 py-1 rounded bg-amber-200 text-amber-900 text-xs font-semibold mr-2">
                          {issue.severity}
                        </span>
                        <span className="text-slate-700 text-sm sm:text-base">
                          {issue.type}
                        </span>
                      </p>
                      <p className="text-slate-700 mb-3 text-sm sm:text-base">
                        {issue.why_flagged}
                      </p>
                      <p className="text-slate-600 italic text-xs sm:text-sm">
                        <strong className="font-semibold">Action:</strong>{" "}
                        {issue.suggested_action}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Insurance Attention Items */}
            {result?.insurance_attention_items?.length > 0 && (
              <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-purple-50 rounded-xl border border-purple-200">
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  🏥 Insurance Coverage Notes
                </h3>
                <div className="space-y-3 sm:space-y-4">
                  {result.insurance_attention_items.map((item, index) => (
                    <div
                      key={index}
                      className="bg-white p-3 sm:p-4 rounded-lg shadow-sm border border-purple-100"
                    >
                      <strong className="text-purple-900 font-semibold block mb-2 text-sm sm:text-base">
                        {item.item_name}
                      </strong>
                      <p className="text-slate-700 mb-2 text-sm sm:text-base">
                        {item.reason}
                      </p>
                      <p className="text-slate-700 text-sm sm:text-base">
                        <strong className="font-semibold">Coverage:</strong>{" "}
                        {item.coverage_likelihood}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Final Advice */}
            {result?.final_advice_for_patient?.length > 0 && (
              <div className="p-4 sm:p-6 bg-slate-50 rounded-xl border border-slate-200">
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  💡 Recommendations
                </h3>
                <ul className="list-disc list-inside space-y-2 text-slate-700 text-sm sm:text-base">
                  {result.final_advice_for_patient.map((advice, index) => (
                    <li key={index} className="leading-relaxed">
                      {advice}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
