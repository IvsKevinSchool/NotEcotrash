/**
 * Genera una contraseña temporal segura
 * @returns string - Contraseña temporal de 12 caracteres
 */
export const generateTempPassword = (): string => {
    const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789@#$%';
    let password = '';
    
    // Asegurar que tenga al menos una mayúscula, una minúscula, un número y un símbolo
    const upperCase = 'ABCDEFGHJKMNPQRSTUVWXYZ';
    const lowerCase = 'abcdefghijkmnpqrstuvwxyz';
    const numbers = '23456789';
    const symbols = '@#$%';
    
    password += upperCase[Math.floor(Math.random() * upperCase.length)];
    password += lowerCase[Math.floor(Math.random() * lowerCase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += symbols[Math.floor(Math.random() * symbols.length)];
    
    // Completar los 8 caracteres restantes
    for (let i = 4; i < 12; i++) {
        password += chars[Math.floor(Math.random() * chars.length)];
    }
    
    // Mezclar la contraseña
    return password.split('').sort(() => Math.random() - 0.5).join('');
};

/**
 * Constante para contraseña temporal predeterminada (alternativa más simple)
 */
export const DEFAULT_TEMP_PASSWORD = 'TempPass123!';
