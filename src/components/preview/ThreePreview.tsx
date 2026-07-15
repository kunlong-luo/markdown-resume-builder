import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Html, OrbitControls, Sparkles, Float } from '@react-three/drei';
import * as THREE from 'three';
import { RotateCw, RefreshCw, Compass, Sun, Moon, Sparkle, Eye, HelpCircle, Box, Maximize2, ZoomIn } from 'lucide-react';

interface ThreePreviewProps {
  children: React.ReactNode;
  lang: 'zh' | 'en';
}

interface CameraPreset {
  position: [number, number, number];
  target: [number, number, number];
}

const PRESETS: Record<'front' | 'angle' | 'detail', CameraPreset> = {
  front: { position: [0, 0, 8.5], target: [0, 0, 0] },
  angle: { position: [4.2, 1.8, 6.8], target: [0, 0, 0] },
  detail: { position: [0, 2.2, 4.2], target: [0, 2.2, 0] }
};

// Smooth Camera Controller that manages custom presets transition and hands back control to OrbitControls
function CameraManager({ 
  preset, 
  presetTrigger,
  orbitRef 
}: { 
  preset: 'front' | 'angle' | 'detail'; 
  presetTrigger: number;
  orbitRef: React.RefObject<any>;
}) {
  const { camera } = useThree();
  const [animating, setAnimating] = useState(false);
  const animationFrames = useRef(0);
  const targetConfig = useRef(PRESETS[preset]);

  useEffect(() => {
    targetConfig.current = PRESETS[preset];
    setAnimating(true);
    animationFrames.current = 0;
  }, [preset, presetTrigger]);

  useFrame(() => {
    if (!animating || !orbitRef.current) return;

    const tPos = new THREE.Vector3(...targetConfig.current.position);
    const tLook = new THREE.Vector3(...targetConfig.current.target);

    // Smoothly lerp camera position and orbit look target
    camera.position.lerp(tPos, 0.08);
    orbitRef.current.target.lerp(tLook, 0.08);
    orbitRef.current.update();

    animationFrames.current += 1;
    // Hand full manual dragging control back to user after 45 frames
    if (animationFrames.current > 45) {
      setAnimating(false);
    }
  });

  return null;
}

// Interactive Scene Controller to handle smooth cursor follow / parallax
function InteractiveScene({ 
  children, 
  autoRotate, 
  enableMouseParallax, 
}: { 
  children: React.ReactNode; 
  autoRotate: boolean; 
  enableMouseParallax: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const targetRotation = useRef({ x: 0, y: 0 });

  // Mouse move handler normalized to [-1, 1]
  useEffect(() => {
    if (!enableMouseParallax) return;

    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      // Soft limits for professional parallax micro-movement
      targetRotation.current.y = x * 0.15;
      targetRotation.current.x = y * 0.12;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [enableMouseParallax]);

  useFrame((state) => {
    if (!groupRef.current) return;

    // Smoothly interpolate rotation
    if (enableMouseParallax) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y, 
        targetRotation.current.y, 
        0.05
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x, 
        targetRotation.current.x, 
        0.05
      );
    } else if (autoRotate) {
      // Gentle full 360 showcase spin
      groupRef.current.rotation.y += 0.003;
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, 0, 0.05);
    } else {
      // Return smoothly to base position
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, 0, 0.08);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, 0, 0.08);
    }
  });

  return (
    <group ref={groupRef}>
      {children}
    </group>
  );
}

// Spotlight that dynamically glides to follow the user cursor, creating realistic paper/metallic specular gloss
function InteractiveSpotlight({ style }: { style: 'studio' | 'sunset' | 'dark' }) {
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    if (!lightRef.current) return;
    const targetX = state.pointer.x * 6;
    const targetY = state.pointer.y * 6;
    lightRef.current.position.x = THREE.MathUtils.lerp(lightRef.current.position.x, targetX, 0.08);
    lightRef.current.position.y = THREE.MathUtils.lerp(lightRef.current.position.y, targetY, 0.08);
  });

  const lightColor = style === 'sunset' ? '#f59e0b' : style === 'dark' ? '#818cf8' : '#38bdf8';
  return (
    <pointLight 
      ref={lightRef} 
      position={[0, 0, 5.5]} 
      intensity={style === 'dark' ? 1.4 : 1.8} 
      color={lightColor} 
      distance={14}
      decay={2.2}
    />
  );
}

