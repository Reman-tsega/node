const { v4: uuid } = require("uuid");
const { format } = require("date-fns");
const fs = require("fs");
const path = require("path");
const fsPromises = fs.promises;

const logEvents = async (msg, fileName) => {
  try {
    const dateTime = format(new Date(), "dd-MM-yyyy\t\tHH:mm:ss");
    // console.log(`${dateTime}\t${uuid()}\t${msg}`);

    fs.existsSync(`./tut3/${fileName}`)
      ? await fsPromises.appendFile(
          path.join(__dirname, `./tut3/${fileName}`),
          `${msg}${uuid()} ${dateTime}\n`
        ).then(()=>console.log("file exist"))
      : await fsPromises.mkdir(path.join(__dirname,'./tut3')).then(async () => {
        console.log("file not exist")
        await fsPromises.appendFile(
          path.join(__dirname, `./tut3/${fileName}`),
          `${msg}${uuid()} ${dateTime}\n`
        );
    })  
  } catch (error) {
    console.log(error);
  }
};

module.exports = logEvents;
