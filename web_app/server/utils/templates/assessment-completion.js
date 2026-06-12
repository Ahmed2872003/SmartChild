exports.assessmentCompletedTemplate = (parentName, childName) => {
  const emailIcon = 'https://cdn.templates.unlayer.com/assets/1597218650916-xxxxc.png';

  const dashboardURL = `${process.env.CLIENT_URL}/parent/dashboard`;

  return `
<!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="x-apple-disable-message-reformatting">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  
    <style type="text/css">
      @media only screen and (min-width: 620px) {
        .u-row {
          width: 600px !important;
        }
        .u-row .u-col {
          vertical-align: top;
        }
            .u-row .u-col-100 {
              width: 600px !important;
            }
      }

      @media only screen and (max-width: 620px) {
        .u-row-container {
          max-width: 100% !important;
          padding-left: 0px !important;
          padding-right: 0px !important;
        }
        .u-row {
          width: 100% !important;
        }
        .u-row .u-col {
          display: block !important;
          width: 100% !important;
          min-width: 320px !important;
          max-width: 100% !important;
        }
        .u-row .u-col > div {
          margin: 0 auto;
        }
      }
    
body{margin:0;padding:0}table,td,tr{border-collapse:collapse;vertical-align:top}.ie-container table,.mso-container table{table-layout:fixed}*{line-height:inherit}a[x-apple-data-detectors=true]{color:inherit!important;text-decoration:none!important}

table, td { color: #000000; } #u_body a { color: #0000ee; text-decoration: underline; }
    </style>
  
<link href="https://fonts.googleapis.com/css?family=Cabin:400,700&display=swap" rel="stylesheet" type="text/css">

</head>

<body class="clean-body u_body" style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;background-color: #f9f9f9;color: #000000">
  <table role="presentation" id="u_body" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 320px;Margin: 0 auto;background-color: #f9f9f9;width:100%" cellpadding="0" cellspacing="0">
  <tbody>
  <tr style="vertical-align: top">
    <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">

<div class="u-row-container" style="padding: 0px;background-color: transparent;">
  <div class="u-row" style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #003399;">
    <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
<div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
  <div style="height: 100%;width: 100% !important;">
  <div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">
<table style="font-family:'Cabin',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
  <tbody>
    <tr>
      <td style="overflow-wrap:break-word;word-break:break-word;padding:40px 10px 10px;font-family:'Cabin',sans-serif;" align="left">
        
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
  <tr>
    <td style="padding-right: 0px;padding-left: 0px;" align="center">
        <img align="center" border="0" src="${emailIcon}" alt="Image" title="Image" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 26%;max-width: 150.8px;" width="150.8" height="42"/>
    </td>
  </tr>
</table>

      </td>
    </tr>
  </tbody>
</table>

<table style="font-family:'Cabin',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
  <tbody>
    <tr>
      <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Cabin',sans-serif;" align="left">
        
  <div style="font-size: 14px; color: #e5eaf5; line-height: 140%; text-align: center; word-wrap: break-word;">
    <p style="font-size: 14px; line-height: 140%; margin: 0px;"><strong>G R E A T &nbsp; N E W S !</strong></p>
  </div>

      </td>
    </tr>
  </tbody>
</table>

<table style="font-family:'Cabin',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
  <tbody>
    <tr>
      <td style="overflow-wrap:break-word;word-break:break-word;padding:0px 10px 31px;font-family:'Cabin',sans-serif;" align="left">
        
  <div style="font-size: 14px; color: #e5eaf5; line-height: 140%; text-align: center; word-wrap: break-word;">
    <p style="font-size: 14px; line-height: 140%; margin: 0px;"><span style="font-size: 28px; line-height: 39.2px;"><strong><span style="line-height: 39.2px; font-size: 28px;">Assessment Completed</span></strong></span></p>
  </div>

      </td>
    </tr>
  </tbody>
</table>

  </div>
</div>
    </div>
  </div>
</div>

<div class="u-row-container" style="padding: 0px;background-color: transparent;">
  <div class="u-row" style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #ffffff;">
    <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
<div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
  <div style="height: 100%;width: 100% !important;">
  <div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">
  
<table style="font-family:'Cabin',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
  <tbody>
    <tr>
      <td style="overflow-wrap:break-word;word-break:break-word;padding:33px 55px;font-family:'Cabin',sans-serif;" align="left">
        
  <div style="font-size: 14px; line-height: 160%; text-align: center; word-wrap: break-word;">
      <p style="font-size: 14px; line-height: 160%; margin: 0px;"><span style="font-size: 22px; line-height: 35.2px;">Hi ${parentName}, </span></p>
<p style="font-size: 14px; line-height: 160%; margin: 0px; padding-top: 10px;"><span style="font-size: 18px; line-height: 28.8px;"><strong>${childName}</strong> has successfully finished their latest assessment! You can now view their newly earned stars, progress, and a detailed performance report by visiting your dashboard.</span></p>
  </div>

      </td>
    </tr>
  </tbody>
</table>

<table style="font-family:'Cabin',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
  <tbody>
    <tr>
      <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Cabin',sans-serif;" align="left">
        
<div align="center">
    <a href="${dashboardURL}" target="_blank" class="v-button" style="box-sizing: border-box; display: inline-block; text-decoration: none; -moz-text-size-adjust: none; text-align: center; color: rgb(255, 255, 255); background: #28a745; border-radius: 4px; width: auto; max-width: 100%; word-break: break-word; overflow-wrap: break-word; font-size: 14px; line-height: inherit; margin: 5px;"><span style="display:block;padding:14px 44px 13px;line-height:120%;"><span style="font-size: 16px; line-height: 19.2px;"><strong><span style="line-height: 19.2px; font-size: 16px;">VIEW DASHBOARD</span></strong></span></span>
    </a>
</div>

      </td>
    </tr>
  </tbody>
</table>

<table style="font-family:'Cabin',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
  <tbody>
    <tr>
      <td style="overflow-wrap:break-word;word-break:break-word;padding:33px 55px 60px;font-family:'Cabin',sans-serif;" align="left">
        
  <div style="font-size: 14px; line-height: 160%; text-align: center; word-wrap: break-word;">
    <p style="line-height: 160%; font-size: 14px; margin: 0px;"><span style="font-size: 18px; line-height: 28.8px;">Thanks,</span></p>
<p style="line-height: 160%; font-size: 14px; margin: 0px;"><span style="font-size: 18px; line-height: 28.8px;">Smart Child Team</span></p>
  </div>

      </td>
    </tr>
  </tbody>
</table>

  </div>
  </div>
</div>
    </div>
  </div>
</div>

<div class="u-row-container" style="padding: 0px;background-color: transparent;">
  <div class="u-row" style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #003399;">
    <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
<div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
  <div style="height: 100%;width: 100% !important;">
  <div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">
  
<table style="font-family:'Cabin',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
  <tbody>
    <tr>
      <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Cabin',sans-serif;" align="left">
        
  <div style="font-size: 14px; color: #fafafa; line-height: 180%; text-align: center; word-wrap: break-word;">
    <p style="font-size: 14px; line-height: 180%; margin: 0px;"><span style="font-size: 16px; line-height: 28.8px;">Copyrights &copy; Smart Child All Rights Reserved</span></p>
  </div>

      </td>
    </tr>
  </tbody>
</table>

  </div>
  </div>
</div>
    </div>
  </div>
</div>

    </td>
  </tr>
  </tbody>
  </table>
</body>

</html>
`;
};
