// Interfaces en typescript

interface Producto {
    id: number;
    name: string;
    price: number;
    qty: number;
    description?: string; // Propiedad opcional
}

interface Zapatilla extends Producto {
    color: string;
    talla: number;
}

interface ShoppingCart {
    productos: Producto[];
    total: number;
    addProducto(producto: Producto): void;
    removeProducto(id: number): void;
    calcularTotal(): number;
}

const car: ShoppingCart = {
    productos: [],
    total: 0,
    addProducto(producto: Producto): void {
        this.productos.push(producto);
        this.calcularTotal();
    },
    removeProducto(id: number): void {
        this.productos = this.productos.filter(p => p.id !== id);
        this.calcularTotal();
    },
    calcularTotal(): number {
        this.total = this.productos.reduce((acc, p) => acc + p.price * p.qty, 0);
        return this.total;
    }
}