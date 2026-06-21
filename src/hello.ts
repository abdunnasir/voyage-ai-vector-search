import * as dotenv from "dotenv";
import { VoyageAIClient } from "voyageai";

dotenv.config();

const client = new VoyageAIClient({ apiKey: process.env.VOYAGE_API_KEY });

async function main() {
  const response = await client.embed({
    input: "Hello World — this is my first embedding!",
    model: "voyage-3",
  });

  const embedding = response.data?.[0]?.embedding ?? [];

  console.log("Voyage AI is working!");
  console.log(`Text embedded successfully.`);
  console.log(`Embedding dimensions: ${embedding.length}`);
  console.log(`\nFull vector (1024 values):`);
  console.log(embedding);
}

main().catch(console.error);
