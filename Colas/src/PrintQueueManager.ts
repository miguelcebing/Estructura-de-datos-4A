import { Queue } from "./Queue";
import { Stack } from "./Stack";
import { PrintJob, UndoAction } from "./PrintJob";

/**
 * Manages print jobs using queues for processing and stacks for history/undo functionality
 */
export class PrintQueueManager {
  private printQueue: Queue<PrintJob>;
  private printHistory: Stack<PrintJob>;
  private undoHistory: Stack<UndoAction>;
  private jobCounter: number;

  constructor() {
    this.printQueue = new Queue<PrintJob>();
    this.printHistory = new Stack<PrintJob>();
    this.undoHistory = new Stack<UndoAction>();
    this.jobCounter = 1;
  }

  /**
   * Add a new print job to the queue
   * @param documentName - Name of the document to print
   * @param pages - Number of pages to print
   * @returns The created print job
   */
  addPrintJob(documentName: string, pages: number): PrintJob {
    const job: PrintJob = {
      id: `JOB-${this.jobCounter++}`,
      documentName,
      pages,
      submitTime: new Date(),
      status: 'pending'
    };

    this.printQueue.enqueue(job);
    
    // Record action for undo
    const action: UndoAction = {
      type: 'ADD_JOB',
      jobId: job.id,
      timestamp: new Date()
    };
    this.undoHistory.push(action);

    return job;
  }

  /**
   * Process the next print job in the queue (FIFO)
   * @returns The processed print job or null if queue is empty
   */
  processNextJob(): PrintJob | null {
    if (this.printQueue.isEmpty()) {
      return null;
    }

    const job = this.printQueue.dequeue();
    if (!job) return null;

    // Update job status
    job.status = 'processing';
    
    // Simulate processing time (in a real system, this would be asynchronous)
    // For simplicity, we'll immediately mark as completed
    job.status = 'completed';
    
    // Add to history stack (most recent first, using arrays for assignment
    this.printHistory.push(job);
    
    // Record action for undo
    const action: UndoAction = {
      type: 'PROCESS_JOB',
      jobId: job.id,
      timestamp: new Date()
    };
    this.undoHistory.push(action);

    return job;
  }

  /**
   * Cancel a specific print job by ID
   * @param jobId - ID of the job to cancel
   * @returns true if job was found and cancelled, false otherwise
   */
  cancelJob(jobId: string): boolean {
    // We need to search through the queue to find the job
    const items = this.printQueue.toArray();
    const index = items.findIndex(job => job.id === jobId);
    
    if (index === -1) {
      return false; // Job not found
    }

    // Remove the job from the queue
    const jobToCancel = items.splice(index, 1)[0];
    
    // Rebuild the queue without the cancelled job
    this.printQueue.clear();
    items.forEach(job => this.printQueue.enqueue(job));
    
    // Update job status
    jobToCancel.status = 'cancelled';
    
    // Add to history
    this.printHistory.push(jobToCancel);
    
    // Record action for undo
    const action: UndoAction = {
      type: 'CANCEL_JOB',
      jobId: jobId,
      timestamp: new Date()
    };
    this.undoHistory.push(action);

    return true;
  }

  /**
   * View the current print queue (without removing jobs)
   * @returns Array of print jobs in the queue (front to back)
   */
  viewPrintQueue(): PrintJob[] {
    return this.printQueue.toArray();
  }

  /**
   * View print history (most recent first)
   * @returns Array of printed jobs (most recent first)
   */
  viewPrintHistory(): PrintJob[] {
    return this.printHistory.toArray();
  }

  /**
   * Undo the last action
   * @returns Description of what was undone or null if nothing to undo
   */
  undoLastAction(): string | null {
    if (this.undoHistory.isEmpty()) {
      return null;
    }

    const action = this.undoHistory.pop();
    if (!action) return null;

    switch (action.type) {
      case 'ADD_JOB':
        // Undo adding a job by removing it from queue
        const items = this.printQueue.toArray();
        const index = items.findIndex(job => job.id === action.jobId);
        if (index !== -1) {
          items.splice(index, 1);
          this.printQueue.clear();
          items.forEach(job => this.printQueue.enqueue(job));
        }
        return `Undid addition of job ${action.jobId}`;
        
      case 'PROCESS_JOB':
        // Undo processing a job by moving it back to queue
        const historyItems = this.printHistory.toArray();
        const historyIndex = historyItems.findIndex(job => job.id === action.jobId);
        if (historyIndex !== -1) {
          const jobToRestore = historyItems.splice(historyIndex, 1)[0];
          jobToRestore.status = 'pending'; // Reset status
          this.printHistory.clear();
          historyItems.forEach(job => this.printHistory.push(job));
          this.printQueue.enqueue(jobToRestore);
        }
        return `Undid processing of job ${action.jobId}`;
        
      case 'CANCEL_JOB':
        // Undo cancelling a job by restoring it to queue
        const historyItems2 = this.printHistory.toArray();
        const historyIndex2 = historyItems2.findIndex(job => job.id === action.jobId);
        if (historyIndex2 !== -1) {
          const jobToRestore = historyItems2.splice(historyIndex2, 1)[0];
          jobToRestore.status = 'pending'; // Reset status
          this.printHistory.clear();
          historyItems2.forEach(job => this.printHistory.push(job));
          this.printQueue.enqueue(jobToRestore);
        }
        return `Undid cancellation of job ${action.jobId}`;
        
      default:
        return `Undid unknown action ${action.type}`;
    }
  }

  /**
   * Get the number of pending print jobs
   * @returns Number of jobs in the print queue
   */
  getPendingCount(): number {
    return this.printQueue.size();
  }

  /**
   * Get the number of printed jobs in history
   * @returns Number of jobs in print history
   */
  getHistoryCount(): number {
    return this.printHistory.size();
  }

  /**
   * Check if there are actions that can be undone
   * @returns true if there are actions in the undo history
   */
  canUndo(): boolean {
    return !this.undoHistory.isEmpty();
  }
}
