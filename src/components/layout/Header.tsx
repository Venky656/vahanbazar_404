import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Search, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { supabase } from '@/utils/supabase';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');

  const location = useLocation();

  // ✅ Navigation
  const navigationItems = [
    {
      title: 'Buy',
      items: [
        { label: 'New Bikes', href: '/vehicles?category=bike' },
        { label: 'Scooters', href: '/vehicles?category=scooter' },
        { label: 'Electric Vehicles', href: '/vehicles?category=ev' },
      ],
    },
    { title: 'Used', href: '/used' }, // ✅ Added Used here
    { title: 'Sell', href: '/sell' },
    {
      title: 'Tools',
      items: [
        { label: 'EMI Calculator', href: '/emi-calculator' },
        { label: 'Fuel Calculator', href: '/fuel-calculator' },
      ],
    },
    { title: 'Dealers', href: '/dealers' },
    { title: 'Upcoming', href: '/upcoming' },
  ];

  // 🔑 Supabase Auth
  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setUser(session?.user || null);

      if (session?.user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (!error) setProfile(data);
      }
    };

    fetchUser();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  // 🌞🌙 Theme Toggle
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img src="/motorcycle.png" alt="Bike Icon" className="w-6 h-6" />
            <span className="font-inter font-bold text-xl text-foreground">VahanBazar</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-6">
            {navigationItems.map((item) => (
              <div key={item.title}>
                {item.items ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="font-inter font-medium">
                        {item.title}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-background border border-border">
                      {item.items.map((subItem) => (
                        <DropdownMenuItem key={subItem.label} asChild>
                          <Link
                            to={subItem.href}
                            className="font-open-sans hover:bg-muted"
                          >
                            {subItem.label}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Link to={item.href}>
                    <Button
                      variant="ghost"
                      className={`font-inter font-medium ${
                        location.pathname === item.href ? 'text-primary' : 'text-foreground'
                      }`}
                    >
                      {item.title}
                    </Button>
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Search + Theme + User */}
          <div className="hidden md:flex items-center space-x-4">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="text"
                placeholder="Search vehicles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64 font-open-sans"
              />
            </form>

            <button
              aria-label="Toggle Theme"
              onClick={() => setDarkMode(!darkMode)}
              className={`relative w-12 h-6 rounded-full transition-colors duration-500 ${
                darkMode ? 'bg-purple-700' : 'bg-yellow-300'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-all duration-500 ${
                  darkMode ? 'translate-x-6 bg-gray-900' : 'translate-x-0'
                }`}
              />
            </button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-background border border-border">
                {user ? (
                  <>
                    <DropdownMenuItem>{profile?.full_name || user.email}</DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard">Dashboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem asChild>
                      <Link to="/login">Login</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/register">Register</Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="space-y-4">

              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search vehicles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full font-open-sans"
                />
              </form>

              {/* Mobile Nav */}
              {navigationItems.map((item) => (
                <div key={item.title} className="space-y-2">
                  {item.items ? (
                    <>
                      <div className="font-inter font-medium text-foreground px-2">
                        {item.title}
                      </div>
                      {item.items.map((subItem) => (
                        <Link
                          key={subItem.label}
                          to={subItem.href}
                          className="block px-4 py-2 text-muted-foreground font-open-sans hover:text-foreground hover:bg-muted rounded-md"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {subItem.label}
                        </Link>
                      ))}
                    </>
                  ) : (
                    <Link
                      to={item.href}
                      className="block px-2 py-2 font-inter font-medium text-foreground hover:text-primary"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.title}
                    </Link>
                  )}
                </div>
              ))}

              {/* Mobile User Links */}
              <div className="pt-4 border-t border-border space-y-2">
                {user ? (
                  <>
                    <div className="px-2 font-open-sans">{profile?.full_name || user.email}</div>
                    <Link
                      to="/dashboard"
                      className="block px-2 py-2 font-open-sans text-muted-foreground hover:text-foreground"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-2 py-2 font-open-sans text-muted-foreground hover:text-foreground"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="block px-2 py-2 font-open-sans text-muted-foreground hover:text-foreground"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="block px-2 py-2 font-open-sans text-muted-foreground hover:text-foreground"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Register
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
