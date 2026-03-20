const ANSWER_AUTHOR = {
  "@type": "Person" as const,
  name: "Av. Kaan Karayaka | Yasal Haklarınız",
};

type QAPageSchemaProps = {
  questionName: string;
  questionText: string;
  dateCreated: string;
  questionUrl: string;
  /** Soruyu soran kişi (veritabanından). Yoksa "Vatandaş" kullanılır. */
  questionAuthorName?: string | null;
  /** Cevabı yazan (örn. Av. Kaan Karayaka | Yasal Haklarınız). Yoksa ANSWER_AUTHOR. */
  answerAuthorName?: string | null;
  acceptedAnswer?: { text: string; dateCreated?: string } | null;
};

/** Soru detay sayfası: QAPage (Question + Answer). */
export function QAPageSchema({
  questionName,
  questionText,
  dateCreated,
  questionUrl,
  questionAuthorName,
  answerAuthorName,
  acceptedAnswer,
}: QAPageSchemaProps) {
  const questionAuthor = {
    "@type": "Person" as const,
    name: questionAuthorName?.trim() || "Vatandaş",
  };
  const answerAuthorObj = {
    "@type": "Person" as const,
    name: answerAuthorName?.trim() || ANSWER_AUTHOR.name,
  };

  const schema = {
    "@context": "https://schema.org",
    "@type": "QAPage",
    mainEntity: {
      "@type": "Question",
      name: questionName,
      text: questionText,
      url: questionUrl,
      author: questionAuthor,
      upvoteCount: 0,
      answerCount: acceptedAnswer ? 1 : 0,
      dateCreated,
      ...(acceptedAnswer && {
        acceptedAnswer: {
          "@type": "Answer",
          text: acceptedAnswer.text,
          url: questionUrl,
          author: answerAuthorObj,
          upvoteCount: 0,
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
