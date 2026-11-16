export function SkipLink({ target }: { target: string }) {
  return (
    <a
      className="skip-link"
      href={`#${target}`}
      onClick={(e) => {
        e.preventDefault();
        const main = document.getElementById(target);
        main?.focus();
        main?.scrollIntoView({ block: "start" });
      }}
    >
      跳到主要內容
    </a>
  );
}
