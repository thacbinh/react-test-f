import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BookDetail from "./book/book.detail";
import { getBookDetailAPI } from "@/services/api";
import { App } from "antd";
import BookLoader from "./book/book.loader";

const BookPage = () => {
    const { notification } = App.useApp();
    const [bookDetail, setBookDetail] = useState<IBookTable | null>(null);
    let { id } = useParams();

    const [isLoadingBook, setIsLoadingBook] = useState<boolean>(true);

    useEffect(() => {
        if (id) {
            //do something
            console.log("book id = ", id)
            fetchBookDetail(id);
        }
    }, [id])

    const fetchBookDetail = async (id: string) => {
        setIsLoadingBook(true);
        const res = await getBookDetailAPI(id);
        if (res && res.data) {
            setBookDetail(res.data);
        } else {
            notification.error({
                message: 'Đã có lỗi xảy ra',
                description: res.message
            })
        }
        setIsLoadingBook(false);
    }
    return (
        <>
            {isLoadingBook ?
                <BookLoader />
                :
                <BookDetail
                    bookDetail={bookDetail}
                />
            }
        </>
    )
}
export default BookPage;