export async function SignIn(formData: FormData) {
    'use server'
    const email = formData.get('email')
    const password = formData.get('password')
    console.log('Signed in: ', {email, password})
}
export async function SignUp(formData: FormData) {
    'use server'
    const email = formData.get('email')
    const password = formData.get('password')
    console.log('Signed up: ', {email, password})
}

const AuthPage = ({isSignIn}: {isSignIn: boolean}) => {



    return (
        <div className='w-screen h-screen flex justify-center items-center bg-background text-foreground'>

            <div className='p-2 m-2 rounded-md border border-white'>
                <form action={isSignIn ? SignIn : SignUp} className="flex flex-col gap-3 bg-background">
            <input type="text" name="email" id="email" placeholder="Email"/>
            <input type="text" name="password" id="password" placeholder="Password"/>
            <button className='bg-blue-600' type="submit">{isSignIn ? 'Sign in' : 'Sign up'}</button>
                </form>
            </div>
        </div>
    )
}

export default AuthPage