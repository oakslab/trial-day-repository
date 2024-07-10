# Google Maps Integration Setup Guide

## Enabling APIs in Google Cloud Platform

To utilize the `RHFAddressInput` or other component which integrates Google Maps functionality, you must enable several APIs in your Google Cloud Platform project. Follow these steps to set up your project:

1. Navigate to **"APIs & Services > Dashboard"**.

2. Click **"+ ENABLE APIS AND SERVICES"**.

3. Search for and enable the following APIs:
   - **Places API**
   - **Geocoding API**
   - **Maps JavaScript API**

## Setting Up the `.env` Configuration

You need to configure your API key in your environment variables to interact with Google Maps securely:

1. **Obtain Your API Key**:

   - In the Google Cloud Console, go to **"APIs & Services > Credentials"**.
   - Click **"Create Credentials"** and select **API key**. Follow the prompts to generate a new API key.

2. **Restrict the generated API key only for WebSites from where it will be used**

   - In the Google Cloud Console, click on the generated API key
   - Under **Set an application restriction** choose **WebSites**
   - Add URL of each allowed WebSite.
     - The list of URLs will typically match apps hosted on Firebase e.g. `https://reusability-development-admin-imw1bfgk.web.app`, `https://admin.boilerplate.oakslab.com` etc.
     - For development environment make sure to add also `http://localhost`
     - Wildcards are also supported, see info in panel on right

3. **Configure `.env` File**:

   - Navigate to **"Secret Manager"**.
   - Add your Google Maps API key as follows to `web` and `web-local` secrets:

     ```dotenv
     NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
     ```

   - Restrict this API key in the Google Cloud Console to be used only by authorized services and from your application's domains to secure its usage.

## Using the `useJsApiLoader` Hook

The `useJsApiLoader` hook is used to load the Google Maps JavaScript API dynamically. The placement of should be based on where the Google Maps functionalities are required:

1. **Global Placement (In Layout)**: If multiple pages or components across your application require access to Google Maps API.

2. **Page-Level Placement**: If only specific pages in your application need access to Google Maps API.

3. **Component-Level Placement**: For isolated usage in individual components which might not be required on every page.

### Usage example

1. **Import and Configure `useJsApiLoader`**:

   - Import the hook in your component file:

     ```javascript
     import { useJsApiLoader } from '@react-google-maps/api';
     ```

   - Create constant with list of libraries to be loaded:

   ```javascript
   const GOOGLE_MAPS_API_LIBRARIES: Libraries = ['places'];
   ```

   Note: For performance reasons, this constant must be placed outside of the React component

   - Configure the hook to load the Google Maps script:

     ```javascript
     const { isLoaded } = useJsApiLoader({
       id: 'google-map-script',
       googleMapsApiKey: frontendEnv.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
       libraries: GOOGLE_MAPS_API_LIBRARIES,
     });
     ```

   - Check `isLoaded` to ensure Google Maps API has loaded before rendering components that depend on it.

2. **Example Usage**:

   - Conditionally render the `RHFAddressInput` or similar components depending on the API load status:

     ```javascript
     {
       isLoaded ? <RHFAddressInput /> : <div>Loading...</div>;
     }
     ```

- See [/apps/examples/pages/form/index.tsx](/apps/examples/pages/form/index.tsx) for example of page-level component placement and `useJsApiLoader` usage.
