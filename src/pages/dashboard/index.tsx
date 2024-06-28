
import { canSSRAuth } from "./../../utils/canSSRAuth";
import Head from "next/head";
import styles from "./styles.module.scss";

import { Header } from "./../../components/Header";
import { FiRefreshCcw } from "react-icons/fi"

export default function Dashboard(){
    return (
        <>
            <Head>
                <title>Painel - Sujeito Pizzaria</title>
            </Head>
            <div>
                <Header />
                <main className={styles.container}>
                    <div className={styles.containerHeader}>
                        <h1>Últimos Pedidos</h1>
                        <button>
                            <FiRefreshCcw color="#3fffaf" size={25}/>
                        </button>
                    </div>

                    <article className={styles.listOrders}>
                        <section className={styles.orderItem}>
                            <button>
                                <div className={styles.tag}></div>
                                <span>Mesa 22</span>
                            </button>
                        </section>
                    </article>
                </main>
            </div>
        </>
    )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {


    return {
        props: {}
    }
})