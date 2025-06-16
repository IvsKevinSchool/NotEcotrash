
// Tipar un array de strings
// Type an array of strings
const languages: string[] = []

languages.push('JavaScript');


// Tipar un array de edades donde puede ser un string o un number
// Type an array of ages where it can be a string or a number 
const ages: (string | number)[] = []
ages.push(20);
ages.push('30');


// Tipar una matriz de objetos
// Type a matrix of objects
type CellValue = 'X' | 'O' | '';
type GameBoard = [
    [CellValue, CellValue, CellValue],
    [CellValue, CellValue, CellValue],
    [CellValue, CellValue, CellValue]
];
const board: GameBoard = [
    ['X', 'O', ''],
    ['', 'X', 'O'],
    ['O', '', 'X']
];