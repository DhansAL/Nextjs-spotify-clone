import { getProviders, signIn } from "next-auth/react"


function Login({ providers }) {
    return (
        <div>
            <h1>login page</h1>
        </div>
    )
}

export default Login

export async function getServerProviderProps() {
    const providers = await getProviders();
    return {
        props: {
            providers
        }
    }
}
