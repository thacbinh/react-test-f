export { };
declare global {

    // cau hinh kieu du lieu phan hoi cua Backend (test tra ra trong post man) , vi cac method ben API se truyen vao 1 generic
    interface IBackendRes<T> {
        error?: string | string[];
        message: string;
        statusCode: number | string;
        data?: T;
    }
    interface IModelPaginate<T> {
        meta: {
            current: number;
            pageSize: number;
            pages: number;
            total: number;
        },
        result: T[]
    }
    interface ILogin {
        access_token: string;
        user: {
            email: string;
            phone: string;
            fullName: string;
            role: string;
            avatar: string;
            id: string;
        }
    }

    interface IRegister {
        _id: string;
        email: string;
        fullName: string;
    }

    interface IUser {
        email: string;
        phone: string;
        fullName: string;
        role: string;
        avatar: string;
        id: string;
    }

    interface IFetchAccount {
        user: IUser
    }

    interface IUserTable {
        _id: string;
        fullName: string;
        email: string;
        phone: string;
        role: string;
        avatar: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }

    interface IResponseImport {
        countSuccess: number;
        countError: number;
        detail: any
    }

    interface IBookTable {
        _id: string,
        thumbnail: string,
        slider: string[],
        mainText: string,
        author: string,
        price: number,
        sold: number,
        quantity: number,
        category: string,
        createdAt: Date,
        updatedAt: Date
    }

    interface ICategory {
        categories: string[]
    }

    interface ICart {
        _id: string;
        quantity: number;
        detail: IBookTable
    }
}