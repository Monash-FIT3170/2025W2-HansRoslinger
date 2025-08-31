import { uploadFile } from './uploadFile';
import { retrieveUserFiles } from './retrieveFiles';
import { createS3UserBucket } from './createUserBucket';
import { getObject } from './getObject';
import { downloadFile } from './downloadFile';
import { deleteFile } from './deleteFile';
import path from 'path';
import { promises as fs } from 'fs';

const testS3Functions = async () => {
  const testEmail = 'testuser@example.com';
  const localFilePath = path.resolve('./sample.txt');
  const downloadDir = path.resolve('./downloads');

  // Ensure download directory exists
  await fs.mkdir(downloadDir, { recursive: true });

  try {
    console.log('🚀 Starting S3 Functions Test\n');

    // Step 1: Create S3 "folder" for user
    console.log('--- Step 1: Create S3 "folder" for user ---');
    const folderUrl = await createS3UserBucket(testEmail);
    console.log('✅ Folder created at:', folderUrl);

    // Step 2: Upload file to S3
    console.log('\n--- Step 2: Upload file to S3 ---');
    const uploadResult = await uploadFile(testEmail, {
      path: localFilePath,
    });
    console.log('✅ Upload result:', uploadResult);

    // Step 3: Retrieve files for user
    console.log('\n--- Step 3: Retrieve files for user ---');
    const userFiles = await retrieveUserFiles(testEmail);
    console.log(`📦 Found ${userFiles.length} file(s)`);
    userFiles.forEach(file => {
      console.log(`📄 ${file.key} (${file.size} bytes) - Last modified: ${file.lastModified}`);
    });

    if (userFiles.length === 0) {
      console.log('⚠️  No files found. Cannot test getObject, downloadFile, or deleteFile.');
      return;
    }

    const testFileName = path.basename(localFilePath);

    // Step 4: Test getObject
    console.log('\n--- Step 4: Test getObject ---');
    const objectData = await getObject(testEmail, testFileName);
    console.log('✅ getObject result:');
    console.log(`   - S3 Key: ${objectData.s3Key}`);
    console.log(`   - Content Type: ${objectData.contentType}`);
    console.log(`   - Content Length: ${objectData.contentLength}`);
    console.log(`   - ETag: ${objectData.etag}`);
    console.log(`   - Body: ${objectData.body ? 'Stream available' : 'No body'}`);

    // Step 5: Test downloadFile
    console.log('\n--- Step 5: Test downloadFile ---');
    const downloadedPath = await downloadFile(testEmail, testFileName, downloadDir);
    console.log(`✅ Downloaded file to: ${downloadedPath}`);
    
    // Verify the downloaded file exists
    const downloadedContent = await fs.readFile(downloadedPath, 'utf-8');
    console.log(`📖 Downloaded file content: "${downloadedContent.trim()}"`);

    // Step 6: Test deleteFile
    console.log('\n--- Step 6: Test deleteFile ---');
    const deleteResult = await deleteFile(testEmail, testFileName);
    console.log('✅ Delete result:', deleteResult);

    // Step 7: Verify file was deleted
    console.log('\n--- Step 7: Verify file was deleted ---');
    const filesAfterDelete = await retrieveUserFiles(testEmail);
    console.log(`📦 Files remaining: ${filesAfterDelete.length}`);
    
    if (filesAfterDelete.length === 0) {
      console.log('✅ File successfully deleted from S3');
    } else {
      console.log('⚠️  File may still exist:');
      filesAfterDelete.forEach(file => {
        console.log(`   📄 ${file.key}`);
      });
    }

    // Cleanup: Remove downloaded file
    console.log('\n--- Cleanup ---');
    await fs.unlink(downloadedPath);
    console.log('🧹 Cleaned up downloaded file');

  } catch (err) {
    console.error('❌ Error during test:', err);
  }
};

// Export for potential use in other files
export { testS3Functions };

// Run the test if this file is executed directly
if (require.main === module) {
  testS3Functions();
}
