type OrderEmailBodyParams = {
 
  mealName: string;
  foodName: string;
  totalAmount: number;
  paymentType: string;
  location: string;
};

export const orderEmailBody = ({
  
  mealName,
  foodName,
  totalAmount,
  paymentType,
  location,
}: OrderEmailBodyParams) => {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Order Confirmation</title>
    <style>
      body {
        margin: 0;
        padding: 0;
        background-color: #f6f7fb;
        font-family: Arial, Helvetica, sans-serif;
        color: #1f2937;
      }

      .email-wrapper {
        width: 100%;
        padding: 32px 16px;
      }

      .email-card {
        max-width: 640px;
        margin: 0 auto;
        background: #ffffff;
        border-radius: 16px;
        overflow: hidden;
        box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
      }

      .email-header {
        background: linear-gradient(135deg, #6e498b, #9e5ecf);
        color: #ffffff;
        padding: 32px;
      }

      .email-header h1 {
        margin: 0 0 8px;
        font-size: 28px;
        line-height: 1.2;
      }

      .email-header p {
        margin: 0;
        font-size: 15px;
        opacity: 0.95;
      }

      .pill {
        display: inline-block;
        margin-top: 14px;
        padding: 8px 14px;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.18);
        color: #ffffff;
        font-size: 12px;
        font-weight: 700;
        letter-spacing: 0.02em;
      }

      .email-content {
        padding: 32px;
      }

      .section-title {
        margin: 0 0 16px;
        font-size: 18px;
        color: #0f172a;
      }

      .summary-box {
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 14px;
        padding: 20px;
        margin-bottom: 24px;
      }

      .summary-row {
        display: flex;
        justify-content: space-between;
        gap: 16px;
        padding: 10px 0;
        border-bottom: 1px solid #e2e8f0;
        font-size: 14px;
      }

      .summary-row:last-child {
        border-bottom: none;
      }

      .summary-label {
        color: #64748b;
      }

      .summary-value {
        color: #0f172a;
        font-weight: 700;
        text-align: right;
      }

      .total-row {
        margin-top: 12px;
        padding-top: 14px;
        border-top: 1px solid #cbd5e1;
        font-size: 16px;
      }

      .cta {
        display: inline-block;
        margin-top: 8px;
        padding: 12px 20px;
        border-radius: 999px;
        background: #0f766e;
        color: #ffffff !important;
        text-decoration: none;
        font-weight: 700;
        font-size: 14px;
      }

      .footer {
        padding: 0 32px 32px;
        color: #64748b;
        font-size: 13px;
        line-height: 1.6;
      }

      @media only screen and (max-width: 600px) {
        .email-wrapper {
          padding: 12px;
        }

        .email-header,
        .email-content,
        .footer {
          padding-left: 20px;
          padding-right: 20px;
        }

        .summary-row {
          flex-direction: column;
          gap: 4px;
        }

        .summary-value {
          text-align: left;
        }
      }
    </style>
  </head>
  <body>
    <div class="email-wrapper">
      <div class="email-card">
        <div class="email-header">
          <h1>New Order Received</h1>
          <p>A customer has placed a new order and it is ready for review in the admin dashboard.</p>
        </div>

        <div class="email-content">
          <h2 class="section-title">Order Overview</h2>
          <div class="summary-box">           
            <div class="summary-row">
              <span class="summary-label">Meal Name:</span>
              <span class="summary-value">${mealName}</span>
            </div>
            <div class="summary-row">
              <span class="summary-label">Food Item:</span>
              <span class="summary-value">${foodName}</span>
            </div>
            <div class="summary-row">
              <span class="summary-label">Payment Method:</span>
              <span class="summary-value">${paymentType}</span>
            </div>
            <div class="summary-row">
              <span class="summary-label">Location:</span>
              <span class="summary-value">${location}</span>
            </div>
            <div class="summary-row total-row">
              <span class="summary-label">Total Amount:</span>
              <span class="summary-value">$${totalAmount.toFixed(2)}</span>
            </div>
          </div>

          <a class="cta" href="https://admin.mortben.shop/admin/order" target="_blank" rel="noreferrer">Review Order</a>
        </div>

        <div class="footer">
          This message was sent to the Mortben admin team because a new order was created. Please review and process it from the dashboard.
        </div>
      </div>
    </div>
  </body>
</html>`;
};
