"use strict";

/** @type {import('sequelize-cli').Migration} */

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("users", {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: { notEmpty: true },
    },
    firstName: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: { is: /^[a-zA-Z ]+$/, notEmpty: true },
    },
    lastName: {
      type: Sequelize.STRING,
      allowNull: true,
      validate: {
        is: /^[a-zA-Z ]*$/,
      },
    },
    role: {
      type: Sequelize.ENUM("user", "admin"),
      allowNull: false,
      defaultValue: "user",
    },
    isActive: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal(
        "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
      ),
    },
  });
  await queryInterface.addIndex("users", ["email"], {
    unique: true,
    name: "userEmailUnique",
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable("users");
}
