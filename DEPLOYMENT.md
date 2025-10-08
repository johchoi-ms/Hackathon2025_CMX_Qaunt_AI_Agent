# Deployment Guide
Azure Blade Analytics Dashboard - Production Deployment

## Quick Start Options

### Option 1: Azure Static Web Apps (Recommended)
Perfect for Azure-focused dashboard with automatic CI/CD

1. **Create Azure Static Web App**
   ```bash
   # Using Azure CLI
   az staticwebapp create \
     --name "azure-blade-analytics" \
     --resource-group "your-resource-group" \
     --source "https://github.com/johchoi-ms/Hackathon2025_CMX_Qaunt_AI_Agent" \
     --location "Central US" \
     --branch "main" \
     --app-location "/" \
     --output-location ""
   ```

2. **Configure GitHub Repository**
   - Go to your repository settings → Secrets and variables → Actions
   - Add `AZURE_STATIC_WEB_APPS_API_TOKEN` from Azure portal
   - The `.github/workflows/azure-static-web-apps.yml` will handle deployment

3. **Custom Domain (Optional)**
   ```bash
   az staticwebapp hostname set \
     --name "azure-blade-analytics" \
     --resource-group "your-resource-group" \
     --hostname "dashboard.yourcompany.com"
   ```

### Option 2: GitHub Pages (Free Alternative)
Simple and free hosting for public repositories

1. **Enable GitHub Pages**
   - Go to repository Settings → Pages
   - Source: Deploy from a branch → main
   - Folder: / (root)
   - Save

2. **Access your dashboard at:**
   `https://johchoi-ms.github.io/Hackathon2025_CMX_Qaunt_AI_Agent/`

### Option 3: Netlify (Easy Deployment)
Great for static sites with powerful features

1. **Deploy via Git**
   - Connect your GitHub repo to Netlify
   - Build settings: Leave empty (static site)
   - Publish directory: `/`

2. **Or deploy via drag & drop**
   - Zip your project files
   - Drag to Netlify deploy area

### Option 4: Vercel (Developer-Friendly)
Optimized for frontend frameworks

1. **Deploy with Vercel CLI**
   ```bash
   npm i -g vercel
   vercel --prod
   ```

2. **Or connect via GitHub**
   - Import project from GitHub
   - Configure build settings (leave empty for static)

## Environment Setup

### Prerequisites
- Git repository (already set up)
- Modern web browser
- Optional: Node.js for local development server

### Local Development
```bash
# Clone the repository
git clone https://github.com/johchoi-ms/Hackathon2025_CMX_Qaunt_AI_Agent.git
cd Hackathon2025_CMX_Qaunt_AI_Agent

# Serve locally (choose one method)
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Node.js (if you have it installed)
npx serve .

# PHP (if you have it installed)
php -S localhost:8000

# Open http://localhost:8000 in your browser
```

## Production Configuration

### Environment Variables
For production deployments, consider these configurations:

```javascript
// Add to dashboard.js for production
const CONFIG = {
  ENVIRONMENT: 'production',
  API_BASE_URL: 'https://your-api-endpoint.com',
  ANALYTICS_ID: 'your-analytics-id',
  VERSION: '1.0.0'
};
```

### Security Headers
Add to your hosting platform:

```
# Headers for security
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Content-Security-Policy: default-src 'self' https://d3js.org https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline';
```

### Performance Optimization

1. **Enable Compression**
   ```
   # .htaccess for Apache
   <IfModule mod_deflate.c>
     AddOutputFilterByType DEFLATE text/plain
     AddOutputFilterByType DEFLATE text/html
     AddOutputFilterByType DEFLATE text/css
     AddOutputFilterByType DEFLATE text/javascript
     AddOutputFilterByType DEFLATE application/javascript
     AddOutputFilterByType DEFLATE application/json
   </IfModule>
   ```

2. **Cache Configuration**
   ```
   # Cache static assets
   <IfModule mod_expires.c>
     ExpiresActive on
     ExpiresByType text/css "access plus 1 year"
     ExpiresByType application/javascript "access plus 1 year"
     ExpiresByType application/json "access plus 1 day"
   </IfModule>
   ```

## Custom Domain Setup

### Azure Static Web Apps
```bash
# Add custom domain
az staticwebapp hostname set \
  --name "your-app-name" \
  --resource-group "your-rg" \
  --hostname "dashboard.yourcompany.com"
```

