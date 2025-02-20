import { Outlet } from "react-router-dom"
import AppHeader from "./components/layout/app.header"
import { useCurrentApp } from "./components/context/app.context"
import { useEffect } from "react";
import { fetchAccountAPI } from "./services/api";

function Layout() {
  const { setUser, isAppLoading, setIsAppLoading } = useCurrentApp();
  useEffect(() => {
    const fetchAccount = async () => {
      const res = await fetchAccountAPI();
      if (res.data) {
        setUser(res.data.user);
      }
      setIsAppLoading(false)
    }
    fetchAccount();
  }, [])
  return (
    <>
      <AppHeader />
      <Outlet />
    </>
  )
}

export default Layout
