import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Checkbox } from '@/components/ui/checkbox.jsx'
import { 
  Plus, 
  Search, 
  Settings, 
  Users, 
  FileText, 
  Download, 
  Edit, 
  Trash2, 
  Copy,
  BarChart3,
  Server,
  Shield,
  Monitor,
  Wrench,
  GraduationCap,
  Smartphone,
  Printer,
  Building
} from 'lucide-react'
import Papa from 'papaparse'
import { Document, Packer, Paragraph, TextRun } from 'docx'
import { saveAs } from 'file-saver'
import './App.css'

// Sample data structure
const initialServices = [
  {
    id: '1',
    serviceName: 'Office 365 Setup',
    category: 'Apps & Software',
    shortDescription: 'Complete Office 365 setup and configuration',
    description: 'Microsoft Office 365 setup including user accounts, email configuration, and basic training.',
    pricing: { type: 'fixed', amount: 150, currency: 'USD', period: 'one-time', displayText: '$150 one-time' },
    serviceLevel: { responseTime: '4 hours', resolutionTime: '24 hours', availability: '9 AM - 5 PM', emergencySupport: false },
    status: 'active',
    featured: true,
    tags: ['office', 'email', 'productivity']
  },
  {
    id: '2',
    serviceName: 'Network Monitoring',
    category: 'Monitoring',
    shortDescription: '24/7 network monitoring and alerting',
    description: 'Continuous monitoring of network infrastructure with proactive alerting and issue resolution.',
    pricing: { type: 'fixed', amount: 99, currency: 'USD', period: 'monthly', displayText: '$99/month' },
    serviceLevel: { responseTime: '15 minutes', resolutionTime: '2 hours', availability: '24/7', emergencySupport: true },
    status: 'active',
    featured: true,
    tags: ['monitoring', 'network', 'proactive']
  },
  {
    id: '3',
    serviceName: 'Backup Service',
    category: 'Security',
    shortDescription: 'Automated backup and recovery solution',
    description: 'Comprehensive backup solution with automated daily backups and quick recovery options.',
    pricing: { type: 'fixed', amount: 75, currency: 'USD', period: 'monthly', displayText: '$75/month' },
    serviceLevel: { responseTime: '2 hours', resolutionTime: '4 hours', availability: '9 AM - 6 PM', emergencySupport: true },
    status: 'active',
    featured: false,
    tags: ['backup', 'security', 'recovery']
  }
]

const categories = [
  { value: 'Apps & Software', label: 'Apps & Software', icon: Server },
  { value: 'Security', label: 'Security', icon: Shield },
  { value: 'Monitoring', label: 'Monitoring', icon: Monitor },
  { value: 'Hardware', label: 'Hardware', icon: Wrench },
  { value: 'Training', label: 'Training', icon: GraduationCap },
  { value: 'Phones & Tablets', label: 'Phones & Tablets', icon: Smartphone },
  { value: 'Printing', label: 'Printing', icon: Printer },
  { value: 'Business Operations', label: 'Business Operations', icon: Building }
]

