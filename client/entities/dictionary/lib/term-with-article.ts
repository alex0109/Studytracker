// The same as plain text, for titles and labels
export const termWithArticle = ({ term, article }: { term: string; article?: string | null }) =>
  article ? `${article} ${term}` : term;
