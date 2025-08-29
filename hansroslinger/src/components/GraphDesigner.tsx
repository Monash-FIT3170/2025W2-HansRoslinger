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

/**
 * Function that updates a specific property in a JSON file
 * @param jsonFilePath - Path to the JSON file
 * @param targetProperty - The property to update (supports dot notation like "user.profile.name")
 * @param newValue - The new value to set
 * @returns Promise that resolves when the update is complete
 */
export async function updateJsonProperty(
  jsonFilePath: string,
  targetProperty: string,
  newValue: any
): Promise<void> {
  // Use the first function to get the current data and validate the property exists
  await GraphDesigner(jsonFilePath, targetProperty);
  
  // Fetch the current JSON file
  const response = await fetch(jsonFilePath);
  const jsonData = await response.json();
  
  // Split the property path
  const keys = targetProperty.split('.');
  const lastKey = keys.pop()!;
  
  // Navigate to the parent object
  let current = jsonData;
  for (const key of keys) {
    current = current[key];
  }
  
  // Update the property
  current[lastKey] = newValue;
  
  // Write the updated data back to the file
  await fetch(jsonFilePath, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(jsonData),
  });
}

export default GraphDesigner;
