import { createContext, useContext, useState } from "react";

type TAppContext = {
    isAuthenticated: boolean;
    setIsAuthenticated: (p: boolean) => void;
    user: IUser | null;
    setUser: (p: IUser) => void;
    isAppLoading: boolean;
    setIsAppLoading: (p: boolean) => void;
};

type TProps = {
    children: React.ReactNode;
}


export const CurrentAppContext = createContext<TAppContext | null>(null);

export const AppProvider = (props: TProps) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [user, setUser] = useState<IUser | null>(null);
    const [isAppLoading, setIsAppLoading] = useState<boolean>(true);

    return (
        <CurrentAppContext.Provider value={{ isAuthenticated, setIsAuthenticated, user, setUser, isAppLoading, setIsAppLoading }}>
            {props.children}
        </CurrentAppContext.Provider>
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