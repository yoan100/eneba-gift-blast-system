
# Deployment Guide for InfinityFree Hosting

Follow these steps to deploy this static HTML page to InfinityFree:

## Step 1: Prepare Your Files

You need just two files for deployment:
1. `index.html` - Contains all HTML, CSS, and JavaScript for the application
2. `.htaccess` - Ensures proper routing and configuration for your site

## Step 2: Set Up Your InfinityFree Account

1. Create an account on [InfinityFree](https://infinityfree.net/) if you don't have one already
2. Create a new website and note your subdomain or connect your custom domain

## Step 3: Upload Files

1. Access the File Manager in your InfinityFree control panel or use FTP
2. Navigate to the `htdocs` or `public_html` directory
3. Upload both files:
   - `index.html` 
   - `.htaccess`
4. Make sure the `.htaccess` file is uploaded correctly (it's hidden by default)

## Step 4: Verify File Permissions

1. Check that `index.html` has permissions of 644 (readable by everyone)
2. Check that `.htaccess` has permissions of 644 as well
3. If needed, adjust permissions using the File Manager or FTP client

## Step 5: Test Your Website

1. Visit your website URL to ensure everything loads properly
2. Test all features including the verification process
3. Check the browser console for any JavaScript errors

## Troubleshooting

If you encounter issues:

1. **Blank page or 500 errors**: Check that `.htaccess` is uploaded and has correct permissions
2. **Missing styles or functionality**: Ensure `index.html` contains all necessary JavaScript and CSS
3. **CORS errors**: InfinityFree might block some external API calls; check browser console for details
4. **Page not found errors**: Make sure your `.htaccess` file is configured correctly

Remember that InfinityFree has limitations:
- Limited PHP processing (not used in this project)
- Limited bandwidth and storage
- Some API restrictions (Discord webhooks might be blocked)
