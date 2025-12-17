
class EmailTemplate {
  constructor() { }

  sentOtp = async (name, otp) => {
    return `
          <!DOCTYPE html>
          <html lang="en" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:v="urn:schemas-microsoft-com:vml">
          
      <head>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  background-color: #f7f7f7;
                  padding: 20px;
              }
              .container {
                  max-width: 600px;
                  margin: 0 auto;
                  background: #ffffff;
                  padding: 20px;
                  border-radius: 5px;
                  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
              }
              h2 {
                  color: #333333;
              }
              p {
                  font-size: 16px;
                  line-height: 1.5;
                  color: #555555;
              }
              .otp {
                  font-size: 24px;
                  font-weight: bold;
                  color: #007BFF;
              }
              .footer {
                  text-align: center;
                  margin-top: 20px;
                  font-size: 14px;
                  color: #aaaaaa;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <h2>Hello, ${name}!</h2>
              <p>Thank you for using our service. Your OTP is:</p>
              <p class="otp">${otp}</p>
              <p>Please use this OTP to complete your process. It will expire in 10 minutes.</p>
              <p>Best regards,<br>Your Company</p>
              <div class="footer">
                  &copy; 2024 Your Company. All rights reserved.
              </div>
          </div>
      </body>
          </html>
          `;
  };

  sendCredentials = async (name, email, password) => {
    return `
      <!DOCTYPE html>
      <html lang="en" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:v="urn:schemas-microsoft-com:vml">
      
  <head>
      <style>
      
          body {
              font-family: Arial, sans-serif;
              background-color: #f7f7f7;
              padding: 20px;
          }
          .container {
              max-width: 600px;
              margin: 0 auto;
              background: #ffffff;
              padding: 20px;
              border-radius: 5px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }
          h2 {
              color: #333333;
          }
          p {
              font-size: 16px;
              line-height: 1.5;
              color: #555555;
          }
          .credentials {
              background-color: #f0f0f0;
              padding: 15px;
              border-radius: 5px;
              margin: 20px 0;
          }
          .label {
              font-weight: bold;
              color: #333333;
          }
          .footer {
              text-align: center;
              margin-top: 20px;
              font-size: 14px;
              color: #aaaaaa;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <h2>Welcome, ${name}!</h2>
          <p>We are pleased to share your login credentials for accessing your account:</p>
          
          <div class="credentials">
              <p><span class="label">Email:</span> ${email}</p>
              <p><span class="label">Password:</span> ${password}</p>
          </div>
          
          <p>For security reasons, we recommend changing your password after your first login.</p>
          <p>If you did not request this information or have any concerns, please contact our support team immediately.</p>
          
          <p>Best regards,<br>Your Company Team</p>
          
          <div class="footer">
              &copy; 2024 Your Company. All rights reserved.
          </div>
      </div>
  </body>
      </html>
    `};

