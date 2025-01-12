import Image from 'next/image'
import Head from 'next/head'
import Link from 'next/link'
import { FormEvent, useState, useContext } from 'react'

import { Button } from './../../components/ui/Button'
import { Input } from './../../components/ui/Input'
import styles from './../../styles/home.module.scss'
import logoImg from './../../../public/logo.svg'

import { AuthContext } from "./../../contexts/AuthContext"
import { toast } from 'react-toastify'

export default function Signup() {
  const { signUp } = useContext(AuthContext)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [loading, setLoading] = useState(false)

  async function handleSingUp(event: FormEvent){
    event.preventDefault();

    if(name === '' || email === '' || password === ''){
      toast.warning("Preencha todos os campos para continuar!")
      return;
    }

    setLoading(true)

    let data = {
      name,
      email,
      password
    }

    await signUp(data)

    setLoading(false)
  }

  return (
    <>
      <Head>
        <title>Faça seu cadastro agora</title>
      </Head>
      <div className={styles.containerCenter}>
        <Image src={logoImg} alt="Logo Sujeito Pizzaria" />

        <div className={styles.login}>
            <h1>Criando sua conta</h1>
          <form onSubmit={handleSingUp}>
            <Input 
            placeholder='Digite seu nome' 
            type='text' 
            value={name}
            onChange={(e) => {setName(e.target.value)}}
            />
            <Input 
            placeholder='Digite seu email' 
            type='text'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            />
            <Input 
            placeholder='Sua senha' 
            type='password' 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            />

            <Button
              type={'submit'}
              loading={loading}
            >
              Cadastrar
            </Button>
          </form>

          <Link href="/" className={styles.text}>
            Já pussui uma conta? Faça login
          </Link>
        </div>
      </div>

    </>
  );
}