// Colorful animated floating abstract background meshes
function FloatingBackdrop({ style }: { style: 'studio' | 'sunset' | 'dark' }) {
  const spheresRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!spheresRef.current) return;
    const time = state.clock.getElapsedTime();
    spheresRef.current.children.forEach((child, index) => {
      const speed = 0.2 + (index * 0.05);
      const scale = 1 + Math.sin(time * speed + index) * 0.1;
      child.scale.set(scale, scale, scale);
      child.position.y += Math.sin(time * speed + index) * 0.002;
    });
  });

  const getSphereColors = () => {
    if (style === 'sunset') return ['#f59e0b', '#ef4444', '#f43f5e', '#ec4899'];
    if (style === 'dark') return ['#475569', '#3b82f6', '#6366f1', '#1e293b'];
    return ['#818cf8', '#60a5fa', '#a5b4fc', '#e0e7ff'];
  };

  const colors = getSphereColors();

  return (
    <group ref={spheresRef}>
      {/* Soft floating background blobs */}
      <mesh position={[-6, 4, -8]}>
        <sphereGeometry args={[2.5, 32, 32]} />
        <meshBasicMaterial color={colors[0]} transparent opacity={0.15} />
      </mesh>
      <mesh position={[6, -4, -10]}>
        <sphereGeometry args={[3, 32, 32]} />
        <meshBasicMaterial color={colors[1]} transparent opacity={0.12} />
      </mesh>
      <mesh position={[-5, -5, -7]}>
        <sphereGeometry args={[1.8, 32, 32]} />
        <meshBasicMaterial color={colors[2]} transparent opacity={0.1} />
      </mesh>
      <mesh position={[5, 5, -9]}>
        <sphereGeometry args={[2.2, 32, 32]} />
        <meshBasicMaterial color={colors[3]} transparent opacity={0.14} />
      </mesh>
    </group>
  );
}

