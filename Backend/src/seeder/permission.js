require("dotenv").config();
const { dbName } = require("../constants/constant");
const mongoose = require("mongoose");
const permissionModel = require("../models/permission.model");


const DBconnection = async () => {
  try {
    const db = await mongoose.connect(`${process.env.MONGODB_URL}/${dbName}`);
    console.log(`Database connected to ${db.connection.host}`);
    await seedPermission();
  } catch (error) {
    console.log("Database connection refused", erro);
  }
};

//seed all permission resources
const seedPermission = async () => {
  try {
    //remove  existing permissions
    await permissionModel.deleteMany();
    const permissionData = [
      {
        name: "category",
        actions: ["create", "read", "update", "delete"],
      },
      {
        name: "subcategory",
        actions: ["create", "read", "update", "delete"],
      },
      {
        name: "brand",
        actions: ["create", "read", "update", "delete"],
      },
      {
        name: "product",
        actions: ["create", "read", "update", "delete"],
      },
      {
        name: "coupon",
        actions: ["create", "read", "update", "delete"],
      },
      {
        name: "delivercharge",
        actions: ["create", "read", "update", "delete"],
      },
      {
        name: "discount",
        actions: ["create", "read", "update", "delete"],
      },
      {
        name: "invoice",
        actions: ["create", "read", "update", "delete"],
      },
      {
        name: "order",
        actions: ["create", "read", "update", "delete"],
      },
      {
        name: "permission",
        actions: ["create", "read", "update", "delete"],
      },
      {
        name: "role",
        actions: ["create", "read", "update", "delete"],
      },
      {
        name: "variant",
        actions: ["create", "read", "update", "delete"],
      },
      {
        name: "user",
        actions: ["create", "read", "update", "delete"],
      },
    ];

    const allPermission = await permissionModel.insertMany(permissionData);

    console.log("permissions seeded successfully", allPermission);
  } catch (error) {
    console.log("error", error);
  }
};

DBconnection();
