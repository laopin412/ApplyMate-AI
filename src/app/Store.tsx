import {
  createContext,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  emptyData,
  GuestRepository,
  type GuestData,
} from "../services/storage/repository";
type Store = {
  data: GuestData;
  error: string;
  blocked: boolean;
  commit: (change: (old: GuestData) => GuestData) => boolean;
};
const Context = createContext<Store | null>(null);
export function StoreProvider({ children }: { children: ReactNode }) {
  const [initial] = useState(() => {
    try {
      const repository = new GuestRepository(window.localStorage);
      return { repository, data: repository.load(), error: "" };
    } catch (e) {
      return {
        repository: null,
        data: emptyData(),
        error:
          e instanceof Error
            ? e.message
            : "無法存取瀏覽器儲存空間，請檢查瀏覽器設定。",
      };
    }
  });
  const [data, setData] = useState(initial.data);
  const current = useRef(data);
  const [error, setError] = useState(initial.error);
  function commit(change: (old: GuestData) => GuestData) {
    try {
      if (!initial.repository) throw new Error(initial.error);
      const next = initial.repository.write(change(current.current));
      current.current = next;
      setData(next);
      setError("");
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : "保存失敗，請先複製目前內容。");
      return false;
    }
  }
  return (
    <Context.Provider
      value={{ data, error, blocked: !initial.repository, commit }}
    >
      {children}
    </Context.Provider>
  );
}
export function useStore() {
  const store = useContext(Context);
  if (!store) throw new Error("StoreProvider required");
  return store;
}
