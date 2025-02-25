import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { fetchEmails } from "../utils/api"; // ✅ Import the updated function

const EmailList = ({ selectedCategory, onSelectEmail }) => {
  const [emails, setEmails] = useState([]); // ✅ Store emails
  const [from, setFrom] = useState(0); // ✅ Pagination offset
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true); // ✅ Check if more emails exist

  // ✅ Function to fetch emails (No useCallback to avoid unnecessary dependencies)
  const getEmails = async (reset = false) => {
    if (loading) return; // ✅ Prevent duplicate calls

    setLoading(true);
    const currentFrom = reset ? 0 : from;

    const emailData = await fetchEmails(selectedCategory, currentFrom, 50); // ✅ Fetch 50 at a time

    if (emailData.length > 0) {
      setEmails((prevEmails) => (reset ? emailData : [...prevEmails, ...emailData])); // ✅ Reset or append emails
      setFrom(currentFrom + 50); // ✅ Increase offset
    } else {
      setHasMore(false); // ✅ No more emails to fetch
    }
    setLoading(false);
  };

  // ✅ Reset when `selectedCategory` changes
  useEffect(() => {
    setEmails([]); // ✅ Clear emails when category changes
    setFrom(0);
    setHasMore(true);
    getEmails(true); // ✅ Fetch fresh emails
  }, [selectedCategory]); // ✅ Only runs when category changes

  return (
    <div className="flex-1 p-4 bg-gray-100 h-screen overflow-y-auto">
      <h2 className="text-xl font-semibold mb-4">{selectedCategory} Emails</h2>
      <ul>
        {emails.map((email, index) => (
          <li
            key={email._id || `email-${index}`} // ✅ Use `_id`, fallback to `index`
            className="p-2 mb-2 bg-white shadow rounded-md cursor-pointer hover:bg-gray-200"
            onClick={() => onSelectEmail(email)}
          >
            <h3 className="font-bold">{email.subject}</h3>
            <p className="text-sm text-gray-600">{email.sender}</p>
          </li>
        ))}
      </ul>

      {/* ✅ Load More Button */}
      {hasMore && (
        <button
          onClick={() => getEmails()} // ✅ Fetch next batch
          disabled={loading}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? "Loading..." : "Load More"}
        </button>
      )}
    </div>
  );
};

EmailList.propTypes = {
  selectedCategory: PropTypes.string.isRequired,
  onSelectEmail: PropTypes.func.isRequired,
};

export default EmailList;
