import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL;
const WEBHOOK_URL = process.env.WEBHOOK_URL;

export const sendSlackNotification = async (message) => {
  try {
    await axios.post(SLACK_WEBHOOK_URL, { text: message });
    console.log("Slack Notification Sent!");
  } catch (error) {
    console.error("Error sending Slack notification:", error);
  }
};

export const triggerWebhook = async (data) => {
  try {
    await axios.post(WEBHOOK_URL, data);
    console.log("Webhook Triggered Successfully!");
  } catch (error) {
    console.error("Error triggering webhook:", error);
  }
};
