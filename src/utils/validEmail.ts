const isValidEmail = (email: string) => {
    //Regex to check valid email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export default isValidEmail;