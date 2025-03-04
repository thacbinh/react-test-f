import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BookDetail from "./book/book.detail";
import { getBookDetailAPI } from "@/services/api";
import { App } from "antd";

const BookPage = () => {
    const { notification } = App.useApp();
    const [bookDetail, setBookDetail] = useState<IBookTable | null>(null);
    let { id } = useParams();

    useEffect(() => {
        if (id) {
            //do something
            console.log("book id = ", id)
            fetchBookDetail(id);
        }
    }, [id])

    const fetchBookDetail = async (id: string) => {
        const res = await getBookDetailAPI(id);
        if (res && res.data) {
            setBookDetail(res.data);
        } else {
            notification.error({
                message: 'Đã có lỗi xảy ra',
                description: res.message
            })
        }
    }
    return (
        <>
            <BookDetail
                bookDetail={bookDetail}
            />
        </>
    )
}
export default BookPage;