const commands = [
  {
    name: "npm run help",
    description: "Show this help message with all available commands.",
  },
  {
    name: "npm run list",
    description: "List all available FAQ topics.",
  },
  {
    name: "npm run search -- \"<question>\"",
    description: "Search FAQs semantically and return the top 3 matches.",
    example: 'npm run search -- "How do I change my password?"',
  },
  {
    name: "npm run hello",
    description: "Test the Voyage AI connection by embedding a sample text.",
  },
];

console.log("Available commands:\n");
commands.forEach(({ name, description, example }) => {
  console.log(`  ${name}`);
  console.log(`    ${description}`);
  if (example) {
    console.log(`    Example: ${example}`);
  }
  console.log();
});
