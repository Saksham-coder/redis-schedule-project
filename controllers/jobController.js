const Job = require('./../models/jobModel')
const schedule = require('node-schedule');
const redis = require("redis");
const client = redis.createClient();
const { getHTML, getNews } =  require('./../helpers/scraper')

exports.postJob = async(req, res) => {
    try{
        const {
            url,
            priority,
            status
        } = req.body
        // ERROR MESSAGE
        // JOB STATUS ERROR ALSO
        const newJob =await Job.create({url,priority,status})
        console.log("NEW JOB IN DTAABSE", newJob)

        // add logger also
        res.status(200).json({
            message: 'Job is queued!'
        });
    }catch(err){
        console.log(err)
    }
}

// WILL REMOVE THIS ONLY FOR REF.
exports.scrapeJob = async(req, res) => {
    try{
        const html = await getHTML('https://www.manchestereveningnews.co.uk/all-about/manchester-united-fc')
        const follower = await getNews(html)
        console.log("NEWS HEADING", follower)
        res.status(200).json({
            message: 'Job is aborted!',
        });
    } catch(err) {
        console.log("ERROR", err)
    }
}

exports.cancelJob = async(req, res) => {
    try{
        // helper("cancel")
        const Jobs = await Job.aggregate([
            {
                $match: { 
                    status: {$not: { $eq: 'success' } }},
            },
            { 
                $sort : {priority : -1},
            },
            { 
                $limit : 10 
            },
        ])
        // add logger also
        res.status(200).json({
            message: 'Job is canceled!',
            data: Jobs
        });
    }catch(err){
        console.log(err)
    }
}

exports.abortJob = async(req, res) => {
    try{
        const {
            id
        } = req.body
        const document = await Job.findByIdAndUpdate(id, {
            $set: { status: 'abort'},
            $inc: { halted: 1 },
        })
        // add logger also
        res.status(200).json({
            message: 'Job is aborted!',
        });
    }catch(err){
        console.log(err)
    }
}

// schedule.scheduleJob('5 * * * * *', async () => {

//     const Jobs = await Job.aggregate([
//         {
//             $match: { 
//                 status: {$not: { $in: ['success', 'running', 'queue'] } }},
//         },
//         { 
//             $sort : {priority : -1},
//         },
//         { 
//             $limit : 10 
//         },
//     ])

//     Jobs?.length && Jobs.forEach(val => {
//         console.log("EVERY VAL THAT WILL ADD", val._id)
//         const result = client.sadd("data", JSON.stringify(val._id), async function(err, reply) {
//             // const updatedDocument = await Job.findByIdAndUpdate(val._id, {
//             //     status: 'queue'
//             // } )
//             // console.log("UPDATED DOCUMENT", updatedDocument)
//         })
//     })
// });

// schedule.scheduleJob('10 * * * * *', async () => {
//     client.spop("data",async function(err, reply) {
//         if (err) {
//             const updateDocument = await Job.findByIdAndUpdate(Jobs._id, {
//                 $set: { status: 'halt'},
//                 $inc: { halted: 1 },
//             })
//         }
//         const Jobs = await Job.findById(JSON.parse(reply))
//         const updateDocumentToRunning =await Job.findByIdAndUpdate(Jobs._id, {
//             status: 'running'
//         })
//         console.log("ALL REPLY IDDDDD>>>",reply);
//         // EXECUTE FUNCTION ANY ASYNC FUNCTION
//         // LIKE SENDING MAIL, PERFORMING TASK, ... etc.
//         const html = await getHTML(Jobs.url)
//         const news = await getNews(html)
//         // console.log("FINALLY EVERYTHIBGGH", news)

//         // MARKED IT AS SUCCESS WHEN IT COMPLETED
//         const updateDocumentToSuccess = await Job.findByIdAndUpdate(Jobs._id, {
//             status: 'success'
//         })
//     })
// });

// const helper = async (type="start") => {
//     try{
//         // console.log("STARTED")
//         // let job
//         if (type === "start") {
//             console.log("WIL START ENGINE")
//             schedule.scheduleJob('10 * * * * *', async () => {
//                 const Jobs = await Job.aggregate([
//                     {
//                         $match : {'status': 'create' }
//                     },
//                     { 
//                         $sort : {priority : -1}
//                     }
//                 ])
//                 console.log("FROM DB", Jobs)
//             });
//         } else if (type==="cancel") {
//             // console.log("WIL CANCEL ENGINE")
//             // schedule.canceled('1 * * * * *', () => {
//             //     console.log("FINALLY CANCELLED")
//             // });
//         }
//     } catch (err) {
//         console.log("ERROR RFROM HELOPERR", err)
//     }
// }