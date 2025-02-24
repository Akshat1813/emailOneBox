import { useState } from "react";

const Navbar = () => {
  const [selectedEmail, setSelectedEmail] = useState("akshatnigam769@gmail.com");

  const fetchNewEmails = async () => {
    try {
      await fetch("http://localhost:5000/emails/fetch-emails");
      alert("Fetching new emails...");
    } catch (error) {
      console.error("❌ Error fetching new emails:", error);
    }
  };

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">📧 OneBox Email Aggregator</h1>

      {/* Dropdown Menu */}
      <div className="relative">
        <select
          className="bg-gray-700 text-white px-4 py-2 rounded-md cursor-pointer"
          value={selectedEmail}
          onChange={(e) => setSelectedEmail(e.target.value)}
        >
          <option value="akshatnigam769@gmail.com">akshatnigam769@gmail.com</option>
          <option value="toxicgaming1040@gmail.com">toxicgaming1040@gmail.com</option>
        </select>
      </div>

      <button
        onClick={fetchNewEmails}
        className="bg-red-500 px-4 py-2 rounded-md text-white hover:bg-blue-600 hover:cursor-pointer"
      >
        Refresh Emails
      </button>
    </nav>
  );
};

export default Navbar;