function App() {
  const [services, setServices] = useState(initialServices)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [activeTab, setActiveTab] = useState('dashboard')
  const [isAddServiceOpen, setIsAddServiceOpen] = useState(false)
  const [editingService, setEditingService] = useState(null)

  // Form state for adding/editing services
  const [formData, setFormData] = useState({
    serviceName: '',
    category: '',
    shortDescription: '',
    description: '',
    pricingType: 'fixed',
    amount: '',
    period: 'monthly',
    responseTime: '',
    resolutionTime: '',
    availability: '',
    emergencySupport: false,
    tags: ''
  })

  // Load data from localStorage on mount
  useEffect(() => {
    const savedServices = localStorage.getItem('msp-services')
    if (savedServices) {
      setServices(JSON.parse(savedServices))
    }
  }, [])

  // Save to localStorage whenever services change
  useEffect(() => {
    localStorage.setItem('msp-services', JSON.stringify(services))
  }, [services])

  // Filter services based on search and category
  const filteredServices = services.filter(service => {
    const matchesSearch = service.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault()
    
    const serviceData = {
      id: editingService ? editingService.id : Date.now().toString(),
      serviceName: formData.serviceName,
      category: formData.category,
      shortDescription: formData.shortDescription,
      description: formData.description,
      pricing: {
        type: formData.pricingType,
        amount: parseFloat(formData.amount) || 0,
        currency: 'USD',
        period: formData.period,
        displayText: `$${formData.amount}${formData.period === 'one-time' ? ' one-time' : '/' + formData.period}`
      },
      serviceLevel: {
        responseTime: formData.responseTime,
        resolutionTime: formData.resolutionTime,
        availability: formData.availability,
        emergencySupport: formData.emergencySupport
      },
      status: 'active',
      featured: false,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
    }

    if (editingService) {
      setServices(services.map(s => s.id === editingService.id ? serviceData : s))
    } else {
      setServices([...services, serviceData])
    }

    // Reset form
    setFormData({
      serviceName: '',
      category: '',
      shortDescription: '',
      description: '',
      pricingType: 'fixed',
      amount: '',
      period: 'monthly',
      responseTime: '',
      resolutionTime: '',
      availability: '',
      emergencySupport: false,
      tags: ''
    })
    setIsAddServiceOpen(false)
    setEditingService(null)
  }

  // Handle edit service
  const handleEdit = (service) => {
    setEditingService(service)
    setFormData({
      serviceName: service.serviceName,
      category: service.category,
      shortDescription: service.shortDescription,
      description: service.description,
      pricingType: service.pricing.type,
      amount: service.pricing.amount.toString(),
      period: service.pricing.period,
      responseTime: service.serviceLevel.responseTime,
      resolutionTime: service.serviceLevel.resolutionTime,
      availability: service.serviceLevel.availability,
      emergencySupport: service.serviceLevel.emergencySupport,
      tags: service.tags.join(', ')
    })
    setIsAddServiceOpen(true)
  }

  // Handle delete service
  const handleDelete = (serviceId) => {
    setServices(services.filter(s => s.id !== serviceId))
  }

  // Handle duplicate service
  const handleDuplicate = (service) => {
    const duplicatedService = {
      ...service,
      id: Date.now().toString(),
      serviceName: service.serviceName + ' (Copy)'
    }
    setServices([...services, duplicatedService])
  }

  // Stats for dashboard
  const stats = {
    totalServices: services.length,
    activeServices: services.filter(s => s.status === 'active').length,
    featuredServices: services.filter(s => s.featured).length,
    categories: [...new Set(services.map(s => s.category))].length
  }

  // Export to CSV
  const handleExportCSV = () => {
    const csvData = services.map(service => ({
      ServiceName: service.serviceName,
      Category: service.category,
      ShortDescription: service.shortDescription,
      Description: service.description,
      Pricing: service.pricing.displayText,
      ResponseTime: service.serviceLevel.responseTime,
      ResolutionTime: service.serviceLevel.resolutionTime,
      Availability: service.serviceLevel.availability,
      EmergencySupport: service.serviceLevel.emergencySupport,
      Tags: service.tags.join(", ")
    }));
    const csv = Papa.unparse(csvData);
    console.log('CSV Content:', csv);
    console.log(csv);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'msp-service-catalog.csv');
  }

  // Export to Word
  const handleExportWord = () => {
    const doc = new Document({
      sections: [
        {
          children: services.map(service => 
            new Paragraph({
              children: [
                new TextRun({ text: service.serviceName, bold: true, size: 28 }),
                new TextRun({ text: `Category: ${service.category}`, break: 1 }),
                new TextRun({ text: `Description: ${service.description}`, break: 1 }),
                new TextRun({ text: `Pricing: ${service.pricing.displayText}`, break: 1 }),
              ]
            })
          )
        }
      ]
    });

    Packer.toBlob(doc).then(blob => {
      saveAs(blob, "msp-service-catalog.docx");
    });
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900">MSP Service Catalog</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Export Service Catalog</DialogTitle>
                  <DialogDescription>
                    Select a format to export your service catalog.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4 py-4">
                  <Button onClick={handleExportCSV}>Export as CSV</Button>
                  <Button onClick={handleExportWord}>Export as Word</Button>
                </div>
              </DialogContent>
            </Dialog>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="clients">Clients</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Services</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalServices}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Services</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.activeServices}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Featured Services</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.featuredServices}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Categories</CardTitle>
                  <Building className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.categories}</div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common tasks and operations</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => setIsAddServiceOpen(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Service
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Users className="h-4 w-4 mr-2" />
                    Manage Clients
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Generate Report
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export Catalog
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest updates and changes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="text-sm">Office 365 Setup service updated</div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div className="text-sm">Network Monitoring service added</div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <div className="text-sm">Backup Service pricing modified</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services" className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search services..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={() => setIsAddServiceOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Service
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices.map(service => (
                <Card key={service.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{service.serviceName}</CardTitle>
                        <CardDescription className="mt-1">{service.shortDescription}</CardDescription>
                      </div>
                      <Badge variant={service.status === 'active' ? 'default' : 'secondary'}>
                        {service.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Category:</span>
                        <Badge variant="outline">{service.category}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Price:</span>
                        <span className="font-semibold">{service.pricing.displayText}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Response:</span>
                        <span className="font-semibold">{service.serviceLevel.responseTime}</span>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center space-x-2">
                        {service.tags.map(tag => (
                          <Badge key={tag} variant="secondary">{tag}</Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-end space-x-2 mt-4">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(service)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDuplicate(service)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(service.id)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Add/Edit Service Dialog */}
      <Dialog open={isAddServiceOpen} onOpenChange={setIsAddServiceOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingService ? 'Edit Service' : 'Add New Service'}</DialogTitle>
            <DialogDescription>
              Fill in the details to {editingService ? 'update the' : 'create a new'} service.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="serviceName">Service Name *</Label>
                <Input id="serviceName" value={formData.serviceName} onChange={(e) => setFormData({...formData, serviceName: e.target.value})} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="shortDescription">Short Description *</Label>
              <Input id="shortDescription" value={formData.shortDescription} onChange={(e) => setFormData({...formData, shortDescription: e.target.value})} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Detailed Description</Label>
              <Textarea id="description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="pricingType">Pricing Type</Label>
                <Select value={formData.pricingType} onValueChange={(value) => setFormData({...formData, pricingType: value})}>
                  <SelectTrigger id="pricingType">
                    <SelectValue placeholder="Select pricing type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fixed">Fixed Price</SelectItem>
                    <SelectItem value="range">Price Range</SelectItem>
                    <SelectItem value="consultation">Consultation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Amount ($)</Label>
                <Input id="amount" type="number" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="period">Period</Label>
                <Select value={formData.period} onValueChange={(value) => setFormData({...formData, period: value})}>
                  <SelectTrigger id="period">
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="one-time">One-time</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="responseTime">Response Time</Label>
                <Input id="responseTime" value={formData.responseTime} onChange={(e) => setFormData({...formData, responseTime: e.target.value})} placeholder="e.g., 4 hours" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="resolutionTime">Resolution Time</Label>
                <Input id="resolutionTime" value={formData.resolutionTime} onChange={(e) => setFormData({...formData, resolutionTime: e.target.value})} placeholder="e.g., 24 hours" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="availability">Availability</Label>
                <Input id="availability" value={formData.availability} onChange={(e) => setFormData({...formData, availability: e.target.value})} placeholder="e.g., 9 AM - 5 PM" />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="emergencySupport" checked={formData.emergencySupport} onCheckedChange={(checked) => setFormData({...formData, emergencySupport: checked})} />
              <Label htmlFor="emergencySupport">Emergency Support Available</Label>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input id="tags" value={formData.tags} onChange={(e) => setFormData({...formData, tags: e.target.value})} placeholder="e.g., office, email, productivity" />
            </div>
            <div className="flex justify-end space-x-4">
              <Button type="submit">{editingService ? 'Update Service' : 'Add Service'}</Button>
              <Button variant="outline" onClick={() => setIsAddServiceOpen(false)}>Cancel</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default App


