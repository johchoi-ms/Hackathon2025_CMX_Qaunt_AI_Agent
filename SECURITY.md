# Security Configuration for Azure Blade Analytics Dashboard

## Security Headers

### Content Security Policy (CSP)
Add to your hosting platform's configuration:

```
Content-Security-Policy: default-src 'self'; script-src 'self' https://d3js.org https://cdn.jsdelivr.net 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; font-src 'self'; object-src 'none'; media-src 'none'; frame-src 'none';
```

### Additional Security Headers
```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Strict-Transport-Security: max-age=31536000; includeSubDomains
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

## Azure Static Web Apps Security

### Authentication (Optional)
If you need to restrict access to your dashboard:

```json
{
  "routes": [
    {
      "route": "/login",
      "rewrite": "/.auth/login/aad"
    },
    {
      "route": "/logout", 
      "rewrite": "/.auth/logout"
    },
    {
      "route": "/*",
      "allowedRoles": ["authenticated"]
    }
  ],
  "auth": {
    "identityProviders": {
      "azureActiveDirectory": {
        "userDetailsClaim": "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name",
        "registration": {
          "openIdIssuer": "https://login.microsoftonline.com/{tenant-id}/v2.0",
          "clientIdSettingName": "AZURE_CLIENT_ID",
          "clientSecretSettingName": "AZURE_CLIENT_SECRET"
        }
      }
    }
  }
}
```

### Environment Variables
Set these in your Azure Static Web App configuration:
- `AZURE_CLIENT_ID`: Your Azure AD application ID
- `AZURE_CLIENT_SECRET`: Your Azure AD application secret

## Data Security

### Client-Side Data Handling
- ✅ No sensitive data stored in localStorage
- ✅ Data validation before processing
- ✅ Error handling prevents data exposure
- ✅ File upload size limits (10MB)
- ✅ JSON structure validation

### Best Practices
1. **Never store sensitive data** in the client-side code
2. **Validate all user inputs** before processing
3. **Use HTTPS** for all communications
4. **Implement rate limiting** if adding server-side features
5. **Regular security updates** for dependencies

## Network Security

### HTTPS Enforcement
All hosting platforms provide HTTPS by default:
- Azure Static Web Apps: Automatic HTTPS
- GitHub Pages: Automatic HTTPS for github.io domains
- Netlify: Automatic HTTPS with Let's Encrypt
- Vercel: Automatic HTTPS

### CDN Security
External dependencies from trusted sources:
- D3.js: `https://d3js.org/d3.v7.min.js`
- D3-Sankey: `https://cdn.jsdelivr.net/npm/d3-sankey@0.12.3/dist/d3-sankey.min.js`

### Subresource Integrity (Optional)
For enhanced security, add integrity hashes:

```html
<script src="https://d3js.org/d3.v7.min.js" 
        integrity="sha384-[hash]" 
        crossorigin="anonymous"></script>
```

## Privacy Considerations

### Data Collection
The dashboard itself does not collect personal data:
- ✅ No user tracking
- ✅ No cookies set
- ✅ No personal information stored
- ✅ Analytics data is aggregated and anonymized

### GDPR Compliance
- Data processed is already anonymized Azure telemetry
- No personal identifiers in the visualization
- Users can upload their own data (processed client-side only)

## Monitoring and Alerting

### Security Monitoring
Consider implementing:
1. **Failed login attempts** (if authentication is enabled)
2. **Unusual traffic patterns**
3. **File upload monitoring**
4. **Error rate monitoring**

### Application Insights (Azure)
```html
<script type="text/javascript">
// Add Application Insights for monitoring
// (Configuration details in DEPLOYMENT.md)
</script>
```

## Incident Response

### Security Incident Checklist
1. **Assess the scope** of the incident
2. **Document findings** and actions taken
3. **Notify stakeholders** if data is affected
4. **Implement fixes** and security improvements
5. **Review and update** security measures

### Contact Information
- **Security Team**: security@yourcompany.com
- **Dashboard Maintainers**: See repository contributors
- **Emergency Contact**: [Your emergency contact]

## Regular Security Tasks

### Monthly
- [ ] Review access logs
- [ ] Check for dependency updates
- [ ] Verify security headers are active
- [ ] Test upload functionality for vulnerabilities

### Quarterly
- [ ] Security audit of code changes
- [ ] Review authentication configuration
- [ ] Update emergency contact information
- [ ] Test incident response procedures

### Annually
- [ ] Comprehensive security review
- [ ] Penetration testing (if required)
- [ ] Update security documentation
- [ ] Review and update security policies

## Security Resources

### Documentation
- [Azure Security Best Practices](https://docs.microsoft.com/en-us/azure/security/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [MDN Web Security](https://developer.mozilla.org/en-US/docs/Web/Security)

### Tools
- [Observatory by Mozilla](https://observatory.mozilla.org/)
- [Security Headers](https://securityheaders.com/)
- [SSL Labs](https://www.ssllabs.com/ssltest/)

---

**Note**: This security configuration provides a solid foundation, but security requirements may vary based on your organization's policies and the sensitivity of your data. Always consult with your security team before deploying to production.