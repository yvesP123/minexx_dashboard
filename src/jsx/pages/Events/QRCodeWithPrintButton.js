import React, { useState, useRef, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Printer } from 'lucide-react';
import logoImage from "../../../images/Minexx-Logo.png";

const QRCodeWithPrintButton = ({ value }) => {
    const [isHovered, setIsHovered] = useState(false);
    const qrRef = useRef(null);
    const [logoDataUrl, setLogoDataUrl] = useState('');

    useEffect(() => {
        // Convert logo image to data URL
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            setLogoDataUrl(canvas.toDataURL('image/png'));
        };
        img.src = logoImage;
    }, []);

    const handlePrint = (e) => {
        e.stopPropagation();

        const svgElement = qrRef.current;
        if (svgElement) {
            const svgData = new XMLSerializer().serializeToString(svgElement);
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();
            img.onload = () => {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                
                // Draw logo in the center
                const logoImg = new Image();
                logoImg.onload = () => {
                    const logoSize = canvas.width / 4; // Adjust size as needed
                    const x = (canvas.width - logoSize) / 2;
                    const y = (canvas.height - logoSize) / 2;
                    ctx.drawImage(logoImg, x, y, logoSize, logoSize);
                    
                    const dataUrl = canvas.toDataURL('image/png');

                    const printWindow = window.open('', '_blank');
                    printWindow.document.write(`
                        <html>
                            <head>
                                <title>Print QR Code</title>
                                <style>
                                    body {
                                        display: flex;
                                        justify-content: center;
                                        align-items: center;
                                        height: 100vh;
                                        margin: 0;
                                    }
                                    img {
                                        max-width: 100%;
                                        max-height: 100%;
                                    }
                                </style>
                            </head>
                            <body>
                                <img src="${dataUrl}" alt="QR Code with Logo"  width="50%"/>
                            </body>
                        </html>
                    `);
                    printWindow.document.close();
                    
                    const printImg = printWindow.document.querySelector('img');
                    printImg.onload = () => {
                        printWindow.focus();
                        printWindow.print();
                        printWindow.close();
                    };
                };
                logoImg.src = logoDataUrl;
            };
            img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
        }
    };

    return (
        <div 
            style={{ position: 'relative' }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <QRCodeSVG
                value={value}
                size={128}
                bgColor={"#ffffff"}
                fgColor={"#31a7e4"} // Changed to a blue color
                level={"M"}
                includeMargin={true}
                imageSettings={{
                    src: logoImage,
                    x: undefined,
                    y: undefined,
                    height: 20,
                    width: 24,
                    excavate: true,
                }}
                ref={qrRef}
            />
            {isHovered && (
                <button
                    onClick={handlePrint}
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        background: 'rgba(255, 255, 255, 0.8)',
                        border: 'none',
                        borderRadius: '50%',
                        padding: '8px',
                        cursor: 'pointer',
                    }}
                >
                    <Printer size={24} color="#3B82F6" /> {/* Changed to match QR code color */}
                </button>
            )}
        </div>
    );
};

export default QRCodeWithPrintButton;