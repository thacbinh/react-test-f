import { useState } from "react";
import OrderDetail from "./order/index"
import Payment from "./order/payment";
import { Button, Result, Steps } from "antd";
import { Link } from "react-router-dom";

const OrderPage = () => {
    const [currentStep, setCurrentStep] = useState<number>(0);
    return (
        <div style={{ background: '#efefef', padding: "20px 0" }}>
            <div className="order-container" style={{ maxWidth: 1440, margin: '0 auto' }}>
                <div className="order-steps">
                    <Steps
                        size="small"
                        current={currentStep}
                        items={[
                            {
                                title: 'Đơn hàng',
                            },
                            {
                                title: 'Đặt hàng',
                            },
                            {
                                title: 'Thanh toán',
                            },
                        ]}
                    />
                </div>
                {currentStep === 0 &&
                    <OrderDetail setCurrentStep={setCurrentStep} />
                }
                {currentStep === 1 &&
                    <Payment setCurrentStep={setCurrentStep} />
                }
                {currentStep === 2 &&
                    <Result
                        status="success"
                        title="Đặt hàng thành công"
                        subTitle="Hệ thông đã ghi nhận thông tin đơn hàng của bạn."
                        extra={[
                            <Button key="home">
                                <Link to={"/"} type="primary">
                                    Trang Chủ
                                </Link>
                            </Button>,

                            <Button key="history">
                                Lịch sử mua hàng
                            </Button>,
                        ]}
                    />
                }
            </div>
        </div>
    )
}

export default OrderPage