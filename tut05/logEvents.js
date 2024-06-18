const { v4: uuid } = require("uuid");
const { format } = require("date-fns");
const fs = require("fs");
const path = require("path");
const fsPromises = fs.promises;

const logEvents = async (msg, fileName) => {
  try {
    const dateTime = format(new Date(), "dd-MM-yyyy\t\tHH:mm:ss");
    const logItem = `${dateTime}\t${uuid()}\t${msg}\n`;

    // Ensure the directory exists
    const logDir = path.join(__dirname, 'tut3');
    if (!fs.existsSync(logDir)) {
      await fsPromises.mkdir(logDir);
    }

    // Append the log item to the file
    await fsPromises.appendFile(path.join(logDir, fileName), logItem);
  } catch (error) {
    console.log(error);
  }
};

module.exports = logEvents;
