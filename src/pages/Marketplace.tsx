import { useState } from "react";
import { Search, Filter, Clock, Zap, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Link } from "react-router-dom";

interface Dataset {
  id: string;
  name: string;
  description: string;
  category: string;
  price: string;
  isAuction: boolean;
  thumbnail: string;
  tags: string[];
  downloadCount: number;
  owner: string;
  uploadTimestamp: number;
}

const mockDatasets: Dataset[] = [
  {
    id: "1",
    name: "Climate Data 2024",
    description: "Comprehensive climate and weather data from global stations",
    category: "Environmental",
    price: "0.5 ETH",
    isAuction: false,
    thumbnail: "/api/placeholder/300/200",
    tags: ["climate", "weather", "global"],
    downloadCount: 1250,
    owner: "0x1234...5678",
    uploadTimestamp: Date.now() - 86400000,
  },
  {
    id: "2",
    name: "E-commerce Transactions",
    description: "Anonymized transaction data from major e-commerce platforms",
    category: "Business",
    price: "Starting at 0.2 ETH",
    isAuction: true,
    thumbnail: "/api/placeholder/300/200",
    tags: ["ecommerce", "transactions", "business"],
    downloadCount: 856,
    owner: "0x9876...4321",
    uploadTimestamp: Date.now() - 172800000,
  },
  {
    id: "3",
    name: "Medical Research Data",
    description: "Clinical trial data for cardiovascular research",
    category: "Healthcare",
    price: "1.2 ETH",
    isAuction: false,
    thumbnail: "/api/placeholder/300/200",
    tags: ["medical", "clinical", "research"],
    downloadCount: 543,
    owner: "0x5555...1111",
    uploadTimestamp: Date.now() - 259200000,
  },
];

const categories = ["All", "Environmental", "Business", "Healthcare", "Technology", "Finance"];

const Marketplace = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceRange, setPriceRange] = useState("all");

  const filteredDatasets = mockDatasets.filter((dataset) => {
    const matchesSearch = dataset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         dataset.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         dataset.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === "All" || dataset.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
          Dataset Marketplace
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Discover, purchase, and sell high-quality datasets on the blockchain
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-2xl mx-auto">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
        <Input
          placeholder="Search datasets, categories, or tags..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-12 h-12 text-base glass-card border-border/50"
        />
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="lg:w-80 space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Filter className="w-5 h-5" />
                <h3 className="font-semibold">Filters</h3>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Category Filter */}
              <div>
                <h4 className="font-medium mb-3">Category</h4>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                      className="w-full justify-start"
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div>
                <h4 className="font-medium mb-3">Price Range</h4>
                <div className="space-y-2">
                  {[
                    { value: "all", label: "All Prices" },
                    { value: "under-0.5", label: "Under 0.5 ETH" },
                    { value: "0.5-1", label: "0.5 - 1 ETH" },
                    { value: "over-1", label: "Over 1 ETH" },
                  ].map((range) => (
                    <Button
                      key={range.value}
                      variant={priceRange === range.value ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setPriceRange(range.value)}
                      className="w-full justify-start"
                    >
                      {range.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Sale Type Filter */}
              <div>
                <h4 className="font-medium mb-3">Sale Type</h4>
                <div className="space-y-2">
                  <Button variant="ghost" size="sm" className="w-full justify-start">
                    <Zap className="w-4 h-4 mr-2" />
                    Instant Sale
                  </Button>
                  <Button variant="ghost" size="sm" className="w-full justify-start">
                    <Clock className="w-4 h-4 mr-2" />
                    Auction
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Datasets Grid */}
        <div className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredDatasets.map((dataset) => (
              <Link key={dataset.id} to={`/dataset/${dataset.id}`}>
                <Card className="glass-card hover:border-primary/50 transition-smooth cursor-pointer group">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img
                      src={dataset.thumbnail}
                      alt={dataset.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-smooth"
                    />
                    <div className="absolute top-3 right-3">
                      {dataset.isAuction ? (
                        <Badge className="bg-orange-500/90 text-white">
                          <Clock className="w-3 h-3 mr-1" />
                          Auction
                        </Badge>
                      ) : (
                        <Badge className="bg-primary/90 text-primary-foreground">
                          <Zap className="w-3 h-3 mr-1" />
                          Instant
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <CardContent className="p-4 space-y-3">
                    <div>
                      <h3 className="font-semibold text-lg group-hover:text-primary transition-smooth">
                        {dataset.name}
                      </h3>
                      <p className="text-muted-foreground text-sm line-clamp-2">
                        {dataset.description}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {dataset.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-border/50">
                      <div className="flex items-center space-x-1 text-muted-foreground text-sm">
                        <Eye className="w-4 h-4" />
                        <span>{dataset.downloadCount}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-primary">
                          {dataset.price}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;