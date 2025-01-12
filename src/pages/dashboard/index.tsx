
import { canSSRAuth } from "./../../utils/canSSRAuth";
import Head from "next/head";
import styles from "./styles.module.scss";

import { Header } from "./../../components/Header";
import { FiRefreshCcw } from "react-icons/fi";
import { setupAPIClient } from "./../../services/api";
import { api } from "@/services/apiClient";
import { useState } from "react";
import Modal from "react-modal";

import { ModalOrder } from "./../../components/ModalOrder"

type OrderProps = {
    id: string;
    table: string | number;
    status: boolean;
    draft: boolean;
    name: string | null;
    // createdAt: string,
    // updatedAt: string
}

interface HomeProps {
    orders: OrderProps[];
}

export type OrderItemProps = {
    id: string;
    amount: number;
    order_id: string;
    product_id: string;

    order: {
        id: string;
        table: number | string;
        status: boolean;
        draft: boolean;
        name: string | null;
    };

    product: {
        id: string;
        name: string;
        price: string;
        description: string;
        banner: string;
        category_id: string;
    }
}

export default function Dashboard({ orders }: HomeProps) {
    const [orderList, setOrderList] = useState(orders || [])

    const [modalItem, setModalItem] = useState<OrderItemProps[]>()
    const [modalVisible, setModalVisible] = useState(false)

    function handleCloseModal(){
        setModalVisible(false)
    }

    async function handleOpenModalView(id: string) {
        const response = await api.get("/order/detail", {
            params: {
                order_id: id
            }
        })

        setModalItem(response.data)
        setModalVisible(true)
    }

    Modal.setAppElement("#__next")

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
                            <FiRefreshCcw color="#3fffaf" size={25} />
                        </button>
                    </div>

                    <article className={styles.listOrders}>

                        {orderList.map((item) => (
                            <section key={item.id} className={styles.orderItem}>
                                <button onClick={() => handleOpenModalView(item.id)}>
                                    <div className={styles.tag}></div>
                                    <span>Mesa {item.table}</span>
                                </button>
                            </section>
                        ))}

                    </article>
                </main>

                {modalVisible && (
                    <ModalOrder />
                )}
            </div>
        </>
    )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
    const apiClient = setupAPIClient(ctx)

    const response = await apiClient.get("/orders")

    return {
        props: {
            orders: response.data
        }
    }
})