const Job = require("./../models/jobModel");
const schedule = require("node-schedule");
const redis = require("redis");
const client = redis.createClient();
const logger = require("./../helpers/loggers");
var tcpPortUsed = require("tcp-port-used");
const net = require("net");

const options = {
  port: "9000",
};

const scheduler = schedule.scheduleJob("* * * * * *", async () => {
  client.spop("data", async function (err, reply) {
    const latestData = { ...JSON.parse(reply) };
    console.log("POPPED IS", latestData);
    try {
      const documnet = await Job.findById(latestData._id);
      // console.log("AAAA", documnet);
      if (documnet) {
        // UPDATE DOCUMENT TO RUNNING STATUS
        const updateDocumentToRunning = await Job.findByIdAndUpdate(
          latestData._id,
          {
            status: "running",
          }
        );
        // EXECUTE FUNCTION ANY ASYNC FUNCTION
        // LIKE SENDING MAIL, PERFORMING TASK, ... etc.
        // IF THERE IS TCP ERROR THEN IT WILL ADD TO QUEUE AND ON EXCEDDING TWICE IT WILL NOT ADD IN QUEUE
        tcpPortUsed.check(9000, "127.0.0.1").then(
          async function (inUse) {
            if (inUse && latestData.url) {
              const updateDocumentToRunning = await Job.findByIdAndUpdate(
                latestData._id,
                {
                  $set: {
                    status: "running",
                  },
                },
                { new: true }
              );
              const client = net.createConnection(options, () => {
                client.write(JSON.stringify({ url: latestData.url }));
              });
              client.on("data", async (data) => {
                // MARKED IT AS SUCCESS WHEN IT COMPLETED
                const updateDocumentToSuccess = await Job.findByIdAndUpdate(
                  latestData._id,
                  {
                    $set: {
                      status: "success",
                      data: data.toString().split(","),
                    },
                  },
                  { new: true }
                );
                client.end();
              });
            }
          },
          async function (err) {
            if (latestData) {
              const updatedToHalt = await Job.findByIdAndUpdate(
                latestData._id,
                {
                  $set: { status: "halt" },
                  $inc: { halted: 1 },
                },
                { new: true }
              );
            }
            console.error("Error on check:", err.message);
          }
        );
      }
    } catch (error) {
      if (latestData) {
        const updatedToHalt = await Job.findByIdAndUpdate(
          latestData._id,
          {
            $set: { status: "halt" },
            $inc: { halted: 1 },
          },
          { new: true }
        );
        // ADD AGAIN IN QUEUE IF ITS LESS THAN OR EQUAL TO 2
        if (updatedToHalt?.halted <= 2) {
          client.sadd(
            "data",
            JSON.stringify(updatedToHalt),
            async function (err, reply) {
              const updatedDocument = await Job.findByIdAndUpdate(
                updatedToHalt._id,
                {
                  status: "queue",
                }
              );
            }
          );
        }
      }
    }
  });
});

module.exports = scheduler;
