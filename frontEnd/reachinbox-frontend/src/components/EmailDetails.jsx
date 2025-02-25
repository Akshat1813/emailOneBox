import PropTypes from "prop-types";
import parse from "html-react-parser";

const EmailDetails = ({ email, onBack }) => {
  if (!email) return <div className="p-4">Select an email to view details.</div>;
  const parser = new DOMParser();
  const doc = parser.parseFromString(email.body, "text/html");
  doc.querySelectorAll("meta").forEach((meta) => meta.remove());

  return (
    <div className="p-4 w-full h-screen bg-white shadow-lg">
      <button
        onClick={onBack}
        className="mb-4 bg-blue-500 text-white px-4 py-2 rounded-md"
      >
        ← Back to Emails
      </button>
      <h2 className="text-2xl font-bold">{email.subject}</h2>
      <p className="text-sm text-gray-500">
        <strong>From:</strong> {email.sender}
      </p>
      <p className="text-sm text-gray-500">
        <strong>Received:</strong> {new Date(email.timestamp).toLocaleString()}
      </p>
      <div className="mt-4">
        <div>{parse(doc.body.innerHTML)}</div>
      </div>
    </div>
  );
};

EmailDetails.propTypes = {
  email: PropTypes.shape({
    subject: PropTypes.string.isRequired,
    sender: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired,
    timestamp: PropTypes.string.isRequired,
  }).isRequired,
  onBack: PropTypes.func.isRequired,
};

export default EmailDetails;
