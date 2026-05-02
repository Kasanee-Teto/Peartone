import "dotenv/config";
import app from "./app.js";
import db from "./models/index.js";
import Sequelize from "sequelize";

const PORT = process.env.PORT || 3000;

async function ensureUserBioColumn() {
  const queryInterface = db.sequelize.getQueryInterface();
  const tableDescription = await queryInterface.describeTable("Users");

  if (!tableDescription.bio) {
    await queryInterface.addColumn("Users", "bio", {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  }
}

await ensureUserBioColumn();

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});