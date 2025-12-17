const cron = require("node-cron");
const moment = require("moment-timezone");
const TaskModel = require("../Models/task.model");
const UserModel = require("../Models/user.model");
const NotificationTemplateModel = require("../Models/notification-template.model");
const commonUtilsObj = require("../Utils/commonUtils.utils");  

 
async function checkOverdueTasks() {

    console.log("CRON JOB: Starting overdue task check...");

    const todayStart = moment().tz("Asia/Kolkata").startOf('day').toDate();
    
    const overdueTasks = await TaskModel.find({
        due_date: { $lt: todayStart }, 
        status: { $nin: ["Delayed", "Completed"] },
        is_delete: false,
    });

    if (overdueTasks.length === 0) {
        console.log("CRON JOB: No new overdue tasks found.");
        return;
    }

    console.log(`CRON JOB: Found ${overdueTasks.length} tasks to mark as Delayed.`);

    const overdueTemplate = await NotificationTemplateModel.findOne({ 
        event_type: "Task Overdue", 
        is_active: true 
    });

    for (const task of overdueTasks) {
        try {
            task.status = "Delayed";
            await task.save();

            if (overdueTemplate) {
                const assignedUser = await UserModel.findById(task.assigned_to).select('full_name');

                if (!assignedUser) continue;  

                const dynamicData = {
                    serviceName: "N/A", 
                    dueDate: task.due_date ? moment(task.due_date).tz("Asia/Kolkata").format("DD-MM-YYYY") : "N/A",
                    assignedUser: assignedUser.full_name,
                    // overdueBy calculation can be done here if needed
                };

                await commonUtilsObj.sendNotification({
                    receiver_id: assignedUser._id,
                    receiver_type: "User",
                    reference_for: "Task",
                    reference_id: task._id,
                    template: overdueTemplate,
                    dynamicData,
                });

                console.log(`Notification sent for overdue task: ${task._id}`);
            }

        } catch (error) {
            console.error(`Error processing task ${task._id}:`, error);
        }
    }

    console.log("CRON JOB: Overdue task check completed.");
}

// 4. Cron Job Scheduler Setup
exports.startCronJobs = () => {
    // Cron expression: '0 0 * * *' = 0th minute, 0th hour (12:00 AM) of every day
    // Timezone: 'Asia/Kolkata'
    cron.schedule('0 0 * * *', checkOverdueTasks, {
        scheduled: true,
        timezone: "Asia/Kolkata"
    });
    console.log("Cron Job: Overdue task checker scheduled to run daily at 12:00 AM IST.");
};

// Note: आपको अपनी `app.js` या `server.js` फ़ाइल में `startCronJobs()` को कॉल करना होगा।