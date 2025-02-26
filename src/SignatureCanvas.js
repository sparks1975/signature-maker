import React, { useEffect, useRef } from 'react';
import opentype from 'opentype.js';

const SignatureCanvas = ({ name, style }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (name) {
      drawSignature(ctx, name, style);
    }
  }, [name, style]);

  const drawSignature = (ctx, name, style, isDownload = false) => {
    ctx.fillStyle = isDownload ? 'black' : 'white';
    let fontStyle;
    let fontSize;

    switch (style) {
      case 'elegant':
        fontSize = 40;
        fontStyle = '40px "Mrs Saint Delafield"';
        break;
      case 'bold':
        fontSize = 30;
        fontStyle = '30px "Yesteryear"';
        break;
      case 'casual':
        fontSize = 24;
        fontStyle = '24px "Borel"';
        break;
      case 'ballet':
        fontSize = 32;
        fontStyle = '32px "Ballet"';
        break;
      case 'alex':
        fontSize = 32;
        fontStyle = '32px "Alex Brush"';
        break;
      case 'meddon':
        fontSize = 24;
        fontStyle = '24px "Meddon"';
        break;
      case 'windsong':
        fontSize = 24;
        fontStyle = '24px "WindSong"';
        break;
      case 'engagement':
        fontSize = 42;
        fontStyle = '42px "Engagement"';
        break;
      default:
        fontSize = 30;
        fontStyle = '30px "Mrs Saint Delafield"';
        break;
    }

    ctx.font = fontStyle;
    const textMetrics = ctx.measureText(name);
    const textWidth = textMetrics.width;
    const textHeight = fontSize * 1.2;
    const x = (ctx.canvas.width - textWidth) / 2;
    const y = (ctx.canvas.height + textHeight / 2) / 2;

    ctx.fillText(name, x, y);
    return { x, y, textWidth, textHeight, fontSize, fontStyle };
  };

  const download = async (format) => {
    if (!name) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const { textWidth, textHeight, fontStyle } = drawSignature(ctx, name, style, false);

    const exportCanvas = document.createElement('canvas');
    const padding = 20;
    exportCanvas.width = textWidth + padding * 2;
    exportCanvas.height = textHeight + padding * 2;
    const exportCtx = exportCanvas.getContext('2d');
    exportCtx.fillStyle = 'black';
    exportCtx.font = fontStyle;
    exportCtx.fillText(name, padding, padding + textHeight / 1.2);

    const dataUrl = exportCanvas.toDataURL(`image/${format.toLowerCase()}`);
    const fileName = `${name || 'signature'}.${format.toLowerCase()}`;

    // Detect if on mobile device
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    if (isMobile && navigator.share) {
      // Use Web Share API on mobile where supported
      try {
        const response = await fetch(dataUrl);
        const blob = await response.blob();
        const file = new File([blob], fileName, { type: blob.type });

        await navigator.share({
          files: [file],
          title: 'Signature Generator',
          text: 'Download your custom signature!',
        });
      } catch (error) {
        console.error('Sharing failed:', error);
        fallbackDownload(dataUrl, fileName);
      }
    } else {
      // Fallback for non-mobile or unsupported browsers
      fallbackDownload(dataUrl, fileName);
    }
  };

  const fallbackDownload = (dataUrl, fileName) => {
    const link = document.createElement('a');
    link.download = fileName;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadSvg = async (name, style) => {
    if (!name) return;

    let fontPath;
    let fontSize;

    switch (style) {
      case 'elegant':
        fontPath = '/fonts/MrsSaintDelafield-Regular.ttf';
        fontSize = 40;
        break;
      case 'bold':
        fontPath = '/fonts/Yesteryear-Regular.ttf';
        fontSize = 30;
        break;
      case 'casual':
        fontPath = '/fonts/Borel-Regular.ttf';
        fontSize = 24;
        break;
      case 'ballet':
        fontPath = '/fonts/Ballet-Regular.ttf';
        fontSize = 32;
        break;
      case 'alex':
        fontPath = '/fonts/AlexBrush-Regular.ttf';
        fontSize = 32;
        break;
      case 'meddon':
        fontPath = '/fonts/Meddon-Regular.ttf';
        fontSize = 24;
        break;
      case 'windsong':
        fontPath = '/fonts/WindSong-Regular.ttf';
        fontSize = 24;
        break;
      case 'engagement':
        fontPath = '/fonts/Engagement-Regular.ttf';
        fontSize = 42;
        break;
      default:
        fontPath = '/fonts/MrsSaintDelafield-Regular.ttf';
        fontSize = 30;
        break;
    }

    try {
      const font = await opentype.load(fontPath);
      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d');
      tempCtx.font = `${fontSize}px "${font.names.fullName.en}"`;
      const textMetrics = tempCtx.measureText(name);
      const textWidth = textMetrics.width;
      const textHeight = fontSize * 1.2;

      const padding = 20;
      const svgWidth = textWidth + padding * 2;
      const svgHeight = textHeight + padding * 2;
      const x = padding;
      const y = padding + textHeight / 1.2;

      const path = font.getPath(name, x, y, fontSize);
      const pathData = path.toPathData(2);

      const svgContent = `
        <svg width="${svgWidth}" height="${svgHeight}" xmlns="http://www.w3.org/2000/svg">
          <path d="${pathData}" fill="black"/>
        </svg>
      `;
      const blob = new Blob([svgContent], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const fileName = `${name || 'signature'}.svg`;

      const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

      if (isMobile && navigator.share) {
        // Use Web Share API on mobile
        try {
          const file = new File([blob], fileName, { type: 'image/svg+xml' });
          await navigator.share({
            files: [file],
            title: 'Signature Generator',
            text: 'Download your custom signature!',
          });
        } catch (error) {
          console.error('Sharing failed:', error);
          fallbackDownload(url, fileName);
        }
      } else {
        // Fallback for non-mobile or unsupported browsers
        fallbackDownload(url, fileName);
      }

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating SVG:', error);
      alert('Failed to generate SVG. Make sure font files are available in /public/fonts/.');
    }
  };

  return (
    <div>
      <canvas ref={canvasRef} width={300} height={150} />
      {name && (
        <div style={{ paddingBlockStart: '24px', display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
          <button onClick={() => download('PNG')}>PNG</button>
          <button onClick={() => download('JPG')}>JPG</button>
          <button onClick={() => downloadSvg(name, style)}>SVG</button>
        </div>
      )}
    </div>
  );
};

export default SignatureCanvas;