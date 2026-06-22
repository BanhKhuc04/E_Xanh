import confetti from 'canvas-confetti'

export function triggerLikeBurst(event) {
  let origin = { x: 0.5, y: 0.5 }
  
  if (event && event.clientX && event.clientY) {
    const rect = event.currentTarget.getBoundingClientRect()
    origin = {
      x: (rect.left + rect.width / 2) / window.innerWidth,
      y: (rect.top + rect.height / 2) / window.innerHeight,
    }
  }

  const defaults = {
    spread: 360,
    ticks: 100,
    gravity: 0,
    decay: 0.94,
    startVelocity: 30,
    colors: ['#FFE400', '#FFBD00', '#E89400', '#FFCA6C', '#FDFFB8']
  };

  function shoot() {
    confetti({
      ...defaults,
      particleCount: 40,
      scalar: 1.2,
      shapes: ['star'],
      origin
    });

    confetti({
      ...defaults,
      particleCount: 10,
      scalar: 0.75,
      shapes: ['circle'],
      origin
    });
  }

  setTimeout(shoot, 0);
  setTimeout(shoot, 100);
  setTimeout(shoot, 200);
}

export function triggerReactionBurst(event, reactionType = 'like') {
  let origin = { x: 0.5, y: 0.5 }
  
  if (event && event.clientX && event.clientY) {
    const rect = event.currentTarget.getBoundingClientRect()
    origin = {
      x: (rect.left + rect.width / 2) / window.innerWidth,
      y: (rect.top + rect.height / 2) / window.innerHeight,
    }
  }

  const emojiText = getEmojiForReaction(reactionType);
  const shapes = confetti.shapeFromText ? [confetti.shapeFromText({ text: emojiText, scalar: 3 })] : ['circle'];

  function shoot() {
    confetti({
      spread: 90,
      ticks: 100,
      gravity: 1,
      decay: 0.94,
      startVelocity: 40,
      particleCount: 12,
      scalar: 1,
      shapes,
      origin,
      colors: ['#FF0000', '#FFBD00', '#E89400', '#FFCA6C', '#FDFFB8']
    });
  }

  setTimeout(shoot, 0);
  setTimeout(shoot, 150);
}

function getEmojiForReaction(type) {
  switch(type) {
    case 'love': return '❤️';
    case 'haha': return '😂';
    case 'wow': return '😮';
    case 'sad': return '😢';
    case 'angry': return '😡';
    case 'like':
    default: return '👍';
  }
}
