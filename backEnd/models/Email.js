import mongoose from "mongoose";

const emailSchema = new mongoose.Schema({
  sender: String,
  recipient: String,
  subject: String,
  body: String,
  timestamp: Date,
  folder: { type: String, default: "INBOX" },
  category: { 
    type: String, 
    enum: ["Interested", "Meeting Booked", "Not Interested", "Spam", "Out of Office", "Uncategorized"], 
    default: "Uncategorized" 
  },
});

const Email = mongoose.model("Email", emailSchema);
export default Email;
