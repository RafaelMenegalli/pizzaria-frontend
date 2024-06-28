import { createContext, ReactNode, useState, useEffect } from 'react'
import { destroyCookie, setCookie, parseCookies } from 'nookies'
import Router from 'next/router'

import { api } from './../services/apiClient'
import { toast } from 'react-toastify'

type AuthContextData = {
    user?: UserProps;
    isAuthenticated: boolean;
    signIn: (credenltials: SignInProps) => Promise<void>
    signOut: () => void
    signUp: (credenltials: SignUpProps) => Promise<void>
}

type UserProps = {
    id: string;
    name: string;
    email: string;
}

type SignInProps = {
    email: string;
    password: string;
}

type AuthProviderProps = {
    children: ReactNode
}

type SignUpProps = {
    name: string;
    email: string;
    password: string;
}

export const AuthContext = createContext({} as AuthContextData)

export function signOut() {
    try {
        destroyCookie(undefined, '@nextauth.token')
        Router.push("/")
    } catch {

    }
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<UserProps>()
    const isAuthenticated = !!user

    useEffect(() => {
        const { '@nextauth.token': token } = parseCookies()

        if (token) {
            api.get("/me")
                .then(response => {
                    const { id, name, email } = response.data

                    setUser({
                        id,
                        name,
                        email
                    })
                }).catch(() => {
                    signOut()
                })
        }
    }, [])

    async function signIn({ email, password }: SignInProps) {
        try {
            const response = await api.post("/session", {
                email,
                password
            })

            const { id, name, token } = response.data

            setCookie(undefined, '@nextauth.token', token, {
                maxAge: 60 * 60 * 24 * 30,
                path: '/'
            })

            setUser({
                id,
                name,
                email
            })

            //Passar para as procimas requisiç~es  token
            api.defaults.headers['Authorization'] = `Bearer ${token}`

            toast.success("Logado com sucesso!")

            Router.push('/dashboard')
        } catch (error) {
            toast.error("Erro ao logar!")
            console.log("ERRO AO ACESSAR :::>> ", error)
        }
    }

    async function signUp({ name, email, password }: SignUpProps) {
        try {
            const response = await api.post('/users', {
                name,
                email,
                password
            })

            console.log("USUÁRIO CADASTRADO COM SUCESSO :::>> ", response.data)

            toast.success("Usuário cadastrado com sucesso!")

            Router.push("/")
        } catch (error) {
            toast.error("Erro ao cadastrar usuário!")
            console.log("ERRRO AO CADASTRAR USUÁRIO ::::>> ", error)
        }
    }

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, signIn, signOut, signUp }}>
            {children}
        </AuthContext.Provider>
    )
}