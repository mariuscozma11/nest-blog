import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { ModeToggle } from "./mode-toggle";
import { MobileMenu } from "./mobile-menu";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 1);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navigationItems = [
    {
      label: "Home",
      href: "/",
    },
    // {
    //   label: "Blog",
    //   href: "/blog",
    // },
    {
      label: "Contact",
      href: "/contact",
    },
  ];
  return (
    <div className="fixed z-10 border-b border-dashed w-full bg-background">
      <div
        className={`max-w-7xl h-16 mx-auto transition-all duration-500 ease-out px-4 border-x border-dashed
        ${
          isScrolled
            ? "py-2 h-auto backdrop-blur-sm shadow-md"
            : "py-4 shadow-none"
        }`}
      >
        <div className="flex items-center justify-between mx-auto">
          {/* Logo - Left */}
          <Link to="/" className="flex items-center space-x-2 cursor-pointer">
            <div className="text-xl  tracking-tight font-mono">
              Marius Cozma
            </div>
          </Link>
          {/* Desktop Navigation - Right */}
          <div className="hidden lg:flex items-center space-x-4">
            <ModeToggle />
            {navigationItems.map((item) => (
              <div key={item.label}>
                {item.href.startsWith("/") ? (
                  <Link to={item.href}>
                    <Button
                      variant="ghost"
                      className="px-3 text-[15px]"
                      size="sm"
                    >
                      {item.label}
                    </Button>
                  </Link>
                ) : (
                  <a href={item.href}>
                    <Button
                      variant="ghost"
                      className="px-3 text-[15px]"
                      size="sm"
                    >
                      {item.label}
                    </Button>
                  </a>
                )}
              </div>
            ))}
          </div>
          <div className="flex lg:hidden">
            <MobileMenu />
          </div>
          {/* <Button variant={"outline"} size={"icon"} className="flex lg:hidden">
              <Menu />
            </Button> */}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
