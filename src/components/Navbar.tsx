export default function Navbar() {
  return (
    <nav
      className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 sm:px-8 lg:px-12 py-4 sm:py-6"
      style={{ fontFamily: "var(--font-sans)" }}
    >
      <span className="text-white text-xs sm:text-sm font-medium tracking-wide">
        Hayden Baxter
      </span>
      <div className="flex items-center gap-3 sm:gap-8 lg:gap-12">
        <a
          href="#"
          className="text-white/70 hover:text-white text-xs sm:text-sm transition-colors duration-200"
        >
          Work
        </a>
        <a
          href="#"
          className="text-white/70 hover:text-white text-xs sm:text-sm transition-colors duration-200"
        >
          About
        </a>
        <a
          href="#"
          className="text-white/70 hover:text-white text-xs sm:text-sm transition-colors duration-200"
        >
          Connect
        </a>
      </div>
    </nav>
  );
}
