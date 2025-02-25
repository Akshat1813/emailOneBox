import { Client } from "@elastic/elasticsearch";
import dotenv from "dotenv";
dotenv.config();

export const elasticClient = new Client({
  node: "http://localhost:9200",
  apiVersion: "7.10",
});

export const indexEmail = async (emailData) => {
  try {
    const response = await elasticClient.index({
      index: "emails",
      body: emailData,
    });
    console.log(`Email indexed in Elasticsearch! ID: ${response.body._id}`);
  } catch (error) {
    console.error("Elasticsearch Indexing Error:", error);
  }
};

export const emailExistsInElasticsearch = async (subject, sender, timestamp) => {
  try {
    const esQuery = {
      index: "emails",
      body: {
        query: {
          bool: {
            must: [
              { match: { subject } },
              { match: { sender } },
              { range: { timestamp: { gte: timestamp } } }
            ]
          }
        }
      }
    };

    const { body } = await elasticClient.search(esQuery);
    return body.hits.total.value > 0;
  } catch (error) {
    console.error("Elasticsearch Query Error:", error);
    return false;
  }
};

export const searchEmails = async (req, res) => {
  try {
    const { query } = req.query;
    const folder = req.query.folder || "INBOX";
    const account = req.query.account || "akshatnigam769@gmail.com";

    const from = parseInt(req.query.from) || 0;
    const size = parseInt(req.query.size) || 50;

    console.log(`Search Query: ${query}, Folder: ${folder}, Account: ${account}, From: ${from}, Size: ${size}`);

    const esQuery = {
      index: "emails",
      body: {
        from,
        size,
        query: {
          bool: {
            must: [
              query ? { multi_match: { query, fields: ["subject", "body", "sender", "recipient"] } } : { match_all: {} },
              folder ? { match: { folder } } : {},
              account ? { match: { recipient: account } } : {}
            ].filter(Boolean),
          },
        },
      },
    };

    const { body } = await elasticClient.search(esQuery);
    res.json({ success: true, results: body.hits.hits.map((hit) => hit._source) });
  } catch (error) {
    console.error("Search API Error:", error);
    res.status(500).json({ error: "Search failed" });
  }
};
