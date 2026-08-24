# Implementación de una pila (stack) para funcionalidad de deshacer en editor de texto
class TextEditorStack:
    def __init__(self):
        # Inicializa una lista vacía para almacenar los estados del texto
        self.stack = []
    
    # Agrega un estado a la pila (equivalente a push)
    # Usa el método append de listas
    def push(self, state):
        self.stack.append(state)
    
    # Elimina y devuelve el último estado de la pila (equivalente a pop)
    # Usa el método pop de listas
    def pop(self):
        if not self.is_empty():
            return self.stack.pop()
        return None
    
    # Devuelve el último estado sin eliminarlo (peek)
    # Usa el índice -1 para acceder al último elemento
    def peek(self):
        if not self.is_empty():
            return self.stack[-1]
        return None
    
    # Verifica si la pila está vacía
    # Usa len() para obtener el tamaño
    def is_empty(self):
        return len(self.stack) == 0
    
    # Devuelve el número de elementos en la pila
    # Usa len() para obtener el tamaño
    def size(self):
        return len(self.stack)