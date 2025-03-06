import { deleteBookAPI, getBookAPI, getOrdersAPI } from "@/services/api";
import { DeleteTwoTone, EditTwoTone, ExportOutlined, PlusOutlined } from "@ant-design/icons";
import { ActionType, ProColumns, ProTable } from "@ant-design/pro-components";
import { App, Button, Popconfirm } from "antd";
import { useRef, useState } from "react";
import { CSVLink } from "react-csv";

type TFilter = {
    name: string,
    address: string
}

const TableOrder = () => {

    const actionRef = useRef<ActionType>();
    const [meta, setMeta] = useState({
        current: 1,
        pageSize: 5,
        pages: 0,
        total: 0
    })
    const [currentDataTable, setCurrentDataTable] = useState<IOrderTable[]>([]);

    const refreshTable = () => {
        actionRef.current?.reload();
    }

    const columns: ProColumns<IOrderTable>[] = [
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
                    }} href='#'>{entity._id}</a>
                )
            },
        },
        {
            title: 'Full Name',
            dataIndex: 'name',
        },
        {
            title: 'Address',
            dataIndex: 'address',
        },
        {
            title: 'Created at',
            dataIndex: 'createdAt',
            valueType: 'date',
            sorter: true,
            hideInSearch: true,
        },
        {
            title: 'Total',
            dataIndex: 'totalPrice',
            sorter: true,
            hideInSearch: true,
            // https://stackoverflow.com/questions/37985642/vnd-currency-formatting
            render(dom, entity, index, action, schema) {
                return (
                    <>{new Intl.NumberFormat(
                        'vi-VN',
                        { style: 'currency', currency: 'VND' }).format(entity.totalPrice)}
                    </>
                )
            }
        },
    ];
    return (
        <>
            <ProTable<IOrderTable, TFilter>
                columns={columns}
                actionRef={actionRef}
                cardBordered
                request={async (params, sort, filter) => {
                    console.log(params, sort, filter);
                    let query = '';
                    if (params) {
                        query += `current=${params?.current ?? 1}&pageSize=${params?.pageSize ?? 5}`
                        if (params.name) {
                            query += `&name=/${params.name}/i`
                        }
                        if (params.address) {
                            query += `&address=/${params.address}/i`
                        }
                    }

                    //default
                    if (sort) {
                        if (sort.totalPrice) {
                            query += `&sort=${sort.totalPrice === "ascend" ? "totalPrice" : "-totalPrice"}`
                        }
                        if (sort.createdAt) {
                            query += `&sort=${sort.createdAt === "ascend" ? "createdAt" : "-createdAt"}`
                        } else query += `&sort=-createdAt`;
                    }


                    const res = await getOrdersAPI(query);
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
                headerTitle="Table Order"
            />
        </>
    )
}

export default TableOrder;