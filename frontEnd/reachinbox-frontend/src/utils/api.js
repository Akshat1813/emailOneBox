const BASE_URL = "https://vercel.com/akshat-kumar-nigams-projects/email-one-box-backend/CWCmoMRm4t5XfURSesCxziGA4W8f"; // Adjust if needed

// ✅ Fetch emails by category
export const fetchEmails = async (category) => {
  try {
    let url = `${BASE_URL}/search?query=`;
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
