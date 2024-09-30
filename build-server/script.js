const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const mime = require("mime-types");

const s3Client = new S3Client({
  region: "eu-north-1",
  credentials: {
    accessKeyId: "AKIAQ3EGQOCGRJFO42WS",
    secretAccessKey: "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",
  },
});

const PROJECT_ID = process.env.PROJECT_ID;

const init = async () => {
  /* 
    The product repo  is cloned to the repo and 
    the require packages are installed and will keep running.

    here the process thread is executed, the process will run the require steps.
    while building the repo's, the logs files are displayed in the terminal. 
    if they are any errors it would be giving out. 

    after completing this steps the process will end and show case the build
    output command.

    returns -- as dist folder (which contains the static files)
    would be uploading them into S3
*/
  console.log("executing script.js");
  const outDirPath = path.join(__dirname, "output");

  const process = exec(`cd ${outDirPath} && npm install && npm run build`);

  process.stdout.on("data", (data) => {
    console.log(data.toString());
  });

  process.stdout.on("error", (error) => {
    console.log("Error", data.toString());
  });

  process.on("close", async () => {
    console.log("Build complete");
    const distFolderPath = path.join(__dirname, "output", "dist");
    const distFolderContents = fs.readdirSync(distFolderPath, {
      recursive: true,
    }); // returns an array

    // check if path is file or folder path
    for (const file of distFolderContents) {
      const filePath = path.join(distFolderPath, file);
      if (fs.lstatSync(filePath).isDirectory()) continue;

      console.log("uploading files...");
      const command = new PutObjectCommand({
        Bucket: "launch-host",
        Key: `__outputs/${PROJECT_ID}/${file}`,
        // storing path -- {ouputs/project_id or /slug}
        Body: fs.createReadStream(filePath),
        ContentType: mime.lookup(filePath),
      });

      await s3Client.send(command);
      console.log("uploaded", filePath);
    }
    console.log(" Done ...");
  });
};

init();
