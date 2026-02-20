type QAPageSchemaProps = {
  questionName: string;
  questionText: string;
  dateCreated: string;
  acceptedAnswer?: { text: string; dateCreated?: string } | null;
};

/** Soru detay sayfası: QAPage (Question + Answer). */
export function QAPageSchema({
  questionName,
  questionText,
  dateCreated,
  acceptedAnswer,
}: QAPageSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "QAPage",
    mainEntity: {
      "@type": "Question",
      name: questionName,
      text: questionText,
      answerCount: acceptedAnswer ? 1 : 0,
      dateCreated,
      ...(acceptedAnswer && {
        acceptedAnswer: {
          "@type": "Answer",
          text: acceptedAnswer.text,
          ...(acceptedAnswer.dateCreated && { dateCreated: acceptedAnswer.dateCreated }),
        },
      }),
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
