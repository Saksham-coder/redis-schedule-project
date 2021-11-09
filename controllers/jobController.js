const Job = require("./../models/jobModel");
const redis = require("redis");
const client = redis.createClient();
const logger = require("./../helpers/loggers");

exports.postJob = async (req, res) => {
  try {
    const { url, priority, status, title } = req.body;

    // VALIDATION
    if (!url && !priority && !status && !title) {
      const response = {
        message: "Field is missing",
      };
      logger.warn(response);
      res.status(404).json(response);
    }

    // SAVING IN DATABASE
    const newDocument = await Job.create({ url, priority, status, title });

    // const lengthOfList = client.scard("data", async function (err, reply) {
    //   console.log("IN REPY", reply);
    // });

    const queueDocument = client.sadd(
      "data",
      JSON.stringify(newDocument),
      async function (err, reply) {
        if (reply) {
          const updatedDocument = await Job.findByIdAndUpdate(
            newDocument._id,
            {
              status: "queue",
            },
            {
              new: true,
            }
          );
        }
      }
    );

    logger.info(`Job is created at ${Date.now()}`);
    res.status(200).json({
      message: "Job is created!",
    });
  } catch (error) {
    logger.warn(`Job is failed to create at ${Date.now()} ${error}`);
    res.status(404).json({
      message: "Job is not created!",
    });
  }
};

exports.getAllJob = async (req, res) => {
  try {
    const documents = await Job.find();
    logger.info(`Data is fetched at ${Date.now()}`);
    res.status(200).json({
      message: "Job is fetched",
      data: documents,
    });
  } catch (error) {
    logger.warn(`Job is failed to create at ${Date.now()} ${error}`);
    res.status(404).json({
      message: "Job is not fetched!",
    });
  }
};

exports.abortJob = async (req, res) => {
  try {
    const { id } = req.body;
    const document = await Job.findByIdAndUpdate(id, {
      $set: { status: "abort" },
      $inc: { halted: 1 },
    });
    // MAKE HELPERS TO UTILS
    // add logger also
    res.status(200).json({
      message: "Job is aborted!",
    });
  } catch (err) {
    console.log(err);
  }
};
