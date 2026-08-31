/**
 * Interface representing a print job
 */
export interface PrintJob {
  id: string;
  documentName: string;
  pages: number;
  submitTime: Date;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
}

/**
 * Type representing an action that can be undone
 */
export type UndoAction = {
  type: 'ADD_JOB' | 'PROCESS_JOB' | 'CANCEL_JOB';
  jobId: string;
  timestamp: Date;
};
