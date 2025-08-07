import { useState } from "react";
import { useParams } from "react-router-dom";
import { Clock, Download, Eye, Star, Tag, User, Calendar, Gavel, ShoppingCart, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

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
  fileSize: number;
  isActive: boolean;
}

interface Transaction {
  id: string;
  buyer: string;
  seller: string;
  amount: string;
  timestamp: number;
  type: "DirectPurchase" | "AuctionSale";
}

interface Bid {
  bidder: string;
  amount: string;
  timestamp: number;
}

const mockDataset: Dataset = {
  id: "1",
  name: "Climate Data 2024",
  description: "Comprehensive climate and weather data from global weather stations across 195 countries. This dataset includes temperature, humidity, precipitation, wind speed, and atmospheric pressure measurements collected hourly over the past 12 months. Perfect for climate research, machine learning models, and environmental analysis.",
  category: "Environmental",
  price: "0.5 ETH",
  isAuction: false,
  thumbnail: "/api/placeholder/600/400",
  tags: ["climate", "weather", "global", "hourly", "temperature", "precipitation"],
  downloadCount: 1250,
  owner: "0x1234567890abcdef1234567890abcdef12345678",
  uploadTimestamp: Date.now() - 86400000,
  fileSize: 2500000000, // 2.5GB
  isActive: true,
};

const mockTransactions: Transaction[] = [
  {
    id: "1",
    buyer: "0x9876...4321",
    seller: "0x1234...5678",
    amount: "0.5 ETH",
    timestamp: Date.now() - 3600000,
    type: "DirectPurchase",
  },
  {
    id: "2",
    buyer: "0x5555...1111",
    seller: "0x1234...5678",
    amount: "0.5 ETH",
    timestamp: Date.now() - 7200000,
    type: "DirectPurchase",
  },
];

const mockBids: Bid[] = [
  {
    bidder: "0x9999...8888",
    amount: "0.45 ETH",
    timestamp: Date.now() - 1800000,
  },
  {
    bidder: "0x7777...6666",
    amount: "0.4 ETH",
    timestamp: Date.now() - 3600000,
  },
];

const DatasetDetail = () => {
  const { id } = useParams();
  const [bidAmount, setBidAmount] = useState("");
  const [isOwner] = useState(false); // This would be determined by wallet connection
  
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const PurchaseModal = () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="lg" className="flex-1">
          <ShoppingCart className="w-4 h-4 mr-2" />
          Purchase Dataset
        </Button>
      </DialogTrigger>
      <DialogContent className="glass-card">
        <DialogHeader>
          <DialogTitle>Purchase Dataset</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Dataset</Label>
            <p className="font-medium">{mockDataset.name}</p>
          </div>
          <div className="space-y-2">
            <Label>Price</Label>
            <p className="text-2xl font-bold text-primary">{mockDataset.price}</p>
          </div>
          <div className="space-y-2">
            <Label>File Size</Label>
            <p>{formatBytes(mockDataset.fileSize)}</p>
          </div>
          <Separator />
          <div className="flex items-center justify-between font-semibold">
            <span>Total</span>
            <span className="text-xl text-primary">{mockDataset.price}</span>
          </div>
          <Button className="w-full" size="lg">
            Confirm Purchase
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  const BidModal = () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="lg" className="flex-1">
          <Gavel className="w-4 h-4 mr-2" />
          Place Bid
        </Button>
      </DialogTrigger>
      <DialogContent className="glass-card">
        <DialogHeader>
          <DialogTitle>Place a Bid</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Dataset</Label>
            <p className="font-medium">{mockDataset.name}</p>
          </div>
          <div className="space-y-2">
            <Label>Current Highest Bid</Label>
            <p className="text-lg font-semibold">{mockBids[0]?.amount || "No bids yet"}</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="bidAmount">Your Bid (ETH)</Label>
            <Input
              id="bidAmount"
              type="number"
              step="0.001"
              placeholder="0.6"
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              className="glass-card border-border/50"
            />
          </div>
          <Button className="w-full" size="lg">
            Place Bid
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h1 className="text-4xl font-bold mb-4">{mockDataset.name}</h1>
            <p className="text-lg text-muted-foreground">{mockDataset.description}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {mockDataset.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="px-3 py-1">
                <Tag className="w-3 h-3 mr-1" />
                {tag}
              </Badge>
            ))}
          </div>

          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{mockDataset.downloadCount}</div>
                  <div className="text-sm text-muted-foreground flex items-center justify-center">
                    <Download className="w-4 h-4 mr-1" />
                    Downloads
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{formatBytes(mockDataset.fileSize)}</div>
                  <div className="text-sm text-muted-foreground">File Size</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{mockDataset.category}</div>
                  <div className="text-sm text-muted-foreground">Category</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">CSV</div>
                  <div className="text-sm text-muted-foreground">Format</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Dataset Image */}
          <Card className="glass-card overflow-hidden">
            <img 
              src={mockDataset.thumbnail} 
              alt={mockDataset.name}
              className="w-full h-64 object-cover"
            />
          </Card>

          {/* Price & Actions */}
          <Card className="glass-card">
            <CardContent className="p-6 space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{mockDataset.price}</div>
                {mockDataset.isAuction && (
                  <div className="text-sm text-muted-foreground">Current bid</div>
                )}
              </div>

              {isOwner ? (
                <div className="space-y-2">
                  <Button variant="outline" className="w-full">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Delist Dataset
                  </Button>
                  {mockDataset.isAuction && (
                    <Button variant="destructive" className="w-full">
                      Cancel Auction
                    </Button>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  {mockDataset.isAuction ? (
                    <BidModal />
                  ) : (
                    <PurchaseModal />
                  )}
                </div>
              )}

              <Separator />

              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Owner</span>
                  <span className="font-mono">{mockDataset.owner.slice(0, 6)}...{mockDataset.owner.slice(-4)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Uploaded</span>
                  <span>{formatDate(mockDataset.uploadTimestamp)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3 glass-card">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          {mockDataset.isAuction && (
            <TabsTrigger value="bids">Bid History</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Dataset Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Description</h4>
                    <p className="text-muted-foreground">{mockDataset.description}</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Category</h4>
                    <Badge variant="secondary">{mockDataset.category}</Badge>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">File Information</h4>
                    <div className="space-y-1 text-sm">
                      <div>Size: {formatBytes(mockDataset.fileSize)}</div>
                      <div>Format: CSV</div>
                      <div>Rows: ~1.2M records</div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Usage Rights</h4>
                    <p className="text-sm text-muted-foreground">
                      Commercial and non-commercial use allowed with attribution
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 border border-border/50 rounded-lg">
                    <div className="space-y-1">
                      <div className="font-medium">
                        {transaction.type === "DirectPurchase" ? "Direct Purchase" : "Auction Sale"}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        From {transaction.seller.slice(0, 6)}...{transaction.seller.slice(-4)} to {transaction.buyer.slice(0, 6)}...{transaction.buyer.slice(-4)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-primary">{transaction.amount}</div>
                      <div className="text-sm text-muted-foreground">
                        {formatDate(transaction.timestamp)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {mockDataset.isAuction && (
          <TabsContent value="bids" className="space-y-4">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Bid History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockBids.map((bid, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border border-border/50 rounded-lg">
                      <div className="space-y-1">
                        <div className="font-medium">
                          {bid.bidder.slice(0, 6)}...{bid.bidder.slice(-4)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {formatDate(bid.timestamp)}
                        </div>
                      </div>
                      <div className="font-bold text-primary">{bid.amount}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default DatasetDetail;