### GitHub Pages
1. Add CNAME file with your domain
2. Configure DNS A records:
   ```
   185.199.108.153
   185.199.109.153
   185.199.110.153
   185.199.111.153
   ```

### Netlify
1. Go to Domain settings in Netlify dashboard
2. Add custom domain
3. Follow DNS configuration instructions

## Monitoring and Analytics

### Add Google Analytics
```html
<!-- Add to head section of index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Azure Application Insights
```html
<!-- Add to head section -->
<script type="text/javascript">
var sdkInstance="appInsightsSDK";window[sdkInstance]="appInsights";var aiName=window[sdkInstance],aisdk=window[aiName]||function(e){function n(e){t[e]=function(){var n=arguments;t.queue.push(function(){t[e].apply(t,n)})}}var t={config:e};t.initialize=!0;var i=document,a=window;setTimeout(function(){var n=i.createElement("script");n.src=e.url||"https://az416426.vo.msecnd.net/scripts/b/ai.2.min.js",i.getElementsByTagName("script")[0].parentNode.appendChild(n)});try{t.cookie=i.cookie}catch(e){}t.queue=[],t.version=2;for(var r=["Event","PageView","Exception","Trace","DependencyData","Metric","PageViewPerformance"];r.length;)n("track"+r.pop());n("startTrackPage"),n("stopTrackPage");var s="Track"+r[0];if(n("start"+s),n("stop"+s),n("setAuthenticatedUserContext"),n("clearAuthenticatedUserContext"),n("flush"),!(!0===e.disableExceptionTracking||e.extensionConfig&&e.extensionConfig.ApplicationInsightsAnalytics&&!0===e.extensionConfig.ApplicationInsightsAnalytics.disableExceptionTracking)){n("_"+(r="onerror"));var o=a[r];a[r]=function(e,n,i,a,s){var c=o&&o(e,n,i,a,s);return!0!==c&&t["_"+r]({message:e,url:n,lineNumber:i,columnNumber:a,error:s}),c},e.autoExceptionInstrumented=!0}return t}({
    instrumentationKey:"YOUR_INSTRUMENTATION_KEY"
});window[aiName]=aisdk,aisdk.queue&&0===aisdk.queue.length&&aisdk.trackPageView({});
</script>
```

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Serve files from HTTP server, not file:// protocol
   - Configure CORS headers if using external APIs

2. **D3.js Not Loading**
   - Check internet connection for CDN resources
   - Consider hosting D3.js locally for offline use

3. **JSON Data Not Loading**
   - Ensure test_ver11.json is in the correct path
   - Check file permissions
   - Verify JSON syntax

4. **Mobile Display Issues**
   - Test responsive design
   - Check viewport meta tag
   - Verify CSS media queries

### Performance Issues
- Optimize JSON data size
- Implement lazy loading for large datasets
- Use browser DevTools to identify bottlenecks

## Backup and Recovery

### Data Backup
```bash
# Backup your data files
cp test_ver11.json backup/test_ver11_$(date +%Y%m%d).json

# Version control all configuration
git add .
git commit -m "Production configuration update"
git push origin main
```

### Rollback Strategy
```bash
# Quick rollback via Git
git revert HEAD
git push origin main

# Or deploy specific version
git checkout v1.0.0
git push origin main --force
```

## Scaling Considerations

### High Traffic
- Use CDN for static assets
- Implement caching strategies
- Consider serverless functions for data processing

### Multiple Environments
```bash
# Development
https://dev-dashboard.yourcompany.com

# Staging
https://staging-dashboard.yourcompany.com

# Production
https://dashboard.yourcompany.com
```

## Security Checklist

- [ ] HTTPS enabled
- [ ] Security headers configured
- [ ] Sensitive data not exposed in client-side code
- [ ] Content Security Policy implemented
- [ ] Regular dependency updates
- [ ] Access logs monitoring

## Support and Maintenance

### Regular Tasks
1. Update dependencies monthly
2. Monitor performance metrics
3. Review security headers
4. Backup data files
5. Test cross-browser compatibility

### Getting Help
- Check browser console for errors
- Review network tab for failed requests
- Verify JSON data structure
- Test with sample data

## Next Steps

1. **Choose your deployment method** (Azure Static Web Apps recommended)
2. **Set up monitoring** and analytics
3. **Configure custom domain** if needed
4. **Implement security measures**
5. **Set up automated backups**
6. **Monitor and optimize performance**

Your dashboard is now ready for production deployment! 🚀