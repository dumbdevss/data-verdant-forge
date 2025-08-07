import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Upload, X, Image, File, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const categories = [
  "Environmental",
  "Business",
  "Healthcare",
  "Technology",
  "Finance",
  "Education",
  "Research",
  "Social Media",
];

const suggestedTags = [
  "machine-learning", "analytics", "research", "real-time", "historical",
  "financial", "social", "geographical", "temporal", "survey", "experimental"
];

const CreateDataset = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    isAuction: false,
  });
  const [datasetFile, setDatasetFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState("");

  const onDatasetDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setDatasetFile(acceptedFiles[0]);
    }
  }, []);

  const onThumbnailDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setThumbnailFile(acceptedFiles[0]);
    }
  }, []);

  const datasetDropzone = useDropzone({
    onDrop: onDatasetDrop,
    maxFiles: 1,
    accept: {
      'text/csv': ['.csv'],
      'application/json': ['.json'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/x-parquet': ['.parquet'],
    }
  });

  const thumbnailDropzone = useDropzone({
    onDrop: onThumbnailDrop,
    maxFiles: 1,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
    }
  });

  const addTag = (tag: string) => {
    if (!selectedTags.includes(tag) && selectedTags.length < 10) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const removeTag = (tag: string) => {
    setSelectedTags(selectedTags.filter(t => t !== tag));
  };

  const addCustomTag = () => {
    if (customTag.trim() && !selectedTags.includes(customTag.trim())) {
      addTag(customTag.trim());
      setCustomTag("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!datasetFile) {
      toast({
        title: "Missing Dataset File",
        description: "Please upload a dataset file to continue.",
        variant: "destructive",
      });
      return;
    }

    // Here you would typically upload to blockchain/IPFS
    toast({
      title: "Dataset Created!",
      description: "Your dataset has been successfully uploaded to the marketplace.",
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
          Create New Dataset
        </h1>
        <p className="text-muted-foreground text-lg">
          Upload your dataset and make it available on the marketplace
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Dataset Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Climate Data 2024"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="glass-card border-border/50"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select onValueChange={(value) => setFormData({...formData, category: value})}>
                  <SelectTrigger className="glass-card border-border/50">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your dataset, its contents, and potential use cases..."
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="glass-card border-border/50 min-h-24"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price (ETH)</Label>
              <Input
                id="price"
                type="number"
                step="0.001"
                placeholder="0.5"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                className="glass-card border-border/50"
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* File Uploads */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>File Uploads</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Dataset File Upload */}
            <div className="space-y-3">
              <Label>Dataset File</Label>
              <div
                {...datasetDropzone.getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-smooth ${
                  datasetDropzone.isDragActive 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <input {...datasetDropzone.getInputProps()} />
                {datasetFile ? (
                  <div className="space-y-2">
                    <File className="w-12 h-12 mx-auto text-primary" />
                    <p className="font-medium">{datasetFile.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(datasetFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="w-12 h-12 mx-auto text-muted-foreground" />
                    <p className="text-lg font-medium">Drop your dataset file here</p>
                    <p className="text-muted-foreground">
                      Supports CSV, JSON, XLSX, and Parquet files
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Thumbnail Upload */}
            <div className="space-y-3">
              <Label>Dataset Thumbnail (Optional)</Label>
              <div
                {...thumbnailDropzone.getRootProps()}
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-smooth ${
                  thumbnailDropzone.isDragActive 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <input {...thumbnailDropzone.getInputProps()} />
                {thumbnailFile ? (
                  <div className="space-y-2">
                    <img 
                      src={URL.createObjectURL(thumbnailFile)} 
                      alt="Thumbnail preview"
                      className="w-24 h-24 mx-auto object-cover rounded-lg"
                    />
                    <p className="font-medium">{thumbnailFile.name}</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Image className="w-8 h-8 mx-auto text-muted-foreground" />
                    <p className="font-medium">Upload thumbnail image</p>
                    <p className="text-sm text-muted-foreground">
                      PNG, JPG, or WebP format
                    </p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tags */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Tags</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {selectedTags.map((tag) => (
                <Badge
                  key={tag}
                  variant="default"
                  className="px-3 py-1 cursor-pointer hover:bg-primary/80"
                  onClick={() => removeTag(tag)}
                >
                  {tag}
                  <X className="w-3 h-3 ml-1" />
                </Badge>
              ))}
            </div>

            <div className="space-y-3">
              <Label>Suggested Tags</Label>
              <div className="flex flex-wrap gap-2">
                {suggestedTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="cursor-pointer hover:bg-accent"
                    onClick={() => addTag(tag)}
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Input
                placeholder="Add custom tag"
                value={customTag}
                onChange={(e) => setCustomTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomTag())}
                className="glass-card border-border/50"
              />
              <Button type="button" onClick={addCustomTag} variant="outline">
                Add
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="text-center">
          <Button type="submit" size="xl" className="min-w-48">
            Create Dataset
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateDataset;