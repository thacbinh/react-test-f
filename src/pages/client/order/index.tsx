import { App, Button, Col, Divider, Empty, InputNumber, Row } from 'antd';
import { DeleteTwoTone } from '@ant-design/icons';
import 'styles/order.scss';
import { useEffect, useState } from 'react';
import { useCurrentApp } from '@/components/context/app.context';

interface IProps {
    setCurrentStep: (p: number) => void
}

const OrderDetail = (props: IProps) => {

    const { setCurrentStep } = props;

    const { carts, setCarts } = useCurrentApp();

    const [totalPrice, setTotalPrice] = useState(0);

    const { message } = App.useApp();

    useEffect(() => {
        const initialValue = 0;

        setTotalPrice(carts.reduce(
            (accumulator, currentValue) => accumulator + currentValue.quantity * currentValue.detail.price,
            initialValue,
        ))
    }, [carts])

    const handleOnChange = (value: number, id: string) => {
        let cartStorage = [...carts];
        const indexUpdate = carts.findIndex(item => item._id === id);
        if (!value || value < 0 || value > carts[indexUpdate].detail.quantity) return;
        cartStorage[indexUpdate].quantity = value;
        localStorage.setItem("carts", JSON.stringify(cartStorage));
        setCarts(cartStorage);
    }

    const handleDelete = (id: string) => {
        const cartStorage = carts.filter(item => item._id !== id);
        localStorage.setItem("carts", JSON.stringify(cartStorage));
        setCarts(cartStorage);
    }

    const handlePayment = () => {
        if (carts.length < 1) {
            message.error('Gio hang trong')
        } else {
            setCurrentStep(1);
        }
    }

    return (
        <div style={{ background: '#efefef', padding: "20px 0" }}>
            <div className="order-container" style={{ maxWidth: 1440, margin: '0 auto' }}>
                <Row gutter={[20, 20]}>
                    <Col md={18} xs={24}>
                        {
                            carts.map((item, index) => {
                                return (
                                    <div className='order-book' key={`item-${index}`}>
                                        <div className='book-content'>
                                            <img src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${item?.detail?.thumbnail}`} />
                                            <div className='title'>
                                                {item?.detail?.mainText}
                                            </div>
                                            <div className='price'>
                                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.detail.price)}
                                            </div>
                                        </div>
                                        <div className='action'>
                                            <div className='quantity'>
                                                <InputNumber onChange={(value) => handleOnChange(value as number, item._id)}
                                                    value={item.quantity}
                                                />
                                            </div>
                                            <div className='sum'>
                                                Tổng:  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.detail.price * item.quantity)}
                                            </div>
                                            <DeleteTwoTone onClick={() => handleDelete(item._id)}
                                                style={{ cursor: "pointer" }}
                                                twoToneColor="#eb2f96"
                                            />

                                        </div>
                                    </div>
                                )
                            })
                        }
                        {carts.length === 0 &&
                            <Empty
                                description="Không có sản phẩm trong giỏ hàng"
                            />
                        }
                    </Col>
                    <Col md={6} xs={24} >
                        <div className='order-sum'>
                            <div className='calculate'>
                                <span> Tạm tính</span>
                                <span>
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice)}
                                </span>
                            </div>
                            <Divider style={{ margin: "10px 0" }} />
                            <div className='calculate'>
                                <span>Tổng tiền</span>
                                <span className='sum-final'>
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice)}
                                </span>
                            </div>
                            <Divider style={{ margin: "10px 0" }} />
                            <Button
                                color="danger" variant="solid"
                                onClick={() => handlePayment()}
                            >
                                Mua Hàng ({carts?.length ?? 0})
                            </Button>
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    )
}

export default OrderDetail;