// Objects.tsx

// Declaracion de un type usando typescript.
// Type declaration using TypeScript.
type Hero = {
    nombre: string;
    edad: number;
    poderes: string[];
}

// Declaracion de un objeto usando typescript.
// Object declaration using TypeScript.
let hero: Hero = {
    nombre: 'Juan',
    edad: 20,
    poderes: ['volar', 'super fuerza']
}

// Funcion que crea un objeto de tipo Hero.
// Function that creates an object of type Hero.
function createHero(nombre: string, edad: number, poderes: string[]): Hero {
    // Creacion de un objeto usando typescript.
    // Creating an object using TypeScript.
    return {
        nombre,
        edad,
        poderes,
    };
}

// Creacion de un objeto de tipo Hero usando la funcion createHero.
const thor = createHero('Thor', 1500, ['fuerza', 'control del rayo']);







// Declaracion de un type usando typescript con propiedades opcionales.
// Type declaration using TypeScript with optional properties.
type heroID = `${string}-${string}-${string}-${string}-${string}`; // Usando template literal types para crear un tipo de ID de héroe.

// Propieades opcionales en un objeto.
// Optional properties in an object.
type Villain = {
    readonly id: heroID; // Propiedad de solo lectura.
    nombre: string;
    edad: number;
    poderes?: string[]; // Esta propiedad es opcional.
}

// Creacion de un objeto de tipo Villain.
const loki: Villain = {
    id: crypto.randomUUID(),
    nombre: 'Loki',
    edad: 1000,
    // poderes: ['magia', 'ilusionismo'] // Esta propiedad es opcional, por lo que no es necesario incluirla.
};


// Ejemplo practico:
type HexadecimalColor = `#${string}`; // Tipo para representar colores hexadecimales.
type RGBColor = `rgb(${number}, ${number}, ${number})`; // Tipo para representar colores RGB.

type Color = HexadecimalColor | RGBColor; // Union de tipos para representar colores.

const color1: Color = '#FF5733'; // Color hexadecimal.
const color2: Color = 'rgb(255, 87, 51)'; // Color RGB.



// Intersection types para combinar tipos.
type Person = {
    nombre: string;
    edad: number;
};
type Contact = {
    email: string;
    telefono: string;
};
type PersonContact = Person & Contact; // Combina las propiedades de Person y Contact.

const juan: PersonContact = {
    nombre: 'Juan',
    edad: 30,
    email: '',
    telefono: '123-456-7890'
}