const jwt = require("jsonwebtoken");
const CryptoJS = require("crypto-js");
const moment = require("moment-timezone");

const NotificationTemplateModel = require("../Models/notification-template.model");
const NotificationModel = require("../Models/notification.model");

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY?.trim();
const JWT_ALGORITHM = process.env.JWT_ALGORITHM?.trim() || "HS256";

class CommonUtils {
  constructor() {}

  // ---------------- OTP ----------------
  generateOTP(length = 4) {
    const charset = "0123456789";
    let otp = "";
    for (let i = 0; i < length; i++) {
      otp += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return otp;
  }

  // ---------------- Token ----------------
  encryptToken(token) {
    return CryptoJS.AES.encrypt(token, ENCRYPTION_KEY).toString();
  }

  decryptToken(encryptedToken) {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedToken, ENCRYPTION_KEY);
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      return null;
    }
  }

  async generateTokens(id, email, user_type, is_verified = false) {
    const secret = process.env.JWT_SECRET?.trim();
    const accessTokenPayload = { id, email, user_type, is_verified, iat: Math.floor(Date.now() / 1000) };
    const refreshTokenPayload = { id, user_type, token_type: "refresh" };

    // const accessToken = jwt.sign(accessTokenPayload, secret, {
    //   expiresIn: process.env.JWT_EXPIRES || "1h",
    //   algorithm: JWT_ALGORITHM,
    // });

        const accessToken = jwt.sign(accessTokenPayload, secret, {
      expiresIn: "1d",
      algorithm: JWT_ALGORITHM,
    });
    // const refreshToken = jwt.sign(refreshTokenPayload, secret, {
    //   expiresIn: process.env.REFRESH_TOKEN_EXPIRES || "7d",
    //   algorithm: JWT_ALGORITHM,
    // });
     const refreshToken = jwt.sign(refreshTokenPayload, secret, {
      expiresIn: "1d" || "7d",
      algorithm: JWT_ALGORITHM,
    });

    return {
      accessToken: this.encryptToken(accessToken),
      refreshToken: this.encryptToken(refreshToken),
      expiresIn: process.env.JWT_EXPIRES || "1h",
    };
  }

  verifyToken(token, isRefreshToken = false) {
    try {
      const secret = process.env.JWT_SECRET?.trim();
      return jwt.verify(token, secret);
    } catch (error) {
      return null;
    }
  }
 
  static replaceVariables(templateString, data) {
    if (!templateString) {
      return "";
    }

    // Find all {{variable}} patterns and replace them
    let result = templateString;
    
     for (let key in data) {
      const value = data[key];
      const placeholder = `{{${key}}}`;
      
      // Replace all occurrences of this placeholder
      if (value !== null && value !== undefined) {
        result = result.split(placeholder).join(value);
      } else {
        // If value is missing, just remove the placeholder
        result = result.split(placeholder).join("");
      }
    }
    
    // Clean up any remaining {{...}} that we don't have data for
    result = result.replace(/\{\{[^}]+\}\}/g, "");
    
    return result;
  }


  async sendNotification(params) {
    const { 
      receiver_id,    // User who will receive notification
      client_id,      // Company ID (optional)
      service_id,     // Service ID (optional)
      event_type,     // Like "Client Added", "Task Assigned"
      data            // Object with values like {clientName: "Acme", serviceName: "GST"}
    } = params;

    const NotificationTemplateModel = require('../Models/notification-template.model');
    
    const template = await NotificationTemplateModel.findOne({
      event_type: event_type,
      is_active: true,
      is_delete: false
    });

    if (!template) {
      console.log(`No template found for event: ${event_type}`);
      return null;
    }

    const processedSubject = this.replaceVariables(template.subject, data);
    const processedMessage = this.replaceVariables(template.message, data);

    const NotificationModel = require('../Models/notification.model');
    
    const notificationData = {
      receiver_id: receiver_id,
      client_id: client_id || null,
      service_id: service_id || null,
      title: processedSubject || event_type, 
      message: processedMessage,
      event_type: event_type,
      channels: template.channels,
      meta: {
        priority: template.priority,
        template_id: template._id
      },
      is_read: false
    };

    const notification = await NotificationModel.create(notificationData);

    // await this.sendToChannels(notification, template.channels);

    return notification;
  }


  async sendToChannels(notification, channels) {
    for (let i = 0; i < channels.length; i++) {
      const channel = channels[i];
      
      if (channel === "Email") {
        console.log("📧 Email sent:", notification.title);
      } 
      else if (channel === "SMS") {
        console.log("📱 SMS sent:", notification.title);
      } 
      else if (channel === "WhatsApp") {
        console.log("💬 WhatsApp sent:", notification.title);
      } 
      else if (channel === "Push") {
        console.log("🔔 Push notification sent:", notification.title);
      } 
      else if (channel === "In-App") {
        console.log("📱 In-App notification created");
      }
    }
  }

 
 

  calculateDueDates = (service, frontendDueDate, frontendExtendedDueDate) => {
    
  const frequency = service.frequency;
  const freqConfig = service.frequency_due_dates;
  const today = new Date();
  const currentYear = today.getUTCFullYear();
  const currentMonthIndex = today.getUTCMonth();

  let dueDate = null;
  let extendedDueDate = null;

  if (frequency === "One-time") {
    if (!frontendDueDate) {
      throw new Error("due_date is required for One-time service");
    }

    dueDate = new Date(frontendDueDate);
    if (isNaN(dueDate.getTime())) throw new Error("Invalid due_date format");

    if (frontendExtendedDueDate) {
      extendedDueDate = new Date(frontendExtendedDueDate);
      if (isNaN(extendedDueDate.getTime())) {
        throw new Error("Invalid extended_due_date format");
      }
    }

    return { due_date: dueDate, extended_due_date: extendedDueDate };
  }
 
  if (!freqConfig) {
    throw new Error("frequency_due_dates missing in service");
  }
 
    const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
    ];
    
  if (frequency === "Monthly") {
    const monthName = monthNames[currentMonthIndex];
    const config = freqConfig[monthName];

    if (!config || !config.day)
      throw new Error(`Missing frequency config for month: ${monthName}`);

    dueDate = new Date(Date.UTC(currentYear, currentMonthIndex, config.day));

    if (config.extended_due_date)
      extendedDueDate = new Date(config.extended_due_date);
  }
 
  else if (frequency === "Quarterly") {
    const quarterMap = {
      0: "Q4", 1: "Q4", 2: "Q4",
      3: "Q1", 4: "Q1", 5: "Q1",
      6: "Q2", 7: "Q2", 8: "Q2",
      9: "Q3", 10: "Q3", 11: "Q3"
    };

    const quarterKey = quarterMap[currentMonthIndex];
    const config = freqConfig[quarterKey];

    if (!config || !config.day || !config.month)
      throw new Error(`Invalid quarterly config for ${quarterKey}`);

    dueDate = new Date(Date.UTC(currentYear, config.month - 1, config.day));

    if (config.extended_due_date || config.extended_date)
      extendedDueDate = new Date(config.extended_due_date || config.extended_date);
  }
 
  else if (frequency === "Half-yearly") {
    const key = currentMonthIndex <= 5 ? "first_half" : "second_half";
    const config = freqConfig[key];

    if (!config || !config.day || !config.month)
      throw new Error(`Invalid half-yearly config for ${key}`);

    dueDate = new Date(Date.UTC(currentYear, config.month - 1, config.day));

    if (config.extended_due_date)
      extendedDueDate = new Date(config.extended_due_date);
  }
 
  else if (frequency === "Annually" || frequency === "Anually") {
    if (!freqConfig.day || !freqConfig.month)
      throw new Error("Invalid annual configuration");

    dueDate = new Date(Date.UTC(currentYear, freqConfig.month - 1, freqConfig.day));

    if (freqConfig.extended_due_date)
      extendedDueDate = new Date(freqConfig.extended_due_date);
  }
 
  if (dueDate && isNaN(dueDate.getTime())) {
    throw new Error("Invalid calculated due_date");
  }

  if (extendedDueDate && isNaN(extendedDueDate.getTime())) {
    extendedDueDate = null;
  }

  return { due_date: dueDate, extended_due_date: extendedDueDate };
};

 
  static _calculateOverdueDays(dueDate) {
    if (!dueDate) return '0 days';
    const due = new Date(dueDate);
    const now = new Date();
    const diffTime = now - due;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? `${diffDays} days` : '0 days';
  }

  /**
   * Helper: Calculate days remaining
   */
  static _calculateDaysRemaining(dueDate) {
    if (!dueDate) return '0 days';
    const due = new Date(dueDate);
    const now = new Date();
    const diffTime = due - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? `${diffDays} days` : '0 days';
  }
}


module.exports = new CommonUtils();
