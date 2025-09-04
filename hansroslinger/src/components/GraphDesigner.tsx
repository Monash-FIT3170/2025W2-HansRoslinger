/**
 * Simple function that reads a JSON file and extracts a specific property
 * @param jsonFilePath - Path to the JSON file
 * @param targetProperty - The property to extract (supports dot notation like "user.profile.name")
 * @returns Promise that resolves to the extracted data or null if property doesn't exist
 */
export async function GraphDesigner(
  jsonData: object,
  targetProperty: string
): Promise<any | null> {
  try {
    // Extract the target property using dot notation
    const extractedData = targetProperty.split('.').reduce((obj, key) => {
      return obj && obj[key as keyof object];
    }, jsonData);

    if (extractedData === undefined) {
      return null; // Return null instead of throwing error
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
  userEmail: string,
  fileName: string,
  targetProperty: string,
  newValue: any
): Promise<void> {

  // Get the JSON file from S3 via API endpoint
  const apiResponse = await fetch(`/api/aws-get?email=${encodeURIComponent(userEmail)}&key=${encodeURIComponent(fileName)}`);
  
  if (!apiResponse.ok) {
    throw new Error(`Failed to fetch file: ${apiResponse.status} ${apiResponse.statusText}`);
  }
  
  const fileContent = await apiResponse.text();
  const jsonData = JSON.parse(fileContent);

  // Use the first function to check if the property exists
  const existingValue = await GraphDesigner(jsonData, targetProperty);

  // Split the property path once
  const keys = targetProperty.split('.');
  const lastKey = keys.pop()!;

  // Start from the root JSON data
  let current = jsonData;

  if (existingValue !== null) {
    // Property exists - just update it directly
    for (const key of keys) {
      current = current[key];
    }
    current[lastKey] = newValue;
  } else {
    // Property doesn't exist - create the path
    for (const key of keys) {
      if (!(key in current) || typeof current[key] !== 'object') {
        current[key] = {};
      }
      current = current[key];
    }
    current[lastKey] = newValue;
  }

  console.log('Updated JSON data:', JSON.stringify(jsonData, null, 2));
}