  forgotAdminPassword = async (name, link) => {
    return ` <!DOCTYPE html>

<html
  lang="en"
  xmlns:o="urn:schemas-microsoft-com:office:office"
  xmlns:v="urn:schemas-microsoft-com:vml"
>
  <head>
    <title>Jivan Emailer</title>
    <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
    <meta content="width=device-width, initial-scale=1.0" name="viewport" />
    <style>
      @font-face {
        font-family: "Antique Olive BQ";
        src: url("fonts/AntiqueOliveBQ-Medium.woff2") format("woff2"),
          url("fonts/AntiqueOliveBQ-Medium.woff") format("woff");
        font-weight: 500;
        font-style: normal;
        font-display: swap;
      }

      @font-face {
        font-family: "Antique Olive";
        src: url("fonts/AntiqueOlive.woff2") format("woff2"),
          url("fonts/AntiqueOlive.woff") format("woff");
        font-weight: normal;
        font-style: normal;
        font-display: swap;
      }

      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        padding: 0;
        font-size: 16px;
        font-family: "Antique Olive";
      }

      a[x-apple-data-detectors] {
        color: inherit !important;
        text-decoration: inherit !important;
      }

      #MessageViewBody a {
        color: inherit;
        text-decoration: none;
      }

      p {
        line-height: inherit;
        margin: 0;
        padding: 0;
      }

      .desktop_hide,
      .desktop_hide table {
        mso-hide: all;
        display: none;
        max-height: 0px;
        overflow: hidden;
      }

      .image_block img + div {
        display: none;
      }

      @media (max-width: 820px) {
        .desktop_hide table.icons-inner {
          display: inline-block !important;
        }
        .icons-inner {
          text-align: center;
        }
        .icons-inner td {
          margin: 0 auto;
        }
        .social_block.desktop_hide .social-table {
          display: inline-block !important;
        }
        .row-content {
          width: 100% !important;
        }
        .stack .column {
          width: 100%;
          display: block;
        }
        .mobile_hide {
          max-width: 0;
          min-height: 0;
          max-height: 0;
          font-size: 0;
          display: none;
          overflow: hidden;
        }
        .desktop_hide,
        .desktop_hide table {
          max-height: none !important;
          display: table !important;
        }
      }

      @media (max-width: 767px) {
        .mobile-padding {
          padding-left: 10px !important;
          padding-right: 10px !important;
        }
        .p-mobile-0 {
          padding: 0 !important;
        }
      }
    </style>
  </head>

  <body
    style="
      text-size-adjust: none;
      background-color: #fff;
      margin: 0;
      padding: 0;
    "
  >
    <table
      border="0"
      cellpadding="0"
      cellspacing="0"
      class="nl-container"
      role="presentation"
      style="
        mso-table-lspace: 0pt;
        mso-table-rspace: 0pt;
        background-color: #fff;
      "
      width="100%"
    >
      <tbody>
        <tr>
          <td>
            <table
              align="center"
              border="0"
              cellpadding="0"
              cellspacing="0"
              class="row row-1"
              role="presentation"
              style="mso-table-lspace: 0pt; mso-table-rspace: 0pt"
              width="100%"
            >
              <tbody>
                <tr>
                  <td>
                    <table
                      align="center"
                      border="0"
                      cellpadding="0"
                      cellspacing="0"
                      class="row-content stack"
                      role="presentation"
                      style="
                        mso-table-lspace: 0pt;
                        mso-table-rspace: 0pt;
                        color: #000;
                        background-color: #eee;
                        width: 800px;
                        margin: 0 auto;
                      "
                      width="800"
                    >
                      <tbody>
                        <tr>
                          <td
                            class="column column-1"
                            style="
                              mso-table-lspace: 0pt;
                              mso-table-rspace: 0pt;
                              text-align: left;
                              font-weight: 400;
                              padding-bottom: 60px;
                              padding-top: 60px;
                              vertical-align: top;
                              border-top: 0px;
                              border-right: 0px;
                              border-bottom: 0px;
                              border-left: 0px;
                            "
                            width="100%"
                          >
                            <table
                              border="0"
                              cellpadding="0"
                              cellspacing="0"
                              class="image_block block-1"
                              role="presentation"
                              style="
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                              "
                              width="100%"
                            >
                              <tr>
                                <td class="pad" style="width: 100%">
                                  <div
                                    align="center"
                                    class="alignment"
                                    style="line-height: 10px"
                                  >
                                    <a href="" style="display: inline-block"
                                      ><img
                                        src="cid:logo"
                                        style="
                                          height: auto;
                                          display: block;
                                          border: 0;
                                          max-width: 267px;
                                          width: 100%;
                                        "
                                        width="267"
                                    /></a>
                                  </div>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
            <table
              align="center"
              border="0"
              cellpadding="0"
              cellspacing="0"
              class="row row-2"
              role="presentation"
              style="mso-table-lspace: 0pt; mso-table-rspace: 0pt"
              width="100%"
            >
              <tbody>
                <tr>
                  <td>
                    <table
                      align="center"
                      border="0"
                      cellpadding="0"
                      cellspacing="0"
                      class="row-content stack"
                      role="presentation"
                      style="
                        mso-table-lspace: 0pt;
                        mso-table-rspace: 0pt;
                        color: #000;
                        background-color: #eee;
                        border-radius: 0;
                        width: 800px;
                        margin: 0 auto;
                      "
                      width="800"
                    >
                      <tbody>
                        <tr>
                          <td
                            class="column column-1"
                            style="
                              mso-table-lspace: 0pt;
                              mso-table-rspace: 0pt;
                              text-align: left;
                              font-weight: 400;
                              vertical-align: top;
                              border-top: 0px;
                              border-right: 0px;
                              border-bottom: 0px;
                              border-left: 0px;
                            "
                            width="10%"
                          >
                            <table
                              border="0"
                              cellpadding="0"
                              cellspacing="0"
                              class="empty_block block-1"
                              role="presentation"
                              style="
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                              "
                              width="100%"
                            >
                              <tr>
                                <td class="pad">
                                  <div></div>
                                </td>
                              </tr>
                            </table>
                          </td>

                          <td
                            class="column column-2 mobile-padding"
                            style="
                              mso-table-lspace: 0pt;
                              mso-table-rspace: 0pt;
                              text-align: left;
                              font-weight: 400;
                              background-color: #ffffff;
                              padding-bottom: 60px;
                              padding-left: 40px;
                              padding-right: 40px;
                              padding-top: 60px;
                              vertical-align: top;
                              border-top: 0px;
                              border-right: 0px;
                              border-bottom: 0px;
                              border-left: 0px;
                            "
                            width="80%"
                          >
                            <table
                              border="0"
                              cellpadding="0"
                              cellspacing="0"
                              class="heading_block block-1"
                              role="presentation"
                              style="
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                              "
                              width="100%"
                            >
                              <tr>
                                <td
                                  class="pad"
                                  style="
                                    text-align: center;
                                    width: 100%;
                                    padding: 0px 0px 30px;
                                  "
                                >
                                  <img
                                    src="cid:lock"
                                    style="height: 140px"
                                    alt=""
                                  />
                                </td>
                              </tr>
                            </table>

                            <table
                              border="0"
                              cellpadding="0"
                              cellspacing="0"
                              class="heading_block block-1"
                              role="presentation"
                              style="
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                              "
                              width="100%"
                            >
                              <tr>
                                <td
                                  class="pad"
                                  style="
                                    padding-bottom: 0px;
                                    text-align: center;
                                    width: 100%;
                                  "
                                >
                                  <h1
                                    style="
                                      margin: 0;
                                      color: #333333;
                                      direction: ltr;
                                      font-family: 'Antique Olive';
                                      font-size: 24px;
                                      font-weight: 400;
                                      letter-spacing: normal;
                                      line-height: 100%;
                                      text-align: center;
                                      margin-top: 0;
                                      margin-bottom: 0;
                                      padding-bottom: 30px;
                                    "
                                  >
                                    Dear ${name}
                                  </h1>
                                </td>
                              </tr>
                            </table>

                            <table
                              border="0"
                              cellpadding="0"
                              cellspacing="0"
                              class="heading_block block-1"
                              role="presentation"
                              style="
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                              "
                              width="100%"
                            >
                              <tr>
                                <td
                                  class="pad"
                                  style="
                                    padding-bottom: 0px;
                                    text-align: center;
                                    width: 100%;
                                  "
                                >
                                  <h1
                                    style="
                                      margin: 0;
                                      color: #333333;
                                      direction: ltr;
                                      font-family: 'Antique Olive';
                                      font-size: 24px;
                                      font-weight: 400;
                                      letter-spacing: normal;
                                      line-height: 100%;
                                      text-align: center;
                                      margin-top: 0;
                                      margin-bottom: 0;
                                    "
                                  >
                                    Password Reset request
                                  </h1>
                                </td>
                              </tr>
                            </table>
                            <table
                              border="0"
                              cellpadding="10"
                              cellspacing="0"
                              class="paragraph_block block-2"
                              role="presentation"
                              style="
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                                word-break: break-word;
                              "
                              width="100%"
                            >
                              <tr>
                                <td class="pad" style="padding: 10px 0px 0px">
                                  <div
                                    style="
                                      color: #666666;
                                      direction: ltr;
                                      font-family: 'Antique Olive';
                                      font-size: 16px;
                                      font-weight: 400;
                                      letter-spacing: 0px;
                                      line-height: 150%;
                                      text-align: center;
                                      mso-line-height-alt: 24px;
                                    "
                                  >
                                    <p style="margin: 0">
                                      We received a request to reset the
                                      password for your Jivan Oil account. To
                                      help you regain access, please follow the
                                      instructions below.
                                    </p>
                                  </div>
                                  <div
                                    style="
                                      color: #666666;
                                      direction: ltr;
                                      font-family: 'Antique Olive';
                                      font-size: 16px;
                                      font-weight: 400;
                                      letter-spacing: 0px;
                                      line-height: 150%;
                                      text-align: center;
                                      mso-line-height-alt: 24px;
                                    "
                                  >
                                    <p style="margin: 0">
                                      Please click on the following link to
                                      reset your password:
                                    </p>
                                  </div>
                                </td>
                              </tr>
                            </table>
                            <table
                              border="0"
                              cellpadding="10"
                              cellspacing="0"
                              class="paragraph_block block-2 p-mobile-0"
                              role="presentation"
                              style="
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                                word-break: break-word;
                                padding: 20px 20px 0px;
                              "
                              width="100%;"
                            >
                              <tr>
                                <td>
                                  <table
                                    border="0"
                                    cellpadding="10"
                                    cellspacing="0"
                                    class="paragraph_block block-2"
                                    role="presentation"
                                    style="
                                      mso-table-lspace: 0pt;
                                      mso-table-rspace: 0pt;
                                      word-break: break-word;
                                      border: 1px solid #dddddd;
                                      border-radius: 5px;
                                    "
                                    width="100%;"
                                  >
                                    <tr>
                                      <td class="pad" style="padding: 15px 5px">
                                        <table
                                          border="0"
                                          cellpadding="0"
                                          cellspacing="0"
                                          class="paragraph_block block-2"
                                          role="presentation"
                                          style="
                                            mso-table-lspace: 0pt;
                                            mso-table-rspace: 0pt;
                                            word-break: break-word;
                                          "
                                          width="100%;"
                                        >
                                          <tr>
                                            <td
                                              style="
                                                width: 100%;
                                                text-align: center;
                                              "
                                            >
                                              <p
                                                style="
                                                  color: #ff2000;
                                                  font-size: 16px;
                                                  line-height: 18px;
                                                  font-family: 'Antique Olive BQ';
                                                  padding-bottom: 10px;
                                                  padding-top:10px
                                                "
                                              >
                                                <a
                                                  id="myInput"
                                                  href=${link}
                                                  >${link}
                                                  
                                                </a>
                                              </p>
                                            </td>
                                          </tr>
                                        </table>
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                              <!-- <tr>
                                                            <td>
                                                                <table border="0" cellpadding="10" cellspacing="0" class="paragraph_block block-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;border:1px solid #dddddd;border-radius: 5px;" width="100%;">
                                                                    <tr>
                                                                        <td class="pad" style="padding: 15px 5px;">
                                                                            <table border="0" cellpadding="0" cellspacing="0" class="paragraph_block block-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%;">
                                                                                <tr>
                                                                                    <td style="width: 100%;text-align: center;">
                                                                                        <p style="color: #FF2000;font-size: 12px;line-height: 14px;font-family: 'Antique Olive BQ';padding-bottom: 10px;">Business Details</p>
                                                                                        <p style="color: #333333;font-family: Antique Olive BQ;font-size: 16px;font-style: normal;line-height: 18px;padding-bottom: 5px;">Pizza Paradise Gourmet Kitchen</p>
                                                                                        <p style="color: #333333;font-size: 14px;line-height: 16px;font-family: 'Antique Olive';">Sydney NSW, Australia</p>
                                                                                    </td>
                                                                                </tr>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </table>
                                                            </td>
                                                        </tr> -->
                            </table>
                            <table
                              border="0"
                              cellpadding="10"
                              cellspacing="0"
                              class="paragraph_block block-2 p-mobile-0"
                              role="presentation"
                              style="
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                                word-break: break-word;
                                padding: 0px 20px 0px;
                              "
                              width="100%;"
                            >
                              <tr>
                                <!-- <td>
                                                                <table border="0" cellpadding="10" cellspacing="0" class="paragraph_block block-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;border:1px solid #dddddd;border-radius: 5px;" width="100%;">
                                                                    <tr>
                                                                        <td class="pad" style="padding: 15px 5px;">
                                                                            <table border="0" cellpadding="0" cellspacing="0" class="paragraph_block block-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%;">
                                                                                <tr>
                                                                                    <td style="width: 100%;text-align: center;">
                                                                                        <p style="color: #FF2000;font-size: 12px;line-height: 14px;font-family: 'Antique Olive BQ';padding-bottom: 10px;">No. of People</p>
                                                                                        <p style="color: #333333;font-family: Antique Olive BQ;font-size: 16px;font-style: normal;line-height: 18px;">2</p>
                                                                                    </td>
                                                                                </tr>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </table>
                                                            </td> -->
                                <!-- <td class="p-mobile-0">
                                                                <table border="0" cellpadding="10" cellspacing="0" class="paragraph_block block-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;border:1px solid #dddddd;border-radius: 5px;" width="100%;">
                                                                    <tr>
                                                                        <td class="pad" style="padding: 15px 5px;">
                                                                            <table border="0" cellpadding="0" cellspacing="0" class="paragraph_block block-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%;">
                                                                                <tr>
                                                                                    <td style="width: 100%;text-align: center;">
                                                                                        <p style="color: #FF2000;font-size: 12px;line-height: 14px;font-family: 'Antique Olive BQ';padding-bottom: 10px;">Date</p>
                                                                                        <p style="color: #333333;font-family: Antique Olive BQ;font-size: 16px;font-style: normal;line-height: 18px;">27-04-2023</p>
                                                                                    </td>
                                                                                </tr>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </table>
                                                            </td> -->
                                <!-- <td>
                                                                <table border="0" cellpadding="10" cellspacing="0" class="paragraph_block block-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;border:1px solid #dddddd;border-radius: 5px;" width="100%;">
                                                                    <tr>
                                                                        <td class="pad" style="padding: 15px 5px;">
                                                                            <table border="0" cellpadding="0" cellspacing="0" class="paragraph_block block-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%;">
                                                                                <tr>
                                                                                    <td style="width: 100%;text-align: center;">
                                                                                        <p style="color: #FF2000;font-size: 12px;line-height: 14px;font-family: 'Antique Olive BQ';padding-bottom: 10px;">Time</p>
                                                                                        <p style="color: #333333;font-family: Antique Olive BQ;font-size: 16px;font-style: normal;line-height: 18px;">10:00 AM</p>
                                                                                    </td>
                                                                                </tr>
                                                                            </table>
                                                                        </td>

                                                                    </tr>
                                                                </table>
                                                            </td> -->
                              </tr>
                            </table>
                            <table style="padding: 0px 20px">
                              <tr>
                                <td class="pad" style="padding: 10px 0px 0px">
                                  <p
                                    style="
                                      color: #666666;
                                      text-align: left;
                                      font-family: 'Antique Olive';
                                      font-size: 16px;
                                      font-weight: 400;
                                      letter-spacing: 0px;
                                      line-height: 150%;
                                      text-align: justify;
                                      mso-line-height-alt: 24px;
                                    "
                                  >
                                    If you are unable to click on the link
                                    directly, you can copy and paste it into
                                    your web browser's address bar.
                                  </p>
                                </td>
                              </tr>
                              <tr>
                                <td class="pad" style="padding: 10px 0px 0px">
                                  <p
                                    style="
                                      color: #666666;
                                      direction: ltr;
                                      font-family: 'Antique Olive';
                                      font-size: 16px;
                                      font-weight: 400;
                                      letter-spacing: 0px;
                                      line-height: 150%;
                                      text-align: justify;
                                      mso-line-height-alt: 24px;
                                    "
                                  >
                                    Please note that this password reset link is
                                    valid for a limited time only. After 24
                                    hours, it will expire, and you will need to
                                    initiate the password reset process again.
                                  </p>
                                </td>
                              </tr>
                              <tr>
                                <td class="pad" style="padding: 10px 0px 0px">
                                  <p
                                    style="
                                      color: #666666;
                                      direction: ltr;
                                      font-family: 'Antique Olive';
                                      font-size: 16px;
                                      font-weight: 400;
                                      letter-spacing: 0px;
                                      line-height: 150%;
                                      text-align: justify;
                                      mso-line-height-alt: 24px;
                                    "
                                  >
                                    If you did not request a password reset,
                                    please ignore this email. Rest assured, your
                                    account remains secure.
                                  </p>
                                </td>
                              </tr>
                              <tr>
                                <td class="pad" style="padding: 10px 0px 0px">
                                  <p
                                    style="
                                      color: #666666;
                                      direction: ltr;
                                      font-family: 'Antique Olive';
                                      font-size: 16px;
                                      font-weight: 400;
                                      letter-spacing: 0px;
                                      line-height: 150%;
                                      text-align: justify;
                                      mso-line-height-alt: 24px;
                                    "
                                  >
                                    To ensure the safety of your account, we
                                    recommend the following:
                                  </p>
                                </td>
                              </tr>
                              <tr>
                                <td class="pad" style="padding: 10px 0px 0px">
                                  <ul
                                    style="
                                      color: #666666;
                                      direction: ltr;
                                      font-family: 'Antique Olive';
                                      font-size: 16px;
                                      font-weight: 400;
                                      letter-spacing: 0px;
                                      line-height: 150%;
                                      text-align: justify;
                                      mso-line-height-alt: 24px;
                                    "
                                  >
                                    <li
                                      class="pad"
                                      style="padding: 10px 0px 0px"
                                    >
                                      Choose a strong and unique password that
                                      is not easily guessable.
                                    </li>
                                    <li
                                      class="pad"
                                      style="padding: 10px 0px 0px"
                                    >
                                      Avoid using common phrases or personal
                                      information in your password.
                                    </li>
                                    <li
                                      class="pad"
                                      style="padding: 10px 0px 0px"
                                    >
                                      Regularly update your password and avoid
                                      using the same password for multiple
                                      accounts.
                                    </li>
                                    <li
                                      class="pad"
                                      style="padding: 10px 0px 0px"
                                    >
                                      If you need any assistance or have any
                                      questions, please feel free to contact our
                                      support team at [Customer Support
                                      Email/Phone Number]. We're here to help.
                                    </li>
                                  </ul>
                                </td>
                              </tr>
                              <tr>
                                <td class="pad" style="padding: 10px 0px 0px">
                                  <p
                                    style="
                                      color: #666666;
                                      direction: ltr;
                                      font-family: 'Antique Olive';
                                      font-size: 16px;
                                      font-weight: 400;
                                      letter-spacing: 0px;
                                      line-height: 150%;
                                      text-align: justify;
                                      mso-line-height-alt: 24px;
                                    "
                                  >
                                    Thank you for being a valued member of Jivan
                                    Oil. We appreciate your trust in our
                                    services.
                                  </p>
                                </td>
                              </tr>

                              <tr>
                                <td class="pad" style="padding: 10px 0px 0px">
                                  <p
                                    style="
                                      color: #666666;
                                      direction: ltr;
                                      font-family: 'Antique Olive';
                                      font-size: 16px;
                                      font-weight: 400;
                                      letter-spacing: 0px;
                                      line-height: 150%;
                                      text-align: justify;
                                      mso-line-height-alt: 24px;
                                    "
                                  >
                                    Best Regards,
                                  </p>
                                </td>
                              </tr>
                              <tr>
                                <td class="pad" style="padding: 10px 0px 0px">
                                  <p
                                    style="
                                      color: #666666;
                                      direction: ltr;
                                      font-family: 'Antique Olive';
                                      font-size: 16px;
                                      font-weight: 400;
                                      letter-spacing: 0px;
                                      line-height: 150%;
                                      text-align: justify;
                                      mso-line-height-alt: 24px;
                                    "
                                  >
                                    Jivan Oil
                                  </p>
                                </td>
                              </tr>
                            </table>
                          </td>
                          <td
                            class="column column-3"
                            style="
                              mso-table-lspace: 0pt;
                              mso-table-rspace: 0pt;
                              text-align: left;
                              font-weight: 400;
                              padding-bottom: 5px;
                              padding-top: 5px;
                              vertical-align: top;
                              border-top: 0px;
                              border-right: 0px;
                              border-bottom: 0px;
                              border-left: 0px;
                            "
                            width="10%"
                          >
                            <table
                              border="0"
                              cellpadding="0"
                              cellspacing="0"
                              class="empty_block block-1"
                              role="presentation"
                              style="
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                              "
                              width="100%"
                            >
                              <tr>
                                <td class="pad">
                                  <div></div>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
            <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-8" role="presentation"
            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt" width="100%">
            <tbody>
              <tr>
                <td>
                  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack"
                    role="presentation" style="
                        mso-table-lspace: 0pt;
                        mso-table-rspace: 0pt;
                        color: #000;
                        background-color: #eee;
                        width: 800px;
                        margin: 0 auto;
                      " width="800">
                    <tbody>
                      <tr>
                        <td class="column column-1" style="
                              mso-table-lspace: 0pt;
                              mso-table-rspace: 0pt;
                              text-align: left;
                              font-weight: 400;
                              vertical-align: top;
                              border-top: 0px;
                              border-right: 0px;
                              border-bottom: 0px;
                              border-left: 0px;
                              padding-top: 60px;
                            " width="100%">
                          <table border="0" cellpadding="15" cellspacing="0" class="image_block block-1"
                            role="presentation" style="
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                              " width="100%">
                            <tr>
                              <td class="pad">
                                <div align="center" class="alignment" style="line-height: 10px">
                                  <a href="https://jivanadmin.demobrains.com/" style="outline: none" tabindex="-1"
                                    target="_blank"><img alt="Your Logo" class="fullWidth" src="cid:logo" style="
                                          height: auto;
                                          display: block;
                                          border: 0;
                                          max-width: 200px;
                                          width: 100%;
                                        " title="Your Logo" width="200px" /></a>
                                </div>
                              </td>
                            </tr>
                          </table>
                          <table border="0" cellpadding="10" cellspacing="0" class="text_block block-2"
                            role="presentation" style="
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                                word-break: break-word;
                              " width="100%">
                            <tr>
                              <td class="pad">
                                <div style="font-family: sans-serif">
                                  <div class="" style="
                                        font-size: 12px;
                                        font-family: Helvetica Neue, Helvetica,
                                          Arial, sans-serif;
                                        mso-line-height-alt: 14.399999999999999px;
                                        color: #555555;
                                        line-height: 1.2;
                                      ">
                                    <p style="
                                          margin: 0;
                                          font-size: 14px;
                                          text-align: center;
                                          mso-line-height-alt: 16.8px;
                                        ">
                                      <a href="mailto:contact@jivan.com" rel="noopener"
                                        style="
                                            text-decoration: underline;
                                            color: #e4917f;
                                            padding: 5px 0px;
                                                                                          display: inline-block;
                                          " target="_blank" title="https://jivanadmin.demobrains.com/">contact@jivan.com</a>
                                    </p>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
          <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-3" role="presentation"
            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt" width="100%">
            <tbody>
              <tr>
                <td>
                  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack"
                    role="presentation" style="
                        mso-table-lspace: 0pt;
                        mso-table-rspace: 0pt;
                        color: #000;
                        background-color: #eee;
                        border-radius: 0;
                        width: 800px;
                        margin: 0 auto;
                      " width="800">
                    <tbody>
                      <tr>
                        <td class="column column-1" style="
                              mso-table-lspace: 0pt;
                              mso-table-rspace: 0pt;
                              text-align: left;
                              font-weight: 400;
                              padding-bottom: 60px;
                              vertical-align: top;
                              border-top: 0px;
                              border-right: 0px;
                              border-bottom: 0px;
                              border-left: 0px;
                            " width="100%">
                          <table border="0" cellpadding="0" cellspacing="0" class="paragraph_block block-2"
                            role="presentation" style="
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                                word-break: break-word;
                              " width="100%">
                            <tr>
                              <td class="pad" style="padding-top: 15px">
                                <div style="
                                      color: #666666;
                                      direction: ltr;
                                      font-family: 'Antique Olive';
                                      font-size: 14px;
                                      font-weight: 400;
                                      letter-spacing: 0px;
                                      line-height: 120%;
                                      text-align: center;
                                      mso-line-height-alt: 19.2px;
                                    ">
                                  <p style="margin: 0">
                                    <span style="
                                          font-family: Arial, Helvetica,
                                            sans-serif;
                                        ">©</span>
                                    2023 Jivan Oil. All Rights Reserved
                                  </p>
                                </div>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
          </td>
        </tr>
      </tbody>
    </table>
    <!-- End -->
  </body>
</html>`

  }

}
module.exports = new EmailTemplate();