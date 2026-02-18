# Deployment Guide - Matrix Chat Angular

## Prerequisites

- Node.js 18+ and npm installed
- Git installed
- A Matrix homeserver (or use matrix.org for testing)

## Local Development

### 1. Clone and Install

```bash
git clone https://github.com/BakkeshSatvik/matrixChat-angular.git
cd matrixChat-angular
npm install
```

### 2. Run Development Server

```bash
npm start
```

The app will be available at `http://localhost:4200`

### 3. Environment Configuration

Edit `src/environments/environment.ts` to customize:

```typescript
export const environment = {
  production: false,
  defaultHomeserver: 'https://matrix.org'  // Change to your homeserver
};
```

## Production Build

### Build the Application

```bash
npm run build
```

This creates an optimized production build in `dist/matrix-chat-angular/`.

### Build Options

- **Production**: `npm run build` (default)
- **Development**: `npm run build -- --configuration development`

## Deployment Options

### 1. Netlify

#### Via Netlify CLI
```bash
npm install -g netlify-cli
npm run build
netlify deploy --prod --dir=dist/matrix-chat-angular
```

#### Via Git Integration
1. Push your code to GitHub
2. Connect your repository to Netlify
3. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist/matrix-chat-angular`
4. Deploy!

### 2. Vercel

#### Via Vercel CLI
```bash
npm install -g vercel
npm run build
vercel --prod
```

When prompted, use these settings:
- Build Command: `npm run build`
- Output Directory: `dist/matrix-chat-angular`
- Install Command: `npm install`

### 3. GitHub Pages

#### Setup
```bash
npm install -g angular-cli-ghpages
```

#### Deploy
```bash
npm run build -- --base-href=/matrixChat-angular/
npx angular-cli-ghpages --dir=dist/matrix-chat-angular
```

### 4. AWS S3 + CloudFront

#### 1. Build the app
```bash
npm run build
```

#### 2. Create S3 bucket
```bash
aws s3 mb s3://your-matrix-chat-bucket
```

#### 3. Upload files
```bash
aws s3 sync dist/matrix-chat-angular/ s3://your-matrix-chat-bucket/
```

#### 4. Configure bucket for static hosting
```bash
aws s3 website s3://your-matrix-chat-bucket/ \
  --index-document index.html \
  --error-document index.html
```

#### 5. Set up CloudFront (optional, for HTTPS)
- Create CloudFront distribution
- Point origin to S3 bucket
- Configure custom domain
- Add SSL certificate

### 5. Docker

#### Create Dockerfile
```dockerfile
# Build stage
FROM node:18 AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Serve stage
FROM nginx:alpine
COPY --from=build /app/dist/matrix-chat-angular /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### Create nginx.conf
```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

#### Build and run
```bash
docker build -t matrix-chat-angular .
docker run -p 8080:80 matrix-chat-angular
```

### 6. Traditional Web Server

#### Apache (.htaccess)
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

#### Nginx
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/matrix-chat;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## Environment Variables

### Production Environment

Edit `src/environments/environment.prod.ts` before building:

```typescript
export const environment = {
  production: true,
  defaultHomeserver: 'https://your-homeserver.org'
};
```

## Post-Deployment Checklist

- [ ] Test login with your homeserver
- [ ] Test registration (if homeserver supports it)
- [ ] Verify room creation works
- [ ] Test sending/receiving messages
- [ ] Test voice/video calls (requires HTTPS for WebRTC)
- [ ] Check browser notifications work
- [ ] Verify responsive design on mobile
- [ ] Test session persistence (refresh page)
- [ ] Check console for errors

## SSL/HTTPS Requirements

**Important**: WebRTC (voice/video calls) requires HTTPS. Make sure your deployment uses SSL:

- **Netlify/Vercel**: Automatic HTTPS
- **GitHub Pages**: Automatic HTTPS
- **Custom domain**: Use Let's Encrypt or CloudFront

## Performance Optimization

### 1. Enable Gzip/Brotli Compression

Most hosting platforms enable this by default. For custom servers:

#### Nginx
```nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
```

### 2. Set Cache Headers

```nginx
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### 3. CDN (Optional)

Use a CDN like Cloudflare for:
- Faster global delivery
- DDoS protection
- Additional caching

## Monitoring

### Recommended Tools

- **Sentry**: Error tracking
- **Google Analytics**: Usage analytics
- **LogRocket**: Session replay
- **Uptime Robot**: Uptime monitoring

## Troubleshooting

### Build Fails
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### App doesn't load after deployment
- Check that `index.html` is in the root
- Verify server routing (all routes should serve `index.html`)
- Check browser console for errors

### WebRTC calls don't work
- Ensure site is served over HTTPS
- Check browser permissions for camera/microphone
- Verify firewall allows WebRTC traffic

### Can't connect to homeserver
- Check homeserver URL is correct
- Verify homeserver is accessible
- Check CORS headers if using custom homeserver

## Scaling Considerations

For high traffic:

1. **Use a CDN**: Distribute static assets globally
2. **Optimize images**: Use WebP format, lazy loading
3. **Code splitting**: Already enabled in Angular build
4. **Service worker**: Add for offline support (PWA)
5. **Database caching**: Consider IndexedDB for message history

## Security Best Practices

1. **HTTPS only**: Never deploy without SSL
2. **CSP headers**: Add Content Security Policy
3. **Update dependencies**: Regularly check for security updates
4. **Homeserver validation**: Validate homeserver URLs
5. **Session encryption**: Consider encrypting localStorage data

## Support

For issues:
- Check [GitHub Issues](https://github.com/BakkeshSatvik/matrixChat-angular/issues)
- Review `IMPLEMENTATION.md` for architecture details
- Check Matrix.org documentation for protocol questions

## License

MIT License - See LICENSE file for details
