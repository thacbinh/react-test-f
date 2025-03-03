import { FORMATE_DATE_VN } from "@/services/helper";
import { PlusOutlined } from "@ant-design/icons";
import { Badge, Descriptions, Divider, Drawer, GetProp, Image, Upload, UploadProps } from "antd";
import { UploadFile } from "antd/lib";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';

interface IProps {
    openDetailBook: boolean;
    setOpenDetailBook: (p: boolean) => void;
    detailBook: IBookTable | null;
    setDetailBook: (p: IBookTable | null) => void;
}

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const DetailBook = (props: IProps) => {
    const { openDetailBook, setOpenDetailBook, detailBook, setDetailBook } = props;

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    // const [previewTitle, setPreviewTitle] = useState('');

    const [fileList, setFileList] = useState<UploadFile[]>([]);

    useEffect(() => {
        let imgThumbnail: any = {}, imgSlider: UploadFile[] = [];
        if (detailBook) {
            if (detailBook.thumbnail) {
                imgThumbnail = {
                    uid: uuidv4(),
                    name: detailBook.thumbnail,
                    status: 'done',
                    url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${detailBook.thumbnail}`,
                }
            }
            if (detailBook.slider && detailBook.slider.length > 0) {
                detailBook.slider.map((item) => {
                    imgSlider.push({
                        uid: uuidv4(),
                        name: item,
                        status: 'done',
                        url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
                    })
                })
            }
            setFileList([imgThumbnail, ...imgSlider]);
        }
    }, [detailBook])

    const getBase64 = (file: FileType): Promise<string> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });

    const handleCancel = () => setPreviewOpen(false);

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
    };

    const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) =>
        setFileList(newFileList);


    return (
        <>
            <Drawer
                title="Chức năng xem chi tiết"
                width={"50vw"}
                onClose={() => {
                    setDetailBook(null)
                    setOpenDetailBook(false)
                }}
                open={openDetailBook}>
                <Descriptions
                    title="Thông tin book"
                    bordered
                    column={2}
                >
                    <Descriptions.Item label="Id">{detailBook?._id}</Descriptions.Item>
                    <Descriptions.Item label="Tên Sách">{detailBook?.mainText}</Descriptions.Item>
                    <Descriptions.Item label="Tác Giả">{detailBook?.author}</Descriptions.Item>
                    <Descriptions.Item label="Giá tiền">{
                        new Intl.NumberFormat('vi-VN',
                            { style: 'currency', currency: 'VND' })
                            .format(detailBook?.price ?? 0)}
                    </Descriptions.Item>
                    <Descriptions.Item span={2} label="Thể Loại">
                        <Badge status="processing" text={detailBook?.category} />
                    </Descriptions.Item>
                    <Descriptions.Item label="Created At">
                        {dayjs(detailBook?.createdAt).format(FORMATE_DATE_VN)}
                    </Descriptions.Item>
                    <Descriptions.Item label="Updated At">
                        {dayjs(detailBook?.updatedAt).format(FORMATE_DATE_VN)}
                    </Descriptions.Item>
                </Descriptions>

                <Divider orientation="left" > Ảnh Books </Divider>

                <Upload
                    action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={handlePreview}
                    onChange={handleChange}
                    showUploadList={
                        { showRemoveIcon: false }
                    }
                >
                </Upload>
                {previewImage && (
                    <Image
                        wrapperStyle={{ display: 'none' }}
                        preview={{
                            visible: previewOpen,
                            onVisibleChange: (visible) => setPreviewOpen(visible),
                            afterOpenChange: (visible) => !visible && setPreviewImage(''),
                        }}
                        src={previewImage}
                    />
                )}
            </Drawer>
        </>
    )
}

export default DetailBook;