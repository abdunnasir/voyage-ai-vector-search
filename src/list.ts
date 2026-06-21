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

console.log("FAQ Topics:\n");
faqs.forEach((faq, i) => {
  console.log(`  ${i + 1}. ${faq}`);
});
