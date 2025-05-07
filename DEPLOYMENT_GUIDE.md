
# Deployment Guide for InfinityFree Hosting

Follow these steps to deploy this React application to InfinityFree:

## Step 1: Build the Project

First, build the project to generate static files:

```bash
npm run build
```

This will create a `dist` directory with all the static files needed for your website.

## Step 2: Set Up Your InfinityFree Account

1. Create an account on [InfinityFree](https://infinityfree.net/) if you don't have one already
2. Create a new website and note your subdomain or connect your custom domain

## Step 3: Upload Files

1. Access the File Manager in your InfinityFree control panel or use an FTP client
2. Navigate to the `htdocs` or `public_html` directory
3. Upload ALL files from your project's `dist` directory to this folder
4. Make sure to include the `.htaccess` file from the `dist` directory

## Step 4: Configure Your Website

1. Ensure that the `.htaccess` file was properly uploaded
2. If you're using a custom domain, make sure it's properly configured in the InfinityFree control panel

## Step 5: Test Your Website

1. Visit your website URL to make sure everything is working properly
2. Test all features to ensure they function as expected

## Troubleshooting

If you encounter any issues:

1. Check the `.htaccess` file is present and has the correct permissions (usually 644)
2. Ensure all files were uploaded, including the `index.html` file
3. Clear your browser cache and try accessing the website again

## Important Notes for InfinityFree

- InfinityFree uses Apache servers, so the included `.htaccess` file is essential
- If you're using API requests, ensure they're secure (HTTPS) as InfinityFree provides SSL
- Remember that InfinityFree has certain limitations on bandwidth and storage
