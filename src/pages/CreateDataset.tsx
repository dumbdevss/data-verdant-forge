import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Upload, X, Image, File, Plus, ArrowLeft, ArrowRight, Check, FileText, DollarSign, Tags } from "lucide-react";
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

const steps = [
  { id: 1, title: "Basic Information", icon: FileText },
  { id: 2, title: "Files & Pricing", icon: DollarSign },
  { id: 3, title: "Tags & Review", icon: Tags },
];

const CreateDataset = () => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    isAuction: false,
    auctionDuration: "24",
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

  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        return formData.name && formData.description && formData.category;
      case 2:
        return datasetFile && formData.price;
      case 3:
        return selectedTags.length > 0;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    } else {
      toast({
        title: "Incomplete Step",
        description: "Please fill in all required fields before proceeding.",
        variant: "destructive",
      });
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = () => {
    if (!validateStep(3)) {
      toast({
        title: "Incomplete Form",
        description: "Please complete all steps before submitting.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Dataset Created!",
      description: "Your dataset has been successfully uploaded to the marketplace.",
    });
  };

  const progressPercentage = ((currentStep - 1) / (steps.length)) * 100;

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4 lg:p-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-2xl lg:text-4xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
          Create New Dataset
        </h1>
        <p className="text-muted-foreground text-sm lg:text-lg">
          Upload your dataset and make it available on the marketplace
        </p>
      </div>

      {/* Progress */}
      <div className="space-y-4">
        <Progress value={progressPercentage} className="h-2" />
        <div className="flex justify-between items-center">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`flex flex-col items-center space-y-2 ${
                currentStep >= step.id ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <div className={`w-8 h-8 lg:w-10 lg:h-10 rounded-full flex items-center justify-center border-2 ${
                currentStep >= step.id 
                  ? 'border-primary bg-primary/10' 
                  : 'border-muted-foreground/30'
              }`}>
                {currentStep > step.id ? (
                  <Check className="w-4 h-4 lg:w-5 lg:h-5" />
                ) : (
                  <step.icon className="w-4 h-4 lg:w-5 lg:h-5" />
                )}
              </div>
              <span className="text-xs lg:text-sm font-medium hidden sm:block">{step.title}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      {currentStep === 1 && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Dataset Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Climate Data 2024"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="glass-card border-border/50"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select onValueChange={(value) => setFormData({...formData, category: value})} value={formData.category}>
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
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe your dataset, its contents, and potential use cases..."
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="glass-card border-border/50 min-h-32"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {currentStep === 2 && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Files & Pricing
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Dataset File Upload */}
            <div className="space-y-3">
              <Label>Dataset File *</Label>
              <div
                {...datasetDropzone.getRootProps()}
                className={`border-2 border-dashed rounded-lg p-6 lg:p-8 text-center cursor-pointer transition-smooth ${
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

            {/* Pricing */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="price">Price (ETH) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.001"
                  placeholder="0.5"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  className="glass-card border-border/50"
                />
              </div>

              <div className="space-y-2">
                <Label>Sale Type</Label>
                <div className="flex items-center space-x-2 p-3 glass-card border border-border/50 rounded-lg">
                  <Switch
                    checked={formData.isAuction}
                    onCheckedChange={(checked) => setFormData({...formData, isAuction: checked})}
                  />
                  <Label>Enable Auction</Label>
                </div>
              </div>
            </div>

            {formData.isAuction && (
              <div className="space-y-2">
                <Label htmlFor="auctionDuration">Auction Duration (hours)</Label>
                <Select onValueChange={(value) => setFormData({...formData, auctionDuration: value})} value={formData.auctionDuration}>
                  <SelectTrigger className="glass-card border-border/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="24">24 hours</SelectItem>
                    <SelectItem value="48">48 hours</SelectItem>
                    <SelectItem value="72">72 hours</SelectItem>
                    <SelectItem value="168">7 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {currentStep === 3 && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tags className="w-5 h-5" />
              Tags & Review
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
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
      )}

      {currentStep === 4 && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Review & Submit</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold">Dataset Information</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Name:</span> {formData.name}</p>
                  <p><span className="font-medium">Category:</span> {formData.category}</p>
                  <p><span className="font-medium">Description:</span> {formData.description}</p>
                  <p><span className="font-medium">Price:</span> {formData.price} ETH</p>
                  <p><span className="font-medium">Sale Type:</span> {formData.isAuction ? `Auction (${formData.auctionDuration}h)` : 'Fixed Price'}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-semibold">Files & Tags</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Dataset File:</span> {datasetFile?.name}</p>
                  <p><span className="font-medium">File Size:</span> {datasetFile ? (datasetFile.size / 1024 / 1024).toFixed(2) + ' MB' : 'N/A'}</p>
                  <p><span className="font-medium">Thumbnail:</span> {thumbnailFile ? 'Uploaded' : 'None'}</p>
                  <div>
                    <span className="font-medium">Tags:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedTags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center pt-6">
        <Button
          onClick={prevStep}
          variant="outline"
          disabled={currentStep === 1}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Previous
        </Button>

        {currentStep < 4 ? (
          <Button
            onClick={nextStep}
            className="flex items-center gap-2"
          >
            Next
            <ArrowRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            className="flex items-center gap-2 min-w-32"
          >
            <Check className="w-4 h-4" />
            Submit
          </Button>
        )}
      </div>
    </div>
  );
};

export default CreateDataset;