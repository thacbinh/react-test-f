import { fetchAccountAPI } from "@/services/api";
import { createContext, useContext, useEffect, useState } from "react";
import { PacmanLoader } from "react-spinners";

type TAppContext = {
    isAuthenticated: boolean;
    setIsAuthenticated: (p: boolean) => void;
    user: IUser | null;
    setUser: (p: IUser | null) => void;
    isAppLoading: boolean;
    setIsAppLoading: (p: boolean) => void;
    carts: ICart[];
    setCarts: (v: ICart[]) => void;
};

type TProps = {
    children: React.ReactNode;
}


export const CurrentAppContext = createContext<TAppContext | null>(null);

export const AppProvider = (props: TProps) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [user, setUser] = useState<IUser | null>(null);
    const [isAppLoading, setIsAppLoading] = useState<boolean>(true);
    const [carts, setCarts] = useState<ICart[]>([])

    useEffect(() => {
        const fetchAccount = async () => {
            const res = await fetchAccountAPI();
            if (res.data) {
                setUser(res.data.user);
                setIsAuthenticated(true);
            }
            setIsAppLoading(false)
        }

        fetchAccount();
    }, [])

    useEffect(() => {
        const cartStorage = localStorage.getItem('carts');
        if (cartStorage) {
            const carts = JSON.parse(cartStorage) as ICart[];
            setCarts(carts);
        }
    }, [])

    return (
        <>
            {isAppLoading === false ?
                <CurrentAppContext.Provider value={{
                    isAuthenticated, user, setIsAuthenticated, setUser,
                    isAppLoading, setIsAppLoading,
                    carts, setCarts
                }}>
                    {props.children}
                </CurrentAppContext.Provider>
                :
                <div style={{
                    position: "fixed",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)"
                }}>
                    <PacmanLoader
                        size={30}
                        color="#36d6b4"
                    />
                </div>
            }

        </>
    )
};

export const useCurrentApp = () => {
    const currentAppContext = useContext(CurrentAppContext);

    if (!currentAppContext) {
        throw new Error(
            "useCurrentApp has to be used within <CurrentAppContext.Provider>"
        );
    }

    return currentAppContext;
};