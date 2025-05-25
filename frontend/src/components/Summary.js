import React, { useState } from "react";
import { toast, Toaster } from "sonner";

const Summary = () => {
  const [loading, setLoading] = useState(false);

  const handleSummarize = async () => {
    setLoading(true);

    try {
      const res = await fetch(
        "https://task-summary-assistant.onrender.com/summarize",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Adjust if stored elsewhere
            "Content-Type": "application/json",
          },
        }
      );

      const data = await res.json();

      if (res.ok) {
        toast.success("✅ Summary sent to Slack!");
      } else {
        toast.error(data.message || "❌ Failed to send summary.");
      }
    } catch (error) {
      toast.error("❌ Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center mt-12 px-6">
      <Toaster position="bottom-right" richColors />

      <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">
        Summarize Your Tasks Here
      </h1>
      <p className="text-lg text-gray-600 text-center mb-6 max-w-xl">
        Click below to instantly summarize your incomplete to-do tasks and send
        them to your Slack workspace 📬
      </p>

      <button
        onClick={handleSummarize}
        disabled={loading}
        className={`mt-2 px-6 py-3 rounded-xl text-white font-medium shadow-lg transition-all duration-200 ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? "Summarizing..." : "📤 Summarize & Send to Slack"}
      </button>
    </div>
  );
};

export default Summary;
