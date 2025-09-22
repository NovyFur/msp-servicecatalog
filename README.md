# MSP Service Catalog Manager

A comprehensive web-based service catalog management tool designed specifically for Managed Service Providers (MSPs). This application allows MSPs to create, manage, and export their service offerings with detailed information including pricing, service levels, and technical specifications.

## Features

### 📊 Dashboard
- Overview statistics (Total Services, Active Services, Featured Services, Categories)
- Quick action buttons for common tasks
- Recent activity tracking
- Service performance metrics

### 🛠️ Service Management
- **Complete Service Information**: Service name, category, descriptions, pricing details
- **Service Level Agreements**: Response time, resolution time, availability windows
- **Pricing Models**: Fixed price, price ranges, consultation-based pricing
- **Categorization**: Apps & Software, Security, Monitoring, Hardware, Training, etc.
- **Tags and Labels**: Flexible tagging system for easy organization
- **Emergency Support**: Toggle for services with 24/7 emergency support

### 🔍 Search and Filtering
- Real-time search across service names and descriptions
- Category-based filtering
- Advanced filtering options

### 📤 Export Capabilities
- **CSV Export**: Spreadsheet-compatible format for data analysis
- **Word Document Export**: Professional service catalog documents
- **Structured Data**: All service details, pricing, and SLA information

### 💾 Data Persistence
- Local storage for data persistence
- Import/export functionality for data backup
- No server required - runs entirely in the browser

## Technology Stack

- **Frontend**: React 19 with Vite
- **UI Components**: Shadcn/UI with Tailwind CSS
- **Icons**: Lucide React
- **Export Libraries**: 
  - PapaParse for CSV export
  - docx for Word document generation
  - file-saver for download functionality
- **Deployment**: GitHub Pages ready

## Getting Started

### Prerequisites
- Node.js 18 or higher
- pnpm (recommended) or npm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd msp-service-catalog
```

2. Install dependencies:
```bash
pnpm install
```

3. Start the development server:
```bash
pnpm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
pnpm run build
```

The built files will be in the `dist` directory, ready for deployment.

## Usage Guide

### Adding a New Service

1. Click the "Add Service" button on the Services tab or Dashboard
2. Fill in the service details:
   - **Service Name**: Clear, descriptive name
   - **Category**: Select from predefined categories
   - **Short Description**: Brief one-line description
   - **Detailed Description**: Comprehensive service description
   - **Pricing**: Choose pricing model and set amounts
   - **Service Levels**: Define response and resolution times
   - **Availability**: Set service availability windows
   - **Tags**: Add relevant tags for organization

3. Click "Add Service" to save

### Managing Services

- **Edit**: Click the edit icon on any service card
- **Duplicate**: Use the copy icon to create a similar service
- **Delete**: Remove services with the delete icon
- **Search**: Use the search bar to find specific services
- **Filter**: Select categories to filter the service list

### Exporting Data

1. Click the "Export" button in the header
2. Choose your preferred format:
   - **CSV**: For spreadsheet analysis and data manipulation
   - **Word**: For professional service catalog documents
3. The file will be automatically downloaded

## Service Categories

The application includes the following predefined categories:

- **Apps & Software**: Application setup, software licensing, productivity tools
- **Security**: Cybersecurity services, backup solutions, compliance
- **Monitoring**: Network monitoring, system monitoring, alerting
- **Hardware**: Hardware procurement, installation, maintenance
- **Training**: User training, technical training, certification
- **Phones & Tablets**: Mobile device management, communication systems
- **Printing**: Printer management, document solutions
- **Business Operations**: General business support services

## Data Structure

Each service contains the following information:

```javascript
{
  serviceName: "Service Name",
  category: "Category",
  shortDescription: "Brief description",
  description: "Detailed description",
  pricing: {
    type: "fixed|range|consultation",
    amount: 100,
    currency: "USD",
    period: "one-time|monthly|yearly"
  },
  serviceLevel: {
    responseTime: "4 hours",
    resolutionTime: "24 hours",
    availability: "9 AM - 5 PM",
    emergencySupport: true/false
  },
  status: "active|inactive",
  featured: true/false,
  tags: ["tag1", "tag2", "tag3"]
}
```

## Deployment

### GitHub Pages

This application is configured for automatic deployment to GitHub Pages:

1. Push your code to the `main` or `master` branch
2. GitHub Actions will automatically build and deploy the application
3. Your service catalog will be available at `https://yourusername.github.io/repository-name`

### Manual Deployment

1. Build the application: `pnpm run build`
2. Upload the contents of the `dist` directory to your web server
3. Configure your web server to serve the `index.html` file for all routes

## Customization

### Adding New Categories

Edit the `categories` array in `src/App.jsx`:

```javascript
const categories = [
  { value: 'New Category', label: 'New Category', icon: YourIcon },
  // ... existing categories
]
```

### Modifying Export Formats

The export functions can be found in `src/App.jsx`:
- `handleExportCSV()` - Customize CSV output format
- `handleExportWord()` - Modify Word document structure

### Styling

The application uses Tailwind CSS for styling. Modify the classes in the components or update the `tailwind.config.js` file for global changes.

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and commit: `git commit -m 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

For support, feature requests, or bug reports, please open an issue on the GitHub repository.

---

**Built for MSPs, by MSPs** - Streamline your service catalog management and focus on what matters most: delivering exceptional service to your clients.

