export default function SkipToContent() {
  const handleClick = (e) => {
    e.preventDefault();
    const el = document.getElementById('main-content');
    if (el) {
      el.focus();
      el.scrollIntoView();
    }
  };

  return (
    <a
      href="#main-content"
      onClick={handleClick}
      className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[70] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-[#141414] focus:text-white focus:shadow-lg"
    >
      Skip to content
    </a>
  );
}
