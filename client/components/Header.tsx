import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, Menu, X, ChevronDown, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Implement search functionality
      console.log("Searching for:", searchQuery);
      // You can add search logic here or navigate to a search results page
    }
  };

  const navigationItems = [
    { path: "/", label: "Dashboard", featured: false },
    { path: "/supplies", label: "Supplies", featured: false },
    { path: "/purchase-patterns", label: "Insights", featured: false },
    { path: "/market-trends", label: "Market Trends", featured: false },
    { path: "/alerts", label: "Alerts", featured: false },
    { path: "/ai-bot", label: "🤖 AI Assistant", featured: true },
  ];

  const additionalPages = [
    { path: "/data-sync", label: "Data Sync" },
    { path: "/ai-bot-simple", label: "AI Bot Simple" },
    { path: "/test", label: "Test Route" },
  ];

  return (
    <header className="bg-white border-b border-[#E5E8EB] px-4 sm:px-6 lg:px-10 py-3 flex-shrink-0 sticky top-0 z-50">
      <div className="flex items-center justify-between w-full">
        {/* Left Section - Logo and Navigation */}
        <div className="flex items-center gap-4 lg:gap-8 flex-1">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <h1 className="text-[#0D1C17] text-lg sm:text-xl font-bold font-['Lexend']">
              AgriSupply Insights
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-4 xl:gap-6">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-[#0D1C17] text-sm font-normal font-['Lexend'] hover:text-[#45A180] transition-colors px-2 py-1 rounded-lg ${
                  isActive(item.path) ? "font-semibold text-[#45A180]" : ""
                } ${
                  item.featured
                    ? "bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200"
                    : ""
                }`}
              >
                {item.label}
              </Link>
            ))}

            {/* More Dropdown for Additional Pages */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-[#0D1C17] text-sm font-normal font-['Lexend'] hover:text-[#45A180] transition-colors px-2 py-1 rounded-lg">
                More
                <ChevronDown className="w-4 h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                {additionalPages.map((item) => (
                  <DropdownMenuItem key={item.path} asChild>
                    <Link
                      to={item.path}
                      className={`w-full cursor-pointer ${
                        isActive(item.path) ? "bg-[#F7FCFA] font-semibold" : ""
                      }`}
                    >
                      {item.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 -m-2 ml-auto"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5 text-[#0D1C17]" />
            ) : (
              <Menu className="w-5 h-5 text-[#0D1C17]" />
            )}
          </button>
        </div>

        {/* Right Section - Search and Profile */}
        <div className="flex items-center gap-3 sm:gap-4 lg:gap-6">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden sm:block">
            <div className="flex items-center bg-[#E5F5F0] rounded-xl overflow-hidden min-w-[140px] sm:min-w-[180px] lg:min-w-[200px] max-w-[280px]">
              <button
                type="submit"
                className="pl-3 sm:pl-4 flex items-center hover:bg-[#CCE8DE] transition-colors"
                aria-label="Search"
              >
                <Search className="w-4 h-4 sm:w-5 sm:h-5 text-[#45A180]" />
              </button>
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent px-2 sm:px-3 py-2 text-[#45A180] placeholder-[#45A180] text-sm sm:text-base font-['Lexend'] outline-none flex-1"
              />
            </div>
          </form>

          {/* Mobile Search Button */}
          <button className="sm:hidden p-2 -m-2" aria-label="Search">
            <Search className="w-5 h-5 text-[#45A180]" />
          </button>

          {/* Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex-shrink-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#E5F5F0] flex items-center justify-center cursor-pointer hover:bg-[#45A180] transition-colors group">
                <User className="w-4 h-4 sm:w-5 sm:h-5 text-[#45A180] group-hover:text-white" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="p-3 border-b">
                <p className="font-medium text-[#0D1C17] font-['Lexend']">
                  John Doe
                </p>
                <p className="text-sm text-[#45A180] font-['Lexend']">
                  admin@demo.com
                </p>
              </div>
              <DropdownMenuItem asChild>
                <Link to="/account" className="cursor-pointer">
                  <User className="w-4 h-4 mr-2" />
                  Account Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer text-red-600">
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-[#E5E8EB] bg-white px-4 py-3 mt-3">
          {/* Mobile Search */}
          <form onSubmit={handleSearch} className="mb-4 sm:hidden">
            <div className="flex items-center bg-[#E5F5F0] rounded-xl overflow-hidden">
              <button
                type="submit"
                className="pl-4 flex items-center"
                aria-label="Search"
              >
                <Search className="w-5 h-5 text-[#45A180]" />
              </button>
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent px-3 py-3 text-[#45A180] placeholder-[#45A180] text-base font-['Lexend'] outline-none flex-1"
              />
            </div>
          </form>

          {/* Mobile Navigation */}
          <nav className="flex flex-col space-y-1">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-[#0D1C17] text-sm font-normal font-['Lexend'] hover:text-[#45A180] hover:bg-[#F7FCFA] py-3 px-2 rounded-lg transition-colors ${
                  isActive(item.path) ? "font-semibold text-[#45A180] bg-[#F7FCFA]" : ""
                } ${
                  item.featured
                    ? "bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200"
                    : ""
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}

            {/* Additional Pages in Mobile */}
            <div className="border-t border-[#E5E8EB] pt-2 mt-2">
              <p className="text-xs text-[#45A180] font-['Lexend'] px-2 mb-2 uppercase tracking-wide">
                More Pages
              </p>
              {additionalPages.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-[#0D1C17] text-sm font-normal font-['Lexend'] hover:text-[#45A180] hover:bg-[#F7FCFA] py-3 px-2 rounded-lg transition-colors block ${
                    isActive(item.path) ? "font-semibold text-[#45A180] bg-[#F7FCFA]" : ""
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
