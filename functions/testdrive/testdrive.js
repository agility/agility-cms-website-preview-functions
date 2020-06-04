// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method
require('dotenv').config();
const { BlobServiceClient, StorageSharedKeyCredential } = require("@azure/storage-blob");


exports.handler = async (event, context) => {

	let retObj = {};


	try {

		const guid = event.queryStringParameters.guid

		if (! guid || guid === "")
		{
			throw new Error("No unique identifier was provided for the test drive.")

		} else {

			const testDriveStorageName = process.env.TEST_DRIVE_STORAGE_NAME
			const testDriveStorageKey = process.env.TEST_DRIVE_STORAGE_KEY;

			const automationStorageName = process.env.AUTOMATION_STORAGE_NAME;
			const automationStorageKey = process.env.AUTOMATION_STORAGE_KEY;

			console.log(testDriveStorageName, testDriveStorageKey)

			const testDriveCred = new StorageSharedKeyCredential(testDriveStorageName, testDriveStorageKey)
			const testDriveClient = new BlobServiceClient(`https://${testDriveStorageName}.blob.core.windows.net`, testDriveCred )
			const testDriveContainer = testDriveClient.getContainerClient("testdrive-guids")

			const testDriveBlob = testDriveContainer.getBlockBlobClient(guid)

			if (! (await testDriveBlob.exists())) {
				throw new Error("Invalid test drive identifier.");

			}

			const testDriveBlobResponse = await testDriveBlob.download();
			const testDriveJSON = await streamToString(testDriveBlobResponse.readableStreamBody);
			const testDriveObj = JSON.parse(testDriveJSON)

			const manifestNumber = testDriveObj.manifest;

			//get the manifest....
			const automationCred = new StorageSharedKeyCredential(automationStorageName, automationStorageKey)
			const automationClient = new BlobServiceClient(`https://${automationStorageName}.blob.core.windows.net`, automationCred )
			const automationContainer = automationClient.getContainerClient("instance-manifests")

			const automationBlobClient = automationContainer.getBlockBlobClient(manifestNumber)

			if (! (await automationBlobClient.exists())) {
				throw new Error("Unabled to access Test drive manifest.")
			}

			const automationStream = await automationBlobClient.download()

			const automationJSON = await streamToString(automationStream.readableStreamBody);
			retObj.emailAddress = testDriveObj.emailAddress;
			retObj.instanceManifest = JSON.parse(automationJSON)

			// const retObject = {"msg": "testing" + testDriveStorageName}
			// json = JSON.stringify(retObject);
		}


	} catch (err) {

		console.error(err)

		retObj.isError = true;
		retObj.msg = err.toString()

	}

	const json = JSON.stringify(retObj)

	return {
		statusCode: 200,
		body: json,

		headers: { "Content-Type": "application.json" },
		// isBase64Encoded: true,
	}
}


async function streamToString(readableStream) {
    return new Promise((resolve, reject) => {
      const chunks = [];
      readableStream.on("data", (data) => {
        chunks.push(data.toString());
      });
      readableStream.on("end", () => {
        resolve(chunks.join(""));
      });
      readableStream.on("error", reject);
    });
  }