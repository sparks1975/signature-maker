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

  const drawSignature = (ctx, name, style) => {
    ctx.fillStyle = 'black';
    let fontStyle;
    let fontSize;

    switch (style) {
      case 'elegant':
        fontStyle = '40px "Mrs Saint Delafield"';
        fontSize = 40;
        break;
      case 'bold':
        fontStyle = '40px "Yesteryear"';
        fontSize = 40;
        break;
      case 'casual':
        fontStyle = '40px "Borel"';
        fontSize = 40;
        break;
      case 'random':
      default:
        const fonts = ['"Mrs Saint Delafield"', '"Yesteryear"', '"Borel"'];
        const randomFont = fonts[Math.floor(Math.random() * fonts.length)];
        fontSize = 30 + Math.random() * 20; // 30-50px
        fontStyle = `${fontSize}px ${randomFont}`;
        break;
    }

    ctx.font = fontStyle;
    const textMetrics = ctx.measureText(name);
    const textWidth = textMetrics.width;
    const textHeight = fontSize * 1.2; // Approximate height
    const x = (ctx.canvas.width - textWidth) / 2;
    const y = (ctx.canvas.height + textHeight / 2) / 2; // Center vertically

    // Apply random offset for 'random' style
    const finalX = style === 'random' ? x + (Math.random() * 20 - 10) : x;
    const finalY = style === 'random' ? y + (Math.random() * 20 - 10) : y;

    ctx.fillText(name, finalX, finalY);
    return { x: finalX, y: finalY, textWidth, textHeight, fontSize, fontStyle };
  };

  const download = (format) => {
    if (!name) return; // Prevent download if no name

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const { x, y, textWidth, textHeight, fontStyle } = drawSignature(ctx, name, style);

    const exportCanvas = document.createElement('canvas');
    const padding = 20;
    exportCanvas.width = textWidth + padding * 2;
    exportCanvas.height = textHeight + padding * 2;
    const exportCtx = exportCanvas.getContext('2d');
    exportCtx.fillStyle = 'black';
    exportCtx.font = fontStyle;
    exportCtx.fillText(name, padding, padding + textHeight / 1.2);

    const link = document.createElement('a');
    link.download = `${name || 'signature'}.${format}`;
    link.href = exportCanvas.toDataURL(`image/${format}`);
    link.click();
  };

  const downloadSvg = async (name, style) => {
    if (!name) return; // Prevent download if no name

    let fontPath;
    let fontSize;

    switch (style) {
      case 'elegant':
        fontPath = '/fonts/MrsSaintDelafield-Regular.ttf';
        fontSize = 40;
        break;
      case 'bold':
        fontPath = '/fonts/Yesteryear-Regular.ttf';
        fontSize = 40;
        break;
      case 'casual':
        fontPath = '/fonts/Borel-Regular.ttf';
        fontSize = 40;
        break;
      case 'random':
      default:
        const fonts = [
          '/fonts/MrsSaintDelafield-Regular.ttf',
          '/fonts/Yesteryear-Regular.ttf',
          '/fonts/Borel-Regular.ttf',
        ];
        fontPath = fonts[Math.floor(Math.random() * fonts.length)];
        fontSize = 30 + Math.random() * 20;
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
      const x = style === 'random' ? padding + (Math.random() * 20 - 10) : padding;
      const y = padding + textHeight / 1.2 + (style === 'random' ? Math.random() * 20 - 10 : 0);

      // Use x and y explicitly to satisfy linter
      const path = font.getPath(name, x, y, fontSize);
      const pathData = path.toPathData(2);

      const svg = `
        <svg width="${svgWidth}" height="${svgHeight}" xmlns="http://www.w3.org/2000/svg">
          <path d="${pathData}" fill="black"/>
        </svg>
      `;
      const blob = new Blob([svg], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `${name || 'signature'}.svg`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating SVG:', error);
      alert('Failed to generate SVG. Make sure font files are available in /public/fonts/.');
    }
  };

  return (
    <div>
      <canvas ref={canvasRef} width={400} height={200} />
      <div>
        <button onClick={() => download('png')}>Download PNG</button>
        <button onClick={() => download('jpg')}>Download JPG</button>
        <button onClick={() => downloadSvg(name, style)}>Download SVG</button>
      </div>
    </div>
  );
};

export default SignatureCanvas;