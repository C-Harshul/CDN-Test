require("dotenv/config");
const AWS = require("aws-sdk");
const express = require("express");
const router = new express.Router();
const multer = require("multer");
const uuid = require("uuid/v4");

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_SECRET,
  });
  
  const storage = multer.memoryStorage({
    destination: function (req, file, callback) {
      callback(null, "");
    },
  });
  
  const upload = multer({ storage }).single("file");
  
  router.post("/upload", upload, (req, res) => {
    let myFile = req.file.originalname.split(".");
    const fileType = myFile[myFile.length - 1];
    const directory = req.body.directory;
  
    console.log(req.body);
  
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: directory + `/${uuid()}.${fileType}`,
      Body: req.file.buffer,
    };
    s3.upload(params, (error, data) => {
      if (error) {
        res.status(500).send(error);
      }
  
      res.send(data);
    });
  });
  
  router.delete("/delete", (req, res) => {
    const directory = req.body.directory;
    const fileName = req.body.fileName
    var params = { Bucket: process.env.AWS_BUCKET_NAME, Key: directory+"/"+fileName };
  
    s3.deleteObject(params, function (err, data) {
      if (err) {
          res.status(500).send();
      }
      else{
         
          res.send(data);
      }
    });
  });

  router.patch("/update", upload,(req, res) => {
    let myFile = req.file.originalname.split(".");
    const fileType = myFile[myFile.length - 1];
    const directory = req.body.directory;
    const fileName = req.body.fileName +"."+fileType
    var deleteParams = { Bucket: process.env.AWS_BUCKET_NAME, Key: directory+"/"+fileName };
  
    s3.deleteObject(deleteParams, function (err, data) {
      if (err) {
          console.log(err);
      }
      else{
          console.log(directory+"/"+fileName + "deleted successfully")
      }
    });
    const updateParams = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: directory + `/${fileName}`,
        Body: req.file.buffer,
      };
      s3.upload(updateParams, (error, data) => {
        if (error) {
          res.status(500).send(error);
        }
        else {
        res.send(data);
        }
      });
  });

  module.exports = router;