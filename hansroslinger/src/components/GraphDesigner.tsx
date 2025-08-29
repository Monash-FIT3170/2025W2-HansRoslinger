/**
 * Simple function that reads a JSON file and extracts a specific property
 * @param jsonFilePath - Path to the JSON file
 * @param targetProperty - The property to extract (supports dot notation like "user.profile.name")
 * @returns Promise that resolves to the extracted data
 */
export async function GraphDesigner(
  jsonFilePath: string,
  targetProperty: string
): Promise<any> {
  try {
    // Fetch the JSON file
    const response = await fetch(jsonFilePath);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch JSON file: ${response.status}`);
    }

    const jsonData = await response.json();
    
    // Extract the target property using dot notation
    const extractedData = targetProperty.split('.').reduce((obj, key) => {
      return obj && obj[key];
    }, jsonData);
    
    if (extractedData === undefined) {
      throw new Error(`Property '${targetProperty}' not found`);
    }

    return extractedData;
  } catch (error) {
    throw new Error(`GraphDesigner error: ${error}`);
  }
}

export default GraphDesigner;
