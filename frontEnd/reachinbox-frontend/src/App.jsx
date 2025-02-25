import { useState } from "react";
import Sidebar from "./components/Sidebar";
import EmailList from "./components/EmailList";
import EmailDetails from "./components/EmailDetails";
import Navbar from "./components/Navbar";

const categories = [
  "Interested",
  "Meeting Booked",
  "Not Interested",
  "Spam",
  "Out of Office",
];

function App() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedEmail, setSelectedEmail] = useState(null);

  return (
    <>
      <Navbar />
      <div className="flex h-screen">
        <Sidebar
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
        
        {selectedEmail ? (
          <EmailDetails email={selectedEmail} onBack={() => setSelectedEmail(null)} />
        ) : (
          <EmailList selectedCategory={selectedCategory} onSelectEmail={setSelectedEmail} />
        )}
      </div>
    </>
  );
}

export default App;
