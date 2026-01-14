import React, { useState, useRef, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { 
  Menu, ShoppingCart, User, Search, Star, 
  ShieldCheck, Truck, RotateCcw, Camera, 
  Upload, X, ChevronRight, Zap, Info, Box,
  Mic, Settings, Check, ArrowRight, AlertCircle, Loader2, ChevronLeft, Share2, Move,
  Shield, Droplets, Wind, Wand2, Home, Shirt, RefreshCw, LayoutGrid, Plus, Minus,
  Thermometer, AlertTriangle, Waves
} from "lucide-react";

// --- Mock Data ---

const SECTION_SETTINGS = {
  try_on_models: [
    { id: "m1", name: "Athletic Build (M)", src: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80" },
    { id: "m2", name: "Slim Fit (S)", src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80" },
    { id: "m3", name: "Muscular Build (L)", src: "https://images.unsplash.com/photo-1531384441138-2736e62e0919?auto=format&fit=crop&w=600&q=80" },
    { id: "m4", name: "Regular Fit (XL)", src: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80" },
    { id: "m5", name: "Street Style (M)", src: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80" },
    { id: "m6", name: "Active Wear (XS)", src: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80" }
  ]
};

const PRODUCT = {
  id: "p1",
  title: "CAMO TANK TOP",
  series: "TACTICAL SERIES / SKU: CT-2024-001",
  price: 16.99,
  compareAtPrice: 24.99,
  rating: 4.8,
  reviewCount: 247,
  description: "Premium tactical camo tank top designed for maximum mobility and style. Features advanced moisture-wicking fabric and reinforced stitching. Perfect for intense workouts or casual streetwear. Engineered for operators who demand performance without compromising on aesthetics.",
  shipping_threshold: 50,
  specs: [
    { label: "Material", value: "85% Polyester, 15% Spandex" },
    { label: "Fit", value: "Athletic Fit" },
    { label: "Care", value: "Machine Wash Cold" },
    { label: "Weight", value: "145 GSM" },
    { label: "Origin", value: "Imported" }
  ],
  features: [
    { title: "Durable Construction", desc: "Reinforced seams for long-lasting wear", icon: Shield },
    { title: "Moisture Wicking", desc: "Keeps you dry during intense activity", icon: Droplets },
    { title: "Breathable Fabric", desc: "Enhanced airflow for comfort", icon: Wind }
  ],
  images: [
    "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1503342394128-c104d54dba01?auto=format&fit=crop&q=80&w=800",
  ],
  colors: [
    { name: "Black", hex: "#0c1119" },
    { name: "Beige", hex: "#dcbfa6" },
    { name: "Gray", hex: "#9aa6b2" },
    { name: "Green", hex: "#2a3b2a" },
  ],
  sizes: ["XS", "S", "M", "L", "XL"]
};

const MOCK_REVIEWS = [
    { name: "CyberUser_99", rating: 5, date: "2 days ago", text: "Absolute perfection. The material feels like second skin and the aesthetic is top tier." },
    { name: "NeonRunner", rating: 5, date: "1 week ago", text: "Breathability is unmatched during high-intensity ops. fast shipping too." },
    { name: "Tactical_Dave", rating: 4, date: "2 weeks ago", text: "Great fit, slightly tight around the chest but stretches well. Would buy again." }
];

const CUSTOM_FONTS = ["Orbitron", "Space Grotesk", "Inter"];
const NEON_EFFECTS = [
    { name: "Blue", hex: "#00aeff" },
    { name: "Cyan", hex: "#00e6ff" },
    { name: "Green", hex: "#00ff8a" },
    { name: "Pink", hex: "#ff00c8" }
];

// --- Components ---

const Header = ({ isMinimal, toggleMinimal }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [mobileSearchActive, setMobileSearchActive] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (mobileSearchActive && searchInputRef.current) {
        // Slight delay to ensure animation frame is ready
        setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [mobileSearchActive]);

  const handleVoiceSearch = () => {
    if (isListening) return;

    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Voice search is not supported in this browser.");
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setSearchQuery(transcript);
    };

    recognition.start();
  };

  return (
    <>
      <header className={`neo-navbar ${mobileSearchActive ? 'mobile-search-mode' : ''}`}>
          
          {/* Standard Navigation Content */}
          <div className={`nav-content-standard ${mobileSearchActive ? 'hidden' : ''}`}>
              <div className="nav-left">
                  <button className="nav-btn menu-btn" aria-label="Menu" onClick={() => setIsMenuOpen(true)}>
                      <Menu size={24} strokeWidth={1.5} />
                  </button>
              </div>

              {/* Desktop Search */}
              <div className="nav-center desktop-only">
                  <div className={`nav-search-container ${isListening ? 'listening' : ''}`}>
                      <Search className="search-icon" size={20} strokeWidth={2} />
                      <input 
                          type="text" 
                          placeholder="Search database..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      <button className={`mic-btn ${isListening ? 'active' : ''}`} onClick={handleVoiceSearch} aria-label="Voice Search">
                          <Mic size={20} strokeWidth={2} />
                      </button>
                  </div>
              </div>

              <div className="nav-right">
                  {/* Mobile Search Trigger */}
                  <button className="nav-btn mobile-only" onClick={() => setMobileSearchActive(true)} aria-label="Search">
                      <Search size={24} strokeWidth={1.5} />
                  </button>

                  <button className="nav-btn user-btn" aria-label="Account">
                      <User size={24} strokeWidth={1.5} />
                  </button>
                  <button className="nav-btn cart-btn relative" aria-label="Cart">
                      <ShoppingCart size={24} strokeWidth={1.5} />
                      <span className="badge-dot">2</span>
                  </button>
              </div>
          </div>

          {/* Mobile Expanded Search Overlay */}
          <div className={`nav-mobile-search ${mobileSearchActive ? 'active' : ''}`}>
              <button className="nav-btn back-btn" onClick={() => setMobileSearchActive(false)} aria-label="Back">
                  <ChevronLeft size={28} strokeWidth={1.5} />
              </button>
              <div className={`nav-search-container mobile ${isListening ? 'listening' : ''}`}>
                  <input 
                      ref={searchInputRef}
                      type="text" 
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button className={`mic-btn ${isListening ? 'active' : ''}`} onClick={handleVoiceSearch} aria-label="Voice Search">
                      <Mic size={20} strokeWidth={2} />
                  </button>
              </div>
          </div>
      </header>

      {/* Mobile Menu Drawer */}
      <div className={`mobile-menu-drawer ${isMenuOpen ? 'open' : ''}`}>
          <div className="mobile-menu-header">
              <span className="menu-title">MENU</span>
              <button className="menu-close-btn" onClick={() => setIsMenuOpen(false)} aria-label="Close Menu">
                  <X size={28} />
              </button>
          </div>
          
          <div className="mobile-menu-search px-5 py-2">
             <div className={`nav-search-container drawer-search ${isListening ? 'listening' : ''}`}>
                 <Search className="search-icon" size={20} strokeWidth={2} />
                 <input 
                    type="text" 
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                 />
             </div>
          </div>

          <nav className="mobile-nav-links">
              {['NEW ARRIVALS', 'APPAREL', 'ACCESSORIES', 'TECHNOLOGY', 'ACCOUNT', 'SUPPORT'].map(item => (
                  <a key={item} href="#" className="mobile-nav-item" onClick={() => setIsMenuOpen(false)}>
                      {item} <ChevronRight size={18} className="opacity-50" />
                  </a>
              ))}
          </nav>
      </div>
    </>
  );
};

const BottomBar = () => {
  return (
    <div className="fixed-bottom-bar">
      <div className="bottom-bar-glass">
         <button className="bottom-home-btn">
            <Home size={18} />
            <span>HOME</span>
         </button>
         <button className="bottom-add-btn">
            <ShoppingCart size={18} />
            <span>ADD TO CART</span>
         </button>
      </div>
    </div>
  );
};

const TrustBadges = () => (
  <div className="trust-badges-grid">
    <div className="trust-item">
      <div className="trust-icon"><ShieldCheck size={20} /></div>
      <div className="trust-text">
        <div className="trust-title">SECURE TRANSACTION</div>
        <div className="trust-sub">256-bit encryption</div>
      </div>
    </div>
    <div className="trust-item">
      <div className="trust-icon"><Truck size={20} /></div>
      <div className="trust-text">
        <div className="trust-title">FAST DELIVERY</div>
        <div className="trust-sub">Ships within 24 hours</div>
      </div>
    </div>
    <div className="trust-item">
      <div className="trust-icon"><RotateCcw size={20} /></div>
      <div className="trust-text">
        <div className="trust-title">EASY RETURNS</div>
        <div className="trust-sub">30-day return policy</div>
      </div>
    </div>
  </div>
);

const ZoomPanMedia = ({ children, isActive = true }: { children?: React.ReactNode; isActive?: boolean }) => {
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [isGesturing, setIsGesturing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const gesture = useRef({ 
    isPinching: false, 
    isPanning: false, 
    startX: 0, 
    startY: 0, 
    startDist: 0, 
    initialScale: 1, 
    initialX: 0, 
    initialY: 0 
  });
  const lastTap = useRef(0);

  const getDistance = (touches: React.TouchList) => Math.hypot(touches[0].clientX - touches[1].clientX, touches[0].clientY - touches[1].clientY);

  const getBoundedPosition = (x: number, y: number, s: number) => {
      if (!containerRef.current) return { x, y };
      const { clientWidth, clientHeight } = containerRef.current;
      
      const maxX = Math.max(0, (clientWidth * s - clientWidth) / 2);
      const maxY = Math.max(0, (clientHeight * s - clientHeight) / 2);
      
      return {
          x: Math.max(-maxX, Math.min(maxX, x)),
          y: Math.max(-maxY, Math.min(maxY, y))
      };
  };

  const handleDoubleTap = (e: React.TouchEvent | React.MouseEvent) => {
    e.stopPropagation();
    const now = Date.now();
    if (now - lastTap.current < 300) {
      const newScale = transform.scale > 1.2 ? 1 : 2.5;
      const bounded = getBoundedPosition(0, 0, newScale);
      setTransform({ x: bounded.x, y: bounded.y, scale: newScale });
      lastTap.current = 0;
    } else {
      lastTap.current = now;
    }
  };

  const onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isActive) return;
    setIsGesturing(true);
    
    if (e.touches.length === 2) {
      gesture.current.isPinching = true;
      gesture.current.isPanning = false;
      gesture.current.startDist = getDistance(e.touches);
      gesture.current.initialScale = transform.scale;
    } else if (e.touches.length === 1) {
      gesture.current.isPanning = true;
      gesture.current.isPinching = false;
      gesture.current.startX = e.touches[0].clientX;
      gesture.current.startY = e.touches[0].clientY;
      gesture.current.initialX = transform.x;
      gesture.current.initialY = transform.y;
      handleDoubleTap(e);
    }
  };

  const onTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isActive) return;
    
    if (gesture.current.isPinching && e.touches.length === 2) {
      e.preventDefault(); // Prevent browser zoom
      const dist = getDistance(e.touches);
      const scaleFactor = dist / gesture.current.startDist;
      let newScale = gesture.current.initialScale * scaleFactor;
      newScale = Math.max(0.8, Math.min(newScale, 5));
      setTransform(prev => ({ ...prev, scale: newScale }));
      
    } else if (gesture.current.isPanning && e.touches.length === 1) {
      e.preventDefault(); // Prevent scrolling
      const dx = e.touches[0].clientX - gesture.current.startX;
      const dy = e.touches[0].clientY - gesture.current.startY;
      
      let newX = gesture.current.initialX + dx;
      let newY = gesture.current.initialY + dy;

      if (transform.scale > 1) {
          const bounded = getBoundedPosition(newX, newY, transform.scale);
          // Elasticity at edges
          if (newX !== bounded.x) newX = bounded.x + (newX - bounded.x) * 0.3;
          if (newY !== bounded.y) newY = bounded.y + (newY - bounded.y) * 0.3;
          setTransform(prev => ({ ...prev, x: newX, y: newY }));
      } else {
          // Resistive panning at scale 1
          setTransform(prev => ({ ...prev, x: newX * 0.3, y: newY * 0.3 }));
      }
    }
  };

  const onTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isActive) return;
    
    if (e.touches.length === 0) {
        setIsGesturing(false);
        gesture.current.isPinching = false;
        gesture.current.isPanning = false;
        
        let newScale = transform.scale;
        if (newScale < 1) newScale = 1;
        if (newScale > 4) newScale = 4;
        
        const bounded = getBoundedPosition(transform.x, transform.y, newScale);
        // Snap back if out of bounds or scale < 1
        setTransform({ x: bounded.x, y: bounded.y, scale: newScale });
        
    } else if (e.touches.length === 1) {
        // Switch to panning if one finger remains
        gesture.current.isPinching = false;
        gesture.current.isPanning = true;
        gesture.current.startX = e.touches[0].clientX;
        gesture.current.startY = e.touches[0].clientY;
        gesture.current.initialX = transform.x;
        gesture.current.initialY = transform.y;
    }
  };

  const onWheel = (e: React.WheelEvent) => {
    if (!isActive) return;
    e.stopPropagation();
    const scaleAmount = -e.deltaY * 0.002;
    let newScale = Math.max(1, Math.min(transform.scale + scaleAmount, 4));
    setTransform(prev => ({ ...prev, scale: newScale, x: newScale === 1 ? 0 : prev.x, y: newScale === 1 ? 0 : prev.y }));
  };

  const onMouseDown = (e: React.MouseEvent) => {
      if (!isActive || transform.scale <= 1) return;
      e.preventDefault();
      setIsGesturing(true);
      gesture.current.isPanning = true;
      gesture.current.startX = e.clientX;
      gesture.current.startY = e.clientY;
      gesture.current.initialX = transform.x;
      gesture.current.initialY = transform.y;
  };

  const onMouseMove = (e: React.MouseEvent) => {
      if (!isActive || !gesture.current.isPanning) return;
      e.preventDefault();
      const dx = e.clientX - gesture.current.startX;
      const dy = e.clientY - gesture.current.startY;
      const newX = gesture.current.initialX + dx;
      const newY = gesture.current.initialY + dy;
      
      const bounded = getBoundedPosition(newX, newY, transform.scale);
      setTransform(prev => ({ ...prev, x: bounded.x, y: bounded.y }));
  };

  const onMouseUp = () => { 
      setIsGesturing(false);
      gesture.current.isPanning = false; 
  };

  const handleZoomBtn = (factor: number) => {
    setTransform(prev => {
      let newScale = prev.scale * factor;
      newScale = Math.max(1, Math.min(newScale, 4));
      const bounded = getBoundedPosition(prev.x, prev.y, newScale);
      return { ...prev, scale: newScale, x: bounded.x, y: bounded.y };
    });
  };

  return (
    <div 
      ref={containerRef}
      className="zoom-pan-wrapper"
      onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}
      onWheel={onWheel} onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp} onMouseLeave={onMouseUp}
      style={{ 
          width: '100%', height: '100%', overflow: 'hidden', 
          touchAction: 'none', position: 'relative', 
          cursor: transform.scale > 1.05 ? (isGesturing ? 'grabbing' : 'grab') : 'default' 
      }}
    >
      <div style={{
          transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
          transformOrigin: 'center center',
          transition: isGesturing ? 'none' : 'transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)',
          width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}
      >
        {children}
      </div>
      
      <div className="zoom-controls">
        <button onClick={(e) => { e.stopPropagation(); handleZoomBtn(1.2); }} className="zoom-btn" title="Zoom In"><Plus size={16} /></button>
        <div className="zoom-divider"></div>
        <button onClick={(e) => { e.stopPropagation(); handleZoomBtn(0.8); }} className="zoom-btn" title="Zoom Out"><Minus size={16} /></button>
      </div>

      {transform.scale > 1.01 && (
         <div className="zoom-badge">
             {Math.round(transform.scale * 100)}%
         </div>
      )}
    </div>
  );
};

const SizeGuideModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  if (!isOpen) return null;
  return (
    <div className="vto-overlay" onClick={onClose}>
        <div className="size-guide-modal" onClick={e => e.stopPropagation()}>
          <div className="vto-header">
            <h2 className="text-neon-cyan">SIZE GUIDE</h2>
            <button onClick={onClose} className="vto-close"><X size={24}/></button>
          </div>
          <div className="p-6">
            <p className="text-sm opacity-70 mb-4">All measurements are in inches. Fits true to size.</p>
            <table className="w-full text-left text-sm text-[var(--foreground)] border-collapse">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th className="pb-3 text-[var(--neon-cyan)] font-orbitron">SIZE</th>
                  <th className="pb-3 text-[var(--ink-soft)] font-orbitron">CHEST</th>
                  <th className="pb-3 text-[var(--ink-soft)] font-orbitron">LENGTH</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { s: 'XS', c: '34-36', l: '27' }, { s: 'S', c: '36-38', l: '28' }, { s: 'M', c: '38-40', l: '29' },
                  { s: 'L', c: '40-42', l: '30' }, { s: 'XL', c: '42-44', l: '31' },
                ].map((row, i) => (
                  <tr key={row.s} className="border-b border-[var(--border)] last:border-0 hover:bg-[rgba(255,255,255,0.03)]">
                    <td className="py-4 font-bold text-white">{row.s}</td>
                    <td className="py-4 opacity-80">{row.c}</td>
                    <td className="py-4 opacity-80">{row.l}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
    </div>
  );
};

