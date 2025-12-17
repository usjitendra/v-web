const axios = require('axios');
const responseHandler = require('../Utils/responseHandler.utils');

class TeamsNotificationService {
    constructor() {
        this.tenantId = process.env.MICROSOFT_ACTUAL_TENANT_ID || process.env.MICROSOFT_TENANT_ID;
        this.clientId = process.env.MICROSOFT_CLIENT_ID;
        this.clientSecret = process.env.MICROSOFT_CLIENT_SECRET;
        this.frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        
        this.cachedToken = null;
        this.tokenExpiry = null;
    }

    async getAccessToken() {
        try {
            if (this.cachedToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
                return this.cachedToken;
            }

            const url = `https://login.microsoftonline.com/${this.tenantId}/oauth2/v2.0/token`;
            
            const params = new URLSearchParams();
            params.append('client_id', this.clientId);
            params.append('client_secret', this.clientSecret);
            params.append('scope', 'https://graph.microsoft.com/.default');
            params.append('grant_type', 'client_credentials');

            const response = await axios.post(url, params, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });

            this.cachedToken = response.data.access_token;
            this.tokenExpiry = Date.now() + ((response.data.expires_in - 300) * 1000);

            console.log('✅ Access token obtained');
            return this.cachedToken;
        } catch (error) {
            console.error('❌ Token error:', error.response?.data || error.message);
            throw new Error('Failed to get access token');
        }
    }

    async findUserByEmail(email) {
        try {
            const token = await this.getAccessToken();
            
            const response = await axios.get(
                `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(email)}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log(`✅ Found user: ${response.data.displayName}`);
            return response.data;
        } catch (error) {
            console.error(`❌ User not found: ${email}`);
            throw new Error(`User ${email} not found`);
        }
    }

// ✅ TEAMS BELL NOTIFICATION - With Installed App
async sendTeamsNotification(userEmail, title, message) {
    try {
        console.log(`🔔 Sending Teams notification to: ${userEmail}`);
        
        const token = await this.getAccessToken();
        const user = await this.findUserByEmail(userEmail);

        console.log("toekn : ",token);
        console.log("user: ", user);
        
        // Use your app ID from manifest
        const teamsAppId = "7298445a-f228-462f-a3bf-7227221c8514";

        const notificationPayload = {
            topic: {
                source: "entityUrl",
                value: `https://graph.microsoft.com/v1.0/appCatalogs/teamsApps/${teamsAppId}`
            },
            activityType: "taskCreated",
            previewText: {
                content: message
            },
            templateParameters: [
                {
                    name: "taskTitle",
                    value: title
                }
            ]
        };

        await axios.post(
            `https://graph.microsoft.com/v1.0/users/${user.id}/teamwork/sendActivityNotification`,
            notificationPayload,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log(`✅ Teams notification sent to ${userEmail}`);
        return { 
            success: true, 
            method: 'teams_bell', 
            recipient: userEmail 
        };
    } catch (error) {
        console.error('❌ Teams notification failed:', {
            status: error.response?.status,
            error: error.response?.data?.error?.message || error.message
        });

        return { 
            success: false, 
            error: error.response?.data?.error?.message || error.message 
        };
    }
}

    // ✅ Main send method
    async sendNotification(recipientEmail, message, title = 'Notification') {
        console.log(`\n📤 Sending notification to: ${recipientEmail}`);
        
        // Send Teams notification
        const result = await this.sendTeamsNotification(recipientEmail, title, message);
        
        if (result.success) {
            console.log('✅ Notification sent to Teams bell icon');
            return result;
        }

        console.error('❌ Notification failed:', result.error);
        throw new Error(`Failed to send notification: ${result.error}`);
    }

    // ==================== ROUTE HANDLERS ====================

    testNotification = async (req, res) => {
        try {
            const { email } = req.body;

            if (!email) {
                return responseHandler.errorResponse(res, 400, "Email is required", {});
            }

            const result = await this.sendNotification(
                email,
                '🧪 Test notification from CA Task Manager. If you see this in Teams bell icon, it works!',
                '🧪 Test Notification'
            );

            return responseHandler.successResponse(
                res, 
                200, 
                'Teams notification sent! Check Teams bell icon 🔔', 
                result
            );
        } catch (error) {
            console.error('Test notification error:', error);
            return responseHandler.errorResponse(res, 500, error.message, {});
        }
    };

    sendSimpleNotification = async (req, res) => {
        try {
            const { email, title, message } = req.body;

            if (!email || !message) {
                return responseHandler.errorResponse(res, 400, "Email and message required", {});
            }

            const result = await this.sendNotification(email, message, title || 'Notification');

            return responseHandler.successResponse(res, 200, 'Teams notification sent!', result);
        } catch (error) {
            return responseHandler.errorResponse(res, 500, error.message, {});
        }
    };

    sendTaskNotification = async (req, res) => {
        try {
            const { taskData, assignedToUser, assignedByUser } = req.body;

            if (!taskData || !assignedToUser?.email) {
                return responseHandler.errorResponse(res, 400, "Invalid task data", {});
            }

            const message = `New task "${taskData.title}" assigned to you by ${assignedByUser?.full_name || 'Admin'}. Priority: ${taskData.priority || 'Medium'}`;

            const result = await this.sendNotification(
                assignedToUser.email,
                message,
                '🎯 New Task Assigned'
            );

            return responseHandler.successResponse(res, 200, 'Task notification sent to Teams!', result);
        } catch (error) {
            return responseHandler.errorResponse(res, 500, error.message, {});
        }
    };

    sendBulkNotification = async (req, res) => {
        try {
            const { emails, title, message } = req.body;

            if (!emails || !Array.isArray(emails) || !message) {
                return responseHandler.errorResponse(res, 400, "Emails array and message required", {});
            }

            const results = { success: [], failed: [] };

            for (const email of emails) {
                try {
                    const result = await this.sendNotification(email, message, title || 'Notification');
                    results.success.push({ email, method: result.method });
                    await new Promise(resolve => setTimeout(resolve, 1000));
                } catch (error) {
                    results.failed.push({ email, error: error.message });
                }
            }

            return responseHandler.successResponse(
                res,
                200,
                `Sent: ${results.success.length}, Failed: ${results.failed.length}`,
                results
            );
        } catch (error) {
            return responseHandler.errorResponse(res, 500, error.message, {});
        }
    };
}

module.exports = new TeamsNotificationService();