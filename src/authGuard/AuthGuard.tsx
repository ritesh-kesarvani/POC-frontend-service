import * as React from "react";

interface AuthContextType {
  appId: any;
  token: any;
  setToLocal: (token: string | null, appId: string | null) => void;
  userData: any;
  setUser: (data: any) => void;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = React.useState<any>(localStorage?.["$pay$heet"]);
  const [appId, setAppId] = React.useState<any>(localStorage?.["$pay$heet-!d"]);
  const [userData, setUserData] = React.useState<any>(parseData("$u$er"));

  function parseData(key: string) {
    let data = localStorage?.["$u$er"];
    if (data) {
      return JSON.parse(data);
    }
  }

  const setToLocal = (newToken: string | null, newAppId: string | null) => {
    setToken(newToken);
    setAppId(newAppId);
    if (newToken) {
      localStorage.setItem("$pay$heet", newToken);
    }
    if (newAppId) {
      localStorage.setItem("$pay$heet-!d", newAppId);
    }
  };

  const setUser = (data: any) => {
    setUserData(data);
  };

  const value: AuthContextType = {
    appId,
    token,
    setToLocal,
    userData,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthGuard() {
  const auth = useAuth();
  return !!auth.token;
}

export function AdminGuard() {
  const auth = useAuth();
  return auth?.userData?.role_id && auth?.userData?.role_id === 1;
}
