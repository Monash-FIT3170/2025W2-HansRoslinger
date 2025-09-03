const { readFileSync, writeFileSync } = require('fs');

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
  jsonFilePath: string,
  targetProperty: string,
  newValue: any
): Promise<void> {

  // Fetch the current JSON file
  // const response = await fetch(jsonFilePath);
  // const jsonData = await response.json();
  const jsonData = JSON.parse(readFileSync(jsonFilePath, 'utf8'));

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

  // Write the updated data back to the file
  // await fetch(jsonFilePath, {
  //   method: 'PUT',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(jsonData),
  // });

  writeFileSync(jsonFilePath, JSON.stringify(jsonData, null, 2));
}

// export default GraphDesigner;
(async () => {
  await updateJsonProperty("test.json", "encoding.color.scale.range", ["#4A90E2", "#F5A623", "#7ED321", "#D0021B", "#9013FE", "#50E3C2"]);
  console.log("Update completed!");
})();