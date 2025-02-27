import { updateUserAPI } from "@/services/api";
import { App, Form, FormProps, Input, Modal } from "antd";
import { useEffect, useState } from "react";

type TProps = {
    openUpdateUser: boolean;
    setOpenUpdateUser: (p: boolean) => void;
    refreshTable: () => void;
    userUpdate: IUserTable | null;
    setUserUpdate: (p: IUserTable | null) => void
}



type TFieldType = {
    fullName: string;
    email: string;
    id: string;
    phone: string
}

const UpdateUser = (props: TProps) => {
    const { openUpdateUser, setOpenUpdateUser, refreshTable, userUpdate, setUserUpdate } = props;
    const [form] = Form.useForm();
    const [isSubmit, setIsSubmit] = useState<boolean>(false);
    const { message, notification } = App.useApp();

    useEffect(() => {
        if (userUpdate) {
            form.setFieldsValue({
                id: userUpdate?._id,
                fullName: userUpdate?.fullName,
                email: userUpdate?.email,
                phone: userUpdate?.phone
            })
        }
    }, [userUpdate])

    const handleOk = () => {
        form.submit();
    };

    const handleCancel = () => {
        setOpenUpdateUser(false);
        form.resetFields();
    };
    const onFinish: FormProps<TFieldType>['onFinish'] = async (values) => {
        setIsSubmit(true)
        // console.log('>>>>>', values)
        const res = await updateUserAPI(values.fullName, values.id, values.phone);
        if (res && res.data) {
            message.success("Create user thành công.");
            form.resetFields();
            setUserUpdate(null)
            setOpenUpdateUser(false)
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
            <Modal title="Update User"
                open={openUpdateUser}
                onOk={handleOk}
                onCancel={handleCancel}
                okText={"Cập Nhật"}
                cancelText={"Hủy"}
                confirmLoading={isSubmit}
            >
                <Form
                    form={form}
                    name="basic"
                    style={{ maxWidth: 600 }}
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <Form.Item<TFieldType>
                        labelCol={{ span: 24 }}
                        initialValue={userUpdate?._id}
                        label="id"
                        name="id"
                        hidden
                    >
                        <Input />
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
                        <Input disabled />
                    </Form.Item>

                    <Form.Item<TFieldType>
                        labelCol={{ span: 24 }}
                        label="Fullname"
                        name="fullName"
                        rules={[{ required: true, message: 'Please input your Fullname!' }]}
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

export default UpdateUser;