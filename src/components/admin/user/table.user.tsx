import { deleteUserAPI, getUsersAPI } from '@/services/api';
import { dateRangeValidate } from '@/services/helper';
import { CloudUploadOutlined, DeleteTwoTone, EditTwoTone, ExportOutlined, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { App, Button, Popconfirm, PopconfirmProps } from 'antd';
import { useRef, useState } from 'react';
import DetailsUser from './detail.user';
import CreateUser from './create.user';
import ImportUser from './import.user';
import { CSVLink } from 'react-csv';
import UpdateUser from './update.user';


type TFilter = {
    fullName: string,
    email: string,
    createAt: string,
    createAtRange: string
}

const TableUser = () => {
    const [meta, setMeta] = useState({
        current: 1,
        pageSize: 5,
        pages: 0,
        total: 0
    })
    const [openDetailUser, setOpenDetailUser] = useState<boolean>(false);
    const [detailUser, setDetailUser] = useState<IUserTable | null>(null);
    const [openCreateUser, setOpenCreateUser] = useState<boolean>(false);
    const [openModalImport, setOpenModalImport] = useState<boolean>(false);
    const [currentDataTable, setCurrentDataTable] = useState<IUserTable[]>([]);
    const [openUpdateUser, setOpenUpdateUser] = useState<boolean>(false);
    const [userUpdate, setUserUpdate] = useState<IUserTable | null>(null);
    const { message, notification } = App.useApp();
    const [isDeleteUser, setIsDeleteUser] = useState<boolean>(false);

    const actionRef = useRef<ActionType>();

    const refreshTable = () => {
        actionRef.current?.reload();
    }

    const confirm = async (id: string) => {
        setIsDeleteUser(true);
        const res = await deleteUserAPI(id);
        if (res && res.data) {

            message.success('xoa user thanh cong ');
            refreshTable()
        } else {
            //error
            notification.error({
                message: 'Đã có lỗi xảy ra',
                description: res.message
            })
        }
        setIsDeleteUser(false);
    };

    const columns: ProColumns<IUserTable>[] = [
        {
            dataIndex: 'index',
            valueType: 'indexBorder',
            width: 48,
        },
        {
            title: '_id',
            dataIndex: '_id',
            hideInSearch: true,
            render(dom, entity, index, action, schema) {
                return (
                    <a onClick={() => {
                        setOpenDetailUser(true);
                        setDetailUser(entity);
                    }} href='#'>{entity._id}</a>
                )
            },
        },
        {
            title: 'Full Name',
            dataIndex: 'fullName',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            copyable: true,
        },
        {
            title: 'Create At',
            dataIndex: 'createdAt',
            valueType: 'date',
            hideInSearch: true,
            sorter: true
        },
        {
            title: 'Create At',
            dataIndex: 'createdAtRange',
            valueType: 'dateRange',
            hideInTable: true
        },
        {
            title: 'Action',
            hideInSearch: true,
            render(dom, entity, index, action, schema) {
                return (
                    <>
                        <EditTwoTone
                            twoToneColor="#f57800"
                            style={{ cursor: "pointer", marginRight: 15 }}
                            onClick={() => {
                                setOpenUpdateUser(true);
                                setUserUpdate(entity)
                            }}
                        />
                        <Popconfirm
                            title="Delete the user"
                            description="Are you sure to delete this user?"
                            placement='left'
                            onConfirm={() => confirm(entity._id)}
                            okText="Yes"
                            cancelText="No"
                            okButtonProps={{ loading: isDeleteUser }}
                        >
                            <DeleteTwoTone
                                twoToneColor="#ff4d4f"
                                style={{ cursor: "pointer" }}
                            />
                        </Popconfirm>
                    </>
                )
            },
        },
    ];
    return (
        <>
            <ProTable<IUserTable, TFilter>
                columns={columns}
                actionRef={actionRef}
                cardBordered
                request={async (params, sort, filter) => {
                    console.log(params, sort, filter);
                    let query = '';
                    if (params) {
                        query += `current=${params?.current ?? 1}&pageSize=${params?.pageSize ?? 5}`
                        if (params.email) {
                            query += `&email=/${params.email}/i`
                        }
                        if (params.fullName) {
                            query += `&fullName=/${params.fullName}/i`
                        }

                        const createDateRange = dateRangeValidate(params.createAtRange);
                        if (createDateRange) {
                            query += `&createdAt>=${createDateRange[0]}&createdAt<=${createDateRange[1]}`
                        }
                    }

                    //default

                    if (sort && sort.createdAt) {
                        query += `&sort=${sort.createdAt === "ascend" ? "createdAt" : "-createdAt"}`
                    } else query += `&sort=-createdAt`;
                    const res = await getUsersAPI(query);
                    if (res.data) {
                        setMeta(res.data.meta);
                        // dang lay theo phan trang luon
                        setCurrentDataTable(res.data?.result ?? [])
                    }
                    return {
                        data: res.data?.result,
                        page: 1,
                        success: true,
                        total: res.data?.meta.total
                    }

                }}
                columnsState={{
                    persistenceKey: 'pro-table-singe-demos',
                    persistenceType: 'localStorage',
                    defaultValue: {
                        option: { fixed: 'right', disable: true },
                    },
                    onChange(value) {
                        console.log('value: ', value);
                    },
                }}
                rowKey="_id"
                pagination={{
                    current: meta.current,
                    pageSize: meta.pageSize,
                    showSizeChanger: true,
                    total: meta.total,
                    showTotal: (total, range) => { return (<div> {range[0]}-{range[1]} trên {total} rows</div>) }
                    // onChange: (page) => console.log(page),
                }}
                headerTitle="Table user"
                toolBarRender={() => [
                    <CSVLink
                        data={currentDataTable}
                        filename='export-user.csv'
                    >
                        <Button
                            icon={<ExportOutlined />}
                            type="primary"
                        >
                            Export
                        </Button>,
                    </CSVLink>,

                    <Button
                        icon={<CloudUploadOutlined />}
                        type="primary"
                        onClick={() => setOpenModalImport(true)}
                    >
                        Import
                    </Button>,
                    <Button
                        key="button"
                        icon={<PlusOutlined />}
                        onClick={() => {
                            setOpenCreateUser(true);
                        }}
                        type="primary"
                    >
                        Add new
                    </Button>

                ]}
            />
            <DetailsUser
                openDetailUser={openDetailUser}
                setOpenDetailUser={setOpenDetailUser}
                detailUser={detailUser}
                setDetailUser={setDetailUser}
            />
            <CreateUser
                openCreateUser={openCreateUser}
                setOpenCreateUser={setOpenCreateUser}
                refreshTable={refreshTable}
            />
            <UpdateUser
                openUpdateUser={openUpdateUser}
                setOpenUpdateUser={setOpenUpdateUser}
                refreshTable={refreshTable}
                userUpdate={userUpdate}
                setUserUpdate={setUserUpdate}
            />
            <ImportUser
                openModalImport={openModalImport}
                setOpenModalImport={setOpenModalImport}
                refreshTable={refreshTable}
            />
        </>
    );
};

export default TableUser; 