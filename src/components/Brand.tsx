import { Layers } from "lucide-react";
import { Link } from "react-router-dom";
export function Brand({ light = false }: { light?: boolean }) {
  return (
    <Link
      className={`brand ${light ? "brand-light" : ""}`}
      to="/"
      aria-label="ApplyMate AI 回首頁"
    >
      <span className="brand-mark">
        <Layers size={23} />
      </span>
      <span>
        ApplyMate<span className="brand-ai"> AI</span>
      </span>
    </Link>
  );
}
