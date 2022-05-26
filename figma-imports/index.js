require("dotenv").config();

console.log("process.env", process.env);

const importIcons = require("./icons");

const main = async () => {
  await importIcons();
};

main().catch((err) => {
  console.error("Unhandled rejection", err);
});
