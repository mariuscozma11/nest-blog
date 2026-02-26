import { Mail, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import SectionWrapper from "./section-wrapper";

const Footer = () => {
  const navigationItems = [
    { label: "Home", href: "/" },
    // { label: "Blog", href: "#" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <SectionWrapper>
      <div className="py-4 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-mono text-foreground mb-4">
              Marius Cozma
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:cozma.marius@proton.me"
                  className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-mono text-sm"
                >
                  <Mail className="h-4 w-4" />
                  cozma.marius@proton.me
                </a>
              </li>
              <li>
                <a
                  href="tel:+40756109881"
                  className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-mono text-sm"
                >
                  <Phone className="h-4 w-4" />
                  +40 756 109 881
                </a>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground font-mono text-sm">
                <MapPin className="h-4 w-4" />
                Romania, Timisoara
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-mono text-foreground mb-4">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {navigationItems.map((item) => (
                <li key={item.label}>
                  {item.href.startsWith("/") ? (
                    <Link
                      to={item.href}
                      className="text-muted-foreground hover:text-primary transition-colors font-mono text-sm"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <a
                      href={item.href}
                      className="text-muted-foreground hover:text-primary transition-colors font-mono text-sm"
                    >
                      {item.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Tagline */}
          <div className="md:col-span-2 lg:col-span-1">
            <h3 className="text-xl font-mono text-foreground mb-4">
              Backend Engineer
            </h3>
            <p className="text-muted-foreground font-mono text-sm">
              Still learning, still building.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="mt-4 py-4 border-t border-dashed">
        <p className="text-center text-muted-foreground font-mono text-sm">
          &copy; {new Date().getFullYear()} Marius Cozma. All rights reserved.
        </p>
      </div>
    </SectionWrapper>
  );
};

export default Footer;