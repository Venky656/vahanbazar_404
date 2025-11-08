import React from "react";
import { Link } from "react-router-dom";
import { Calculator, MapPin, Calendar, Users, Zap, Fuel } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import SearchBar from "@/components/common/SearchBar";
import FeaturedVehicles from "@/components/home/FeaturedVehicles";

const Index = () => {
  const categories = [
    {
      title: "Motorcycles",
      description: "Powerful bikes for every rider",
      icon: <Fuel className="w-8 h-8" />,
      href: "/vehicles?category=bike",
      color: "bg-primary/10 text-primary",
    },
    {
      title: "Scooters",
      description: "Convenient urban mobility",
      icon: <Users className="w-8 h-8" />,
      href: "/vehicles?category=scooter",
      color: "bg-secondary/10 text-secondary",
    },
    {
      title: "Electric Vehicles",
      description: "Future of transportation",
      icon: <Zap className="w-8 h-8" />,
      href: "/vehicles?category=ev",
      color: "bg-accent/10 text-accent",
    },
  ];

  const quickTools = [
    {
      title: "EMI Calculator",
      description: "Calculate monthly payments",
      icon: <Calculator className="w-6 h-6" />,
      href: "/emi-calculator",
    },
    {
      title: "Find Dealers",
      description: "Locate nearby showrooms",
      icon: <MapPin className="w-6 h-6" />,
      href: "/dealers",
    },
    {
      title: "Upcoming Launches",
      description: "Stay updated with new models",
      icon: <Calendar className="w-6 h-6" />,
      href: "/upcoming",
    },
  ];

  const popularBrands = [
    "Honda",
    "TVS",
    "Bajaj",
    "Hero",
    "Royal Enfield",
    "Yamaha",
    "KTM",
    "Suzuki",
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/5 to-background py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h1 className="font-inter font-bold text-4xl md:text-6xl text-foreground">
                Find Your Perfect{" "}
                <span className="text-primary block">Two-Wheeler</span>
              </h1>
              <p className="font-open-sans text-xl text-muted-foreground max-w-2xl mx-auto">
                Discover, compare, and buy motorcycles, scooters, and electric
                vehicles with confidence. Your complete two-wheeler marketplace.
              </p>
            </div>

            {/* Hero Search */}
            <div className="max-w-2xl mx-auto">
              <SearchBar
                size="lg"
                placeholder="Search for bikes, scooters, brands..."
                showRecentSearches={true}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-inter font-bold text-3xl text-foreground mb-4">
              Browse by Category
            </h2>
            <p className="font-open-sans text-muted-foreground max-w-2xl mx-auto">
              Explore our extensive collection of two-wheelers across different
              categories
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((category) => (
              <Link key={category.title} to={category.href}>
                <Card className="group hover:shadow-lg transition-all duration-300 h-full">
                  <CardContent className="p-8 text-center space-y-4">
                    <div
                      className={`w-16 h-16 rounded-full ${category.color} flex items-center justify-center mx-auto group-hover:scale-110 transition-transform`}
                    >
                      {category.icon}
                    </div>
                    <div>
                      <h3 className="font-inter font-semibold text-xl text-foreground mb-2">
                        {category.title}
                      </h3>
                      <p className="font-open-sans text-muted-foreground">
                        {category.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Tools Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-inter font-bold text-3xl text-foreground mb-4">
              Quick Tools
            </h2>
            <p className="font-open-sans text-muted-foreground">
              Make informed decisions with our helpful calculators and tools
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickTools.map((tool) => (
              <Link key={tool.title} to={tool.href}>
                <Card className="group hover:shadow-md transition-all duration-300">
                  <CardContent className="p-6 flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      {tool.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-inter font-semibold text-foreground">
                        {tool.title}
                      </h3>
                      <p className="font-open-sans text-sm text-muted-foreground">
                        {tool.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Brands Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-inter font-bold text-3xl text-foreground mb-4">
              Popular Brands
            </h2>
            <p className="font-open-sans text-muted-foreground">
              Explore vehicles from top manufacturers
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {popularBrands.map((brand) => (
              <Link
                key={brand}
                to={`/vehicles?brand=${brand.toLowerCase()}`}
                className="group"
              >
                <Card className="hover:shadow-md transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/10 transition-colors">
                      <span className="font-inter font-bold text-lg text-muted-foreground group-hover:text-primary">
                        {brand.charAt(0)}
                      </span>
                    </div>
                    <p className="font-open-sans text-sm font-medium text-foreground">
                      {brand}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Vehicles Section */}
      <FeaturedVehicles />

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="space-y-4">
            <h2 className="font-inter font-bold text-3xl md:text-4xl">
              Ready to Find Your Dream Ride?
            </h2>
            <p className="font-open-sans text-xl opacity-90">
              Join thousands of satisfied customers who found their perfect
              vehicle with VahanBazar
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              variant="secondary"
              size="lg"
              className="px-8 h-12 font-inter"
            >
              <Link to="/vehicles">Browse Vehicles</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="px-8 h-12 font-inter bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
            >
              <Link to="/sell">Sell Your Vehicle</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
