export interface questionInterfaceType {
  key: "open-modal" | "generate" | "start";
  // Translation key under "questions.actions"
  title: "add" | "generate" | "start";
  icon: React.ReactNode;
  styles?: string;
  disabled?: boolean;
}
