const { v4: uuid4 } = require("uuid");
const client = require("../utils/dbConnection");
const USERS = "users";
const { putObject, deleteObject,BUCKET, PROFILE_FOLDER } = require("../utils/awsS3Cllient");

const getAllUsers = async (req, res) => {
  try {
    const users = await client.json.get(USERS);

    if (!users || Object.keys(users).length === 0) {
      return res.status(404).json({ message: " No users found" });
    }

    return res.json(users);
  } catch (error) {
    console.log("Error in getAllusers", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await client.json.get(USERS, { path: `$.${id}` });

    if (!user || Object.keys(user).length == 0) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json(user);
  } catch (error) {
    console.log("Error in getUserById", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, email, imageContentType } = req.body;

    if (!name || !email || !imageContentType) {
      return res
        .status(400)
        .json({ message: "Name, email, and imageContentType are required" });
    }

    const exists = await client.exists(USERS);
    if (!exists) {
      await client.json.set(USERS, "$", {});
    }

    const mails = await client.json.get(USERS, { path: "$.*.email" }) || [];
    const emailList = Array.isArray(mails) ? mails.flat() : [];

    if (emailList.includes(email)) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }

    const userId = uuid4();
    const imageName = `image-${userId}.jpg`;
    const publicUrl = `https://${BUCKET}.s3.ap-south-1.amazonaws.com/${PROFILE_FOLDER}/${imageName}`;

    await client.json.set(USERS, `$.${userId}`, { name, email, profileUrl: publicUrl });

    const uploadData = await putObject(imageName, imageContentType);

    return res
      .status(201)
      .json({ id: userId, name, email, profileUrl: publicUrl, uploadData });
  } catch (error) {
    console.log("Error in createUser:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};


const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!id) {
      return res.status(400).json({ message: "UserId is required" });
    }

    if (!updateData || Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "Update data is required" });
    }

    const user = await client.json.get(USERS, { path: `$.${id}` });

    if (!user || user.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // Use JSON.MERGE to update the user data
    await client.json.merge(USERS, `$.${id}`, updateData);

    return res.json({
      message: "User updated successfully",
      user: await client.json.get(USERS, { path: `$.${id}` }),
    });
  } catch (error) {
    console.log("Error in updateUser", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};


const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "User id is required" });
    }

    const user = await client.json.get(USERS, { path: `$.${id}` });

    if (!user || Object.keys(user).length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    await client.json.del(USERS, `$.${id}`);
    await deleteObject(`user-profiles/image-${id}.jpg`);

    return res.json({ message: "User deleeted successfully" });
  } catch (error) {
    console.log("Error in updateUser", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};





module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