// Error Boundary for WebGL/Canvas to ensure absolute robustness
class CanvasErrorBoundary extends React.Component<{ children: React.ReactNode; fallback: React.ReactNode }, { hasError: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error('ThreeJS Canvas Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

export function ThreePreview({ children, lang }: ThreePreviewProps) {
  const [autoRotate, setAutoRotate] = useState<boolean>(false);
  const [mouseParallax, setMouseParallax] = useState<boolean>(true);
  const [lightingStyle, setLightingStyle] = useState<'studio' | 'sunset' | 'dark'>('studio');
  const [activePreset, setActivePreset] = useState<'front' | 'angle' | 'detail'>('front');
  const [presetTrigger, setPresetTrigger] = useState<number>(0);
  const [showHelp, setShowHelp] = useState<boolean>(true);
  const orbitRef = useRef<any>(null);

  const isEn = lang === 'en';

  const t = {
    title: isEn ? '3D Immersive Studio' : '3D 拟真排版空间',
    rotate: isEn ? 'Auto Spin' : '自动旋转',
    parallax: isEn ? 'Mouse Follow' : '指针跟踪',
    reset: isEn ? 'Reset View' : '重置视角',
    styleStudio: isEn ? 'Cool Studio' : '冰川极客',
    styleSunset: isEn ? 'Sunset Warmth' : '落日余晖',
    styleDark: isEn ? 'Twilight Dark' : '暮光深渊',
    helpDrag: isEn ? 'Drag mouse to rotate paper' : '拖拽鼠标以 360° 旋转纸张',
    helpScroll: isEn ? 'Scroll wheel to zoom paper' : '滚动滚轮以无级放大缩小',
    helpDouble: isEn ? 'Right click to pan canvas' : '右键拖拽以平移 3D 画布',
    helpClose: isEn ? 'Got it' : '知道了',
    webglFallback: isEn ? '3D View failed to initialize, falling back to 2D standard preview.' : '3D 拟真空间加载失败，正在自动切回标准 2D 预览',
    presetFront: isEn ? 'Front' : '正面',
    presetAngle: isEn ? 'Showcase' : '展示',
    presetDetail: isEn ? 'Detail' : '特写',
  };

  const handlePresetSelect = (preset: 'front' | 'angle' | 'detail') => {
    setActivePreset(preset);
    setPresetTrigger(prev => prev + 1);
    // Turn off automatic rotation when examining details to prevent user disorientation
    if (preset === 'detail') {
      setAutoRotate(false);
    }
  };

  // Turn off auto-rotate when mouse parallax is enabled, and vice-versa
  const handleToggleAutoRotate = () => {
    setAutoRotate(prev => {
      const next = !prev;
      if (next) setMouseParallax(false);
      return next;
    });
  };

  const handleToggleParallax = () => {
    setMouseParallax(prev => {
      const next = !prev;
      if (next) setAutoRotate(false);
      return next;
    });
  };

  // Fallback rendering in case WebGL is not supported
  const fallbackUI = (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 border border-slate-200/60 rounded-xl max-w-md mx-auto my-12 text-center shadow-sm">
      <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-500 mb-4">
        <HelpCircle className="w-6 h-6" />
      </div>
      <p className="text-sm font-medium text-slate-700 leading-relaxed">
        {t.webglFallback}
      </p>
    </div>
  );

  return (
    <div className="relative w-full h-full flex flex-col bg-slate-950 overflow-hidden select-none">
      {/* 3D Toolbar Container - Polished segmented styling inspired by premium CAD & Figma tools */}
      <div className="absolute top-4 left-4 right-4 z-40 flex flex-col xl:flex-row xl:items-center justify-between gap-3 bg-slate-900/85 backdrop-blur-md border border-slate-800 rounded-xl px-4 py-3 shadow-2xl select-none transition-all">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse shadow-[0_0_10px_#3b82f6]" />
          <span className="text-xs font-black text-slate-100 tracking-wider uppercase">{t.title}</span>
        </div>

        <div className="flex items-center flex-wrap gap-2.5">
          {/* Segmented Camera Presets Controller */}
          <div className="flex items-center bg-slate-950/80 p-0.5 rounded-lg border border-slate-800">
            <button
              onClick={() => handlePresetSelect('front')}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md text-[10px] font-bold transition-all cursor-pointer ${
                activePreset === 'front'
                  ? 'bg-slate-800 text-blue-400 shadow-[0_1px_4px_rgba(0,0,0,0.4)]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{t.presetFront}</span>
            </button>
            <button
              onClick={() => handlePresetSelect('angle')}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md text-[10px] font-bold transition-all cursor-pointer ${
                activePreset === 'angle'
                  ? 'bg-slate-800 text-blue-400 shadow-[0_1px_4px_rgba(0,0,0,0.4)]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Box className="w-3.5 h-3.5" />
              <span>{t.presetAngle}</span>
            </button>
            <button
              onClick={() => handlePresetSelect('detail')}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md text-[10px] font-bold transition-all cursor-pointer ${
                activePreset === 'detail'
                  ? 'bg-slate-800 text-blue-400 shadow-[0_1px_4px_rgba(0,0,0,0.4)]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ZoomIn className="w-3.5 h-3.5" />
              <span>{t.presetDetail}</span>
            </button>
          </div>

          <div className="h-4 w-[1px] bg-slate-850 hidden sm:block" />

          {/* Interactive Modes */}
          <div className="flex items-center gap-2">
            {/* Parallax Follow toggle */}
            <button
              onClick={handleToggleParallax}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-extrabold border transition-all cursor-pointer ${
                mouseParallax
                  ? 'bg-blue-600/90 border-blue-500 text-white shadow-[0_2px_8px_rgba(37,99,235,0.4)]'
                  : 'bg-slate-800 border-slate-700/60 text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>{t.parallax}</span>
            </button>

            {/* Auto Rotate toggle */}
            <button
              onClick={handleToggleAutoRotate}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-extrabold border transition-all cursor-pointer ${
                autoRotate
                  ? 'bg-blue-600/90 border-blue-500 text-white shadow-[0_2px_8px_rgba(37,99,235,0.4)]'
                  : 'bg-slate-800 border-slate-700/60 text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>{t.rotate}</span>
            </button>
          </div>

          <div className="h-4 w-[1px] bg-slate-850 hidden sm:block" />

          {/* Lighting Style Selectors */}
          <div className="flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-800">
            <button
              onClick={() => setLightingStyle('studio')}
              className={`px-2.5 py-1.5 rounded-md text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                lightingStyle === 'studio'
                  ? 'bg-slate-800 text-blue-400 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title={t.styleStudio}
            >
              <Sun className="w-3.5 h-3.5" />
              <span className="hidden xs:inline text-[9px]">{isEn ? 'Studio' : '极客'}</span>
            </button>
            <button
              onClick={() => setLightingStyle('sunset')}
              className={`px-2.5 py-1.5 rounded-md text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                lightingStyle === 'sunset'
                  ? 'bg-slate-800 text-amber-400 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title={t.styleSunset}
            >
              <Sparkle className="w-3.5 h-3.5" />
              <span className="hidden xs:inline text-[9px]">{isEn ? 'Sunset' : '落日'}</span>
            </button>
            <button
              onClick={() => setLightingStyle('dark')}
              className={`px-2.5 py-1.5 rounded-md text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                lightingStyle === 'dark'
                  ? 'bg-slate-800 text-indigo-400 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title={t.styleDark}
            >
              <Moon className="w-3.5 h-3.5" />
              <span className="hidden xs:inline text-[9px]">{isEn ? 'Twilight' : '暮光'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Floating Help Card */}
      {showHelp && (
        <div className="absolute bottom-4 left-4 right-4 md:right-auto md:w-80 z-40 bg-slate-900/90 backdrop-blur-md border border-slate-800 shadow-2xl rounded-xl p-4 select-none animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-blue-400" />
              <h4 className="text-xs font-extrabold text-slate-100 tracking-wide uppercase">{isEn ? '3D Guide' : '3D 操作指南'}</h4>
            </div>
            <button 
              onClick={() => setShowHelp(false)}
              className="text-[10px] text-blue-400 hover:text-blue-300 font-extrabold cursor-pointer uppercase tracking-wider"
            >
              {t.helpClose}
            </button>
          </div>
          <div className="mt-3 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-[11px] text-slate-300">
              <span className="text-blue-400/80 font-mono">✦</span>
              <span>{t.helpDrag}</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-300">
              <span className="text-blue-400/80 font-mono">✦</span>
              <span>{t.helpScroll}</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-300">
              <span className="text-blue-400/80 font-mono">✦</span>
              <span>{t.helpDouble}</span>
            </div>
          </div>
        </div>
      )}

      {/* WebGL 3D Scene */}
      <div className="flex-1 w-full h-full">
        <CanvasErrorBoundary fallback={fallbackUI}>
          <Canvas 
            camera={{ position: [0, 0, 8.5], fov: 50 }}
            shadows
            dpr={[1, 2]}
            gl={{ antialias: true, preserveDrawingBuffer: true }}
          >
            {/* Background scene color matching selected style */}
            <color 
              attach="background" 
              args={[
                lightingStyle === 'sunset' ? '#170c0c' : 
                lightingStyle === 'dark' ? '#070a13' : 
                '#030712'
              ]} 
            />

            {/* Standard Ambient Light */}
            <ambientLight intensity={lightingStyle === 'dark' ? 0.45 : 0.85} />

            {/* Dynamic Interactive Spotlight that glides with mouse cursor */}
            <InteractiveSpotlight style={lightingStyle} />

            {/* Configurable Cinematic Lights */}
            {lightingStyle === 'studio' && (
              <>
                <directionalLight 
                  position={[6, 12, 6]} 
                  intensity={1.3} 
                  castShadow 
                  shadow-mapSize={[1024, 1024]}
                  shadow-bias={-0.0005}
                />
                <pointLight position={[-8, -5, 5]} intensity={0.5} color="#3b82f6" />
                <pointLight position={[8, 5, 4]} intensity={0.7} color="#818cf8" />
              </>
            )}

            {lightingStyle === 'sunset' && (
              <>
                <directionalLight 
                  position={[6, 8, 4]} 
                  intensity={1.6} 
                  color="#fbbf24"
                  castShadow
                  shadow-mapSize={[1024, 1024]}
                  shadow-bias={-0.0005}
                />
                <pointLight position={[-6, -6, 5]} intensity={1.1} color="#f43f5e" />
                <pointLight position={[6, 4, -4]} intensity={0.5} color="#d97706" />
              </>
            )}

            {lightingStyle === 'dark' && (
              <>
                <directionalLight 
                  position={[3, 6, 6]} 
                  intensity={0.7} 
                  color="#818cf8"
                  castShadow
                  shadow-mapSize={[1024, 1024]}
                  shadow-bias={-0.0005}
                />
                <pointLight position={[-4, 4, 3]} intensity={1.3} color="#6366f1" />
                <pointLight position={[4, -4, 3]} intensity={1.0} color="#ec4899" />
              </>
            )}

            {/* Floating particles background to create cinematic dust/sparkle effect */}
            <Sparkles 
              count={lightingStyle === 'sunset' ? 100 : 70} 
              scale={12} 
              size={lightingStyle === 'sunset' ? 2.4 : 1.8} 
              speed={0.4} 
              color={
                lightingStyle === 'sunset' ? '#f59e0b' : 
                lightingStyle === 'dark' ? '#ec4899' : 
                '#60a5fa'
              } 
            />

            {/* Animated backdrop spheres */}
            <FloatingBackdrop style={lightingStyle} />

            {/* Elegant futuristic base pedestal receiving shadows */}
            <group position={[0, -4.6, 0]}>
              <mesh receiveShadow castShadow rotation={[-Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[4.2, 4.5, 0.2, 48]} />
                <meshStandardMaterial 
                  color={
                    lightingStyle === 'sunset' ? '#18110f' : 
                    lightingStyle === 'dark' ? '#090d16' : 
                    '#0f172a'
                  } 
                  roughness={0.6} 
                  metalness={0.7} 
                />
              </mesh>
              {/* Pedestal neon edge ring */}
              <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.11, 0]}>
                <ringGeometry args={[4.18, 4.2, 48]} />
                <meshBasicMaterial 
                  color={
                    lightingStyle === 'sunset' ? '#f59e0b' : 
                    lightingStyle === 'dark' ? '#818cf8' : 
                    '#3b82f6'
                  } 
                  transparent 
                  opacity={0.6}
                />
              </mesh>
            </group>

            {/* Soft ground plane shadow receiver */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -4.61, 0]} receiveShadow>
              <planeGeometry args={[30, 30]} />
              <shadowMaterial opacity={lightingStyle === 'dark' ? 0.35 : 0.55} />
            </mesh>

            {/* Camera presets manager */}
            <CameraManager 
              preset={activePreset} 
              presetTrigger={presetTrigger} 
              orbitRef={orbitRef} 
            />

            {/* Orbit Controls to manipulate 3D document */}
            <OrbitControls 
              ref={orbitRef}
              enableZoom={true}
              enablePan={true}
              minDistance={2.5}
              maxDistance={14}
              makeDefault
            />

            {/* Interactive Object Group containing the 3D Resume Sheet */}
            <Suspense fallback={null}>
              <InteractiveScene 
                autoRotate={autoRotate} 
                enableMouseParallax={mouseParallax}
              >
                <Float speed={1.1} rotationIntensity={0.06} floatIntensity={0.12}>
                  {/* Cardboard backing clipboard for extreme realism */}
                  <mesh castShadow receiveShadow>
                    <boxGeometry args={[4.84, 6.84, 0.04]} />
                    <meshStandardMaterial 
                      color={
                        lightingStyle === 'sunset' ? '#25211d' :
                        lightingStyle === 'dark' ? '#0d0f17' :
                        '#1a2232'
                      } 
                      roughness={0.45} 
                      metalness={0.15} 
                    />
                  </mesh>

                  {/* Physical binder clip on top of the clipboard */}
                  <group position={[0, 3.26, 0.035]}>
                    {/* Metal clip bar base */}
                    <mesh castShadow receiveShadow>
                      <boxGeometry args={[1.4, 0.24, 0.05]} />
                      <meshStandardMaterial 
                        color={lightingStyle === 'sunset' ? '#f59e0b' : lightingStyle === 'dark' ? '#cbd5e1' : '#94a3b8'} 
                        metalness={0.9} 
                        roughness={0.15} 
                      />
                    </mesh>
                    {/* Wire loops for squeezing the clip */}
                    <mesh position={[-0.4, 0.12, -0.01]} rotation={[Math.PI / 3, 0, 0]} castShadow>
                      <torusGeometry args={[0.15, 0.015, 8, 24, Math.PI]} />
                      <meshStandardMaterial 
                        color={lightingStyle === 'sunset' ? '#fbbf24' : '#cbd5e1'} 
                        metalness={0.95} 
                        roughness={0.05} 
                      />
                    </mesh>
                    <mesh position={[0.4, 0.12, -0.01]} rotation={[Math.PI / 3, 0, 0]} castShadow>
                      <torusGeometry args={[0.15, 0.015, 8, 24, Math.PI]} />
                      <meshStandardMaterial 
                        color={lightingStyle === 'sunset' ? '#fbbf24' : '#cbd5e1'} 
                        metalness={0.95} 
                        roughness={0.05} 
                      />
                    </mesh>
                  </group>

                  {/* HTML Paper Sheet centered directly onto clipboard surface */}
                  <group position={[0, 0, 0.021]}>
                    <Html
                      transform
                      distanceFactor={4.8}
                      scale={1.15}
                      portal={undefined}
                      style={{
                        pointerEvents: 'auto',
                        width: '794px', // exact standard A4 width representation
                        maxHeight: '1123px', // exact standard A4 height
                        overflowY: 'auto',
                        background: 'white',
                        boxShadow: 'none',
                        borderRadius: '4px',
                        userSelect: 'text',
                        scrollbarWidth: 'thin'
                      }}
                    >
                      <div className="three-html-wrapper w-full p-4 select-text bg-white">
                        {children}
                      </div>
                    </Html>
                  </group>
                </Float>
              </InteractiveScene>
            </Suspense>
          </Canvas>
        </CanvasErrorBoundary>
      </div>
    </div>
  );
}

