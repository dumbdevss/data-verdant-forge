import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Eye, Edit, Trash2, Clock, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  uploadTimestamp: number;
  isActive: boolean;
  earnings: string;
}

const mockOwnedDatasets: Dataset[] = [
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
    uploadTimestamp: Date.now() - 86400000,
    isActive: true,
    earnings: "15.5 ETH",
  },
  {
    id: "2",
    name: "Social Media Analytics",
    description: "User engagement patterns across social platforms",
    category: "Social Media",
    price: "Starting at 0.3 ETH",
    isAuction: true,
    thumbnail: "/api/placeholder/300/200",
    tags: ["social", "analytics", "engagement"],
    downloadCount: 432,
    uploadTimestamp: Date.now() - 172800000,
    isActive: true,
    earnings: "8.2 ETH",
  },
];

const mockPurchasedDatasets: Dataset[] = [
  {
    id: "3",
    name: "E-commerce Transactions",
    description: "Anonymized transaction data from major e-commerce platforms",
    category: "Business",
    price: "0.8 ETH",
    isAuction: false,
    thumbnail: "/api/placeholder/300/200",
    tags: ["ecommerce", "transactions", "business"],
    downloadCount: 856,
    uploadTimestamp: Date.now() - 259200000,
    isActive: true,
    earnings: "0",
  },
];

const MyDatasets = () => {
  const [activeTab, setActiveTab] = useState("owned");

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const DatasetCard = ({ dataset, isOwned = false }: { dataset: Dataset; isOwned?: boolean }) => (
    <Card className="glass-card hover:border-primary/50 transition-smooth">
      <div className="relative overflow-hidden rounded-t-lg">
        <img
          src={dataset.thumbnail}
          alt={dataset.name}
          className="w-full h-48 object-cover"
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
        {!dataset.isActive && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Badge variant="destructive" className="text-sm">
              Delisted
            </Badge>
          </div>
        )}
      </div>
      
      <CardContent className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-lg">{dataset.name}</h3>
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
            {isOwned && (
              <div className="text-sm text-muted-foreground">
                Earned: {dataset.earnings}
              </div>
            )}
          </div>
        </div>

        <div className="flex space-x-2 pt-2">
          <Link to={`/dataset/${dataset.id}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full">
              <Eye className="w-4 h-4 mr-2" />
              View
            </Button>
          </Link>
          {isOwned && (
            <>
              <Button variant="outline" size="sm">
                <Edit className="w-4 h-4" />
              </Button>
              <Button variant="destructive" size="sm">
                <Trash2 className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>

        <div className="text-xs text-muted-foreground text-center">
          Uploaded {formatDate(dataset.uploadTimestamp)}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
            My Datasets
          </h1>
          <p className="text-muted-foreground text-lg mt-2">
            Manage your uploaded datasets and view your purchases
          </p>
        </div>
        <Link to="/create">
          <Button size="lg" className="flex items-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>Create Dataset</span>
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Total Datasets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockOwnedDatasets.length}</div>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Total Downloads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockOwnedDatasets.reduce((sum, dataset) => sum + dataset.downloadCount, 0)}
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Total Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">23.7 ETH</div>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Purchased</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockPurchasedDatasets.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 glass-card">
          <TabsTrigger value="owned">My Uploads ({mockOwnedDatasets.length})</TabsTrigger>
          <TabsTrigger value="purchased">Purchased ({mockPurchasedDatasets.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="owned" className="space-y-6">
          {mockOwnedDatasets.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {mockOwnedDatasets.map((dataset) => (
                <DatasetCard key={dataset.id} dataset={dataset} isOwned={true} />
              ))}
            </div>
          ) : (
            <Card className="glass-card">
              <CardContent className="p-12 text-center">
                <div className="text-muted-foreground space-y-4">
                  <div className="text-6xl">📊</div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">No datasets uploaded yet</h3>
                    <p>Start by creating your first dataset to earn from your data</p>
                  </div>
                  <Link to="/create">
                    <Button size="lg" className="mt-4">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Your First Dataset
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="purchased" className="space-y-6">
          {mockPurchasedDatasets.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {mockPurchasedDatasets.map((dataset) => (
                <DatasetCard key={dataset.id} dataset={dataset} isOwned={false} />
              ))}
            </div>
          ) : (
            <Card className="glass-card">
              <CardContent className="p-12 text-center">
                <div className="text-muted-foreground space-y-4">
                  <div className="text-6xl">🛒</div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">No purchases yet</h3>
                    <p>Browse the marketplace to find datasets for your projects</p>
                  </div>
                  <Link to="/">
                    <Button size="lg" className="mt-4">
                      Browse Marketplace
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MyDatasets;