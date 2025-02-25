const BASE_URL = "https://reachinbox-ai-backend.vercel.app/api/emails"; // Adjust if needed

// ✅ Fetch paginated emails
export const fetchEmails = async (category, from = 0, size = 50) => {
  try {
    let url = `${BASE_URL}/search?query=&from=${from}&size=${size}`;
    if (category && category !== "All") {
      url += `&folder=${category}`;
    }

    const response = await fetch(url);
    const data = await response.json();
    return data.success ? data.results : [];
  } catch (error) {
    console.error("❌ Error fetching emails:", error);
    return [];
  }
};
