export interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  isPlaceholder: boolean;
}
