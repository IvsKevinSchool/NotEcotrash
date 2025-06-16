
// Enums for error handling in a frontend application
const enum ERROR_TYPES {
    NETWORK_ERROR = "Network Error",
    SERVER_ERROR = "Server Error",
    NOT_FOUND = "Not Found",
    UNAUTHORIZED = "Unauthorized",
    FORBIDDEN = "Forbidden",
    BAD_REQUEST = "Bad Request",
    TIMEOUT = "Timeout"
}

// Usage example
function displayError(error: ERROR_TYPES): void {
        switch (error) {
        case ERROR_TYPES.NETWORK_ERROR:
            console.error("There was a problem connecting to the network.");
            break;
        case ERROR_TYPES.SERVER_ERROR:
            console.error("The server encountered an error.");
            break;
        case ERROR_TYPES.NOT_FOUND:
            console.error("The requested resource was not found.");
            break;
        case ERROR_TYPES.UNAUTHORIZED:
            console.error("You are not authorized to access this resource.");
            break;
        case ERROR_TYPES.FORBIDDEN:
            console.error("Access to this resource is forbidden.");
            break;
        case ERROR_TYPES.BAD_REQUEST:
            console.error("The request was invalid or cannot be served.");
            break;
        case ERROR_TYPES.TIMEOUT:
            console.error("The request timed out.");
            break;
        default:
            console.error("An unknown error occurred.");
    }    
}