import React, { useState } from 'react';
import { Avatar, Badge, Descriptions, DescriptionsProps, Drawer } from 'antd';
import dayjs from 'dayjs';
import { FORMATE_DATE_VN } from '@/services/helper';

type TProps = {
    openDetailUser: boolean,
    setOpenDetailUser: (p: boolean) => void,
    detailUser: IUserTable | null,
    setDetailUser: (p: IUserTable | null) => void
}

const DetailsUser = (props: TProps) => {

    const { openDetailUser, setOpenDetailUser, detailUser, setDetailUser } = props;

    const avatarURL = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${detailUser?.avatar}`

    return (
        <>
            <Drawer
                title="Chức năng xem chi tiết"
                width={"50vw"}
                onClose={() => {
                    setDetailUser(null)
                    setOpenDetailUser(false)
                }}
                open={openDetailUser}>
                <Descriptions
                    title="Thông tin user"
                    bordered
                    column={2}
                >
                    <Descriptions.Item label="Id">{detailUser?._id}</Descriptions.Item>
                    <Descriptions.Item label="Tên hiển thị">{detailUser?.fullName}</Descriptions.Item>
                    <Descriptions.Item label="Email">{detailUser?.email}</Descriptions.Item>
                    <Descriptions.Item label="Số điện thoại">{detailUser?.phone}</Descriptions.Item>

                    <Descriptions.Item label="Role">
                        <Badge status="processing" text={detailUser?.role} />
                    </Descriptions.Item>
                    <Descriptions.Item label="Avatar">
                        <Avatar size={40} src={avatarURL} />
                    </Descriptions.Item>
                    <Descriptions.Item label="Created At">
                        {dayjs(detailUser?.createdAt).format(FORMATE_DATE_VN)}
                    </Descriptions.Item>
                    <Descriptions.Item label="Updated At">
                        {dayjs(detailUser?.updatedAt).format(FORMATE_DATE_VN)}
                    </Descriptions.Item>
                </Descriptions>
            </Drawer>
        </>
    )
}

export default DetailsUser;