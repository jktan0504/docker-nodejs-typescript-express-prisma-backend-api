import bcrypt from 'bcryptjs';

export const hashedPassword = async (passwordText: string) => {
    try {
        return await bcrypt.hash(passwordText, 10);
    } catch (error) {
        return {
            error: `bcryptjs:${error as unknown as string}`,
        };
    }
};

export const checkComparePassword = async (
    hashPassword: string,
    passwordText: string,
) => {
    try {
        return await bcrypt.compare(hashPassword, passwordText);
    } catch (error) {
        console.log(error);
        return false;
    }
};
