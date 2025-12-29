require("dotenv").config();
const { dbName } = require("../constants/constant");
const mongoose = require("mongoose");
const roleModel = require("../models/role.model");
const permissionModel = require("../models/permission.model");

const DBconnection = async () => {
  try {
    const db = await mongoose.connect(`${process.env.MONGODB_URL}/${dbName}`);
    console.log(
      `Database connection Successfully for Role Seeder ${db.connection.host}`
    );
    await seedRole();
  } catch (error) {
    console.log("Database connection refused", error);
  }
};

//seed all role resources
const seedRole = async () => {
  try {
    //remove  existing roles
    await roleModel.deleteMany();
    const allpermission = await permissionModel.find();
    const roleModelData = [
      {
        name: "admin",
        permission: allpermission.map((p) => p._id),
      },
      {
        name: "manager",
        permission: allpermission.filter((p) => {
          if (p.name == "brand" || p.name == "coupon" || p.name == "category") {
            return p._id;
          }
        }),
      },
    ];

    const allRole = await roleModel.insertMany(roleModelData);

    console.log("roles seeded successfully", allRole);
  } catch (error) {
    console.log("error seeding role data:", error);
  }
};

DBconnection();
