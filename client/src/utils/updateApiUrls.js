/**
 * API URL Migration Utility
 * 
 * This script helps migrate hardcoded API URLs to use the dynamic apiConfig utility.
 * 
 * Note: This is a browser-compatible utility that can be imported in your application.
 * For Node.js usage, you would need to convert it to use Node.js fs module.
 */

// Directories to search for files (relative paths from src)
const DIRECTORIES = [
  '/components',
  '/pages',
  '/hooks',
];

// File extensions to process
const EXTENSIONS = ['.js', '.jsx'];

// The hardcoded API URL to replace
const API_URL_PATTERN = /http:\/\/localhost:5000\/api\/([a-zA-Z0-9_\-/]+)/g;
const IMAGE_URL_PATTERN = /`http:\/\/localhost:5000(\${[^`]+})`/g;

// Import statement to add
const IMPORT_STATEMENT = "import { getApiUrl, getAssetUrl } from '../utils/apiConfig';";
const RELATIVE_IMPORT_PATTERN = /from ['"]\.\.\/utils\/apiConfig['"];/;

/**
 * This is a placeholder for the file finding functionality
 * In a browser environment, we can't directly access the file system
 * This would need to be implemented differently in a Node.js environment
 */
// Commented out to avoid linting errors
// async function findFiles(directories, extensions) {
//   console.log('findFiles would search these directories:', directories);
//   console.log('Looking for files with extensions:', extensions);
//   return [];
// }

/**
 * Process content to update API URLs
 * This is a pure function that can run in any JavaScript environment
 */
export function processContent(content) {
  // Skip content that already uses the apiConfig
  if (content.includes('getApiUrl(') || content.includes('getAssetUrl(')) {
    return { content, changed: false };
  }
  
  // Replace API URLs
  let newContent = content.replace(API_URL_PATTERN, "getApiUrl('$1')");
  
  // Replace image URLs
  newContent = newContent.replace(IMAGE_URL_PATTERN, "getAssetUrl($1)");
  
  // If no changes were made, return original
  if (newContent === content) {
    return { content, changed: false };
  }
  
  // Add import statement if needed
  if (!newContent.includes('from \'../utils/apiConfig\'')) {
    // Find the last import statement
    const importLines = newContent.split('\n').filter(line => line.trim().startsWith('import '));
    
    if (importLines.length > 0) {
      // Insert after the last import
      const lastImportIndex = newContent.lastIndexOf(importLines[importLines.length - 1]);
      const lastImportEndIndex = lastImportIndex + importLines[importLines.length - 1].length;
      
      newContent = 
        newContent.substring(0, lastImportEndIndex) + 
        '\n' + IMPORT_STATEMENT + 
        newContent.substring(lastImportEndIndex);
    }
  }
  
  return { content: newContent, changed: true };
}

/**
 * Example usage function
 */
export function getExampleUsage() {
  const exampleContent = `import React from 'react';

function MyComponent() {
  const fetchData = async () => {
    const response = await fetch('http://localhost:5000/api/messages');
    const data = await response.json();
    return data;
  };

  return <div>My Component</div>;
}
`;

  const { content, changed } = processContent(exampleContent);
  return {
    original: exampleContent,
    updated: content,
    changed
  };
}

// Export the utility functions
export default {
  processContent,
  getExampleUsage,
  API_URL_PATTERN,
  IMAGE_URL_PATTERN
};
