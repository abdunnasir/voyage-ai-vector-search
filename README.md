# Vector Search using Voyage AI

**Voyage AI** is an AI research company specializing in embedding models and retrieval systems. It was acquired by Anthropic — the company behind Claude — in January 2025. As a result, Voyage AI's embedding models are now the recommended choice for building retrieval and search systems that work alongside Claude, offering tight integration within the Anthropic ecosystem.

This is a small TypeScript project that demonstrates how to use Voyage AI embeddings to perform vector search over a FAQ dataset.

## Prerequisites

- Node.js (v18+)
- A Voyage AI API key

## Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Create a `.env` file** in the project root with your Voyage AI API key:

   ```env
   VOYAGE_API_KEY=your_api_key_here
   ```

## Scripts

### Show help

Lists all available commands with descriptions and examples.

```bash
npm run help
```

### Test the Voyage AI connection

Embeds a sample text and prints the embedding vector to verify your API key is working.

```bash
npm run hello
```

### List all FAQ topics

Prints all available FAQ headings.

```bash
npm run list
```

### Semantic search over FAQs

Searches a built-in FAQ list using cosine similarity and returns the top 3 matches for your query.

```bash
npm run search -- "your question here"
```

**Example:**

```bash
npm run search -- "How do I change my password?"
```

**Output:**

```
Query: "How do I change my password?"
Best match: "How do I reset my password?"

All matches:
  1. "How do I reset my password?"  (score: 0.942)
  2. "How do I update my email address?"  (score: 0.871)
  3. "How can I contact support?"  (score: 0.812)
```

## Role of Voyage AI

Voyage AI takes a plain text string and converts it into a **vector embedding** — a list of 1024 decimal numbers that represent the meaning of that text. For example:

```
"How do I reset my password?" → [0.0421, -0.0183, 0.0734, ..., 0.0291]  (1024 values)
```

Texts with similar meanings produce vectors that point in similar directions in that 1024-dimensional space. This is what makes semantic search possible — instead of matching keywords, we compare meaning.

## Code That Converts Text to Vector Embeddings

The actual text-to-embedding conversion is handled by the `voyageai` SDK's `.embed()` method, called in two places:

**`src/hello.ts` — lines 9–12** (connection test):

```ts
const response = await client.embed({
  input: "Hello World — this is my first embedding!",
  model: "voyage-3",
});
```

This sends a single hardcoded string to Voyage AI and prints the resulting 1024-dimensional vector.

**`src/search.ts` — lines 19–22** (semantic search):

```ts
async function embed(texts: string[]): Promise<number[][]> {
  const response = await voyage.embed({ input: texts, model: "voyage-3" });
  return response.data?.map((d) => d.embedding ?? []) ?? [];
}
```

This `embed()` function accepts an array of strings and returns their embeddings as a 2D array of numbers. It is called twice in `main()` (lines 58–61) — once for all FAQ entries and once for the user's query — so both can be compared using cosine similarity.

In both cases, the SDK sends the text to the Voyage AI API over HTTPS and receives back a list of 1024 floating-point numbers representing the meaning of that text.

## How Score is Calculated using Cosine Similarity

**Voyage AI** is used to convert text into vector embeddings — numerical representations that capture the semantic meaning of a sentence. Each text becomes a list of 1024 numbers (a vector), where similar meanings result in vectors pointing in similar directions.

Once both the query and each FAQ entry are embedded into vectors, the score is calculated using **cosine similarity**, which measures how similar the **direction** of two vectors is, regardless of their size.

Using simplified 3-dimensional vectors as an example:

- Query: `"change password"` → `[0.8, 0.1, 0.3]`
- FAQ: `"reset password"` → `[0.7, 0.2, 0.4]`

**Step 1: Dot Product**

Multiply each pair of values and sum them:

```
(0.8 × 0.7) + (0.1 × 0.2) + (0.3 × 0.4)
= 0.56 + 0.02 + 0.12
= 0.70
```

**Step 2: Magnitude of each vector**

Square root of sum of squares:

```
magA = √(0.8² + 0.1² + 0.3²)
     = √(0.64 + 0.01 + 0.09)
     = √0.74
     = 0.860

magB = √(0.7² + 0.2² + 0.4²)
     = √(0.49 + 0.04 + 0.16)
     = √0.69
     = 0.831
```

**Step 3: Cosine Similarity**

```
score = dot / (magA × magB)
      = 0.70 / (0.860 × 0.831)
      = 0.70 / 0.715
      = 0.979
```

| Score | Meaning |
|-------|---------|
| `1.0` | Identical direction (same meaning) |
| `0.8+` | Very similar |
| `0.5–0.8` | Somewhat related |
| `< 0.5` | Unrelated |

## Role of Score in Semantic Search

Semantic search — also known as **vector search** — works by comparing the meaning of texts rather than matching exact keywords. The score is what makes this ranking possible.

When a user submits a query, it is embedded into a vector and compared against all FAQ vectors. The cosine similarity score tells us how close in meaning each FAQ is to the query. The FAQs are then ranked by score, and the highest-scoring ones are returned as the best matches.

Without the score, there would be no way to determine which FAQ is most relevant — it is the single number that turns a list of vector comparisons into an ordered, meaningful result.
