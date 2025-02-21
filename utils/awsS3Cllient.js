require("dotenv").config();
const {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const s3Client = new S3Client({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  },
});

const BUCKET = "neelimage-private";
const PROFILE_FOLDER = "user-profiles";

async function putObject(filename, contentType) {
  try {
    const key = `${PROFILE_FOLDER}/${filename}`;
    const command = new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      ContentType: contentType,
    });

    const url = await getSignedUrl(s3Client, command);
    return { uploadUrl: url, key };
  } catch (error) {
    console.log(`Error in putObject:`, error.message);
    throw error;
  }
}

async function deleteObject(key) {
  try {
    console.log(key);
    
    const command = new DeleteObjectCommand({
      Bucket: BUCKET,
      Key: key,
    });
    await s3Client.send(command);
  } catch (error) {
    console.log(`Error in deleteObject:`, error.message);
    throw error;
  }
}

module.exports = {
  putObject,
  deleteObject,
  BUCKET,
  PROFILE_FOLDER,
};
