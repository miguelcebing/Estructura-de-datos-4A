import { PrintQueueManager } from "./PrintQueueManager";

// Instancia global del manager para acceder desde las funciones HTML
let manager: PrintQueueManager;

// Inicializar la aplicación cuando se cargue la página
function initializeApp() {
    manager = new PrintQueueManager();
    updateDisplay();
    showMessage("Sistema iniciado correctamente", "info");
}

// Actualizar todos los elementos de la interfaz
function updateDisplay() {
    updateStats();
    updatePrintQueue();
    updatePrintHistory();
}

// Actualizar las estadísticas
function updateStats() {
    document.getElementById("pendingCount").textContent = manager.getPendingCount().toString();
    document.getElementById("historyCount").textContent = manager.getHistoryCount().toString();
    document.getElementById("undoAvailable").textContent = manager.canUndo() ? "Sí" : "No";
}

// Actualizar la tabla de cola de impresión
function updatePrintQueue() {
    const jobs = manager.viewPrintQueue();
    const tbody = document.getElementById("printQueueBody");
    
    // Limpiar tabla
    tbody.innerHTML = "";
    
    if (jobs.length === 0) {
        const row = document.createElement("tr");
        const cell = document.createElement("td");
        cell.colSpan = 6;
        cell.textContent = "No hay trabajos pendientes";
        cell.style.textAlign = "center";
        row.appendChild(cell);
        tbody.appendChild(row);
        return;
    }
    
    jobs.forEach((job, index) => {
        const row = document.createElement("tr");
        
        const idCell = document.createElement("td");
        idCell.textContent = job.id;
        row.appendChild(idCell);
        
        const docCell = document.createElement("td");
        docCell.textContent = job.documentName;
        row.appendChild(docCell);
        
        const pagesCell = document.createElement("td");
        pagesCell.textContent = job.pages.toString();
        row.appendChild(pagesCell);
        
        const timeCell = document.createElement("td");
        timeCell.textContent = job.submitTime.toLocaleTimeString();
        row.appendChild(timeCell);
        
        const statusCell = document.createElement("td");
        statusCell.textContent = job.status;
        statusCell.className = `status-${job.status}`;
        row.appendChild(statusCell);
        
        tbody.appendChild(row);
    });
}

// Actualizar la tabla de historial
function updatePrintHistory() {
    const jobs = manager.viewPrintHistory();
    const tbody = document.getElementById("printHistoryBody");
    
    // Limpiar tabla
    tbody.innerHTML = "";
    
    if (jobs.length === 0) {
        const row = document.createElement("tr");
        const cell = document.createElement("td");
        cell.colSpan = 6;
        cell.textContent = "No hay historial disponible";
        cell.style.textAlign = "center";
        row.appendChild(cell);
        tbody.appendChild(row);
        return;
    }
    
    jobs.forEach((job, index) => {
        const row = document.createElement("tr");
        
        const idCell = document.createElement("td");
        idCell.textContent = job.id;
        row.appendChild(idCell);
        
        const docCell = document.createElement("td");
        docCell.textContent = job.documentName;
        row.appendChild(docCell);
        
        const pagesCell = document.createElement("td");
        pagesCell.textContent = job.pages.toString();
        row.appendChild(pagesCell);
        
        const timeCell = document.createElement("td");
        timeCell.textContent = job.submitTime.toLocaleString();
        row.appendChild(timeCell);
        
        const statusCell = document.createElement("td");
        statusCell.textContent = job.status;
        statusCell.className = `status-${job.status}`;
        row.appendChild(statusCell);
        
        tbody.appendChild(row);
    });
}

// Mostrar mensaje al usuario
function showMessage(message: string, type: "success" | "error" | "info" = "info") {
    const messageArea = document.getElementById("messageArea");
    messageArea.innerHTML = `<div class="message ${type}">${message}</div>`;
    
    // Limpiar mensaje después de 3 segundos
    setTimeout(() => {
        messageArea.innerHTML = "";
    }, 3000);
}

// Funciones de manejo de eventos del HTML

async function addPrintJob() {
    const documentName = (document.getElementById("documentName") as HTMLInputElement).value.trim();
    const pagesInput = (document.getElementById("pages") as HTMLInputElement).value;
    
    if (!documentName) {
        showMessage("Por favor ingrese un nombre de documento", "error");
        return;
    }
    
    const pages = parseInt(pagesInput, 10);
    if (isNaN(pages) || pages < 1) {
        showMessage("Por favor ingrese un número válido de páginas", "error");
        return;
    }
    
    try {
        const job = manager.addPrintJob(documentName, pages);
        showMessage(`Trabajo agregado: ${job.id}`, "success");
        // Limpiar formulario
        (document.getElementById("documentName") as HTMLInputElement).value = "";
        (document.getElementById("pages") as HTMLInputElement).value = "1";
        updateDisplay();
    } catch (error) {
        showMessage(`Error al agregar trabajo: ${error}`, "error");
    }
}

async function processNextJob() {
    try {
        const job = manager.processNextJob();
        if (!job) {
            showMessage("No hay trabajos pendientes para procesar", "info");
            return;
        }
        
        showMessage(`Trabajo procesado: ${job.id}`, "success");
        updateDisplay();
    } catch (error) {
        showMessage(`Error al procesar trabajo: ${error}`, "error");
    }
}

function cancelJob() {
    // En una implementación real, tendríamos una forma de seleccionar un trabajo
    // Por ahora, cancelaremos el primero en la cola o mostraremos un mensaje
    const jobs = manager.viewPrintQueue();
    if (jobs.length === 0) {
        showMessage("No hay trabajos pendientes para cancelar", "info");
        return;
    }
    
    // Cancelar el primer trabajo (en una UI real tendríamos selección)
    const jobId = jobs[0].id;
    try {
        const success = manager.cancelJob(jobId);
        if (success) {
            showMessage(`Trabajo cancelado: ${jobId}`, "success");
            updateDisplay();
        } else {
            showMessage(`No se pudo cancelar el trabajo: ${jobId}`, "error");
        }
    } catch (error) {
        showMessage(`Error al cancelar trabajo: ${error}`, "error");
    }
}

function undoLastAction() {
    try {
        const result = manager.undoLastAction();
        if (result === null) {
            showMessage("No hay acciones para deshacer", "info");
            return;
        }
        
        showMessage(result, "success");
        updateDisplay();
    } catch (error) {
        showMessage(`Error al deshacer acción: ${error}`, "error");
    }
}

// Inicializar cuando se cargue la página
document.addEventListener("DOMContentLoaded", initializeApp);

// Exportar funciones para que estén disponibles globalmente (para usar en onclick)
(window as any).addPrintJob = addPrintJob;
(window as any).processNextJob = processNextJob;
(window as any).cancelJob = cancelJob;
(window as any).undoLastAction = undoLastAction;
