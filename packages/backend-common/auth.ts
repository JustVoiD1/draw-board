import bcrypt from "bcryptjs"

export async function hashPassword(password: string){
    const hashedPassword = await bcrypt.hash(password, 10)
    return hashedPassword
}

export async function comparePassword(password: string, hashedPassword: string) {
    const isPasswordVerified = await bcrypt.compare(password, hashedPassword)

    return isPasswordVerified 
    
}