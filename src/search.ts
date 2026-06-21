import * as dotenv from "dotenv";
import { VoyageAIClient } from "voyageai";

dotenv.config();

const voyage = new VoyageAIClient({ apiKey: process.env.VOYAGE_API_KEY });

const faqs = [
  "How do I reset my password?",
  "What is the refund policy?",
  "How can I contact support?",
  "When will my order arrive?",
  "How do I cancel my subscription?",
  "What payment methods do you accept?",
  "How do I update my email address?",
  "Is there a free trial available?",
];

async function embed(texts: string[]): Promise<number[][]> {
  const response = await voyage.embed({ input: texts, model: "voyage-3" });
  return response.data?.map((d) => d.embedding ?? []) ?? [];
}

// cosine similarity: measures angle between two vectors (1 = identical, 0 = unrelated)
function cosineSimilarity(a: number[], b: number[]): number {
  const dot = a.reduce((sum, val, i) => sum + val * (b[i] ?? 0), 0);
  const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dot / (magA * magB);
}

function search(query: string, queryEmbedding: number[], faqEmbeddings: number[][]) {
  const scores = faqEmbeddings.map((faqVec, i) => ({
    faq: faqs[i] as string,
    score: cosineSimilarity(queryEmbedding, faqVec),
  }));

  scores.sort((a, b) => b.score - a.score);
  const top3 = scores.slice(0, 3);

  console.log(`Query: "${query}"`);
  console.log(`Best match: "${top3[0]?.faq}"\n`);
  console.log("All matches:");
  top3.forEach((match, i) => {
    console.log(`  ${i + 1}. "${match.faq}"  (score: ${match.score.toFixed(3)})`);
  });
  console.log();
}

async function main() {
  const query = process.argv[2];

  if (!query) {
    console.log("Usage: npm run search -- \"your question here\"");
    process.exit(1);
  }

  const [faqEmbeddings, queryEmbeddings] = await Promise.all([
    embed(faqs),
    embed([query]),
  ]);

  search(query, queryEmbeddings[0] as number[], faqEmbeddings);
}

main().catch(console.error);
