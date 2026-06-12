import { SOUNDS } from '@/assets';
import { compressImage } from '@/utils/image';
import { playSound } from '@/utils/sound';
import { Eraser, Loader2, PenTool, Save, Trash2, Upload } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export const DrawingGame = ({ onFinish }) => {
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [color, setColor] = useState('#1F2937');
  const [sizeIndex, setSizeIndex] = useState(1);
  const [isEraser, setIsEraser] = useState(false);
  const [strokeCount, setStrokeCount] = useState(0);

  const COLORS = ['#1F2937', '#ef4444', '#22c55e', '#3b82f6', '#eab308', '#a855f7', '#ec4899'];

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = 800;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if (e.touches && e.touches.length > 0) {
      return { x: (e.touches[0].clientX - rect.left) * scaleX, y: (e.touches[0].clientY - rect.top) * scaleY };
    }
    return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY };
  };

  const startDrawing = (e) => {
    e.preventDefault();
    setIsDrawing(true);
    const { x, y } = getCoordinates(e);
    const ctx = canvasRef.current.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(x, y);

    const penSizes = [5, 12, 24];
    const eraserSizes = [20, 50, 100];

    ctx.strokeStyle = isEraser ? '#ffffff' : color;
    ctx.lineWidth = isEraser ? eraserSizes[sizeIndex] : penSizes[sizeIndex];
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  };

  const draw = (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    const { x, y } = getCoordinates(e);
    const ctx = canvasRef.current.getContext('2d');
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      setStrokeCount((s) => s + 1);
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setStrokeCount(0);
    playSound(SOUNDS.click);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new window.Image();
        img.onload = () => {
          const canvas = canvasRef.current;
          const ctx = canvas.getContext('2d');
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
          const x = canvas.width / 2 - (img.width / 2) * scale;
          const y = canvas.height / 2 - (img.height / 2) * scale;
          ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
          setStrokeCount((s) => s + 1);
          playSound(SOUNDS.click);
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDone = async () => {
    playSound(SOUNDS.match);
    if (!canvasRef.current) return;

    setIsSubmiting(true);

    await canvasRef.current.toBlob(async (blob) => {
      if (!blob) return;
      let imageFile = new File([blob], 'drawing-test.png', { type: 'image/png' });

      imageFile = await compressImage(imageFile, 2);

      onFinish(100, {
        rawData: { imageFile },
      });
    }, 'image/png');
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-3xl mx-auto relative select-none [-webkit-tap-highlight-color:transparent]">
      <div className="w-full bg-white rounded-[2.5rem] shadow-sm border-4 border-gray-200 overflow-hidden mb-6 relative">
        <canvas
          ref={canvasRef}
          className="w-full touch-none cursor-crosshair object-cover"
          style={{ aspectRatio: '4/3' }}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
      </div>
      <div className="w-full bg-white p-4 md:px-8 md:py-5 rounded-[2rem] shadow-sm border border-gray-200 flex flex-col md:flex-row gap-6 md:gap-8 justify-between items-center mb-8">
        <div className="flex justify-between items-center w-full md:w-auto gap-6 md:border-r md:border-gray-200 md:pr-8">
          <div className="flex gap-2">
            <button
              onClick={() => setIsEraser(false)}
              className={`p-3 rounded-xl transition-colors ${!isEraser ? 'bg-yellow-100 text-yellow-600 shadow-sm' : 'text-gray-500 hover:bg-gray-100'}`}
              title="Pen"
            >
              <PenTool size={24} />
            </button>
            <button
              onClick={() => setIsEraser(true)}
              className={`p-3 rounded-xl transition-colors ${isEraser ? 'bg-yellow-100 text-yellow-600 shadow-sm' : 'text-gray-500 hover:bg-gray-100'}`}
              title="Eraser"
            >
              <Eraser size={24} />
            </button>
          </div>
          <div className="flex gap-2 items-center bg-gray-50 p-2 rounded-2xl">
            {[0, 1, 2].map((idx) => {
              const displaySize = [8, 14, 22][idx];
              return (
                <button
                  key={idx}
                  onClick={() => setSizeIndex(idx)}
                  className={`w-10 h-10 flex items-center justify-center rounded-xl transition-colors ${sizeIndex === idx ? 'bg-white shadow-sm border border-gray-200' : 'hover:bg-gray-200'}`}
                  title={`Size ${idx + 1}`}
                >
                  <div
                    className={`rounded-full ${isEraser ? 'border-2 border-gray-400 bg-white' : 'bg-gray-800'}`}
                    style={{ width: displaySize, height: displaySize }}
                  ></div>
                </button>
              );
            })}
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-3 md:gap-4 w-full md:w-auto">
          {COLORS.map((c) => (
            <button
              key={c}
              onClick={() => {
                setColor(c);
                setIsEraser(false);
              }}
              className={`w-10 h-10 rounded-full border-2 transition-all ${color === c && !isEraser ? 'scale-110 shadow-md border-gray-400' : 'border-transparent hover:scale-105'}`}
              style={{ backgroundColor: c }}
              title="Color"
            />
          ))}
        </div>
      </div>
      <div className="flex gap-4 w-full justify-between items-center">
        <div className="flex gap-2">
          <button
            onClick={clearCanvas}
            className="bg-gray-100 text-gray-600 p-4 rounded-full shadow-sm hover:bg-red-50 hover:text-red-500 transition-colors"
            title="Clear Canvas"
          >
            <Trash2 size={24} />
          </button>
          <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="bg-gray-100 text-gray-600 p-4 rounded-full shadow-sm hover:bg-blue-50 hover:text-blue-500 transition-colors"
            title="Upload Image"
          >
            <Upload size={24} />
          </button>
        </div>
        <button
          onClick={handleDone}
          disabled={isSubmiting}
          className={`flex-1 bg-[#fbbf24] text-white font-black text-xl py-4 px-6 rounded-full shadow-sm transition-all flex items-center justify-center gap-2 ${
            isSubmiting ? 'opacity-70 cursor-not-allowed' : 'hover:scale-105'
          }`}
        >
          {isSubmiting ? (
            <>
              <Loader2 size={24} className="animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save size={24} />
              Done
            </>
          )}
        </button>
      </div>
    </div>
  );
};
