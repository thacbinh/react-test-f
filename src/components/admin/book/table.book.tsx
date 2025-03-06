import { deleteBookAPI, getBookAPI } from "@/services/api";
import { DeleteTwoTone, EditTwoTone, ExportOutlined, PlusOutlined } from "@ant-design/icons";
import { ActionType, ProColumns, ProTable } from "@ant-design/pro-components";
import { App, Button, Popconfirm } from "antd";
import { useRef, useState } from "react";
import { CSVLink } from "react-csv";
import DetailBook from "./detail.book";
import CreateBook from "./create.book";
import UpdateBook from "./update.book";

type TFilter = {
    mainText: string,
    author: string
}

const TableBook = () => {

    const actionRef = useRef<ActionType>();
    const [meta, setMeta] = useState({
        current: 1,
        pageSize: 5,
        pages: 0,
        total: 0
    })
    const { message, notification } = App.useApp();
    const [currentDataTable, setCurrentDataTable] = useState<IBookTable[]>([]);
    const [openDetailBook, setOpenDetailBook] = useState<boolean>(false);
    const [detailBook, setDetailBook] = useState<IBookTable | null>(null)
    const [openCreateBook, setOpenCreateBook] = useState<boolean>(false);
    const [openUpdateBook, setOpenUpdateBook] = useState<boolean>(false);
    const [bookUpdate, setBookUpdate] = useState<IBookTable | null>(null);
    const [isDeleteBook, setIsDeleteBook] = useState<boolean>(false);


    const refreshTable = () => {
        actionRef.current?.reload();
    }

    const confirm = async (id: string) => {
        setIsDeleteBook(true);
        const res = await deleteBookAPI(id);
        if (res && res.data) {

            message.success('xoa book thanh cong ');
            refreshTable()
        } else {
            //error
            notification.error({
                message: 'Đã có lỗi xảy ra',
                description: res.message
            })
        }
        setIsDeleteBook(false);
    };

    const columns: ProColumns<IBookTable>[] = [
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
                        setOpenDetailBook(true);
                        setDetailBook(entity);
                    }} href='#'>{entity._id}</a>
                )
            },
        },
        {
            title: 'Main Text',
            dataIndex: 'mainText',
            sorter: true
        },
        {
            title: 'Category',
            dataIndex: 'category',
            copyable: true,
        },
        {
            title: 'Author',
            dataIndex: 'author',
            sorter: true
        },
        {
            title: 'Price',
            dataIndex: 'price',
            sorter: true,
            // https://stackoverflow.com/questions/37985642/vnd-currency-formatting
            render(dom, entity, index, action, schema) {
                return (
                    <>{new Intl.NumberFormat(
                        'vi-VN',
                        { style: 'currency', currency: 'VND' }).format(entity.price)}
                    </>
                )
            }
        },
        {
            title: 'Create At',
            dataIndex: 'createdAt',
            valueType: 'date',
            hideInSearch: true,
            sorter: true
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
                                setBookUpdate(entity);
                                setOpenUpdateBook(true)
                            }}
                        />
                        <Popconfirm
                            title="Delete the user"
                            description="Are you sure to delete this user?"
                            placement='left'
                            onConfirm={() => confirm(entity._id)}
                            okText="Yes"
                            cancelText="No"
                            okButtonProps={{ loading: isDeleteBook }}
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
            <ProTable<IBookTable, TFilter>
                columns={columns}
                actionRef={actionRef}
                cardBordered
                request={async (params, sort, filter) => {
                    console.log(params, sort, filter);
                    let query = '';
                    if (params) {
                        query += `current=${params?.current ?? 1}&pageSize=${params?.pageSize ?? 5}`
                        if (params.mainText) {
                            query += `&mainText=/${params.mainText}/i`
                        }
                        if (params.author) {
                            query += `&author=/${params.author}/i`
                        }
                    }

                    //default
                    if (sort) {
                        if (sort.createdAt) {
                            query += `&sort=${sort.createdAt === "ascend" ? "createdAt" : "-createdAt"}`
                        } else query += `&sort=-createdAt`;
                        if (sort.mainText) {
                            query += `&sort=${sort.mainText === "ascend" ? "mainText" : "-mainText"}`
                        }
                        if (sort.author) {
                            query += `&sort=${sort.author === "ascend" ? "author" : "-author"}`
                        }
                        if (sort.price) {
                            query += `&sort=${sort.price === "ascend" ? "price" : "-price"}`
                        }
                    }


                    const res = await getBookAPI(query);
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
                headerTitle="Table Book"
                toolBarRender={() => [

                    <CSVLink
                        data={currentDataTable}
                        filename='export-book.csv'
                    >
                        <Button
                            icon={<ExportOutlined />}
                            type="primary"
                        >
                            Export
                        </Button>,
                    </CSVLink>,
                    <Button
                        key="button"
                        icon={<PlusOutlined />}
                        onClick={() => {
                            setOpenCreateBook(true);
                        }}
                        type="primary"
                    >
                        Add new
                    </Button>

                ]}
            />
            <DetailBook
                openDetailBook={openDetailBook}
                setOpenDetailBook={setOpenDetailBook}
                detailBook={detailBook}
                setDetailBook={setDetailBook}
            />
            <CreateBook
                openCreateBook={openCreateBook}
                setOpenCreateBook={setOpenCreateBook}
                refreshTable={refreshTable}
            />
            <UpdateBook
                openUpdateBook={openUpdateBook}
                setOpenUpdateBook={setOpenUpdateBook}
                bookUpdate={bookUpdate}
                setBookUpdate={setBookUpdate}
                refreshTable={refreshTable}
            />
        </>
    )
}

export default TableBook;