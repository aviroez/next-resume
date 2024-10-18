import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret-key';

export function generatePassword(password: string) {
    return bcrypt.hash(password, 10).then(
        function(hash: string){
            return hash
        }
    );
}


export function checkPassword(password: string, hashedPassword: string) {
    return bcrypt.compare(password, hashedPassword).then(
        function(result: boolean){
            return result
        }
    );
}

export const generateToken = (userId: number) => {
    return jwt.sign({ userId: userId }, JWT_SECRET, { expiresIn: '1h' });
};

export const verifyToken = (token: string) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
};