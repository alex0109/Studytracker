export interface questionInterfaceType {
  key: "open-modal" | "generate" | "start";
  title: string;
  icon: React.ReactNode;
  styles?: string;
  disabled?: boolean;
}
