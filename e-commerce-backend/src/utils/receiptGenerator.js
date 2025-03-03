require("dotenv").config();
const pdf = require("html-pdf-node");
const path = require("path");
const fs = require("fs");
const { uploadFile, uploadBuffer, extractS3Path } = require("./s3Utils");

const generateReceiptHTML = (session) => {
    return `<!DOCTYPE html>
    <html>
    <head>
        <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        .receipt {
            border: 1px solid #ddd;
            padding: 20px;
            margin-top: 20px;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #333;
            padding-bottom: 20px;
        }
        .company-name {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 10px;
        }
        .receipt-id {
            color: #666;
            margin-bottom: 20px;
        }
        .section {
            margin-bottom: 20px;
        }
        .section-title {
            font-weight: bold;
            margin-bottom: 10px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: left;
        }
        th {
            background-color: #f8f8f8;
        }
        .total {
            text-align: right;
            font-weight: bold;
            font-size: 18px;
            margin-top: 20px;
            padding-top: 10px;
            border-top: 2px solid #333;
        }
        .footer {
            margin-top: 40px;
            text-align: center;
            font-size: 14px;
            color: #666;
        }
    </style>
    </head>
    <body>
        <div class="receipt">
            <div class="header">
                <div class="company-name">E-Commerce Store</div>
                <div class="receipt-id">Receipt #${session.id}</div>
                <div>Date: ${new Date().toLocaleDateString()}</div>
            </div>

            <div class="section">
                <div class="section-title">Bill To:</div>
                <div>${session.customer_details.name}</div>
                <div>${session.customer_details.email}</div>
                <div>${session.customer_details.address.line1}</div>
                <div>${session.customer_details.address.line2}</div>
                <div>${session.customer_details.address.city}, ${session.customer_details.address.state} ${session.customer_details.address.postal_code}</div>
                <div>${session.customer_details.address.country}</div>
            </div>

            <div class="section">
                <div class="section-title">Order Details:</div>
                <table>
                    <thead>
                        <tr>
                            <th>Item</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${JSON.parse(session.metadata.cartItems)
                            .map(
                                (item) => `
                            <tr>
                                <td>${item.name}</td>
                                <td>${item.quantity}</td>
                                <td>$${(item.price / 100).toFixed(2)}</td>
                                <td>$${(item.totalPrice / 100).toFixed(2)}</td>
                            </tr>
                        `
                            )
                            .join("")}
                    </tbody>
                </table>
            </div>

            <div class="total">
                Total Amount: $${(session.amount_total / 100).toFixed(2)} ${session.currency.toUpperCase()}
            </div>

            <div class="footer">
                <p>Thank you for your purchase!</p>
                <p>Payment ID: ${session.payment_intent}</p>
                <p>This is a computer-generated receipt and doesn't require a signature.</p>
            </div>
        </div>
    </body>
    </html>`;
};



const generateAndUploadReceipt = async (session) => {
    try {
        const htmlContent = generateReceiptHTML(session);
        const pdfBuffer = await new Promise((resolve, reject) => {
            pdf.generatePdf({ content: htmlContent }, { format: "A4" })
                .then(resolve)
                .catch(reject);
        });

        // Upload PDF to S3
        const fileName = `receipts/receipt_${session.id}.pdf`;
        const s3Url = await uploadBuffer(pdfBuffer, fileName, "application/pdf");

        // Extract only the relative S3 path
        const filePath = extractS3Path(s3Url);
        console.log('filePath: ', filePath);

        return filePath;
    } catch (error) {
        console.error("Error generating/uploading receipt:", error);
        throw new Error("Receipt generation failed");
    }
};



module.exports = { generateAndUploadReceipt };
