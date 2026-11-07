import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  Upload,
  Sparkles,
  X,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Heart,
  BarChart3,
  TrendingDown,
  Tag,
  Layers,
  ArrowRight,
  RotateCcw,
  ShieldCheck,
  Check,
  Zap,
  Info
} from 'lucide-react';
import { scanProduct, fetchScanSamples } from '../services/api';

export default function ProductScannerModal({
  isOpen,
  onClose,
  onSelectCategoryAndBudget,
  onAddToWishlist,
  wishlistIds = [],
  onAddToCompare,
  compareIds = []
}) {
  const [activeTab, setActiveTab] = useState('camera'); // 'camera', 'upload', 'presets'
  const [cameraStream, setCameraStream] = useState(null);
  const [cameraError, setCameraError] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

  // Upload state
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [customKeyword, setCustomKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('smartphone');

  // Scanner process state
  const [isScanning, setIsScanning] = useState(false);
  const [scanStepIndex, setScanStepIndex] = useState(0);
  const [scanResult, setScanResult] = useState(null);
  const [scanError, setScanError] = useState(null);

  // Presets
  const [presets, setPresets] = useState([]);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  const scanSteps = [
    'Scanning optical frame & analyzing visual patterns...',
    'Identifying product type, category & brand signature...',
    'Extracting technical specifications & hardware features...',
    'Cross-referencing live market pricing across platforms...',
    'Computing AI Value-for-Money alternatives & savings...'
  ];

  // Load sample presets on mount
  useEffect(() => {
    fetchScanSamples()
      .then((res) => {
        if (res.success && res.data) {
          setPresets(res.data);
        }
      })
      .catch(() => {});
  }, []);

  // Stop camera when modal closes or switching tabs
  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
      setIsCameraActive(false);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      setScanResult(null);
      setScanError(null);
      setIsScanning(false);
      setImagePreview(null);
      setSelectedImage(null);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && activeTab === 'camera' && !scanResult && !isScanning) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, activeTab, scanResult, isScanning]);

  const startCamera = async () => {
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera is not supported in this browser environment. You can upload a photo or use demo presets.');
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      setCameraStream(stream);
      setIsCameraActive(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.warn('Camera access issue:', err);
      setCameraError(err.message || 'Unable to access camera. Please allow camera permissions or upload an image.');
      setIsCameraActive(false);
    }
  };

  // Run multi-step scanner simulation animation
  const runScannerSimulation = async (scanPayload) => {
    setIsScanning(true);
    setScanError(null);
    setScanResult(null);
    stopCamera();

    // Progress ticker
    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step < scanSteps.length) {
        setScanStepIndex(step);
      }
    }, 450);

    try {
      const response = await scanProduct(scanPayload);
      clearInterval(interval);
      if (response.success) {
        setScanResult(response);
      } else {
        setScanError(response.error || 'Failed to analyze product.');
      }
    } catch (err) {
      clearInterval(interval);
      setScanError(err.message || 'Scanning failed. Please try again.');
    } finally {
      setIsScanning(false);
    }
  };

  // Capture frame from live video
  const handleCaptureFromCamera = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current || document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);

    setImagePreview(dataUrl);
    runScannerSimulation({
      image: dataUrl,
      detectedCategory: selectedCategory,
      productName: customKeyword
    });
  };

  // File Upload Handler
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file) => {
    setSelectedImage(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      setImagePreview(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleUploadSubmit = () => {
    if (!imagePreview && !customKeyword.trim()) {
      alert('Please select an image or enter a product keyword/barcode to scan.');
      return;
    }
    runScannerSimulation({
      image: imagePreview,
      imageHint: selectedImage?.name || '',
      productName: customKeyword,
      detectedCategory: selectedCategory
    });
  };

  // Preset Click Handler
  const handlePresetClick = (preset) => {
    setImagePreview(preset.image);
    runScannerSimulation({
      demoId: preset.id
    });
  };

  // Reset Scanner
  const handleResetScanner = () => {
    setScanResult(null);
    setScanError(null);
    setImagePreview(null);
    setSelectedImage(null);
    setCustomKeyword('');
    if (activeTab === 'camera') {
      startCamera();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      style={{ backgroundColor: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(6px)', zIndex: 1055 }}
    >
      <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content border-0 shadow-2xl rounded-4 overflow-hidden">
          {/* Modal Header */}
          <div className="modal-header bg-dark text-white px-4 py-3 border-0">
            <div className="d-flex align-items-center gap-3">
              <span className="p-2 rounded-3 bg-primary text-white d-inline-flex shadow-sm">
                <Camera size={22} />
              </span>
              <div>
                <h5 className="modal-title fw-bold mb-0 d-flex align-items-center gap-2">
                  <span>AI Product Scanner & Recommender</span>
                  <span className="badge bg-primary text-white fs-7 py-1 px-2 rounded-pill">
                    Vision AI
                  </span>
                </h5>
                <small className="text-white-50">
                  Scan any product to detect its <strong>Type</strong>, <strong>Price</strong>, <strong>Features</strong>, and get smart budget recommendations!
                </small>
              </div>
            </div>
            <button
              type="button"
              className="btn btn-close btn-close-white"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>

          {/* Modal Body */}
          <div className="modal-body p-4 bg-light">
            {/* If Scanning is in progress */}
            {isScanning && (
              <div className="text-center py-5">
                <div className="position-relative d-inline-block mb-4">
                  <div
                    className="spinner-border text-primary"
                    style={{ width: '4rem', height: '4rem' }}
                    role="status"
                  ></div>
                  <div
                    className="position-absolute top-50 start-50 translate-middle text-primary"
                  >
                    <Sparkles size={24} />
                  </div>
                </div>
                <h4 className="fw-bold text-dark mb-2">Analyzing Product with AI Vision</h4>
                <p className="text-primary fw-semibold fs-6 mb-3">
                  {scanSteps[scanStepIndex]}
                </p>
                <div className="progress mx-auto" style={{ height: '8px', maxWidth: '350px' }}>
                  <div
                    className="progress-bar progress-bar-striped progress-bar-animated bg-primary"
                    role="progressbar"
                    style={{ width: `${((scanStepIndex + 1) / scanSteps.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* If Error Occurred */}
            {scanError && !isScanning && (
              <div className="alert alert-danger d-flex align-items-center justify-content-between p-3 rounded-3 shadow-sm mb-4">
                <div className="d-flex align-items-center gap-2">
                  <AlertCircle size={20} />
                  <span>{scanError}</span>
                </div>
                <button className="btn btn-outline-danger btn-sm" onClick={handleResetScanner}>
                  Try Again
                </button>
              </div>
            )}

            {/* SCANNER INPUT VIEW (When no result is loaded yet and not scanning) */}
            {!scanResult && !isScanning && (
              <div>
                {/* Navigation Tabs */}
                <ul className="nav nav-pills nav-fill bg-white p-2 rounded-4 shadow-sm mb-4 border">
                  <li className="nav-item">
                    <button
                      className={`nav-link fw-bold rounded-3 d-flex align-items-center justify-content-center gap-2 ${
                        activeTab === 'camera' ? 'active bg-primary' : 'text-dark'
                      }`}
                      onClick={() => setActiveTab('camera')}
                    >
                      <Camera size={18} />
                      <span>Live Camera Scanner</span>
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link fw-bold rounded-3 d-flex align-items-center justify-content-center gap-2 ${
                        activeTab === 'upload' ? 'active bg-primary' : 'text-dark'
                      }`}
                      onClick={() => setActiveTab('upload')}
                    >
                      <Upload size={18} />
                      <span>Upload Product Photo</span>
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link fw-bold rounded-3 d-flex align-items-center justify-content-center gap-2 ${
                        activeTab === 'presets' ? 'active bg-primary' : 'text-dark'
                      }`}
                      onClick={() => setActiveTab('presets')}
                    >
                      <Zap size={18} />
                      <span>Instant Demo / Viva Presets</span>
                    </button>
                  </li>
                </ul>

                {/* TAB 1: Live Camera Scanner */}
                {activeTab === 'camera' && (
                  <div className="bg-white p-4 rounded-4 shadow-sm border text-center">
                    {cameraError ? (
                      <div className="py-4">
                        <div className="p-3 bg-warning bg-opacity-10 rounded-4 text-warning-emphasis max-w-500 mx-auto mb-3">
                          <AlertCircle size={32} className="mb-2" />
                          <h6 className="fw-bold mb-1">Camera Permission or Device Notice</h6>
                          <p className="small mb-0">{cameraError}</p>
                        </div>
                        <p className="text-muted small">
                          Don't worry! You can easily <strong>Upload a Photo</strong> or click any of the <strong>Demo Presets</strong> below to test the full AI recommendation features.
                        </p>
                        <div className="d-flex justify-content-center gap-2 mt-3">
                          <button
                            type="button"
                            className="btn btn-outline-primary"
                            onClick={startCamera}
                          >
                            <RotateCcw size={16} className="me-1" /> Retry Camera
                          </button>
                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() => setActiveTab('presets')}
                          >
                            Try Instant Demo Presets
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        {/* Camera Viewfinder Box */}
                        <div
                          className="position-relative mx-auto rounded-4 overflow-hidden shadow-inner bg-black"
                          style={{
                            maxWidth: '560px',
                            height: '340px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover'
                            }}
                          />

                          {/* Optical Scanner Target Frame Overlay */}
                          <div
                            className="position-absolute top-50 start-50 translate-middle border border-2 border-primary rounded-4"
                            style={{
                              width: '78%',
                              height: '70%',
                              boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.45)',
                              pointerEvents: 'none'
                            }}
                          >
                            {/* Scanning Laser Beam */}
                            <div
                              className="position-absolute start-0 end-0 bg-primary opacity-75"
                              style={{
                                height: '2px',
                                boxShadow: '0 0 12px 2px #2563eb',
                                animation: 'scannerLine 2s infinite ease-in-out'
                              }}
                            ></div>
                          </div>

                          <div
                            className="position-absolute top-0 start-0 m-3 px-2 py-1 rounded-pill bg-black bg-opacity-70 text-white small d-flex align-items-center gap-1"
                            style={{ fontSize: '0.75rem' }}
                          >
                            <span className="p-1 rounded-circle bg-danger animate-pulse d-inline-block"></span>
                            <span>Live Optical Viewfinder</span>
                          </div>
                        </div>

                        {/* Camera Controls */}
                        <div className="mt-4 d-flex justify-content-center align-items-center gap-3">
                          <button
                            type="button"
                            className="btn btn-primary btn-lg px-4 py-2 rounded-pill fw-bold shadow d-flex align-items-center gap-2"
                            onClick={handleCaptureFromCamera}
                            disabled={!isCameraActive}
                          >
                            <Camera size={20} />
                            <span>Capture & Scan Product</span>
                          </button>
                        </div>
                        <p className="text-muted small mt-2 mb-0">
                          Align your product box, label, or device inside the center box and click capture.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 2: Upload Photo */}
                {activeTab === 'upload' && (
                  <div className="bg-white p-4 rounded-4 shadow-sm border">
                    <div className="row g-4 align-items-center">
                      <div className="col-md-6">
                        {/* Dropzone */}
                        <div
                          className="border-2 border-dashed rounded-4 p-4 text-center cursor-pointer bg-light position-relative"
                          style={{ borderColor: '#cbd5e1', minHeight: '260px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <input
                            type="file"
                            ref={fileInputRef}
                            className="d-none"
                            accept="image/*"
                            onChange={handleFileChange}
                          />

                          {imagePreview ? (
                            <div className="position-relative w-100">
                              <img
                                src={imagePreview}
                                alt="Product Preview"
                                className="rounded-3 shadow-sm"
                                style={{ maxHeight: '200px', maxWidth: '100%', objectFit: 'contain' }}
                              />
                              <div className="mt-2 text-primary small fw-semibold">
                                Click to replace image
                              </div>
                            </div>
                          ) : (
                            <div>
                              <div className="p-3 bg-primary bg-opacity-10 text-primary rounded-circle d-inline-flex mb-3">
                                <Upload size={32} />
                              </div>
                              <h6 className="fw-bold mb-1">Click or Drag Product Photo Here</h6>
                              <p className="text-muted small mb-0">
                                Supports JPG, PNG, WEBP from your phone camera or gallery
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="p-3 bg-light rounded-4 border">
                          <h6 className="fw-bold mb-3 text-dark d-flex align-items-center gap-2">
                            <Tag size={16} className="text-primary" />
                            <span>Optional Clues for Faster Matching</span>
                          </h6>

                          <div className="mb-3">
                            <label className="form-label small fw-semibold text-muted">
                              Product Category:
                            </label>
                            <select
                              className="form-select"
                              value={selectedCategory}
                              onChange={(e) => setSelectedCategory(e.target.value)}
                            >
                              <option value="smartphone">📱 Smartphone</option>
                              <option value="laptop">💻 Laptop</option>
                              <option value="headphones">🎧 Headphones / Audio</option>
                              <option value="smartwatch">⌚ Smartwatch</option>
                              <option value="tablet">📲 Tablet</option>
                              <option value="shoes">👟 Shoes / Footwear</option>
                            </select>
                          </div>

                          <div className="mb-3">
                            <label className="form-label small fw-semibold text-muted">
                              Product Name, Brand or Barcode (Optional):
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="e.g. Samsung Galaxy, HP Laptop, Nike Shoes"
                              value={customKeyword}
                              onChange={(e) => setCustomKeyword(e.target.value)}
                            />
                            <div className="form-text small">
                              Leave empty to let AI vision automatically classify the image!
                            </div>
                          </div>

                          <button
                            type="button"
                            className="btn btn-primary w-100 fw-bold py-2 rounded-pill shadow-sm d-flex align-items-center justify-content-center gap-2"
                            onClick={handleUploadSubmit}
                            disabled={!imagePreview && !customKeyword.trim()}
                          >
                            <Sparkles size={18} />
                            <span>Scan & Analyze Product</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 3: Instant Demo / Viva Presets */}
                {activeTab === 'presets' && (
                  <div className="bg-white p-4 rounded-4 shadow-sm border">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <div>
                        <h6 className="fw-bold mb-1 text-dark">
                          1-Click Demo Presets for Viva Examination & Testing
                        </h6>
                        <small className="text-muted">
                          Click any preset item to simulate scanning an authentic boxed product instantly.
                        </small>
                      </div>
                      <span className="badge bg-success-subtle text-success fw-bold px-3 py-2 rounded-pill">
                        Ready to Test
                      </span>
                    </div>

                    <div className="row g-3">
                      {presets.map((preset) => (
                        <div key={preset.id} className="col-lg-4 col-md-6">
                          <div
                            className="preset-scan-card p-3 rounded-4 border bg-light h-100 cursor-pointer transition hover-shadow"
                            onClick={() => handlePresetClick(preset)}
                          >
                            <div className="d-flex align-items-center gap-3">
                              <img
                                src={preset.image}
                                alt={preset.name}
                                className="rounded-3 border"
                                style={{ width: '64px', height: '64px', objectFit: 'cover' }}
                              />
                              <div className="flex-grow-1 overflow-hidden">
                                <span className="badge bg-primary-subtle text-primary small mb-1">
                                  {preset.category}
                                </span>
                                <div className="fw-bold text-dark text-truncate small">
                                  {preset.name}
                                </div>
                                <div className="text-primary fw-bold small">
                                  ₹{preset.estimatedPrice.toLocaleString('en-IN')}
                                </div>
                              </div>
                            </div>
                            <div className="mt-2 pt-2 border-top d-flex align-items-center justify-content-between text-muted small">
                              <span>{preset.productType}</span>
                              <span className="text-primary fw-semibold d-flex align-items-center gap-1">
                                Scan <ArrowRight size={14} />
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* SCANNER RESULT VIEW */}
            {scanResult && !isScanning && (
              <div>
                {/* Reset & Status bar */}
                <div className="d-flex flex-wrap align-items-center justify-content-between bg-white p-3 rounded-4 shadow-sm border mb-4">
                  <div className="d-flex align-items-center gap-2">
                    <span className="p-2 rounded-circle bg-success bg-opacity-10 text-success d-inline-flex">
                      <CheckCircle2 size={20} />
                    </span>
                    <div>
                      <h6 className="fw-bold mb-0 text-dark">
                        Product Identified: {scanResult.scannedProduct.name}
                      </h6>
                      <small className="text-muted">
                        Confidence: <strong className="text-success">{scanResult.scannedProduct.confidence || '96%'}</strong> • Verified Analysis
                      </small>
                    </div>
                  </div>

                  <div className="d-flex gap-2 mt-2 mt-md-0">
                    <button
                      type="button"
                      className="btn btn-outline-secondary btn-sm rounded-pill d-flex align-items-center gap-1"
                      onClick={handleResetScanner}
                    >
                      <RotateCcw size={14} />
                      <span>Scan Another Item</span>
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm rounded-pill d-flex align-items-center gap-1"
                      onClick={() => {
                        onSelectCategoryAndBudget(
                          scanResult.scannedProduct.estimatedPrice,
                          scanResult.scannedProduct.category
                        );
                        onClose();
                      }}
                    >
                      <span>Apply to Store Filters</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>

                {/* 1. SCANNED PRODUCT BREAKDOWN: TYPE, PRICE & FEATURES */}
                <div className="card border-0 shadow-sm rounded-4 mb-4 overflow-hidden">
                  <div className="card-header bg-primary text-white p-3 d-flex align-items-center justify-content-between">
                    <h6 className="fw-bold mb-0 d-flex align-items-center gap-2">
                      <Sparkles size={18} />
                      <span>Scanned Product Analysis (Type, Price & Specifications)</span>
                    </h6>
                    <span className="badge bg-white text-primary fw-bold">
                      Detected Profile
                    </span>
                  </div>

                  <div className="card-body p-4 bg-white">
                    <div className="row g-4 align-items-start">
                      {/* Product Visual */}
                      <div className="col-md-4 text-center">
                        <div className="position-relative rounded-4 overflow-hidden border p-2 bg-light shadow-sm">
                          <img
                            src={scanResult.scannedProduct.image}
                            alt={scanResult.scannedProduct.name}
                            className="img-fluid rounded-3"
                            style={{ maxHeight: '220px', objectFit: 'contain' }}
                          />
                          <span
                            className="position-absolute top-0 start-0 m-2 badge bg-dark text-white rounded-pill px-3 py-2 small"
                          >
                            {scanResult.scannedProduct.category.toUpperCase()}
                          </span>
                        </div>

                        {/* Price Tag Highlight */}
                        <div className="mt-3 p-3 bg-primary bg-opacity-10 rounded-4 text-center">
                          <small className="text-muted fw-bold d-block text-uppercase">
                            Estimated Market Price
                          </small>
                          <div className="fs-3 fw-bold text-primary">
                            ₹{scanResult.scannedProduct.estimatedPrice?.toLocaleString('en-IN')}
                          </div>
                          {scanResult.scannedProduct.originalPrice && (
                            <small className="text-muted text-decoration-line-through">
                              MRP: ₹{scanResult.scannedProduct.originalPrice?.toLocaleString('en-IN')}
                            </small>
                          )}
                        </div>
                      </div>

                      {/* Details & Features List */}
                      <div className="col-md-8">
                        <div className="d-flex flex-wrap gap-2 mb-2">
                          {/* PRODUCT TYPE BADGE */}
                          <div className="badge bg-info-subtle text-info-emphasis px-3 py-2 rounded-pill fs-7 fw-bold d-inline-flex align-items-center gap-1">
                            <Layers size={14} />
                            <span>Type: {scanResult.scannedProduct.productType || scanResult.scannedProduct.category}</span>
                          </div>

                          {/* BRAND BADGE */}
                          {scanResult.scannedProduct.brand && (
                            <div className="badge bg-secondary-subtle text-secondary px-3 py-2 rounded-pill fs-7 fw-bold">
                              Brand: {scanResult.scannedProduct.brand}
                            </div>
                          )}
                        </div>

                        <h4 className="fw-bold text-dark mb-3">
                          {scanResult.scannedProduct.name}
                        </h4>

                        {/* Key Features Bullet Points */}
                        <div className="mb-4">
                          <h6 className="fw-bold text-dark d-flex align-items-center gap-2 mb-2">
                            <CheckCircle2 size={16} className="text-success" />
                            <span>Key Hardware & Software Features:</span>
                          </h6>
                          <div className="row g-2">
                            {scanResult.scannedProduct.features?.map((feat, idx) => (
                              <div key={idx} className="col-12">
                                <div className="p-2 bg-light rounded-3 border d-flex align-items-center gap-2 small">
                                  <span className="p-1 rounded-circle bg-primary bg-opacity-10 text-primary d-inline-flex flex-shrink-0">
                                    <Check size={12} />
                                  </span>
                                  <span className="text-dark fw-medium">{feat}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* AI Budget Verdict */}
                        {scanResult.scannedProduct.budgetVerdict && (
                          <div className="p-3 bg-warning bg-opacity-10 rounded-4 border border-warning-subtle mb-3">
                            <div className="d-flex align-items-center gap-2 mb-1">
                              <Info size={16} className="text-warning-emphasis" />
                              <strong className="text-warning-emphasis small text-uppercase">
                                AI Value & Budget Verdict:
                              </strong>
                            </div>
                            <p className="small text-dark mb-0">
                              {scanResult.scannedProduct.budgetVerdict}
                            </p>
                          </div>
                        )}

                        {/* Price comparison across platforms */}
                        {scanResult.scannedProduct.priceComparison && (
                          <div>
                            <small className="text-muted fw-bold d-block mb-1">
                              Marketplace Price Comparison:
                            </small>
                            <div className="d-flex flex-wrap gap-2">
                              {scanResult.scannedProduct.priceComparison.map((p, idx) => (
                                <div
                                  key={idx}
                                  className={`px-3 py-2 rounded-3 border small ${
                                    p.isBestPrice ? 'bg-success-subtle border-success text-success fw-bold' : 'bg-light text-muted'
                                  }`}
                                >
                                  <span>{p.platform}: </span>
                                  <strong>₹{p.price?.toLocaleString('en-IN')}</strong>
                                  <span className="ms-1 badge bg-secondary-subtle text-dark" style={{ fontSize: '0.7rem' }}>
                                    {p.badge}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. AI RECOMMENDED ALTERNATIVES SECTION */}
                <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                  <div className="card-header bg-dark text-white p-3 d-flex align-items-center justify-content-between">
                    <div>
                      <h6 className="fw-bold mb-0 d-flex align-items-center gap-2 text-white">
                        <Sparkles size={18} className="text-warning" />
                        <span>AI Recommended Budget Alternatives & Better Value Picks</span>
                      </h6>
                      <small className="text-white-50">
                        Based on your scanned {scanResult.scannedProduct.productType}, our algorithm ranked these smarter options:
                      </small>
                    </div>
                    <span className="badge bg-warning text-dark fw-bold px-3 py-2 rounded-pill">
                      {scanResult.recommendedAlternatives.length} Smart Alternatives Found
                    </span>
                  </div>

                  <div className="card-body p-4 bg-light">
                    <div className="row g-3">
                      {scanResult.recommendedAlternatives.map((alt) => {
                        const isWish = wishlistIds.includes(alt.id);
                        const isComp = compareIds.includes(alt.id);
                        const bestDeal = alt.platformLinks?.find((l) => l.isBestPrice) || alt.platformLinks?.[0];

                        return (
                          <div key={alt.id} className="col-lg-6">
                            <div className="card border h-100 rounded-4 p-3 bg-white shadow-sm transition hover-shadow d-flex flex-column">
                              {/* Reason Badge */}
                              <div className="d-flex align-items-center justify-content-between mb-2">
                                <span className={`badge ${alt.isCheaper ? 'bg-success text-white' : 'bg-primary text-white'} px-3 py-2 rounded-pill small fw-bold`}>
                                  {alt.reasonBadge}
                                </span>
                                {alt.score && (
                                  <span className="badge bg-warning-subtle text-warning-emphasis fw-bold px-2 py-1">
                                    ★ {alt.score}/100 VFM
                                  </span>
                                )}
                              </div>

                              <div className="d-flex gap-3 align-items-center mb-3">
                                <img
                                  src={alt.image}
                                  alt={alt.name}
                                  className="rounded-3 border"
                                  style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                                />
                                <div className="flex-grow-1 overflow-hidden">
                                  <h6 className="fw-bold text-dark mb-1 text-truncate" title={alt.name}>
                                    {alt.name}
                                  </h6>
                                  <div className="d-flex align-items-center gap-2">
                                    <span className="text-primary fw-bold fs-5">
                                      ₹{alt.price?.toLocaleString('en-IN')}
                                    </span>
                                    {alt.originalPrice && (
                                      <span className="text-muted small text-decoration-line-through">
                                        ₹{alt.originalPrice.toLocaleString('en-IN')}
                                      </span>
                                    )}
                                  </div>
                                  <small className="text-muted d-block text-truncate">
                                    Rating: {alt.rating}★ ({alt.reviews?.toLocaleString('en-IN')} reviews)
                                  </small>
                                </div>
                              </div>

                              {/* Specs snippet */}
                              {alt.specs && alt.specs.length > 0 && (
                                <div className="mb-3 flex-grow-1">
                                  <ul className="list-unstyled mb-0 small text-secondary">
                                    {alt.specs.slice(0, 2).map((s, i) => (
                                      <li key={i} className="text-truncate d-flex align-items-center gap-1 mb-1">
                                        <span className="text-primary">•</span>
                                        <span>{s}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {/* Action Buttons */}
                              <div className="pt-2 border-top d-flex flex-wrap gap-2 align-items-center justify-content-between mt-auto">
                                <div className="d-flex gap-1">
                                  <button
                                    type="button"
                                    className={`btn btn-sm ${isWish ? 'btn-danger' : 'btn-outline-danger'} rounded-pill px-3`}
                                    onClick={() => onAddToWishlist(alt)}
                                    title="Add to Wishlist"
                                  >
                                    <Heart size={14} className={isWish ? 'fill-white' : ''} />
                                  </button>
                                  <button
                                    type="button"
                                    className={`btn btn-sm ${isComp ? 'btn-primary' : 'btn-outline-primary'} rounded-pill px-3`}
                                    onClick={() => onAddToCompare(alt)}
                                    title="Compare with other products"
                                  >
                                    <BarChart3 size={14} />
                                  </button>
                                </div>

                                {bestDeal && (
                                  <a
                                    href={bestDeal.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-sm btn-primary rounded-pill px-3 d-flex align-items-center gap-1 fw-bold"
                                  >
                                    <span>Buy on {bestDeal.platform}</span>
                                    <ExternalLink size={12} />
                                  </a>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="modal-footer bg-white border-top px-4 py-3 d-flex justify-content-between">
            <div className="text-muted small">
              BudgetWise.AI • Multi-Platform Budget & Feature Extraction System
            </div>
            <button type="button" className="btn btn-secondary rounded-pill px-4" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
      <canvas ref={canvasRef} className="d-none" />
    </div>
  );
}
