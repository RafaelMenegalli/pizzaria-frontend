import styles from "./styles.module.scss";
import Head from "next/head";
import { Header } from "./../../components/Header";
import { canSSRAuth } from "./../../utils/canSSRAuth";
import { FiUpload } from "react-icons/fi";

import { useState, ChangeEvent, FormEvent } from "react";
import { toast } from "react-toastify";
import { setupAPIClient } from "./../../services/api"

type ItemProps = {
    id: string,
    name: string
}

interface CategoryProps {
    categoryList: ItemProps[]
}

export default function Product({ categoryList }: CategoryProps) {

    const [name, setName] = useState('')
    const [price, setPrice] = useState('')
    const [description, setDescription] = useState('')

    const [categories, setCategories] = useState(categoryList || [])
    const [categorySelected, setCategorySelected] = useState<number>(0)

    const [avatarUrl, setAvatarUrl] = useState('')
    const [imageAvatar, setImageAvatar] = useState<File | null>(null)

    function handleChangeCategory(e: ChangeEvent<HTMLSelectElement>) {
        setCategorySelected(Number(e.target.value))
    }

    function handleFile(event: ChangeEvent<HTMLInputElement>) {
        if (!event.target.files) {
            return;
        }

        const image = event.target.files[0]

        if (!image) {
            return;
        }

        if (image.type === 'image/jpeg' || image.type === 'image/png') {
            setImageAvatar(image)
            setAvatarUrl(URL.createObjectURL(image))
        } else {
            toast.warning("Apenas imagens do tipo PNG/JPG são aceitos!")
        }
    }

    async function handleRegister(event: FormEvent) {
        event.preventDefault()

        try {
            const data = new FormData()

            if (name === '' || price === '' || description === '' || imageAvatar === null) {
                toast.warning("Preencha todos os campos!")
                return;
            }

            data.append("name", name)
            data.append("price", price)
            data.append("description", description)
            data.append("file", imageAvatar)
            data.append("category_id", categories[categorySelected].id)

            const apiClient = setupAPIClient()

            await apiClient.post("/product", data)

            toast.success("Produto cadastrado com sucesso!")
        } catch (err) {
            console.log("Erro no cadastro de produto!")
            toast.error("Erro ao cadastrar produto")
        }

        setName('')
        setPrice('')
        setDescription('')
        setImageAvatar(null)
        setAvatarUrl('')
    }

    return (
        <>
            <Head>
                <title>Novo Produto - Sujeito Pizza</title>
            </Head>
            <div>
                <Header />

                <main className={styles.container}>
                    <h1>Novo Produto</h1>

                    <form className={styles.form} onSubmit={handleRegister}>

                        <label className={styles.labelAvatar}>
                            <span><FiUpload size={30} color="#FFF" /></span>

                            <input type="file" accept="image/png, image/jpeg" onChange={handleFile} />

                            {avatarUrl && (
                                <img
                                    className={styles.preview}
                                    src={avatarUrl}
                                    alt="Foto do Produto"
                                    width={250}
                                    height={250} />
                            )}

                        </label>

                        <select value={categorySelected} onChange={handleChangeCategory}>
                            {categories.map((item, index) => {
                                return (
                                    <option value={index} key={item.id}>{item.name}</option>
                                )
                            })}
                        </select>

                        <input
                            type="text"
                            placeholder="Digite o nome do produto"
                            className={styles.input}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />

                        <input
                            type="text"
                            placeholder="Preço do produto"
                            className={styles.input}
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                        />

                        <textarea
                            placeholder="Descreva seu produto..."
                            className={styles.input}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />

                        <button className={styles.buttonAdd} type="submit">
                            Cadastrar
                        </button>

                    </form>
                </main>
            </div>
        </>
    )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
    const apiClient = setupAPIClient(ctx)

    const response = await apiClient.get('/category');

    return {
        props: {
            categoryList: response.data
        }
    }
})