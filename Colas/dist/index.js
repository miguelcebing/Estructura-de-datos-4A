"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PrintQueueManager_1 = require("./PrintQueueManager");
/**
 * Main application class providing a CLI interface for the print job management system
 */
class PrintJobApp {
    constructor() {
        this.manager = new PrintQueueManager_1.PrintQueueManager();
    }
    /**
     * Display the main menu options
     */
    displayMenu() {
        console.log("\n=== Print Job Management System ===");
        console.log("1. Add new print job");
        console.log("2. View pending print queue");
        console.log("3. Process next print job");
        console.log("4. View print history");
        console.log("5. Cancel a print job");
        console.log("6. Undo last action");
        console.log("7. Exit");
        console.log("===================================");
    }
    /**
     * Prompt the user for input and return their choice
     */
    getUserChoice() {
        const readline = require('readline').createInterface({
            input: process.stdin,
            output: process.stdout
        });
        return new Promise((resolve) => {
            readline.question("Enter your choice: ", (answer) => {
                readline.close();
                resolve(answer);
            });
        });
    }
    /**
     * Add a new print job based on user input
     */
    async addPrintJob() {
        const readline = require('readline').createInterface({
            input: process.stdin,
            output: process.stdout
        });
        const documentName = await new Promise((resolve) => {
            readline.question("Enter document name: ", (answer) => resolve(answer));
        });
        let pages;
        while (true) {
            const pagesInput = await new Promise((resolve) => {
                readline.question("Enter number of pages: ", (answer) => resolve(answer));
            });
            pages = parseInt(pagesInput, 10);
            if (!isNaN(pages) && pages > 0) {
                break;
            }
            console.log("Please enter a valid positive number for pages.");
        }
        readline.close();
        const job = this.manager.addPrintJob(documentName, pages);
        console.log(`\nAdded print job: ${job.id} - "${job.documentName}" (${job.pages} pages)`);
    }
    /**
     * Display the current print queue
     */
    viewPrintQueue() {
        const jobs = this.manager.viewPrintQueue();
        if (jobs.length === 0) {
            console.log("\nNo pending print jobs.");
            return;
        }
        console.log("\n=== Pending Print Queue (FIFO Order) ===");
        jobs.forEach((job, index) => {
            console.log(`${index + 1}. [${job.id}] ${job.documentName} - ${job.pages} pages`);
            console.log(`   Submitted: ${job.submitTime.toLocaleTimeString()} | Status: ${job.status}`);
        });
        console.log(`\nTotal pending jobs: ${jobs.length}`);
    }
    /**
     * Process the next print job in the queue
     */
    async processNextJob() {
        const job = this.manager.processNextJob();
        if (!job) {
            console.log("\nNo pending print jobs to process.");
            return;
        }
        console.log(`\nProcessing print job: ${job.id} - "${job.documentName}"`);
        console.log(`Pages: ${job.pages}`);
        console.log(`Status: ${job.status}`);
        console.log(`Completed at: ${new Date().toLocaleTimeString()}`);
    }
    /**
     * Display the print history
     */
    viewPrintHistory() {
        const jobs = this.manager.viewPrintHistory();
        if (jobs.length === 0) {
            console.log("\nNo print history available.");
            return;
        }
        console.log("\n=== Print History (Most Recent First) ===");
        jobs.forEach((job, index) => {
            console.log(`${index + 1}. [${job.id}] ${job.documentName} - ${job.pages} pages`);
            console.log(`   Submitted: ${job.submitTime.toLocaleString()} | Status: ${job.status}`);
        });
        console.log(`\nTotal printed jobs: ${jobs.length}`);
    }
    /**
     * Cancel a print job based on user input
     */
    async cancelJob() {
        const readline = require('readline').createInterface({
            input: process.stdin,
            output: process.stdout
        });
        const jobId = await new Promise((resolve) => {
            readline.question("Enter job ID to cancel: ", (answer) => resolve(answer.trim()));
        });
        readline.close();
        const success = this.manager.cancelJob(jobId);
        if (success) {
            console.log(`\nJob ${jobId} has been cancelled.`);
        }
        else {
            console.log(`\nJob ${jobId} not found in the print queue.`);
        }
    }
    /**
     * Undo the last action
     */
    undoLastAction() {
        const result = this.manager.undoLastAction();
        if (result === null) {
            console.log("\nNo actions to undo.");
            return;
        }
        console.log(`\n${result}`);
    }
    /**
     * Run the main application loop
     */
    async run() {
        console.log("Welcome to the Print Job Management System!");
        console.log("This system demonstrates queues (FIFO) for job processing");
        console.log("and stacks (LIFO) for history and undo functionality.\n");
        while (true) {
            this.displayMenu();
            const choice = await this.getUserChoice();
            switch (choice) {
                case '1':
                    await this.addPrintJob();
                    break;
                case '2':
                    this.viewPrintQueue();
                    break;
                case '3':
                    await this.processNextJob();
                    break;
                case '4':
                    this.viewPrintHistory();
                    break;
                case '5':
                    await this.cancelJob();
                    break;
                case '6':
                    this.undoLastAction();
                    break;
                case '7':
                    console.log("\nThank you for using the Print Job Management System!");
                    return;
                default:
                    console.log("\nInvalid choice. Please try again.");
            }
        }
    }
}
// Start the application
const app = new PrintJobApp();
app.run().catch(console.error);
