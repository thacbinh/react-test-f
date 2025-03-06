import { getDashboardAPI } from '@/services/api';
import type { StatisticProps } from 'antd';
import { Card, Col, Row, Statistic } from 'antd';
import { useEffect, useState } from 'react';
import CountUp from 'react-countup';


const DashBoard = () => {
    const formatter = (value: any) => <CountUp end={value} separator="," />;

    const [dashboard, setDashboard] = useState<IDashboard>();
    useEffect(() => {
        const fetchData = async () => {
            const res = await getDashboardAPI();
            if (res && res.data) {
                setDashboard(res.data);
            }
        }
        fetchData();
    }, [])
    return (
        <Row gutter={[40, 40]}>
            <Col span={8}>
                <Card title="" bordered={false} >
                    <Statistic
                        title="Tổng Users"
                        value={dashboard?.countUser}
                        formatter={formatter}
                    />
                </Card>
            </Col>
            <Col span={8}>
                <Card title="" bordered={false} >
                    <Statistic title="Tổng Đơn hàng" value={dashboard?.countOrder} precision={2} formatter={formatter} />
                </Card>
            </Col>
            <Col span={8}>
                <Card title="" bordered={false} >
                    <Statistic title="Tổng Books" value={dashboard?.countBook} precision={2} formatter={formatter} />
                </Card>
            </Col>
        </Row>
    )
}

export default DashBoard;