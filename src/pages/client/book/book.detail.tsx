import { Row, Col, Rate, Divider, message, App, Breadcrumb } from 'antd';
import ImageGallery from 'react-image-gallery';
import { useEffect, useRef, useState } from 'react';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { BsCartPlus } from 'react-icons/bs';
import 'styles/book.scss';
import ModalGallery from './modal.gallery';
import { useCurrentApp } from '@/components/context/app.context';
import { Link, useNavigate } from 'react-router-dom';

interface IProps {
    bookDetail: IBookTable | null;
}
const BookDetail = (props: IProps) => {

    const { bookDetail } = props;

    const [isOpenModalGallery, setIsOpenModalGallery] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    const refGallery = useRef<ImageGallery>(null);

    const [images, setImage] = useState<any[]>([]);

    const [order, setOrder] = useState<number>(1);

    const { setCarts, user } = useCurrentApp();
    const { message } = App.useApp();

    const navigate = useNavigate();

    const [imageGallery, setImageGallery] = useState<{
        original: string;
        thumbnail: string;
        originalClass: string;
        thumbnailClass: string;
    }[]>([])

    useEffect(() => {
        if (bookDetail) {
            //build images 
            const images = [];
            if (bookDetail.thumbnail) {
                images.push(
                    {
                        original: `${import.meta.env.VITE_BACKEND_URL}/images/book/${bookDetail.thumbnail}`,
                        thumbnail: `${import.meta.env.VITE_BACKEND_URL}/images/book/${bookDetail.thumbnail}`,
                        originalClass: "original-image",
                        thumbnailClass: "thumbnail-image"
                    },
                )
            }
            if (bookDetail.slider) {
                bookDetail.slider?.map(item => {
                    images.push(
                        {
                            original: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
                            thumbnail: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
                            originalClass: "original-image",
                            thumbnailClass: "thumbnail-image"
                        },
                    )
                })
            }
            setImageGallery(images)
        }
    }, [bookDetail])

    const handleOnClickImage = () => {
        //get current index onClick
        setIsOpenModalGallery(true);
        setCurrentIndex(refGallery?.current?.getCurrentIndex() ?? 0)
    }

    const handleAddToCart = (isBuyNow = false) => {
        if (!user) {
            message.error("Bạn cần đăng nhập để thực hiện tính năng này.")
            return;
        }

        const cartStorage = localStorage.getItem('carts');
        if (cartStorage && bookDetail) {
            //update cart
            const carts = JSON.parse(cartStorage) as ICart[];

            const findIndex = carts.findIndex((item) => item._id === bookDetail?._id);
            if (findIndex > -1) {
                carts[findIndex].quantity = carts[findIndex].quantity + order;
            } else {
                carts.push({
                    _id: bookDetail._id,
                    quantity: order,
                    detail: bookDetail
                })
            }
            localStorage.setItem('carts', JSON.stringify(carts));
            setCarts(carts);

        } else {
            //create cart
            const data = [{
                _id: bookDetail?._id!,
                quantity: order,
                detail: bookDetail!
            }]
            localStorage.setItem('carts', JSON.stringify(data));
            setCarts(data);
        }
        if (isBuyNow) {
            navigate("/order")
        } else
            message.success("Thêm sản phẩm vào giỏ hàng thành công.")

    }

    const handleOder = (a: number, total: number) => {
        if (a === 1 && order < total) setOrder(order + 1);
        if (a === -1 && order > 1) setOrder(order - 1);
    }

    const handleOnChange = (value: string, total: number) => {
        if (!isNaN(+value)) {
            if (+value > 0 && +value <= total) setOrder(+value);
        }
    }

    return (
        <div style={{ background: '#efefef', padding: "20px 0" }}>
            <div className='view-detail-book' style={{ maxWidth: 1440, margin: '0 auto', minHeight: "calc(100vh - 150px)" }}>
                <Breadcrumb
                    separator=">"
                    items={[
                        {
                            title: <Link to={"/"}>Trang Chủ</Link>,
                        },

                        {
                            title: 'Xem chi tiết sách',
                        },
                    ]}
                />
                <div style={{ padding: "20px", background: '#fff', borderRadius: 5 }}>
                    <Row gutter={[20, 20]}>
                        <Col md={10} sm={0} xs={0}>
                            <ImageGallery
                                ref={refGallery}
                                items={imageGallery}
                                showPlayButton={false} //hide play button
                                showFullscreenButton={false} //hide fullscreen button
                                renderLeftNav={() => <></>} //left arrow === <> </>
                                renderRightNav={() => <></>}//right arrow === <> </>
                                slideOnThumbnailOver={true}  //onHover => auto scroll images
                                onClick={() => handleOnClickImage()}
                            />
                        </Col>
                        <Col md={14} sm={24}>
                            <Col md={0} sm={24} xs={24}>
                                <ImageGallery
                                    ref={refGallery}
                                    items={imageGallery}
                                    showPlayButton={false} //hide play button
                                    showFullscreenButton={false} //hide fullscreen button
                                    renderLeftNav={() => <></>} //left arrow === <> </>
                                    renderRightNav={() => <></>}//right arrow === <> </>
                                    showThumbnails={false}
                                />
                            </Col>
                            <Col span={24}>
                                <div className='author'>Tác giả: <a href='#'>{bookDetail?.author}</a> </div>
                                <div className='title'>{bookDetail?.mainText}</div>
                                <div className='rating'>
                                    <Rate value={5} disabled style={{ color: '#ffce3d', fontSize: 12 }} />
                                    <span className='sold'>
                                        <Divider type="vertical" />
                                        Đã bán {bookDetail?.sold}</span>
                                </div>
                                <div className='price'>
                                    <span className='currency'>
                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(bookDetail ? bookDetail.price : 0)}
                                    </span>
                                </div>
                                <div className='delivery'>
                                    <div>
                                        <span className='left'>Vận chuyển</span>
                                        <span className='right'>Miễn phí vận chuyển</span>
                                    </div>
                                </div>
                                <div className='quantity'>
                                    <span className='left'>{bookDetail?.quantity}</span>
                                    <span className='right'>
                                        <button onClick={() => handleOder(-1, bookDetail?.quantity ?? 0)} ><MinusOutlined /></button>
                                        <input onChange={(event) => handleOnChange(event.target.value, bookDetail?.quantity ?? 0)} value={order} />
                                        <button onClick={() => handleOder(1, bookDetail?.quantity ?? 0)}><PlusOutlined /></button>
                                    </span>
                                </div>
                                <div className='buy'>
                                    <button onClick={() => handleAddToCart()} className='cart'>
                                        <BsCartPlus className='icon-cart' />
                                        <span>Thêm vào giỏ hàng</span>
                                    </button>
                                    <button onClick={() => handleAddToCart(true)} className='now'>Mua ngay</button>
                                </div>
                            </Col>
                        </Col>
                    </Row>
                </div>
            </div>
            <ModalGallery
                isOpen={isOpenModalGallery}
                setIsOpen={setIsOpenModalGallery}
                currentIndex={currentIndex}
                items={imageGallery}
                title={bookDetail?.mainText ?? ""}
            />
        </div>
    )
}

export default BookDetail;