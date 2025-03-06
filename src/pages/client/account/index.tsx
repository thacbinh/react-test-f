import { Modal, Tabs, TabsProps } from "antd";
import UserInfo from "./user.info";
import ChangePassword from "./change.password";

interface IProps {
    openManageAccount: boolean
    setOpenManageAccount: (p: boolean) => void
}

const ManageAccount = (props: IProps) => {

    const { openManageAccount, setOpenManageAccount } = props;

    const items: TabsProps['items'] = [
        {
            key: 'info',
            label: `Cập nhật thông tin`,
            children: <UserInfo />,
        },
        {
            key: 'password',
            label: `Đổi mật khẩu`,
            children: <ChangePassword />,
        },

    ];

    return (
        <>
            <Modal title="Quản lý tài khoản"
                open={openManageAccount}
                onCancel={() => setOpenManageAccount(false)}
                width={"60vw"}
                maskClosable={false}
                footer={null}
            >
                <Tabs defaultActiveKey="info" items={items} />
            </Modal>
        </>
    )
}

export default ManageAccount;