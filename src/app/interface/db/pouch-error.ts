export interface PouchError {
  docId: string;
  error: boolean;
  message: string;
  name: string;
  reason: string;
  status: number;
}