const VirtualTryOnModal = ({ isOpen, onClose, product, models = [] }: { isOpen: boolean, onClose: () => void, product: any, models?: any[] }) => {
  const [mode, setMode] = useState("model");
  const [selectedModel, setSelectedModel] = useState(models[0] || null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isModelLoading, setIsModelLoading] = useState(false);

  useEffect(() => {
    if (models.length > 0 && !selectedModel) setSelectedModel(models[0]);
  }, [models]);

  useEffect(() => {
    if (isOpen && mode === "camera") {
      setCameraError(null);
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [isOpen, mode]);

  const startCamera = async () => {
    try {
      setCameraError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
      if (videoRef.current) videoRef.current.srcObject = mediaStream;
    } catch (err: any) {
      console.error("Camera access denied", err);
      setCameraError("Unable to access camera. Please allow permission or use another mode.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result && typeof ev.target.result === 'string') {
          setUploadedImage(ev.target.result);
          setMode("upload_preview");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleModelSelect = (model: any) => {
    if (selectedModel?.id !== model.id) {
        setIsModelLoading(true);
        setMode("model");
        setSelectedModel(model);
    }
  };

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { current: container } = scrollRef;
      const scrollAmount = 150;
      if (direction === 'left') container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      else container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="vto-overlay">
      <div className="vto-modal">
        <div className="vto-header">
          <div className="vto-title-wrap">
            <div className="vto-line left"></div>
            <h2 className="text-neon-cyan">VIRTUAL TRY-ON</h2>
            <div className="vto-line right"></div>
          </div>
          <button onClick={onClose} className="vto-close"><X size={24} /></button>
        </div>
        
        <div className="vto-content">
          <div className="vto-preview-stage">
            <ZoomPanMedia isActive={mode === "model" || mode === "upload_preview" || mode === "camera"}>
              {mode === "camera" && !cameraError && (
                 <div className="vto-camera-view">
                   <video ref={videoRef} autoPlay playsInline className="vto-video" />
                   <img src={product.images[0]} className="vto-ar-overlay" alt="ar-garment" loading="eager" />
                 </div>
              )}
              {mode === "camera" && cameraError && (
                 <div className="vto-error-view">
                    <div className="vto-error-content">
                       <div className="vto-icon-alert"><AlertCircle size={40} /></div>
                       <p className="vto-error-msg">{cameraError}</p>
                       <p className="vto-error-sub">Don't worry, you can still try on visually:</p>
                       <div className="vto-error-actions">
                          <button className="vto-alt-btn" onClick={() => document.getElementById('vto-upload-input')?.click()}><Upload size={16} /> Upload Photo</button>
                          <button className="vto-alt-btn" onClick={() => setMode("model")}><User size={16} /> Use Model</button>
                       </div>
                    </div>
                 </div>
              )}
              {mode === "upload_preview" && uploadedImage && (
                <div className="vto-upload-view">
                   <img src={uploadedImage} className="vto-user-img" alt="uploaded" />
                   <img src={product.images[0]} className="vto-ar-overlay" alt="ar-garment" loading="eager" />
                </div>
              )}
              {mode === "model" && selectedModel && (
                <div className="vto-model-view">
                  {isModelLoading && (
                      <div className="vto-loader"><Loader2 size={32} className="animate-spin text-[hsl(var(--neon-cyan))]" /></div>
                  )}
                  <img src={selectedModel.src} className={`vto-model-img ${isModelLoading ? 'opacity-0' : 'opacity-100'}`} alt="model" onLoad={() => setIsModelLoading(false)} loading="lazy" />
                  <img src={product.images[0]} className={`vto-ar-overlay ${isModelLoading ? 'opacity-0' : 'opacity-90'}`} alt="ar-garment" loading="eager" />
                </div>
              )}
              {(mode === "selection" || (mode === "upload" && !uploadedImage) || (!selectedModel && mode === "model")) && (
                 <div className="vto-placeholder">
                    <Zap size={48} className="mb-4 opacity-50 text-[hsl(var(--neon-cyan))]" />
                    <p>Select a mode to begin your virtual try-on experience</p>
                 </div>
              )}
            </ZoomPanMedia>
          </div>

          <div className="vto-sidebar">
            <div className="vto-options-grid">
              <button className={`vto-card-opt ${mode === "camera" ? "active" : ""}`} onClick={() => setMode("camera")}>
                <div className="vto-icon"><Camera size={32} /></div>
                <div className="vto-opt-text"><h3>Live Camera</h3><span>Start live try-on with your camera</span></div>
              </button>
              <label className={`vto-card-opt ${mode === "upload" || mode === "upload_preview" ? "active" : ""}`}>
                <input id="vto-upload-input" name="vto-upload" type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                <div className="vto-icon"><Upload size={32} /></div>
                <div className="vto-opt-text"><h3>Upload Photo</h3><span>Upload a photo to preview</span></div>
              </label>
            </div>
            <div className="vto-divider"><span className="dot"></span><span className="text">or try on a model</span><span className="dot"></span></div>
            {models.length > 0 ? (
              <div className="vto-carousel-container">
                <button className="vto-carousel-arrow left" onClick={() => scrollCarousel('left')}><ChevronLeft size={20} /></button>
                <div className="vto-model-strip" ref={scrollRef}>
                  {models.map((m: any) => (
                      <button key={m.id} className={`vto-model-thumb ${selectedModel?.id === m.id && mode === "model" ? "active" : ""}`} onClick={() => handleModelSelect(m)} title={m.name}>
                        <img src={m.src} alt={m.name} loading="lazy" />
                      </button>
                  ))}
                </div>
                <button className="vto-carousel-arrow right" onClick={() => scrollCarousel('right')}><ChevronRight size={20} /></button>
              </div>
            ) : (<p className="text-center text-sm text-gray-500 py-4">No models available</p>)}
            <p className="vto-privacy">Photos are processed for this preview and never stored. <ShieldCheck size={12} className="inline" /></p>
            <button className="vto-cta-btn" onClick={onClose}>ADD TO CART</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main App Component ---

const App = () => {
  const [activeImage, setActiveImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(PRODUCT.colors[0]);
  const [selectedSize, setSelectedSize] = useState("M");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("OVERVIEW");
  const [isVTOOpen, setIsVTOOpen] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isMinimal, setIsMinimal] = useState(false);
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [customText, setCustomText] = useState("");
  const [customFont, setCustomFont] = useState(CUSTOM_FONTS[0]);
  const [customGlow, setCustomGlow] = useState(NEON_EFFECTS[0]);

  useEffect(() => {
    const interval = setInterval(() => { setActiveImage(prev => (prev + 1) % PRODUCT.images.length); }, 3500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isMinimal) document.body.classList.add("mode-minimal");
    else document.body.classList.remove("mode-minimal");
  }, [isMinimal]);

  const handleShare = async () => {
    if (navigator.share) {
      try { await navigator.share({ title: PRODUCT.title, text: PRODUCT.description, url: window.location.href }); } 
      catch (error) { console.log('Error sharing', error); }
    } else {
      try { await navigator.clipboard.writeText(window.location.href); alert("Link copied to clipboard!"); } 
      catch (err) { console.error('Failed to copy', err); }
    }
  };

  return (
    <div className={`app-root ${isMinimal ? 'is-minimal' : ''}`}>
      <Styles />
      <Header isMinimal={isMinimal} toggleMinimal={() => setIsMinimal(!isMinimal)} />
      
      <main className="neo-shell">
        <div className="neo-grid">
          {/* Left Column: Media */}
          <div className="gallery-section">
            <div className="hero-frame-wrap">
              <div className="hero-frame">
                <div className="hero-media relative">
                  <img src={PRODUCT.images[activeImage]} alt="Main" className="w-full h-full object-cover transition-opacity duration-500" loading="eager" />
                  {!isMinimal && (
                    <div className="tele-overlay pointer-events-none">
                      <div className="teleporter-base">
                        <div className="teleporter-ring"></div>
                        <div className="teleporter-ring delay-1"></div>
                        <div className="teleporter-ring delay-2"></div>
                      </div>
                    </div>
                  )}
                  <div className="hero-scanline"></div>
                  <div className="badge-360"><Box size={14} /> 360° VIEW</div>
                  <div className="gallery-dots">
                    {PRODUCT.images.map((_, idx) => (
                      <button key={idx} className={`dot ${activeImage === idx ? 'active' : ''}`} onClick={(e) => { e.stopPropagation(); setActiveImage(idx); }} aria-label={`View image ${idx + 1}`}/>
                    ))}
                  </div>
                  <div className="vto-neon-btn-container" onClick={() => setIsVTOOpen(true)}>
                      <button className="vto-neon-btn">
                        <span className="vto-neon-text">VIRTUAL TRY ON</span>
                        <div className="vto-neon-icon"><Shirt size={18} strokeWidth={1.5} /><RefreshCw size={28} strokeWidth={1} className="vto-spin-ring" /></div>
                        <div className="vto-shine"></div>
                      </button>
                      <div className="vto-reflection">
                        <span className="vto-neon-text">VIRTUAL TRY ON</span>
                        <div className="vto-neon-icon"><Shirt size={18} strokeWidth={1.5} /><RefreshCw size={28} strokeWidth={1} className="vto-spin-ring" /></div>
                      </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Info */}
          <div className="info-section">
            <div className="product-header">
              <div className="product-title-row">
                <h1 className="product-title">{PRODUCT.title}</h1>
                <button className="share-btn" onClick={handleShare} aria-label="Share product"><Share2 size={20} /></button>
              </div>
              <div className="product-series">{PRODUCT.series}</div>
            </div>

            <div className="price-rating-row">
               <div className="price-block">
                 <span className="current-price">${PRODUCT.price}</span>
                 <span className="compare-price">${PRODUCT.compareAtPrice}</span>
                 <span className="discount-badge">-{Math.round(((PRODUCT.compareAtPrice - PRODUCT.price)/PRODUCT.compareAtPrice)*100)}% OFF</span>
               </div>
               <div className="rating-block">
                  <div className="stars">
                    {[1,2,3,4,5].map(i => <Star key={i} size={14} fill={i <= Math.floor(PRODUCT.rating) ? "var(--glow-yellow)" : "none"} color="var(--glow-yellow)" />)}
                  </div>
                  <span className="rating-text"><strong>{PRODUCT.rating}</strong> ({PRODUCT.reviewCount} reviews)</span>
               </div>
            </div>

            <div className="shipping-line"><Check size={14} className="text-green-400" /><span>Free shipping on orders over ${PRODUCT.shipping_threshold}</span></div>

            <button className="customize-banner" onClick={() => setIsCustomizing(!isCustomizing)}><Settings size={18} /><span>CUSTOMIZE</span></button>

            {isCustomizing && (
              <div className="customize-panel open">
                 <div className="option-block"><div className="option-title">Customization Method</div>
                    <div className="size-pills"><button className="pill active">Vinyl</button><button className="pill disabled">Sublimation</button></div>
                 </div>
                 <div className="customize-field"><div className="option-title">Cyber Text</div>
                    <input type="text" name="custom-text" id="custom-text-field" className="customize-input" placeholder="ENTER TEXT" maxLength={12} value={customText} onChange={(e) => setCustomText(e.target.value.toUpperCase())} />
                 </div>
                 <div className="option-block"><div className="option-title">Typography</div>
                    <div className="size-pills">{CUSTOM_FONTS.map(font => (<button key={font} className={`pill ${customFont === font ? 'active' : ''}`} onClick={() => setCustomFont(font)} style={{ fontFamily: font }}>{font}</button>))}</div>
                 </div>
                 <div className="option-block"><div className="option-title">Neon Resonance</div>
                    <div className="color-options">{NEON_EFFECTS.map(effect => (<button key={effect.name} className={`color-chip ${customGlow.name === effect.name ? 'active' : ''}`} style={{ '--swatch-color': effect.hex } as React.CSSProperties} onClick={() => setCustomGlow(effect)}><span className="color-name">{effect.name}</span></button>))}</div>
                 </div>
              </div>
            )}

            <div className="options-panel">
              <div className="option-block"><div className="option-title">COLOR</div>
                <div className="color-options">{PRODUCT.colors.map(color => (<button key={color.name} className={`color-chip ${selectedColor.name === color.name ? 'active' : ''}`} style={{ '--swatch-color': color.hex } as React.CSSProperties} onClick={() => setSelectedColor(color)}><input type="radio" className="hidden" checked={selectedColor.name === color.name} readOnly /><span className="color-dot"></span><span className="color-name">{color.name}</span></button>))}</div>
              </div>
              <div className="option-block">
                <div className="flex justify-between items-center mb-2"><div className="option-title mb-0">SIZE</div><button className="size-guide-link" onClick={() => setIsSizeGuideOpen(true)}>Size guide</button></div>
                <div className="size-pills">{PRODUCT.sizes.map(size => (<button key={size} className={`pill ${selectedSize === size ? 'active' : ''}`} onClick={() => setSelectedSize(size)}>{size}</button>))}</div>
              </div>

               <div className="cta-panel">
                  <div className="cta-price">${PRODUCT.price}</div>
                  <div className="qty-row">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                    <input readOnly value={quantity} name="quantity" id="product-quantity" aria-label="Quantity" />
                    <button onClick={() => setQuantity(quantity + 1)}>+</button>
                  </div>
                  <div className="cta-buttons">
                     <button className="btn btn-primary">ADD TO CART</button>
                     <button className="btn btn-secondary">BUY NOW</button>
                  </div>
               </div>
               
               <TrustBadges />
            </div>

            <div className="info-tabs mt-8">
               <div className="tab-list">
                 {['OVERVIEW', 'SPECIFICATIONS', 'REVIEWS', 'CARE', 'SHIPPING & RETURNS'].map(t => (
                   <button key={t} className={`tab-btn ${activeTab === t ? 'active' : ''}`} onClick={() => setActiveTab(t)}>{t}</button>
                 ))}
               </div>
               <div className="tab-panels">
                 {activeTab === 'OVERVIEW' && (
                   <div className="tab-copy animate-in">
                     <div className="overview-layout">
                        <div className="overview-text">
                            <h3 className="tab-section-header">PRODUCT DNA</h3>
                            <p className="description-text leading-relaxed">{PRODUCT.description}</p>
                            <div className="dna-badges">
                                <div className="dna-badge"><Shield size={16} /> <span>DURABLE</span></div>
                                <div className="dna-badge"><Wind size={16} /> <span>BREATHABLE</span></div>
                                <div className="dna-badge"><Zap size={16} /> <span>LIGHTWEIGHT</span></div>
                            </div>
                        </div>
                        <div className="overview-features">
                             <h3 className="tab-section-header">ENGINEERED SPECS</h3>
                             <div className="specs-visual-grid">{PRODUCT.specs.slice(0, 3).map((spec, i) => (<div key={i} className="spec-card-visual"><span className="label">{spec.label}</span><span className="value">{spec.value}</span></div>))}</div>
                        </div>
                     </div>
                     <div className="features-section mt-8">
                        <h3 className="tab-section-header">TACTICAL ADVANTAGE</h3>
                        <div className="feature-cards-grid">{PRODUCT.features.map((feature, i) => (<div className="feature-card" key={i}><div className="icon-wrapper"><feature.icon size={24} strokeWidth={1.5} /></div><div className="feature-content"><h4>{feature.title}</h4><p>{feature.desc}</p></div></div>))}</div>
                     </div>
                   </div>
                 )}
                 {activeTab === 'SPECIFICATIONS' && (
                   <div className="tab-copy animate-in">
                     <div className="specs-layout">
                        <div className="specs-header-row">
                           <h3 className="tab-section-header">TECHNICAL DATA SHEET</h3>
                           <div className="specs-badge">SKU: CT-2024-001</div>
                        </div>
                        <div className="tech-specs-table">
                            {PRODUCT.specs.map((s, i) => (
                                <div className="tech-row" key={i}>
                                    <div className="tech-col-label">{s.label}</div>
                                    <div className="tech-col-value">{s.value}</div>
                                </div>
                            ))}
                             <div className="tech-row">
                                 <div className="tech-col-label">Certified</div>
                                 <div className="tech-col-value text-neon-cyan">ISO 9001, OEKO-TEX</div>
                             </div>
                        </div>
                     </div>
                   </div>
                 )}
                 {activeTab === 'REVIEWS' && (
                   <div className="tab-copy animate-in">
                     <div className="reviews-layout">
                        <div className="reviews-sidebar">
                            <div className="rating-big-card">
                                <div className="big-rating">{PRODUCT.rating}</div>
                                <div className="stars flex gap-1 justify-center mb-2">
                                    {[1,2,3,4,5].map(i => <Star key={i} size={16} fill={i <= Math.floor(PRODUCT.rating) ? "var(--glow-yellow)" : "none"} color="var(--glow-yellow)" />)}
                                </div>
                                <span className="count">{PRODUCT.reviewCount} Verified Reviews</span>
                            </div>
                            <div className="rating-bars">
                                {[5,4,3,2,1].map((star, i) => (
                                    <div key={star} className="bar-row">
                                        <span className="star-label">{star} <Star size={10} /></span>
                                        <div className="bar-track"><div className="bar-fill" style={{width: [85, 10, 3, 2, 0][i] + '%'}}></div></div>
                                        <span className="bar-pct">{[85, 10, 3, 2, 0][i]}%</span>
                                    </div>
                                ))}
                            </div>
                            <button className="write-review-btn w-full mt-4">WRITE A REVIEW</button>
                        </div>
                        <div className="reviews-feed">
                            {MOCK_REVIEWS.map((r, i) => (
                                <div className="review-card" key={i}>
                                    <div className="review-header">
                                        <div className="reviewer-avatar">{r.name.substring(0,2).toUpperCase()}</div>
                                        <div className="reviewer-meta">
                                            <span className="name">{r.name}</span>
                                            <div className="stars flex gap-0.5">
                                                {[1,2,3,4,5].map(star => <Star key={star} size={12} fill={star <= r.rating ? "var(--glow-yellow)" : "none"} color="var(--glow-yellow)" />)}
                                            </div>
                                        </div>
                                        <span className="date">{r.date}</span>
                                    </div>
                                    <p className="review-body">{r.text}</p>
                                </div>
                            ))}
                        </div>
                     </div>
                   </div>
                 )}
                 {activeTab === 'CARE' && (
                   <div className="tab-copy animate-in">
                     <h3 className="tab-section-header">MAINTENANCE PROTOCOLS</h3>
                     <div className="care-grid-cards">
                        <div className="care-card">
                            <div className="care-icon"><Waves size={28} /></div>
                            <div className="care-detail">
                                <strong>Machine Wash Cold</strong>
                                <span>Gentle cycle only</span>
                            </div>
                        </div>
                        <div className="care-card">
                            <div className="care-icon"><Wind size={28} /></div>
                            <div className="care-detail">
                                <strong>Tumble Dry Low</strong>
                                <span>Remove promptly</span>
                            </div>
                        </div>
                        <div className="care-card">
                            <div className="care-icon"><AlertTriangle size={28} /></div>
                            <div className="care-detail">
                                <strong>Do Not Bleach</strong>
                                <span>Preserves colors</span>
                            </div>
                        </div>
                        <div className="care-card">
                            <div className="care-icon"><Thermometer size={28} /></div>
                            <div className="care-detail">
                                <strong>Do Not Iron</strong>
                                <span>Steam if needed</span>
                            </div>
                        </div>
                     </div>
                   </div>
                 )}
                 {activeTab === 'SHIPPING & RETURNS' && (
                    <div className="tab-copy animate-in">
                        <div className="shipping-layout">
                            <div className="shipping-card"><div className="icon-box"><Truck size={24}/></div><div><h4>GLOBAL SHIPPING</h4><p>Free standard shipping on orders over ${PRODUCT.shipping_threshold}. Expedited options available at checkout.</p></div></div>
                             <div className="shipping-card"><div className="icon-box"><RotateCcw size={24}/></div><div><h4>30-DAY RETURNS</h4><p>Hassle-free returns within 30 days. Item must be in original condition with tags attached.</p></div></div>
                             <div className="shipping-card"><div className="icon-box"><ShieldCheck size={24}/></div><div><h4>SECURE PACKAGING</h4><p>All items are vacuum sealed in anti-static tactical packaging for maximum protection.</p></div></div>
                        </div>
                    </div>
                 )}
               </div>
            </div>

          </div>
        </div>
      </main>

      <VirtualTryOnModal isOpen={isVTOOpen} onClose={() => setIsVTOOpen(false)} product={PRODUCT} models={SECTION_SETTINGS.try_on_models} />
      <SizeGuideModal isOpen={isSizeGuideOpen} onClose={() => setIsSizeGuideOpen(false)} />
      <BottomBar />
    </div>
  );
};

// --- CSS Styles ---
const Styles = () => (
  <style dangerouslySetInnerHTML={{ __html: `
    :root {
      --background: 222 47% 4%;
      --foreground: 200 50% 97%;
      --card: 222 47% 5%;
      --card-foreground: 200 50% 97%;
      --popover: 222 47% 6%;
      --popover-foreground: 200 50% 97%;
      --primary: 186 100% 50%;
      --primary-foreground: 222 47% 3%;
      --secondary: 222 30% 12%;
      --secondary-foreground: 200 50% 97%;
      --muted: 222 30% 15%;
      --muted-foreground: 210 30% 60%;
      --accent: 186 100% 50%;
      --accent-foreground: 222 47% 3%;
      --destructive: 340 80% 60%;
      --destructive-foreground: 0 0% 100%;
      --border: 200 50% 20%;
      --input: 222 30% 15%;
      --ring: 186 100% 50%;
      --radius: 0.75rem;
      --neon-cyan: 186 100% 50%;
      --neon-teal: 175 100% 55%;
      --neon-green: 150 100% 72%;
      --neon-magenta: 320 100% 60%;
      --neon-blue: 200 100% 50%;
      --glass: 0 0% 100% / 0.06;
      --glass-strong: 0 0% 100% / 0.12;
      --glass-border: 200 50% 50% / 0.3;
      --glow-cyan: 0 0 30px hsl(186 100% 50% / 0.5), 0 0 60px hsl(186 100% 50% / 0.3);
      --glow-soft: 0 0 20px hsl(186 100% 50% / 0.3);
      --glow-button: 0 0 20px hsl(186 100% 50% / 0.4), 0 4px 15px hsl(0 0% 0% / 0.3);
      --surface-dark: 222 47% 4%;
      --surface-panel: 222 40% 8%;
      --ink-soft: 210 30% 65%;
      --glow: hsl(var(--neon-cyan));
      --glow-blue: hsl(var(--neon-blue));
      --glow-yellow: #ffc400;
      --accent-live: hsl(var(--neon-cyan));
      --accent-live-soft: hsl(186 100% 50% / 0.25);
      --accent-live-strong: hsl(186 100% 50% / 0.6);
      --line: hsl(var(--border));
      --danger: hsl(var(--destructive));
      --safe: hsl(var(--neon-green));
      --ink-strong: hsl(var(--foreground));
    }
    *, *::before, *::after { box-sizing: border-box; }
    /* Utility Classes */
    .w-full { width: 100%; }
    .h-full { height: 100%; }
    .object-cover { object-fit: cover; }
    .hidden { display: none; }
    .flex { display: flex; }
    .justify-between { justify-content: space-between; }
    .items-center { align-items: center; }
    .mb-2 { margin-bottom: 0.5rem; }
    .mb-0 { margin-bottom: 0; }
    .opacity-50 { opacity: 0.5; }
    
    body { background: #03060f; color: hsl(var(--foreground)); font-family: 'Space Grotesk', system-ui, sans-serif; margin: 0; -webkit-font-smoothing: antialiased; overflow-x: hidden; min-height: 100vh; padding-bottom: 80px; }
    button { font-family: inherit; -webkit-tap-highlight-color: transparent; }
    .orbitron { font-family: 'Orbitron', sans-serif; }
    .text-neon-cyan { color: hsl(var(--neon-cyan)); text-shadow: 0 0 10px hsl(var(--neon-cyan) / 0.8); }
    .mode-minimal { background: #000000; color: #ffffff; }
    .is-minimal .neo-navbar { background: #0d0d0d; border: 1px solid #333; box-shadow: none; }
    
    .neo-shell { max-width: 1240px; margin: 0 auto; padding: 140px 20px 40px; width: 100%; }
    .neo-grid { display: grid; grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr); gap: 40px; align-items: start; }
    
    @media (max-width: 1024px) {
      .neo-shell { padding-top: 140px; }
      .neo-grid { gap: 30px; }
    }

    @media (max-width: 900px) {
      .neo-grid { grid-template-columns: 100%; gap: 32px; width: 100%; max-width: 100vw; }
      .neo-shell { padding-top: 190px; padding-left: 16px; padding-right: 16px; }
      .gallery-section, .info-section { width: 100%; min-width: 0; }
      .hero-frame-wrap { width: 100%; max-width: 600px; margin-inline: auto; }
    }

    /* --- IMMERSIVE HEADER --- */
    .neo-navbar { 
        position: fixed; top: 20px; left: 50%; transform: translateX(-50%); 
        width: min(800px, calc(100% - 32px)); z-index: 1000;
        background: linear-gradient(180deg, rgba(13, 22, 43, 0.65) 0%, rgba(6, 11, 23, 0.85) 100%);
        backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
        border-radius: 999px;
        border: 1px solid rgba(130, 200, 255, 0.15);
        border-top: 1px solid rgba(180, 220, 255, 0.3);
        border-bottom: 1px solid rgba(0, 240, 255, 0.1);
        box-shadow: 0 10px 40px -10px rgba(0,0,0,0.8), 0 0 0 1px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255,255,255,0.15), 0 0 20px rgba(0, 180, 255, 0.05);
        height: 72px; 
        transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
        display: flex; align-items: center; justify-content: space-between;
        padding: 0 20px;
        overflow: hidden;
    }
    
    .neo-navbar.mobile-search-mode {
        padding: 0;
    }
    
    @media (max-width: 600px) { 
        .neo-navbar { padding: 0 16px; height: 68px; gap: 8px; width: calc(100% - 24px); } 
        .nav-center.desktop-only { display: none; }
        .nav-btn.mobile-only { display: flex; }
    }

    .nav-content-standard {
        display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: 12px; width: 100%; height: 100%;
    }
    
    @media (max-width: 600px) {
       .nav-content-standard { display: flex; justify-content: space-between; }
    }
    
    .nav-left { display: flex; align-items: center; }
    .nav-center { display: flex; align-items: center; justify-content: center; width: 100%; }
    .nav-right { display: flex; align-items: center; gap: 4px; }
    
    .nav-btn { width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: transparent; border: none; color: rgba(255,255,255,0.7); cursor: pointer; transition: 0.2s; }
    .nav-btn:hover { color: white; background: rgba(255,255,255,0.05); }
    .nav-btn.mobile-only { display: none; }
    
    /* --- SEARCH BAR GLASSMORPHISM --- */
    .nav-search-container { 
        width: 100%; height: 44px; 
        /* Glassmorphism Background */
        background: rgba(13, 22, 43, 0.4); 
        backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
        border-radius: 999px; display: flex; align-items: center; padding: 0 4px 0 16px; 
        /* Soft Neon Edge Lighting (Blue/Purple) */
        border: 1px solid rgba(130, 200, 255, 0.15); 
        box-shadow: 0 4px 12px rgba(0,0,0,0.1), inset 0 0 0 1px rgba(255,255,255,0.05);
        transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94); 
    }
    .nav-search-container:focus-within { 
        background: rgba(13, 22, 43, 0.6); 
        /* Neon Border Shift */
        border-color: rgba(140, 100, 255, 0.5); 
        /* Inner Glow + Outer Bloom */
        box-shadow: 
            0 0 20px rgba(0, 180, 255, 0.2), 
            0 0 10px rgba(160, 60, 255, 0.3),
            inset 0 0 15px rgba(0, 180, 255, 0.1); 
        transform: scale(1.01); 
    }
    .nav-search-container.listening { 
        border-color: #a855f7; 
        box-shadow: 0 0 20px rgba(168, 85, 247, 0.5); 
    }
    .nav-search-container .search-icon { color: rgba(255,255,255,0.7); margin-right: 12px; transition: 0.2s; filter: drop-shadow(0 0 2px rgba(255,255,255,0.3)); }
    .nav-search-container:focus-within .search-icon { color: #fff; filter: drop-shadow(0 0 5px rgba(0, 240, 255, 0.8)); }
    .nav-search-container input { background: transparent; border: none; outline: none; flex: 1; color: white; font-family: 'Space Grotesk'; font-size: 0.95rem; letter-spacing: 0.02em; font-weight: 400; min-width: 0; }
    .nav-search-container input::placeholder { color: rgba(255,255,255,0.5); font-weight: 400; }
    
    /* Mobile Search Overlay Fix */
    .nav-mobile-search { 
        position: absolute; inset: 0; 
        background: rgba(3, 6, 15, 0.85);
        backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
        z-index: 20; 
        display: flex; align-items: center; 
        padding: 0 8px 0 2px;
        gap: 8px; 
        opacity: 0; pointer-events: none; 
        transform: translateY(10px) scale(0.98); 
        transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
        border-radius: 999px;
    }
    .nav-mobile-search.active { opacity: 1; pointer-events: auto; transform: translateY(0) scale(1); }
    
    .nav-mobile-search .back-btn {
        flex-shrink: 0;
        width: 48px; height: 48px;
        color: rgba(255,255,255,0.9);
    }
    
    /* Ensure Mobile Overlay Search Bar is Visible & Consistent */
    .nav-search-container.mobile { 
        width: auto; 
        flex: 1; 
        height: 44px;
        margin: 0;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(130, 200, 255, 0.2); 
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    }
    .nav-search-container.mobile:focus-within {
        background: rgba(255, 255, 255, 0.08);
        border-color: rgba(140, 100, 255, 0.6);
        box-shadow: 0 0 20px rgba(140, 100, 255, 0.15);
    }
    .nav-search-container.mobile input { font-size: 1.1rem; padding-left: 12px; }
    
    /* Mobile Menu Drawer */
    .mobile-menu-drawer { position: fixed; inset: 0; background: rgba(3, 6, 15, 0.98); backdrop-filter: blur(20px); z-index: 2000; transform: translateX(-100%); transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1); display: flex; flex-direction: column; }
    .mobile-menu-drawer.open { transform: translateX(0); }
    .mobile-menu-header { display: flex; justify-content: space-between; align-items: center; padding: 20px; border-bottom: 1px solid var(--border); }
    .menu-title { font-family: 'Orbitron'; font-size: 1.2rem; letter-spacing: 0.1em; color: white; }
    .menu-close-btn { background: none; border: none; color: white; cursor: pointer; }
    .mobile-nav-links { display: flex; flex-direction: column; padding: 20px; gap: 4px; }
    .mobile-nav-item { display: flex; justify-content: space-between; align-items: center; padding: 16px; color: hsl(var(--foreground)); text-decoration: none; font-family: 'Space Grotesk'; font-size: 1.1rem; border-radius: 12px; transition: 0.2s; }
    .mobile-nav-item:hover { background: rgba(255,255,255,0.05); color: hsl(var(--neon-cyan)); }
    
    /* Drawer Search - Enhanced Visibility */
    .mobile-menu-search { border-bottom: 1px solid rgba(255,255,255,0.05); padding: 16px 20px; }
    .nav-search-container.drawer-search {
        background: rgba(255,255,255,0.03);
        border: 1px solid rgba(255,255,255,0.1);
        width: 100%;
        box-shadow: none;
    }
    .nav-search-container.drawer-search:focus-within {
        background: rgba(255,255,255,0.08);
        border-color: rgba(140, 100, 255, 0.5);
        box-shadow: 0 0 15px rgba(140, 100, 255, 0.2);
    }

    .mic-btn { width: 36px; height: 36px; border-radius: 50%; background: transparent; border: none; color: rgba(255,255,255,0.7); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: 0.2s; }
    .mic-btn:hover { color: white; background: rgba(255,255,255,0.1); }
    .mic-btn.active { color: #a855f7; animation: pulse-mic 1.5s infinite; }
    .badge-dot { position: absolute; top: 0px; right: 0px; width: 16px; height: 16px; background: #9d4edd; border-radius: 50%; font-size: 0.65rem; color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; border: 2px solid #0a101d; box-shadow: 0 2px 6px rgba(0,0,0,0.5); }
    
    /* Zoom Controls */
    .zoom-controls { position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%); display: flex; align-items: center; background: rgba(0,0,0,0.7); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.2); border-radius: 99px; padding: 4px; z-index: 100; box-shadow: 0 4px 20px rgba(0,0,0,0.5); }
    .zoom-btn { width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; background: transparent; border: none; color: white; cursor: pointer; border-radius: 50%; transition: 0.2s; }
    .zoom-btn:hover { background: rgba(255,255,255,0.1); color: hsl(var(--neon-cyan)); }
    .zoom-divider { width: 1px; height: 16px; background: rgba(255,255,255,0.2); margin: 0 4px; }
    .zoom-badge { position: absolute; top: 16px; right: 16px; background: rgba(0,0,0,0.6); color: #fff; padding: 4px 10px; border-radius: 99px; font-size: 0.75rem; pointer-events: none; backdrop-filter: blur(4px); border: 1px solid rgba(255,255,255,0.2); z-index: 50; font-family: 'Orbitron'; letter-spacing: 0.05em; animation: fadeIn 0.2s ease; }

    .fixed-bottom-bar { position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%); z-index: 1000; width: auto; }
    .bottom-bar-glass { background: linear-gradient(180deg, rgba(30, 40, 60, 0.7) 0%, rgba(10, 15, 25, 0.9) 100%); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.1); border-top: 1px solid rgba(255,255,255,0.25); border-radius: 99px; padding: 8px 10px; display: flex; align-items: center; gap: 16px; box-shadow: 0 10px 40px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.2), inset 0 -10px 20px rgba(0,0,0,0.3); }
    .bottom-home-btn { display: flex; align-items: center; gap: 6px; background: transparent; border: 1px solid rgba(255,255,255,0.1); color: rgba(255,255,255,0.6); font-family: 'Orbitron'; font-size: 0.7rem; font-weight: 600; letter-spacing: 0.1em; padding: 6px 12px; border-radius: 99px; cursor: pointer; transition: 0.2s; opacity: 0.8; }
    .bottom-home-btn:hover { background: rgba(255,255,255,0.1); color: white; opacity: 1; border-color: rgba(255,255,255,0.3); }
    @keyframes shine-sweep { 0% { left: -100%; opacity: 0; } 20% { opacity: 0.5; } 100% { left: 100%; opacity: 0; } }
    .bottom-add-btn { display: flex; align-items: center; justify-content: center; gap: 10px; background: linear-gradient(90deg, #00f0ff, #00aaff); backdrop-filter: blur(10px); border: none; color: #001015; font-family: 'Orbitron'; font-size: 0.85rem; font-weight: 800; letter-spacing: 0.15em; padding: 10px 40px; min-width: 200px; border-radius: 99px; cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); box-shadow: 0 0 25px rgba(0, 240, 255, 0.5); position: relative; overflow: hidden; }
    .bottom-add-btn::after { content: ''; position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background: linear-gradient(45deg, transparent, rgba(255,255,255,0.4), transparent); transform: rotate(45deg) translate(-100%, 0); transition: transform 0.6s; animation: shine-sweep 3s infinite 2s; }
    .bottom-add-btn:hover { transform: translateY(-2px); box-shadow: 0 0 40px rgba(0, 240, 255, 0.8), inset 0 0 10px white; color: #000; }
    .hero-frame-wrap { position: relative; margin-bottom: 12px; width: 100%; max-width: 540px; margin-inline: auto; }
    .hero-frame { position: relative; border-radius: 20px; padding: 14px; background: linear-gradient(160deg, rgba(12, 20, 35, 0.88), rgba(6, 10, 20, 0.95)); border: 1px solid hsl(var(--neon-cyan)); box-shadow: 0 0 40px rgba(126, 234, 255, 0.15), inset 0 0 30px rgba(0,0,0,0.45); }
    .hero-media { position: relative; border-radius: 14px; overflow: hidden; aspect-ratio: 4/5; background: #03060f; cursor: crosshair; }
    
    .hero-media img { 
      width: 100%; height: 100%; object-fit: cover; 
      transition: transform 0.8s cubic-bezier(0.19, 1, 0.22, 1); 
      will-change: transform; 
    }
    .hero-media:hover img { 
      transform: scale(1.1); 
    }
    
    @media (max-width: 600px) { 
      .hero-media { aspect-ratio: 1/1; max-height: 480px; } 
      .hero-frame { padding: 10px; border-radius: 16px; } 
      .fixed-bottom-bar { width: 94%; bottom: 15px; }
      .bottom-bar-glass { padding: 6px; gap: 8px; justify-content: space-between; } 
      .bottom-home-btn { padding: 8px 12px; font-size: 0.65rem; } 
      .bottom-add-btn { padding: 10px 16px; min-width: 0; flex: 1; font-size: 0.75rem; } 
    }
    
    .tele-overlay { position: absolute; inset: 0; pointer-events: none; z-index: 5; }
    .teleporter-base { position: absolute; bottom: -40px; left: 50%; transform: translateX(-50%) perspective(300px) rotateX(75deg); width: 300px; height: 150px; }
    .teleporter-ring { position: absolute; width: 100%; height: 100%; border-radius: 50%; border: 2px solid hsl(var(--neon-cyan)); box-shadow: 0 0 12px hsl(var(--neon-cyan)); animation: spin 8s linear infinite; opacity: 0.6; }
    .delay-1 { animation-delay: -2s; transform: scale(0.7); }
    .delay-2 { animation-delay: -4s; transform: scale(0.4); }
    @keyframes spin { from { transform: rotate(0) scale(1); } to { transform: rotate(360deg) scale(1); } }
    .badge-360 { position: absolute; top: 12px; right: 12px; display: flex; align-items: center; gap: 6px; padding: 6px 10px; background: rgba(0,0,0,0.7); border: 1px solid hsl(var(--neon-cyan)); border-radius: 99px; color: hsl(var(--neon-cyan)); font-size: 0.65rem; font-weight: bold; font-family: 'Orbitron'; backdrop-filter: blur(4px); }
    .hero-scanline { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(to bottom, transparent, rgba(0, 240, 255, 0.1), transparent); z-index: 4; animation: scanline 4s linear infinite; pointer-events: none; }
    @keyframes scanline { 0% { transform: translateY(-100%); } 100% { transform: translateY(100%); } }
    .vto-neon-btn-container { position: absolute; bottom: 20px; right: 20px; display: flex; flex-direction: column; align-items: flex-end; z-index: 20; perspective: 800px; pointer-events: auto; }
    @media (max-width: 768px) { .vto-neon-btn-container { bottom: 15px; right: 15px; transform: scale(0.85); transform-origin: bottom right; display: flex !important; } }
    .vto-neon-btn { position: relative; width: 128px; height: 64px; background: linear-gradient(180deg, rgba(200, 240, 255, 0.05) 0%, rgba(0, 20, 30, 0.3) 50%, rgba(0, 5, 10, 0.5) 100%); border-radius: 18px; display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer; backdrop-filter: blur(6px); box-shadow: 0 4px 20px rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); border-top: 1px solid rgba(255,255,255,0.2); transition: transform 0.2s; }
    .vto-neon-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 30px rgba(0,0,0,0.8), 0 0 20px rgba(0,240,255,0.3); }
    .vto-neon-btn::after { content: ""; position: absolute; inset: -1px; border-radius: 18px; padding: 2px; background: linear-gradient(90deg, #00f0ff, #ff00aa); -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0); -webkit-mask-composite: xor; mask-composite: exclude; pointer-events: none; box-shadow: 0 0 15px rgba(0,240,255,0.4); opacity: 0.8; }
    .vto-neon-text { color: white; font-family: 'Orbitron', sans-serif; font-weight: 800; font-size: 0.65rem; letter-spacing: 0.05em; margin-bottom: 6px; text-shadow: 0 2px 4px rgba(0,0,0,0.8); z-index: 2; }
    .vto-neon-icon { display: flex; align-items: center; justify-content: center; position: relative; color: white; z-index: 2; }
    .vto-spin-ring { position: absolute; inset: -6px; color: #00f0ff; mix-blend-mode: screen; opacity: 0.9; animation: vto-spin-slow 10s linear infinite; filter: drop-shadow(0 0 5px #00f0ff); }
    .vto-neon-btn:hover .vto-spin-ring { color: #ff00aa; filter: drop-shadow(0 0 5px #ff00aa); }
    .vto-reflection { position: relative; width: 128px; height: 64px; background: linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0.6) 40%, rgba(0,0,0,0.9) 100%); border-radius: 18px; display: flex; flex-direction: column; align-items: center; justify-content: center; opacity: 0.3; transform: scaleY(-1); -webkit-mask-image: linear-gradient(to top, transparent 10%, rgba(0,0,0,0.8) 100%); filter: blur(1px); pointer-events: none; margin-top: -10px; position: absolute; bottom: -50px; }
    .vto-reflection::after { content: ""; position: absolute; inset: 0; border-radius: 18px; padding: 2px; background: linear-gradient(90deg, #00f0ff, #ff00aa); -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0); -webkit-mask-composite: xor; mask-composite: exclude; }
    .vto-shine { position: absolute; top: 0; left: 0; right: 0; height: 45%; background: linear-gradient(180deg, rgba(255,255,255,0.2) 0%, transparent 100%); border-radius: 18px 18px 80% 80% / 18px 18px 30% 30%; pointer-events: none; }
    @keyframes vto-spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    .gallery-dots { position: absolute; bottom: 16px; left: 16px; right: auto; display: flex; align-items: center; gap: 8px; padding: 8px 12px; border-radius: 99px; background: rgba(6, 12, 24, 0.7); border: 1px solid rgba(126, 234, 255, 0.35); backdrop-filter: blur(8px); z-index: 10; box-shadow: 0 4px 12px rgba(0,0,0,0.3); }
    .dot { width: 10px; height: 10px; border-radius: 50%; background: rgba(0, 255, 255, 0.15); border: 1px solid rgba(126, 234, 255, 0.4); cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); padding: 0; }
    .dot:hover { background: rgba(0, 255, 255, 0.5); transform: scale(1.1); }
    .dot.active { background: hsl(var(--neon-cyan)); border-color: hsl(var(--neon-cyan)); box-shadow: 0 0 12px var(--accent-live-strong); transform: scale(1.2); }
    @media (max-width: 768px) { .gallery-dots { bottom: 12px; left: 12px; padding: 6px 10px; } .dot { width: 8px; height: 8px; } }
    .product-title-row { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 8px; flex-wrap: wrap; }
    .product-title { font-family: 'Orbitron'; font-size: 2.2rem; font-weight: 800; letter-spacing: 0.1em; margin: 0; color: white; text-shadow: 0 0 20px rgba(0, 174, 255, 0.4); flex: 1; min-width: 200px; }
    .share-btn { background: none; border: 1px solid var(--border); border-radius: 12px; color: hsl(var(--ink-soft)); cursor: pointer; padding: 8px; transition: 0.2s; display: flex; align-items: center; justify-content: center; }
    .share-btn:hover { border-color: hsl(var(--neon-cyan)); color: hsl(var(--neon-cyan)); box-shadow: 0 0 10px var(--accent-live-soft); }
    .product-series { font-family: 'Orbitron'; font-size: 0.75rem; color: hsl(var(--ink-soft)); letter-spacing: 0.2em; margin-bottom: 20px; }
    .price-rating-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; flex-wrap: wrap; gap: 10px; }
    .price-block { display: flex; align-items: center; gap: 10px; }
    .current-price { font-family: 'Orbitron'; font-size: 1.8rem; font-weight: 800; color: var(--accent-live); text-shadow: 0 0 15px var(--accent-live-soft); }
    .compare-price { text-decoration: line-through; color: hsl(var(--ink-soft)); font-size: 1rem; }
    .discount-badge { background: hsl(var(--destructive)); color: #fff; padding: 2px 6px; border-radius: 4px; font-weight: 700; font-size: 0.75rem; }
    .rating-block { display: flex; align-items: center; gap: 8px; }
    .stars { display: flex; gap: 2px; }
    .rating-text { font-size: 0.8rem; color: hsl(var(--ink-soft)); }
    .rating-text strong { color: white; margin-right: 4px; }
    .shipping-line { display: flex; align-items: center; gap: 8px; font-size: 0.85rem; color: var(--safe); margin-bottom: 24px; }
    
    @media (max-width: 600px) { 
      .product-title { font-size: 1.5rem; line-height: 1.2; } 
      .current-price { font-size: 1.5rem; } 
      .compare-price { font-size: 0.9rem; } 
      .product-series { font-size: 0.65rem; margin-bottom: 16px; }
    }
    
    .customize-banner { width: 100%; padding: 12px; margin-bottom: 12px; background: linear-gradient(90deg, rgba(40, 243, 255, 0.92), rgba(11, 216, 255, 0.96)); border: 1px solid rgba(40, 243, 255, 0.9); border-radius: 12px; color: #02202b; font-family: 'Orbitron'; font-weight: 800; letter-spacing: 0.2em; display: flex; align-items: center; justify-content: center; gap: 10px; cursor: pointer; transition: 0.2s; box-shadow: 0 0 20px rgba(10, 214, 255, 0.4); }
    .customize-banner:hover { transform: translateY(-1px); box-shadow: 0 0 30px rgba(10, 214, 255, 0.6); }
    .customize-panel { background: rgba(6, 10, 22, 0.75); border: 1px solid var(--border); border-radius: 16px; padding: 16px; margin-bottom: 20px; display: grid; gap: 16px; animation: slideDown 0.3s ease; }
    @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
    .customize-field { display: flex; flex-direction: column; gap: 8px; }
    .customize-input { padding: 10px; background: rgba(6, 10, 22, 0.7); border: 1px solid var(--border); border-radius: 8px; color: white; font-family: 'Orbitron'; letter-spacing: 0.1em; }
    .options-panel { display: grid; gap: 16px; }
    .option-title { font-family: 'Orbitron'; font-size: 0.75rem; letter-spacing: 0.2em; color: hsl(var(--ink-soft)); margin-bottom: 8px; text-transform: uppercase; }
    .color-options { display: flex; flex-wrap: wrap; gap: 8px; }
    .color-chip { padding: 8px 12px; background: rgba(8, 12, 24, 0.9); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; display: flex; align-items: center; gap: 6px; cursor: pointer; transition: 0.2s; }
    .color-chip:hover, .color-chip.active { border-color: var(--swatch-color); box-shadow: 0 0 10px var(--swatch-color); transform: translateY(-1px); }
    .color-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--swatch-color); box-shadow: 0 0 6px var(--swatch-color); }
    .color-name { font-family: 'Orbitron'; font-size: 0.65rem; letter-spacing: 0.1em; color: white; text-transform: uppercase; }
    .size-pills { display: flex; flex-wrap: wrap; gap: 8px; }
    .pill { min-width: 48px; padding: 10px 14px; background: rgba(6, 10, 20, 0.7); border: 1px solid var(--border); border-radius: 8px; color: var(--ink-strong); font-family: 'Orbitron'; font-size: 0.75rem; cursor: pointer; transition: 0.2s; }
    .pill:hover { border-color: hsl(var(--neon-cyan)); }
    .pill.active { background: rgba(6, 10, 22, 0.9); border-color: hsl(var(--neon-cyan)); box-shadow: 0 0 15px hsl(var(--neon-cyan)); font-weight: bold; }
    .pill.disabled { opacity: 0.5; cursor: not-allowed; }
    .size-guide-link { background: none; border: none; color: hsl(var(--neon-cyan)); font-size: 0.75rem; text-decoration: underline; cursor: pointer; }
    
    .cta-panel { background: rgba(6, 10, 22, 0.7); border: 1px solid var(--border); border-radius: 16px; padding: 16px; display: grid; grid-template-columns: auto auto 1fr; gap: 12px; align-items: center; margin-top: 10px; }
    .cta-price { font-family: 'Orbitron'; font-size: 1.2rem; font-weight: 800; color: var(--accent-live); }
    .qty-row { display: flex; align-items: center; background: rgba(0,0,0,0.4); border: 1px solid var(--border); border-radius: 10px; height: 44px; }
    .qty-row button { width: 32px; height: 100%; background: none; border: none; color: white; cursor: pointer; }
    .qty-row input { width: 40px; height: 100%; background: none; border: none; text-align: center; color: white; font-weight: bold; }
    .cta-buttons { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; width: 100%; }
    .btn { height: 44px; border-radius: 10px; font-family: 'Orbitron'; font-weight: 800; font-size: 0.8rem; letter-spacing: 0.1em; cursor: pointer; transition: 0.2s; border: 1px solid transparent; position: relative; overflow: hidden; }
    .btn-primary { background: linear-gradient(90deg, #00f0ff, #0080ff); color: #001015; box-shadow: 0 0 20px rgba(0, 240, 255, 0.4); }
    .btn-primary:hover { box-shadow: 0 0 40px rgba(0, 240, 255, 0.7); transform: translateY(-2px); }
    .btn-primary::after { content: ''; position: absolute; top: 0; left: -100%; width: 50%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent); transform: skewX(-20deg); animation: shine-sweep 3s infinite; pointer-events: none; }
    .btn-secondary { background: linear-gradient(90deg, #ff00de, #a200ff); color: white; border: none; box-shadow: 0 0 20px rgba(255, 0, 222, 0.4); }
    .btn-secondary:hover { box-shadow: 0 0 40px rgba(255, 0, 222, 0.7); transform: translateY(-2px); }
    .btn-secondary::after { content: ''; position: absolute; top: 0; left: -100%; width: 50%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent); transform: skewX(-20deg); animation: shine-sweep 3s infinite 1.5s; pointer-events: none; }
    
    @media (max-width: 600px) { 
       .cta-panel { grid-template-columns: 1fr; gap: 16px; } 
       .qty-row { justify-content: center; width: 100%; } 
       .cta-buttons { display: flex; flex-direction: column; gap: 12px; }
       .btn { height: 48px; font-size: 0.9rem; }
    }
    
    .trust-badges-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-top: 24px; }
    .trust-item { background: rgba(255,255,255,0.03); border: 1px solid var(--border); border-radius: 10px; padding: 12px; display: flex; flex-direction: column; align-items: center; text-align: center; gap: 8px; }
    @media (max-width: 768px) {
        .trust-badges-grid { grid-template-columns: 1fr; gap: 12px; }
        .trust-item { flex-direction: row; text-align: left; padding: 16px; justify-content: flex-start; }
        .trust-icon { margin-bottom: 0; margin-right: 16px; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; }
        .trust-text { align-items: flex-start; }
    }
    .trust-icon { color: var(--safe); }
    .trust-title { font-family: 'Orbitron'; font-size: 0.55rem; letter-spacing: 0.1em; color: hsl(var(--ink-soft)); margin-bottom: 2px; }
    .trust-sub { font-size: 0.6rem; color: hsl(var(--ink-soft)); opacity: 0.7; }
    .info-tabs { margin-top: 32px; }
    .tab-list { display: flex; gap: 10px; overflow-x: auto; padding-bottom: 8px; scrollbar-width: none; border-bottom: 1px solid var(--border); }
    .tab-list::-webkit-scrollbar { display: none; }
    .tab-btn { background: transparent; border: 1px solid transparent; color: hsl(var(--ink-soft)); font-family: 'Orbitron'; font-size: 0.75rem; letter-spacing: 0.1em; padding: 10px 16px; cursor: pointer; border-radius: 20px; transition: 0.2s; white-space: nowrap; }
    .tab-btn:hover { color: white; background: rgba(255,255,255,0.05); }
    .tab-btn.active { border-color: hsl(var(--neon-cyan)); color: hsl(var(--neon-cyan)); background: rgba(0, 230, 255, 0.1); box-shadow: 0 0 15px rgba(0, 230, 255, 0.1); }
    
    /* ENHANCED TAB PANELS */
    .tab-panels { 
        background: linear-gradient(180deg, rgba(6, 10, 22, 0.6) 0%, rgba(6, 10, 22, 0.3) 100%);
        border: 1px solid rgba(255,255,255,0.08); 
        box-shadow: inset 0 1px 0 rgba(255,255,255,0.05);
        border-radius: 16px; padding: 28px; margin-top: 16px; min-height: 250px; 
    }
    
    @media (max-width: 600px) {
       .tab-list { padding-bottom: 4px; margin-bottom: 12px; }
       .tab-btn { padding: 8px 12px; font-size: 0.7rem; }
       .tab-panels { padding: 20px; }
    }
    
    .tab-section-header { font-family: 'Orbitron'; font-weight: 800; letter-spacing: 0.15em; color: hsl(var(--neon-cyan)); font-size: 1rem; margin: 0 0 20px; text-transform: uppercase; display: flex; align-items: center; gap: 10px; }
    .animate-in { animation: fadeIn 0.4s ease-out forwards; opacity: 0; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    
    /* Overview Tab */
    .overview-layout { display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 40px; }
    @media (max-width: 768px) { .overview-layout { grid-template-columns: 1fr; gap: 24px; } }
    .description-text { color: hsl(var(--foreground)); opacity: 0.9; font-size: 1rem; line-height: 1.7; margin-bottom: 24px; font-weight: 300; }
    .dna-badges { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 16px; }
    .dna-badge { display: flex; align-items: center; gap: 8px; background: rgba(0, 230, 255, 0.05); border: 1px solid rgba(0, 230, 255, 0.15); padding: 8px 14px; border-radius: 99px; color: hsl(var(--neon-cyan)); font-size: 0.75rem; font-weight: 600; font-family: 'Orbitron'; transition: 0.2s; }
    .dna-badge:hover { background: rgba(0, 230, 255, 0.1); border-color: hsl(var(--neon-cyan)); box-shadow: 0 0 10px rgba(0, 230, 255, 0.2); }
    .specs-visual-grid { display: grid; grid-template-columns: 1fr; gap: 12px; }
    .spec-card-visual { background: rgba(255,255,255,0.02); border-left: 2px solid rgba(255,255,255,0.1); padding: 12px 16px; display: flex; justify-content: space-between; align-items: center; transition: 0.2s; }
    .spec-card-visual:hover { background: rgba(255,255,255,0.04); border-left-color: hsl(var(--neon-cyan)); }
    .spec-card-visual .label { color: hsl(var(--muted-foreground)); font-size: 0.8rem; font-family: 'Orbitron'; letter-spacing: 0.05em; }
    .spec-card-visual .value { color: white; font-weight: 600; font-size: 0.9rem; font-family: 'Space Grotesk'; }
    
    .features-section { margin-top: 40px; padding-top: 30px; border-top: 1px solid var(--border); }
    .feature-cards-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 20px; }
    .feature-card { background: linear-gradient(145deg, rgba(6, 12, 24, 0.4) 0%, rgba(255,255,255,0.02) 100%); border: 1px solid var(--border); border-radius: 12px; padding: 20px; display: flex; gap: 16px; align-items: flex-start; transition: 0.2s; position: relative; overflow: hidden; }
    .feature-card:hover { border-color: hsl(var(--neon-cyan)); box-shadow: 0 4px 20px rgba(0,0,0,0.2); transform: translateY(-2px); }
    .feature-card .icon-wrapper { color: hsl(var(--neon-cyan)); background: rgba(0, 230, 255, 0.08); padding: 10px; border-radius: 10px; flex-shrink: 0; border: 1px solid rgba(0, 230, 255, 0.1); }
    .feature-content h4 { margin: 0 0 6px; font-family: 'Orbitron'; font-size: 0.9rem; color: white; letter-spacing: 0.05em; }
    .feature-content p { margin: 0; font-size: 0.85rem; color: hsl(var(--muted-foreground)); line-height: 1.5; }

    /* Specs Tab */
    .specs-layout { display: flex; flex-direction: column; gap: 20px; }
    .specs-header-row { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border); padding-bottom: 16px; margin-bottom: 8px; }
    .specs-badge { font-family: 'Space Grotesk'; font-size: 0.8rem; color: hsl(var(--muted-foreground)); background: rgba(255,255,255,0.05); padding: 4px 8px; border-radius: 4px; }
    .tech-specs-table { display: flex; flex-direction: column; width: 100%; border: 1px solid var(--border); border-radius: 8px; overflow: hidden; }
    .tech-row { display: grid; grid-template-columns: 200px 1fr; border-bottom: 1px solid rgba(255,255,255,0.05); transition: 0.2s; }
    .tech-row:last-child { border-bottom: none; }
    .tech-row:hover { background: rgba(0, 230, 255, 0.03); }
    .tech-col-label { padding: 16px 20px; color: hsl(var(--muted-foreground)); font-family: 'Orbitron'; font-size: 0.75rem; letter-spacing: 0.05em; border-right: 1px solid rgba(255,255,255,0.05); background: rgba(0,0,0,0.2); display: flex; align-items: center; text-transform: uppercase; }
    .tech-col-value { padding: 16px 20px; color: white; font-family: 'Space Grotesk'; font-size: 0.9rem; }
    @media(max-width: 600px) { .tech-row { grid-template-columns: 1fr; } .tech-col-label { border-right: none; border-bottom: 1px solid rgba(255,255,255,0.05); padding: 12px 16px; } .tech-col-value { padding: 12px 16px; } }

    /* Reviews Tab */
    .reviews-layout { display: grid; grid-template-columns: 280px 1fr; gap: 40px; }
    @media(max-width: 768px) { .reviews-layout { grid-template-columns: 1fr; gap: 24px; } }

    .rating-big-card { text-align: center; padding: 24px; background: rgba(255,255,255,0.02); border-radius: 12px; border: 1px solid var(--border); margin-bottom: 24px; }
    .big-rating { font-size: 3.5rem; font-weight: 800; color: white; font-family: 'Orbitron'; line-height: 1; margin-bottom: 8px; text-shadow: 0 0 20px rgba(0,0,0,0.5); }
    .rating-bars { display: flex; flex-direction: column; gap: 10px; margin-bottom: 24px; }
    .bar-row { display: grid; grid-template-columns: 40px 1fr 30px; align-items: center; gap: 10px; font-size: 0.75rem; color: var(--muted-foreground); }
    .star-label { display: flex; align-items: center; gap: 4px; font-family: 'Orbitron'; }
    .bar-track { height: 6px; background: rgba(255,255,255,0.08); border-radius: 3px; overflow: hidden; position: relative; }
    .bar-fill { height: 100%; background: var(--glow-yellow); border-radius: 3px; box-shadow: 0 0 10px rgba(255, 196, 0, 0.3); }
    .bar-pct { text-align: right; opacity: 0.7; }
    
    .write-review-btn { background: transparent; border: 1px solid hsl(var(--neon-cyan)); color: hsl(var(--neon-cyan)); padding: 12px; border-radius: 8px; font-family: 'Orbitron'; font-size: 0.8rem; cursor: pointer; transition: 0.2s; font-weight: 600; letter-spacing: 0.05em; text-align: center; }
    .write-review-btn:hover { background: hsl(var(--neon-cyan)); color: black; box-shadow: 0 0 15px hsl(var(--neon-cyan) / 0.4); }

    .reviews-feed { display: flex; flex-direction: column; gap: 20px; }
    .review-card { padding: 20px; border: 1px solid transparent; border-bottom: 1px solid var(--border); transition: 0.2s; }
    .review-card:last-child { border-bottom: none; }
    .review-card:hover { border-color: rgba(255,255,255,0.1); background: rgba(255,255,255,0.01); border-radius: 8px; }
    .review-header { display: flex; align-items: center; gap: 14px; margin-bottom: 14px; }
    .reviewer-avatar { width: 42px; height: 42px; border-radius: 50%; background: linear-gradient(135deg, rgba(6, 12, 24, 1), rgba(20, 30, 50, 1)); border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; font-weight: bold; color: var(--neon-cyan); font-family: 'Orbitron'; font-size: 0.9rem; text-shadow: 0 0 5px var(--neon-cyan); }
    .reviewer-meta { display: flex; flex-direction: column; gap: 2px; }
    .reviewer-meta .name { font-weight: 700; color: white; font-size: 0.95rem; }
    .review-body { color: hsl(var(--foreground)); font-size: 0.95rem; line-height: 1.6; opacity: 0.9; margin: 0; }
    .date { margin-left: auto; color: hsl(var(--muted-foreground)); font-size: 0.75rem; opacity: 0.7; }

    /* Care Tab */
    .care-grid-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; }
    .care-card { background: rgba(255,255,255,0.02); border: 1px solid var(--border); border-radius: 12px; padding: 24px; display: flex; flex-direction: column; align-items: center; text-align: center; gap: 16px; transition: 0.2s; position: relative; overflow: hidden; }
    .care-card::before { content: ''; position: absolute; inset: 0; background: radial-gradient(circle at center, rgba(0, 230, 255, 0.1) 0%, transparent 70%); opacity: 0; transition: 0.3s; }
    .care-card:hover { border-color: hsl(var(--neon-cyan)); transform: translateY(-3px); }
    .care-card:hover::before { opacity: 1; }
    .care-icon { width: 56px; height: 56px; display: flex; align-items: center; justify-content: center; background: rgba(0, 0, 0, 0.3); border: 1px solid rgba(255,255,255,0.1); border-radius: 50%; color: hsl(var(--neon-cyan)); margin-bottom: 4px; }
    .care-detail { display: flex; flex-direction: column; gap: 4px; position: relative; z-index: 2; }
    .care-detail strong { color: white; font-family: 'Orbitron'; font-size: 0.9rem; letter-spacing: 0.05em; }
    .care-detail span { color: hsl(var(--muted-foreground)); font-size: 0.8rem; }

    .shipping-layout { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; }
    .shipping-card { display: flex; gap: 16px; padding: 20px; background: rgba(6, 12, 24, 0.4); border: 1px solid var(--border); border-radius: 12px; }
    .shipping-card .icon-box { width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; background: rgba(0, 230, 255, 0.1); border-radius: 8px; color: hsl(var(--neon-cyan)); flex-shrink: 0; }
    .shipping-card h4 { margin: 0 0 6px; color: white; font-family: 'Orbitron'; font-size: 0.9rem; }
    .shipping-card p { margin: 0; font-size: 0.85rem; color: hsl(var(--muted-foreground)); line-height: 1.5; }
    @media (max-width: 600px) { .reviews-header { flex-direction: column; align-items: flex-start; gap: 16px; } }
    .vto-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.85); backdrop-filter: blur(12px); z-index: 2000; display: flex; align-items: center; justify-content: center; animation: fadeIn 0.3s ease; }
    .vto-modal { width: 90%; max-width: 980px; height: 85vh; background: hsl(var(--surface-panel)); border: 1px solid hsl(var(--border)); box-shadow: 0 8px 32px hsl(0 0% 0% / 0.4), inset 0 1px 0 hsl(0 0% 100% / 0.05), var(--glow-soft); border-radius: 24px; display: flex; flex-direction: column; overflow: hidden; }
    
    @media (max-width: 850px) {
       .vto-overlay { align-items: flex-end; padding: 0; } 
       .vto-modal { width: 100vw; height: 100dvh; max-height: -webkit-fill-available; border-radius: 0; border: none; } 
       .vto-content { display: flex; flex-direction: column; overflow-y: auto; height: calc(100dvh - 60px); } 
       .vto-preview-stage { min-height: 45vh; width: 100%; border-right: none; border-bottom: 1px solid var(--border); order: 1; flex-shrink: 0; } 
       .vto-sidebar { padding: 20px; gap: 20px; min-height: auto; order: 2; flex: 1; padding-bottom: 90px; } 
       .vto-cta-btn { position: fixed; bottom: 20px; left: 20px; right: 20px; width: calc(100% - 40px); z-index: 50; } 
       .vto-header { border-radius: 0; padding: 12px 16px; } 
       .vto-options-grid { grid-template-columns: 1fr 1fr; } 
       .vto-model-thumb { flex: 0 0 80px; } 
    }

    .size-guide-modal { width: 90%; max-width: 500px; background: hsl(var(--surface-panel)); border: 1px solid hsl(var(--border)); box-shadow: 0 8px 32px hsl(0 0% 0% / 0.4), inset 0 1px 0 hsl(0 0% 100% / 0.05), var(--glow-soft); border-radius: 20px; overflow: hidden; animation: fadeIn 0.3s ease; }
    .vto-header { padding: 16px 24px; border-bottom: 1px solid hsl(var(--border)); display: flex; justify-content: space-between; align-items: center; background: hsl(var(--surface-dark) / 0.95); border-radius: 24px 24px 0 0; }
    .vto-title-wrap { display: flex; align-items: center; gap: 16px; flex: 1; justify-content: center; }
    .vto-line { height: 2px; width: 60px; background: linear-gradient(90deg, transparent, hsl(var(--neon-cyan))); opacity: 0.8; }
    .vto-line.left { background: linear-gradient(90deg, transparent, hsl(var(--neon-cyan))); }
    .vto-line.right { background: linear-gradient(90deg, hsl(var(--neon-cyan)), transparent); }
    .vto-header h2 { margin: 0; font-family: 'Orbitron'; font-weight: 800; letter-spacing: 0.2em; color: hsl(var(--foreground)); text-shadow: 0 0 12px hsl(var(--neon-cyan)); font-size: 1.1rem; }
    .vto-close { background: none; border: none; color: hsl(var(--muted-foreground)); cursor: pointer; transition: 0.2s; }
    .vto-close:hover { color: hsl(var(--foreground)); transform: rotate(90deg); }
    .vto-content { flex: 1; display: grid; grid-template-columns: 1fr 1fr; overflow: hidden; }
    .vto-preview-stage { background: hsl(var(--background)); position: relative; display: flex; align-items: center; justify-content: center; border-right: 1px solid hsl(var(--border)); }
    .vto-camera-view, .vto-model-view, .vto-upload-view { width: 100%; height: 100%; position: relative; }
    .vto-video, .vto-model-img, .vto-user-img { width: 100%; height: 100%; object-fit: contain; }
    .vto-ar-overlay { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) scale(0.65); mix-blend-mode: screen; pointer-events: none; opacity: 0.9; }
    .vto-placeholder { color: hsl(var(--muted-foreground)); font-family: 'Orbitron'; letter-spacing: 0.1em; opacity: 0.8; display: flex; flex-direction: column; align-items: center; text-align: center; padding: 20px; }
    .vto-sidebar { padding: 32px; background: hsl(var(--surface-dark) / 0.8); backdrop-filter: blur(10px); display: flex; flex-direction: column; gap: 24px; overflow-y: auto; }
    .vto-options-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .vto-card-opt { background: hsl(var(--card)); border: 1px solid hsl(var(--border)); border-radius: 16px; padding: 24px 16px; cursor: pointer; text-align: center; transition: all 0.3s ease; display: flex; flex-direction: column; align-items: center; gap: 12px; height: 100%; position: relative; overflow: hidden; }
    .vto-card-opt::before { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, hsl(var(--glass)) 0%, transparent 100%); pointer-events: none; }
    .vto-card-opt:hover { border-color: hsl(var(--neon-cyan)); box-shadow: var(--glow-soft); transform: translateY(-2px); }
    .vto-card-opt.active { background: hsl(var(--neon-cyan) / 0.05); border-color: hsl(var(--neon-cyan)); box-shadow: inset 0 0 30px hsl(var(--neon-cyan) / 0.1), var(--glow-soft); }
    .vto-icon { color: hsl(var(--neon-cyan)); margin-bottom: 4px; filter: drop-shadow(0 0 8px hsl(var(--neon-cyan))); }
    .vto-opt-text h3 { margin: 0 0 6px; font-family: 'Orbitron'; font-size: 0.9rem; color: hsl(var(--foreground)); }
    .vto-opt-text span { font-size: 0.7rem; color: hsl(var(--muted-foreground)); line-height: 1.3; display: block; }
    .vto-divider { display: flex; align-items: center; justify-content: center; gap: 12px; color: hsl(var(--neon-cyan)); font-size: 0.85rem; letter-spacing: 0.1em; font-family: 'Orbitron'; text-transform: uppercase; margin: 10px 0; }
    .vto-divider .dot { width: 4px; height: 4px; background: hsl(var(--neon-cyan)); border-radius: 50%; box-shadow: 0 0 6px hsl(var(--neon-cyan)); }
    .vto-divider .text { text-shadow: 0 0 10px hsl(var(--neon-cyan)); }
    .vto-carousel-container { display: flex; align-items: center; gap: 8px; }
    .vto-carousel-arrow { background: rgba(255,255,255,0.05); border: 1px solid hsl(var(--border)); border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; color: hsl(var(--foreground)); cursor: pointer; flex-shrink: 0; transition: 0.2s; }
    .vto-carousel-arrow:hover { border-color: hsl(var(--neon-cyan)); background: hsl(var(--neon-cyan) / 0.1); }
    .vto-model-strip { 
      display: flex; gap: 12px; overflow-x: auto; padding: 10px 4px; scroll-behavior: smooth;
      scrollbar-width: none; flex: 1;
      scroll-snap-type: x mandatory;
    }
    .vto-model-strip::-webkit-scrollbar { display: none; }
    .vto-model-thumb { 
      flex: 0 0 80px; aspect-ratio: 3/4; border-radius: 12px; overflow: hidden; 
      border: 2px solid transparent; cursor: pointer; opacity: 0.6; filter: grayscale(0.6); 
      transition: all 0.3s ease; padding: 0; background: #000; position: relative;
      scroll-snap-align: start;
    }
    .vto-model-thumb:hover { opacity: 0.9; filter: grayscale(0); border-color: hsl(var(--neon-cyan) / 0.4); transform: translateY(-3px); }
    .vto-model-thumb.active { border-color: hsl(var(--neon-cyan)); opacity: 1; filter: grayscale(0); transform: scale(1.05) translateY(-3px); box-shadow: var(--glow-cyan); z-index: 2; }
    .vto-model-thumb img { width: 100%; height: 100%; object-fit: cover; }
    .vto-privacy { font-size: 0.7rem; color: hsl(var(--muted-foreground)); text-align: center; opacity: 0.6; margin-top: auto; }
    .vto-cta-btn { width: 100%; padding: 18px; background: linear-gradient(90deg, #00f0ff, #00aaff); color: #001015; border: none; border-radius: 14px; font-family: 'Orbitron'; font-weight: 800; letter-spacing: 0.1em; font-size: 1rem; cursor: pointer; transition: 0.2s; box-shadow: 0 0 30px rgba(0, 240, 255, 0.4); position: relative; overflow: hidden; }
    .vto-cta-btn::after { content: ''; position: absolute; top: 0; left: -100%; width: 50%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent); transform: skewX(-20deg); animation: shine-sweep 4s infinite 1s; }
    .vto-cta-btn:hover { box-shadow: 0 0 50px rgba(0, 240, 255, 0.7); transform: scale(1.02); }
    
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes pulse-glow { 0%, 100% { box-shadow: 0 0 20px hsl(var(--neon-cyan) / 0.4); } 50% { box-shadow: 0 0 30px hsl(var(--neon-cyan) / 0.6), 0 0 50px hsl(var(--neon-cyan) / 0.3); } }
    .vto-error-view { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: hsl(var(--background)); color: hsl(var(--foreground)); text-align: center; padding: 20px; }
    .vto-error-content { display: flex; flex-direction: column; align-items: center; gap: 12px; max-width: 280px; }
    .vto-icon-alert { color: hsl(var(--destructive)); margin-bottom: 4px; opacity: 0.9; }
    .vto-error-content p { font-size: 0.85rem; color: hsl(var(--muted-foreground)); line-height: 1.5; margin: 0; }
    .vto-error-actions { display: flex; gap: 10px; width: 100%; justify-content: center; margin-top: 8px; }
    .vto-alt-btn { background: rgba(255,255,255,0.1); border: 1px solid var(--border); border-radius: 8px; padding: 8px 12px; font-size: 0.75rem; color: white; cursor: pointer; display: flex; align-items: center; gap: 6px; font-family: 'Orbitron'; transition: 0.2s; }
    .vto-alt-btn:hover { border-color: hsl(var(--neon-cyan)); background: rgba(255,255,255,0.15); }
    .vto-loader { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,0.5); z-index: 10; backdrop-filter: blur(4px); }
    .animate-spin { animation: spin 1s linear infinite; }
  `}} />
);

const root = createRoot(document.getElementById("root")!);
root.render(<App />);