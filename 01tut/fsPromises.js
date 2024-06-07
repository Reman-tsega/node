const fsPromises = require("fs").promises;
const path = require("path");

const fileObj = async () => {
  try {
    const data = await fsPromises.readFile(
      path.join(__dirname, "new1.txt"),
      "utf-8"
    );
    console.log(data);
    await fsPromises.writeFile(
      path.join(__dirname, "new2.txt"),
      `this is for promise test ${data}  `
    );

    await fsPromises.appendFile(
      path.join(__dirname, "new2.txt"),
      "\n last line text"
    );

    await fsPromises.rename(
      path.join(__dirname, "new2.txt"),
      path.join(__dirname, "new3.txt")
    );
  } catch (error) {
    console.error(error);
  }
};

fileObj();
console.log("this will be called first");
