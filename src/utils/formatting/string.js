export const containsOnlyNumbers = (str) => {
    return /^\d+$/.test(str);
}

// Password complexity - minimum eight characters, at least one letter and one number
export const validatePasswordComplexity = (str) => {
    return /^^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(str)
}


