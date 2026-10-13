/* Draw a self-contained keepsake without uploading the user's writing. */
async function exportLyricImages({song, mode, values, showReading, savedAt}) {
  await document.fonts.ready;
  await Promise.all([
    document.fonts.load('32px Yomogi', '春の余白'),
    document.fonts.load('32px Gaegu', '나만의 필사')
  ]);
  const width = 1080, left = 132, contentWidth = 810, maxHeight = 4200;
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas is unavailable');
  const fonts = {
    jp: '30px "Yomogi", "Gaegu", sans-serif',
    ko: '34px "Gaegu", sans-serif',
    small: '25px "Gaegu", sans-serif',
    label: '19px sans-serif'
  };
  const wrap = (text, font) => {
    ctx.font = font;
    const result = [];
    for (const paragraph of String(text || '').split(/\r?\n/)) {
      let line = '';
      for (const char of Array.from(paragraph)) {
        if (line && ctx.measureText(line + char).width > contentWidth) {
          result.push(line); line = '';
        }
        line += char;
      }
      result.push(line);
    }
    return result;
  };
  const titleLines = wrap(song.title, '48px "Gaegu", "Yomogi", sans-serif');
  const artistLines = wrap(song.artist, fonts.small);
  const headerHeight = 170 + titleLines.length * 64 + artistLines.length * 36;
  const pages = [[]];
  let used = headerHeight;
  // Split exceptionally long individual lines too, so no writing is clipped.
  const addBlock = block => {
    if (used + block.height > maxHeight - 120 && pages.at(-1).length) {
      pages.push([]); used = headerHeight;
    }
    pages.at(-1).push(block); used += block.height;
  };
  song.lines.forEach((line, index) => {
    const blocks = [];
    const addText = (text, font, color, leading, ruled = false) => {
      for (const value of wrap(text, font)) blocks.push({text:value, font, color, height:leading, ruled});
    };
    addText(line[mode === 'jp' ? 0 : 2], mode === 'jp' ? fonts.jp : fonts.ko, '#383341', 48);
    if (mode === 'jp' && showReading && line[1]) addText(line[1], fonts.small, '#918591', 34);
    if (mode === 'jp' && line[2]) addText(line[2], fonts.ko, '#86798c', 44);
    addText(values[index] || '', mode === 'jp' ? fonts.jp : fonts.ko, '#7859a2', 52, true);
    blocks[0].number = String(index + 1).padStart(2, '0');
    blocks[0].gapBefore = 20; blocks[0].height += 20;
    blocks.at(-1).height += 14;
    const rowHeight = blocks.reduce((sum, block) => sum + block.height, 0);
    if (rowHeight <= maxHeight - headerHeight - 120 && used + rowHeight > maxHeight - 120 && pages.at(-1).length) {
      pages.push([]); used = headerHeight;
    }
    for (const block of blocks) addBlock(block);
  });
  const pad = value => String(value).padStart(2, '0');
  const stamp = `${savedAt.getFullYear()}.${pad(savedAt.getMonth()+1)}.${pad(savedAt.getDate())} · ${pad(savedAt.getHours())}:${pad(savedAt.getMinutes())}`;
  const filenameStamp = `${savedAt.getFullYear()}${pad(savedAt.getMonth()+1)}${pad(savedAt.getDate())}-${pad(savedAt.getHours())}${pad(savedAt.getMinutes())}${pad(savedAt.getSeconds())}`;
  const drawText = (text, x, y, font, color) => { ctx.font = font; ctx.fillStyle = color; ctx.fillText(text, x, y); };
  const downloads = [];
  for (const [pageIndex, blocks] of pages.entries()) {
    canvas.width = width;
    canvas.height = Math.ceil(headerHeight + blocks.reduce((sum, b) => sum + b.height, 0) + 120);
    ctx.textBaseline = 'top';
    ctx.fillStyle = '#eee8f3'; ctx.fillRect(0, 0, width, canvas.height);
    ctx.fillStyle = '#fffdf8'; ctx.fillRect(32, 32, width - 64, canvas.height - 64);
    ctx.strokeStyle = '#e6dceb'; ctx.lineWidth = 1;
    ctx.strokeRect(48, 48, width - 96, canvas.height - 96);
    ctx.fillStyle = '#d8c8eb'; ctx.fillRect(72, 76, 5, 68);
    drawText('KOTONOHA  /  MY LYRIC NOTE', left, 84, fonts.label, '#9b84ac');
    // A small pressed-flower motif in the upper right corner.
    ctx.fillStyle = '#d8c8eb';
    for (let i = 0; i < 5; i++) {
      const angle = i * Math.PI * 2 / 5;
      ctx.beginPath(); ctx.ellipse(978 + Math.cos(angle)*12, 100 + Math.sin(angle)*12, 8, 11, angle, 0, Math.PI*2); ctx.fill();
    }
    let y = 134;
    for (const title of titleLines) { drawText(title, left, y, '48px "Gaegu", "Yomogi", sans-serif', '#403647'); y += 64; }
    for (const artist of artistLines) { drawText(artist, left, y, fonts.small, '#86758d'); y += 36; }
    drawText(`${mode === 'jp' ? '일본어 원문 필사' : '한국어 번역 필사'}  ·  ${stamp}`, left, y + 8, fonts.small, '#9a8b9d');
    ctx.strokeStyle = '#e8dfeb'; ctx.beginPath(); ctx.moveTo(left, headerHeight - 12); ctx.lineTo(948, headerHeight - 12); ctx.stroke();
    ctx.strokeStyle = '#eee4ec'; ctx.beginPath(); ctx.moveTo(110, headerHeight); ctx.lineTo(110, canvas.height - 112); ctx.stroke();
    y = headerHeight;
    for (const block of blocks) {
      const textY = y + (block.gapBefore || 0);
      if (block.number) drawText(block.number, 72, textY + 8, '16px sans-serif', '#b6a6bc');
      drawText(block.text, left, textY + 4, block.font, block.color);
      if (block.ruled) {
        ctx.strokeStyle = '#e7dfee'; ctx.beginPath(); ctx.moveTo(left, textY + 47); ctx.lineTo(948, textY + 47); ctx.stroke();
      }
      y += block.height;
    }
    drawText('ことのは · 한 줄의 노래, 오래 남는 마음', left, canvas.height - 87, fonts.small, '#a18da9');
    ctx.textAlign = 'right'; drawText(`${pageIndex + 1} / ${pages.length}`, 948, canvas.height - 84, fonts.label, '#a18da9'); ctx.textAlign = 'left';
    const blob = await new Promise((resolve, reject) => canvas.toBlob(value => value ? resolve(value) : reject(new Error('PNG encoding failed')), 'image/png'));
    downloads.push({blob, filename:`${song.artist}-${song.title}-필사-${filenameStamp}${pages.length > 1 ? `-${pad(pageIndex+1)}` : ''}.png`.replace(/[\\/:*?"<>|\u0000-\u001f]/g, '_')});
  }
  for (const {blob, filename} of downloads) {
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = filename;
    document.body.append(anchor); anchor.click(); anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 60000);
  }
  return downloads.length;
}
