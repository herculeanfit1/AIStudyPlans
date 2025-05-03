const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Path to the original logo
const originalLogoPath = path.join(__dirname, '../public/SchedulEd_new_logo.png');
// Output paths for the light version
const lightLogoPath = path.join(__dirname, '../public/SchedulEd_logo_light.png');
const darkModeLogoPath = path.join(__dirname, '../public/SchedulEd_logo_dark.png');

// Create a white version of the logo with proper transparency
async function generateLogos() {
  try {
    console.log('Generating logo versions...');
    
    // Process the image for light version (white logo for dark backgrounds)
    await sharp(originalLogoPath)
      // Invert colors for a white version (for dark backgrounds)
      .negate({ alpha: false })
      // Brighten it slightly
      .modulate({ brightness: 1.3 })
      // Add a slight blue tint
      .tint({ r: 240, g: 245, b: 255 })
      // Save to output path
      .toFile(lightLogoPath);
    
    console.log('Light logo generated successfully at:', lightLogoPath);

    // Process the image for an alternate dark mode version with higher contrast
    await sharp(originalLogoPath)
      // Make it brighter and more saturated for better visibility
      .modulate({ brightness: 1.3, saturation: 1.4 })
      // Save to output path
      .toFile(darkModeLogoPath);
    
    console.log('Dark mode logo generated successfully at:', darkModeLogoPath);
  } catch (error) {
    console.error('Error generating logos:', error);
  }
}

generateLogos(); 