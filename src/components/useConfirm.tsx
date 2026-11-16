import { useEffect, useRef, useState } from "react";
import { ShieldCheck, X } from "lucide-react";
export function useConfirm() {
  const [message, setMessage] = useState("");
  const dialog = useRef<HTMLDialogElement>(null);
  const resolver = useRef<((value: boolean) => void) | null>(null);
  useEffect(() => {
    if (message && dialog.current && !dialog.current.open)
      dialog.current.showModal();
  }, [message]);
  useEffect(() => () => resolver.current?.(false), []);
  function finish(value: boolean) {
    dialog.current?.close();
    resolver.current?.(value);
    resolver.current = null;
    setMessage("");
  }
  function confirm(text: string): Promise<boolean> {
    return new Promise((resolve) => {
      resolver.current = resolve;
      setMessage(text);
    });
  }
  const confirmation = (
    <dialog
      ref={dialog}
      className="confirm-dialog"
      onCancel={(e) => {
        e.preventDefault();
        finish(false);
      }}
      aria-labelledby="confirmation-title"
      aria-describedby="confirmation-message"
    >
      <div className="panel-heading">
        <span className="mini-icon blue">
          <ShieldCheck size={20} />
        </span>
        <button
          className="icon-button"
          aria-label="關閉確認視窗"
          onClick={() => finish(false)}
        >
          <X size={18} />
        </button>
      </div>
      <h2 id="confirmation-title">確認這次變更</h2>
      <p id="confirmation-message">{message}</p>
      <div className="button-row">
        <button
          className="button secondary"
          autoFocus
          onClick={() => finish(false)}
        >
          保留現況
        </button>
        <button className="button primary" onClick={() => finish(true)}>
          確認變更
        </button>
      </div>
    </dialog>
  );
  return { confirm, confirmation };
}
