import { createUserAPI } from "@/services/api";
import { App, Button, Form, FormProps, Input, Modal } from "antd";
import { useState } from "react";

type TProps = {
    openCreateUser: boolean;
    setOpenCreateUser: (p: boolean) => void;
    refreshTable: () => void;
}

type TFieldType = {
    fullName: string;
    email: string;
    password: string;
    phone: string
}

const CreateUser = (props: TProps) => {
    const { openCreateUser, setOpenCreateUser, refreshTable } = props;

    const [form] = Form.useForm();

    const { message, notification } = App.useApp();

    const [isSubmit, setIsSubmit] = useState<boolean>(false);

    const handleOk = () => {
        form.submit();
    };

    const handleCancel = () => {
        setOpenCreateUser(false);
        form.resetFields();
    };
    const onFinish: FormProps<TFieldType>['onFinish'] = async (values) => {
        setIsSubmit(true);
        const res = await createUserAPI(values.fullName, values.email, values.password, values.phone);
        if (res && res.data) {
            //thoong bao
            message.success("Create user thành công.")
            //reset field
            form.resetFields
            //dong modal
            setOpenCreateUser(false)
            //load lai table
            refreshTable();
        } else {
            //error
            notification.error({
                message: 'Đã có lỗi xảy ra',
                description: res.message
            })
        }
        setIsSubmit(false)
    }
    return (
        <>
            <Modal title="Create User"
                open={openCreateUser}
                onOk={handleOk}
                onCancel={handleCancel}
                okText={"Tạo mới"}
                cancelText={"Hủy"}
                confirmLoading={isSubmit}
            >
                <Form
                    form={form}
                    name="basic"
                    style={{ maxWidth: 600 }}
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <Form.Item<TFieldType>
                        labelCol={{ span: 24 }}
                        label="Fullname"
                        name="fullName"
                        rules={[{ required: true, message: 'Please input your Fullname!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item<TFieldType>
                        labelCol={{ span: 24 }}
                        label="Password"
                        name="password"
                        rules={[{ required: true, message: 'Please input your password!' }]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item<TFieldType>
                        labelCol={{ span: 24 }} //whole column
                        label="Email"
                        name="email"
                        rules={[
                            { required: true, message: 'Email không được để trống!' },
                            { type: "email", message: "Email không đúng định dạng!" }
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item<TFieldType>
                        labelCol={{ span: 24 }} //whole column
                        label="Số điện thoại"
                        name="phone"
                        rules={[{ required: true, message: 'Số điện thoại không được để trống!' }]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}

export default CreateUser;