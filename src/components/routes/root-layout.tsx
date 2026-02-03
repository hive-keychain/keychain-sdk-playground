import { useEffect, useMemo, useState } from "react";
import { Image } from "react-bootstrap";
import { Link, NavLink, Outlet } from "react-router-dom";
import AlertIconRed from "../../assets/images/pngs/icons8-alert-sign.png";
import KeyChainPngIcon from "../../assets/images/pngs/keychain_icon_small.png";
import CheckMarkGreen from "../../assets/images/svgs/icons8-check-mark-green.svg";
import { requestCategories } from "../../reference-data/requests-categories";
import { Utils } from "../../utils/utils";
import CustomToolTip from "../common_ui/custom-tool-tip";
import FooterComponent from "../footer.component";

type Props = {};

export default function RootLayout({}: Props) {
  const [keychainInstalled, setKeychainInstalled] = useState(false);
  const [requestFilter, setRequestFilter] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const filteredRequestCategories = useMemo(() => {
    const normalizedFilter = requestFilter.trim().toLowerCase();
    if (!normalizedFilter) return requestCategories;

    return requestCategories
      .map((category) => {
        const categoryMatches = category.category
          .toLowerCase()
          .includes(normalizedFilter);
        const filteredItems = categoryMatches
          ? category.items
          : category.items.filter((item) =>
              item.name.toLowerCase().includes(normalizedFilter)
            );
        return { ...category, items: filteredItems };
      })
      .filter((category) => category.items.length > 0);
  }, [requestFilter]);

  useEffect(() => {
    const onLoadHandler = async () => {
      console.log("Fully loaded!");
      setTimeout(async () => {
        if (document.readyState === "complete") {
          try {
            const enabled = await Utils.getSDK().isKeychainInstalled();
            setKeychainInstalled(enabled);
            console.log({ KeychainDetected: enabled });
          } catch (error) {
            console.log({ error });
          }
        }
      }, 100);
    };

    window.addEventListener("load", onLoadHandler);

    return () => {
      window.removeEventListener("load", onLoadHandler);
    };
  }, []);

  useEffect(() => {
    if (!sidebarOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSidebarOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  const handleNavClick = (event: React.MouseEvent<HTMLElement>) => {
    const target = event.target as HTMLElement;
    if (target.closest("a")) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className={`App playground-shell ${sidebarOpen ? "sidebar-open" : ""}`}>
      <aside className="playground-sidebar" id="playground-sidebar">
        <div className="sidebar-brand">
          <Link to="/" className="sidebar-logo">
            <Image
              id="keychain-logo"
              src={KeyChainPngIcon}
              height={34}
              width={34}
              style={{
                backgroundColor: "black",
                borderRadius: 50,
                padding: 3,
              }}
            />
            <span className="sidebar-title">Keychain Playground</span>
          </Link>
          <div className="sidebar-status">
            <CustomToolTip
              children={
                <Image
                  src={keychainInstalled ? CheckMarkGreen : AlertIconRed}
                  width={22}
                  height={22}
                />
              }
              toolTipText={
                keychainInstalled
                  ? "Keychain extension installed and detected!"
                  : "Keychain could not be found, please check documentation, error section."
              }
              placement={"right"}
            />
          </div>
        </div>
        <nav className="sidebar-nav" onClick={handleNavClick}>
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            Welcome
          </NavLink>
          <div className="sidebar-section">Keychain Swap</div>
          <NavLink
            to="/swap-widget"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            Swap widget
          </NavLink>
          <div className="sidebar-section">Keychain requests</div>
          <NavLink
            to="/request/get-started"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            Get started
          </NavLink>
          <div className="sidebar-filter">
            <input
              type="text"
              placeholder="Filter requests"
              value={requestFilter}
              onChange={(event) => setRequestFilter(event.target.value)}
              aria-label="Filter requests"
            />
          </div>
          {filteredRequestCategories.length === 0 ? (
            <div className="sidebar-empty">No matching requests</div>
          ) : (
            filteredRequestCategories.map((category) => (
              <details
                key={category.category}
                className="sidebar-category"
                open
              >
                <summary>{category.category}</summary>
                <div className="sidebar-sublist">
                  {category.items.map((item) => (
                    <NavLink
                      key={item.requestType}
                      to={`/request/${item.requestType}`}
                      className={({ isActive }) =>
                        `sidebar-sublink ${isActive ? "active" : ""}`
                      }
                    >
                      {item.name}
                    </NavLink>
                  ))}
                </div>
              </details>
            ))
          )}
        </nav>
      </aside>
      <div
        className="sidebar-overlay"
        role="button"
        tabIndex={-1}
        aria-label="Close navigation"
        onClick={() => setSidebarOpen(false)}
      />
      <main className="playground-content">
        <div className="mobile-topbar">
          <button
            className="sidebar-toggle"
            type="button"
            aria-label="Open navigation"
            aria-controls="playground-sidebar"
            aria-expanded={sidebarOpen}
            onClick={() => setSidebarOpen(true)}
          >
            <svg
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <span className="mobile-topbar-title">Keychain Playground</span>
        </div>
        <div id="detail" className="playground-detail playground-content-inner">
          <Outlet />
        </div>
        <FooterComponent />
      </main>
    </div>
  );
}
