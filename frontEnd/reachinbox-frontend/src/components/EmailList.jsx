import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { fetchEmails } from "../utils/api";

const EmailList = ({ selectedCategory, onSelectEmail }) => {
  const [emails, setEmails] = useState([]);
  const [from, setFrom] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const getEmails = async (reset = false) => {
    if (loading) return;

    setLoading(true);
    const currentFrom = reset ? 0 : from;

    const emailData = await fetchEmails(selectedCategory, currentFrom, 50);

    if (emailData.length > 0) {
      setEmails((prevEmails) => (reset ? emailData : [...prevEmails, ...emailData]));
      setFrom(currentFrom + 50);
    } else {
      setHasMore(false);
    }
    setLoading(false);
  };

  useEffect(() => {
    setEmails([]);
    setFrom(0);
    setHasMore(true);
    getEmails(true);
  }, [selectedCategory]);

  return (
    <div className="flex-1 p-4 bg-gray-100 h-screen overflow-y-auto">
      <h2 className="text-xl font-semibold mb-4">{selectedCategory} Emails</h2>
      <ul>
        {emails.map((email, index) => (
          <li
            key={email._id || `email-${index}`}
            className="p-2 mb-2 bg-white shadow rounded-md cursor-pointer hover:bg-gray-200"
            onClick={() => onSelectEmail(email)}
          >
            <h3 className="font-bold">{email.subject}</h3>
            <p className="text-sm text-gray-600">{email.sender}</p>
          </li>
        ))}
      </ul>

      {hasMore && (
        <button
          onClick={() => getEmails()}
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
