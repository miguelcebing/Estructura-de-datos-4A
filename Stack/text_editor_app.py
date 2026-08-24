# Importamos tkinter para crear la interfaz gráfica
import tkinter as tk
from tkinter import scrolledtext
from tkinter import ttk

# Importamos nuestra clase de pila desde el archivo separado
from text_editor_stack import TextEditorStack

# Clase principal de la aplicación de editor de texto con deshacer
class TextEditorApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Text Editor with Undo")
        self.root.geometry("600x400")
        
        # Creamos una instancia de nuestra pila
        self.history = TextEditorStack()
        
        # Variable para almacenar el texto actual
        self.current_text = ""
        
        # Configuramos la interfaz
        self.setup_ui()
    
    def setup_ui(self):
        # Etiqueta de instrucciones
        instruction_label = ttk.Label(self.root, text="Enter text and click 'Add Text':")
        instruction_label.pack(pady=5)
        
        # Campo de entrada para nuevo texto
        self.text_entry = ttk.Entry(self.root, width=50)
        self.text_entry.pack(pady=5)
        self.text_entry.focus()  # Enfoque inicial en el campo de entrada
        
        # Botón para agregar texto
        add_button = ttk.Button(self.root, text="Add Text", command=self.add_text)
        add_button.pack(pady=5)
        
        # Área de texto para mostrar el contenido
        self.text_display = scrolledtext.ScrolledText(self.root, width=70, height=15, wrap=tk.WORD)
        self.text_display.pack(pady=10, padx=10, fill=tk.BOTH, expand=True)
        
        # Botón para deshacer
        undo_button = ttk.Button(self.root, text="Undo", command=self.undo_text)
        undo_button.pack(pady=5)
        
        # Etiqueta para mostrar el tamaño de la pila
        self.status_label = ttk.Label(self.root, text="States in stack: 0")
        self.status_label.pack(pady=5)
    
    def add_text(self):
        # Obtiene el texto del campo de entrada
        new_text = self.text_entry.get()
        
        if new_text:  # Solo procesa si hay texto
            # Guarda el estado actual en la pila antes de modificarlo
            # Esto implementa el push usando append
            self.history.push(self.current_text)
            
            # Actualiza el texto actual añadiendo el nuevo texto
            if self.current_text:
                self.current_text += " " + new_text
            else:
                self.current_text = new_text
            
            # Actualiza la visualización
            self.text_display.delete(1.0, tk.END)
            self.text_display.insert(tk.END, self.current_text)
            
            # Limpia el campo de entrada
            self.text_entry.delete(0, tk.END)
            
            # Actualiza la etiqueta de estado
            self.status_label.config(text=f"States in stack: {self.history.size()}")
    
    def undo_text(self):
        # Verifica si hay estados para deshacer
        if not self.history.is_empty():
            # Recupera el último estado de la pila
            # Esto implementa el pop
            previous_state = self.history.pop()
            
            # Restaura el estado anterior
            self.current_text = previous_state if previous_state is not None else ""
            
            # Actualiza la visualización
            self.text_display.delete(1.0, tk.END)
            self.text_display.insert(tk.END, self.current_text)
            
            # Actualiza la etiqueta de estado
            self.status_label.config(text=f"States in stack: {self.history.size()}")
        else:
            # Si la pila está vacía, muestra mensaje
            self.status_label.config(text="No more states to undo")