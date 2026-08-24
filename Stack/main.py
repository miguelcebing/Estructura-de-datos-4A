# Punto de entrada de la aplicación
import os
import sys

# Añadir el directorio donde se encuentra este script al path de Python
# Esto permite que los imports funcionen independientemente desde dónde se ejecute el script
script_dir = os.path.dirname(os.path.abspath(__file__))
if script_dir not in sys.path:
    sys.path.append(script_dir)

# Ahora importamos tkinter y la clase principal de la aplicación
import tkinter as tk
from text_editor_app import TextEditorApp

if __name__ == "__main__":
    # Crear la ventana principal
    root = tk.Tk()
    # Crear la aplicación
    app = TextEditorApp(root)
    # Iniciar el bucle principal de la interfaz
    root.mainloop()