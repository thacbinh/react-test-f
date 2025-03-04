import { useEffect } from "react";
import { useParams } from "react-router-dom";
import BookDetail from "./book/book.detail";

const BookPage = () => {
    let { id } = useParams();

    useEffect(() => {
        if (id) {
            //do something
            console.log("book id = ", id)
        }
    }, [id])
    return (
        <>
            <BookDetail />
        </>
    )
}
export default BookPage;