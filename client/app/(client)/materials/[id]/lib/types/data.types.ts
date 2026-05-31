export interface materialInterfaceType {
  key: number;
  name: string;
  icon: React.ReactNode;
}

export interface assessmentInterfaceType {
  key: "open-modal" | "generate" | "start";
  title: string;
  icon: React.ReactNode;
  styles?: string;
}
