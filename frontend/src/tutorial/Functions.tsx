// Functions.tsx


// Declaracion de una variable usando typescript.
// Variable declaration with TypeScript.
const person_name: string = "Juan";

// Declaracion de una funcion que recibe un parametro y retorna un string.
// Function declaration that takes a parameter and returns a string.
function saludar(nombre: string): string {
    return `Hola, ${nombre}`;
}

function saludarConEdad({ nombre, edad }: { nombre: string, edad: number }): string {
    // Desestructuracion de un objeto en el parametro de la funcion.
    // Destructuring an object in the function parameter.
    return `Hola, ${nombre}, tienes ${edad} años`;
}

saludarConEdad({ nombre: "Juan", edad: 20 });

// Primera forma de tipar una funcion con un objecto de parametro.
// First way to type a function with an object parameter.
function saludarPersona(persona: { nombre: string, edad: number }): string {
    return `Hola, ${persona.nombre}, tienes ${persona.edad} años`;
}


// Segunda forma de tipar una funcion con un objecto de parametro usando una interface.
// Second way to type a function with an object parameter using an interface.
interface Persona {
    nombre: string;
    edad: number;
}
function saludarPersonaConInterface(persona: Persona): string {
    return `Hola, ${persona.nombre}, tienes ${persona.edad} años`;
}

// Tercera forma de tipar una funcion con un objecto de parametro usando un type.
// Third way to type a function with an object parameter using a type.
type PersonaType = {
    nombre: string;
    edad: number;
}
function saludarPersonaConType(persona: PersonaType): string {
    return `Hola, ${persona.nombre}, tienes ${persona.edad} años`;
}

// Cuarta forma de tipar una funcion con un objecto de parametro usando un type y una funcion.
// Fourth way to type a function with an object parameter using a type and a function.
type PersonaConFuncion = {
    nombre: string;
    edad: number;
    saludar: () => string;
}
function saludarPersonaConFuncion(persona: PersonaConFuncion): string {
    return `Hola, ${persona.nombre}, tienes ${persona.edad} años. Tu saludo es: ${persona.saludar()}`;
}