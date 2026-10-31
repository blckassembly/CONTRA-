import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { Play, Pause, RotateCcw, ChevronRight, Eye, Server, Cpu, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { ClinicalCase, ContradictionReport } from '../../types/clinical.ts';

interface NasWorkflowSceneProps {
  currentCase: ClinicalCase;
  currentReport: ContradictionReport | null;
  onAuditTrigger: () => void;
  isAuditing: boolean;
}

export const NasWorkflowScene: React.FC<NasWorkflowSceneProps> = ({
  currentCase,
  currentReport,
  onAuditTrigger,
  isAuditing,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [currentStage, setCurrentStage] = useState<number>(0);
  const [isPlayingAuto, setIsPlayingAuto] = useState<boolean>(true);
  const [isControlsCollapsed, setIsControlsCollapsed] = useState<boolean>(false);

  // References for three.js state
  const stateRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    targetCamPos: THREE.Vector3;
    targetLookAt: THREE.Vector3;
    currentLookAt: THREE.Vector3;
    prismCore?: THREE.Group;
    dataPackets: Array<{ mesh: THREE.Mesh; progress: number; speed: number; curve: THREE.CubicBezierCurve3 }>;
    autoTimer: number;
    clock: THREE.Clock;
    isSoftwareGl: boolean;
  } | null>(null);

  // Stage definitions
  const STAGES = [
    {
      id: 0,
      title: 'Strategic Architecture Overview',
      subtitle: 'Full Server-Side Pipeline: Clinical Terminal ⟷ CONTRA Engine ⟷ UGREEN AI NAS',
      camPos: new THREE.Vector3(0, 16, 26),
      lookAt: new THREE.Vector3(0, 2, 0),
      description:
        'Notice the inverted retrieval paradigm: the client sends the diagnostic hypothesis, while the UGREEN NAS performs server-side file discovery and contradiction filtering before transmitting high-confidence evidence.',
    },
    {
      id: 1,
      title: 'Stage 1: Clinical Terminal & Hypothesis Anchor',
      subtitle: 'Clinician defines Working Diagnosis (D) & Observed Patient Findings (F)',
      camPos: new THREE.Vector3(-10, 6, 8),
      lookAt: new THREE.Vector3(-8, 2.5, 0),
      description:
        `Evaluating ${currentCase.caseNumber}: Working hypothesis is "${currentCase.workingDiagnosis}". Patient facts (4.2g proteinuria, acanthocytes) are ingested without inferring unobserved facts.`,
    },
    {
      id: 2,
      title: 'Stage 2: UGREEN AI NAS Server Storage Discovery',
      subtitle: 'Disorganized Storage Traversal across Unstructured Directories (PRD §5.1)',
      camPos: new THREE.Vector3(10, 6, 8),
      lookAt: new THREE.Vector3(8, 2.5, 0),
      description:
        'Zero mandatory folder organization. The NAS server agent scans 18 authorized clinical guidelines, pathology atlases, and trial records directly across independent directories.',
    },
    {
      id: 3,
      title: 'Stage 3: Contradiction Extraction & Refraction Core',
      subtitle: 'Differential Logic Prism: Separates Facts, Literature, and Discrepancies',
      camPos: new THREE.Vector3(0, 7, 7),
      lookAt: new THREE.Vector3(0, 3.2, -2),
      description:
        'The Gemini reasoning engine compares expected vs observed features. It refracts data into 4 distinct streams: Contradictory (Metallic Gold), Supporting (Emerald), Missing (Indigo), and Inconclusive (Slate).',
    },
    {
      id: 4,
      title: 'Stage 4: Clinician Review & Traceable Provenance',
      subtitle: 'Source-Linked Contradiction Dossier Delivered for Human Review (PRD §5.5)',
      camPos: new THREE.Vector3(-6, 4.5, 5),
      lookAt: new THREE.Vector3(-8, 2.5, 0),
      description:
        'The contradiction report is delivered to the clinical terminal with verbatim excerpts and verified SHA256 NAS file paths. The system poses critical questions without autonomous prescribing.',
    },
  ];

  useEffect(() => {
    if (!mountRef.current) return;

    // Detect software WebGL as instructed in Three.js skill
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    // 1. Scene & Camera Setup
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0e17); // Obsidian lab space
    scene.fog = new THREE.FogExp2(0x0a0e17, 0.022);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 150);
    camera.position.copy(STAGES[0].camPos);

    // 2. Renderer Setup
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: false,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    mountRef.current.appendChild(renderer.domElement);

    // 3. Studio Environment Map (Mandatory from Three.js Skill)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 4. Lighting Rig
    const hemiLight = new THREE.HemisphereLight(0x60a5fa, 0x1e293b, 0.6); // Cool sky / warm floor
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff7ed, 2.2); // Warm key light
    keyLight.position.set(12, 20, 14);
    keyLight.castShadow = !isSoftwareGl;
    if (keyLight.castShadow) {
      keyLight.shadow.mapSize.width = 1024;
      keyLight.shadow.mapSize.height = 1024;
      keyLight.shadow.camera.near = 0.5;
      keyLight.shadow.camera.far = 60;
      keyLight.shadow.bias = -0.0005;
      keyLight.shadow.normalBias = 0.02;
      const d = 16;
      keyLight.shadow.camera.left = -d;
      keyLight.shadow.camera.right = d;
      keyLight.shadow.camera.top = d;
      keyLight.shadow.camera.bottom = -d;
    }
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xd97706, 1.8); // Amber rim accent
    rimLight.position.set(-14, 10, -10);
    scene.add(rimLight);

    // 5. Ground Floor with Cybernetic Grid
    const floorGeo = new THREE.PlaneGeometry(80, 80);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.85,
      metalness: 0.2,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = !isSoftwareGl;
    scene.add(floor);

    // Grid Overlay
    const gridHelper = new THREE.GridHelper(80, 80, 0x334155, 0x1e293b);
    gridHelper.position.y = 0.01;
    scene.add(gridHelper);

    // -------------------------------------------------------------------
    // 6. COMPOSITE 3D OBJECT 1: HOSPITAL CLINICAL TERMINAL (Left, X: -8)
    // -------------------------------------------------------------------
    const terminalGroup = new THREE.Group();
    terminalGroup.position.set(-8, 0, 0);

    // Desk Base (Part 1)
    const deskGeo = new THREE.BoxGeometry(4.2, 0.15, 2.4);
    const deskMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4, metalness: 0.3 });
    const desk = new THREE.Mesh(deskGeo, deskMat);
    desk.position.y = 1.8;
    desk.castShadow = true;
    desk.receiveShadow = true;
    terminalGroup.add(desk);

    // Desk Legs (Part 2)
    const legGeo = new THREE.CylinderGeometry(0.06, 0.06, 1.8, 16);
    const legMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.8, roughness: 0.2 });
    [[-1.8, -0.9], [1.8, -0.9], [-1.8, 0.9], [1.8, 0.9]].forEach(([x, z]) => {
      const leg = new THREE.Mesh(legGeo, legMat);
      leg.position.set(x, 0.9, z);
      leg.castShadow = true;
      terminalGroup.add(leg);
    });

    // Curved Medical Monitor (Part 3)
    const screenGeo = new THREE.BoxGeometry(3.0, 1.6, 0.08);
    const screenMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      emissive: 0x0369a1,
      emissiveIntensity: 0.6,
      roughness: 0.1,
    });
    const screen = new THREE.Mesh(screenGeo, screenMat);
    screen.position.set(0, 2.9, -0.4);
    screen.castShadow = true;
    terminalGroup.add(screen);

    // Monitor Stand (Part 4)
    const standGeo = new THREE.CylinderGeometry(0.08, 0.12, 1.0, 16);
    const stand = new THREE.Mesh(standGeo, legMat);
    stand.position.set(0, 2.3, -0.45);
    terminalGroup.add(stand);

    // Holographic Case Beacon (Part 5)
    const holoRingGeo = new THREE.TorusGeometry(1.2, 0.04, 16, 64);
    const holoRingMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 1.2,
      roughness: 0.2,
      metalness: 0.9,
    });
    const holoRing = new THREE.Mesh(holoRingGeo, holoRingMat);
    holoRing.position.set(0, 4.4, -0.4);
    holoRing.rotation.x = Math.PI / 3;
    terminalGroup.add(holoRing);

    // Contact shadow beneath terminal (Part 6)
    const shadowGeo = new THREE.CircleGeometry(2.4, 32);
    const shadowMat = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.45 });
    const shadow = new THREE.Mesh(shadowGeo, shadowMat);
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = 0.02;
    terminalGroup.add(shadow);

    scene.add(terminalGroup);

    // -------------------------------------------------------------------
    // 7. COMPOSITE 3D OBJECT 2: UGREEN AI NAS SERVER RACK (Right, X: +8)
    // -------------------------------------------------------------------
    const nasGroup = new THREE.Group();
    nasGroup.position.set(8, 0, 0);

    // Main NAS Server Tower (Part 1)
    const chassisGeo = new THREE.BoxGeometry(2.2, 4.2, 2.0);
    const chassisMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.85,
      roughness: 0.25,
    });
    const chassis = new THREE.Mesh(chassisGeo, chassisMat);
    chassis.position.y = 2.1;
    chassis.castShadow = true;
    chassis.receiveShadow = true;
    nasGroup.add(chassis);

    // 4 Hot-Swappable Drive Bays (Part 2-5)
    const bayGeo = new THREE.BoxGeometry(1.8, 0.55, 0.15);
    const bayMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.7, roughness: 0.3 });
    const ledGeo = new THREE.BoxGeometry(0.12, 0.08, 0.05);
    const ledMat = new THREE.MeshStandardMaterial({ color: 0x10b981, emissive: 0x10b981, emissiveIntensity: 2.0 });

    for (let i = 0; i < 4; i++) {
      const bay = new THREE.Mesh(bayGeo, bayMat);
      bay.position.set(0, 1.2 + i * 0.75, 1.02);
      bay.castShadow = true;
      nasGroup.add(bay);

      const led = new THREE.Mesh(ledGeo, ledMat);
      led.position.set(0.7, 1.2 + i * 0.75, 1.1);
      nasGroup.add(led);
    }

    // UGOS Status Display Panel (Part 6)
    const nasScreenGeo = new THREE.PlaneGeometry(1.4, 0.45);
    const nasScreenMat = new THREE.MeshStandardMaterial({
      color: 0x059669,
      emissive: 0x059669,
      emissiveIntensity: 0.8,
      roughness: 0.1,
    });
    const nasScreen = new THREE.Mesh(nasScreenGeo, nasScreenMat);
    nasScreen.position.set(0, 3.8, 1.02);
    nasGroup.add(nasScreen);

    // Ground Contact Shadow (Part 7)
    const nasShadow = new THREE.Mesh(shadowGeo, shadowMat);
    nasShadow.rotation.x = -Math.PI / 2;
    nasShadow.position.y = 0.02;
    nasGroup.add(nasShadow);

    scene.add(nasGroup);

    // -------------------------------------------------------------------
    // 8. COMPOSITE 3D OBJECT 3: CONTRADICTION PRISM & LOGIC CORE (Center, Z: -2)
    // -------------------------------------------------------------------
    const prismCore = new THREE.Group();
    prismCore.position.set(0, 3.2, -2);

    // Central Faceted Crystal Core (Part 1)
    const crystalGeo = new THREE.OctahedronGeometry(1.2, 0);
    const crystalMat = new THREE.MeshPhysicalMaterial({
      color: 0xf59e0b,
      emissive: 0xd97706,
      emissiveIntensity: 0.5,
      roughness: 0.1,
      metalness: 0.2,
      transmission: isSoftwareGl ? 0 : 0.85,
      transparent: true,
      opacity: isSoftwareGl ? 0.6 : 0.95,
      ior: 1.6,
    });
    const crystal = new THREE.Mesh(crystalGeo, crystalMat);
    prismCore.add(crystal);

    // Rotating Gimbal Rings (Parts 2-4)
    const ringGeo1 = new THREE.TorusGeometry(2.0, 0.05, 16, 64);
    const ringMat1 = new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.9, roughness: 0.15 });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    prismCore.add(ring1);

    const ringGeo2 = new THREE.TorusGeometry(2.4, 0.04, 16, 64);
    const ringMat2 = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.9, roughness: 0.2 });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.x = Math.PI / 2;
    prismCore.add(ring2);

    // Core Plinth / Pedestal (Part 5)
    const pedestalGeo = new THREE.CylinderGeometry(0.8, 1.2, 2.0, 32);
    const pedestalMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.5, metalness: 0.6 });
    const pedestal = new THREE.Mesh(pedestalGeo, pedestalMat);
    pedestal.position.set(0, -2.2, 0);
    pedestal.castShadow = true;
    pedestal.receiveShadow = true;
    prismCore.add(pedestal);

    scene.add(prismCore);

    // -------------------------------------------------------------------
    // 9. DYNAMIC DATA FLOW TUBES & PARTICLE PACKETS
    // -------------------------------------------------------------------
    // Curve 1: NAS Server -> Contradiction Core (Ingesting files)
    const curveNasToCore = new THREE.CubicBezierCurve3(
      new THREE.Vector3(7, 2.8, 0),
      new THREE.Vector3(4, 4.0, 0),
      new THREE.Vector3(2, 4.2, -1),
      new THREE.Vector3(0.5, 3.2, -2)
    );

    // Curve 2: Core -> Clinical Workstation (Delivering contradiction findings)
    const curveCoreToWorkstation = new THREE.CubicBezierCurve3(
      new THREE.Vector3(-0.5, 3.2, -2),
      new THREE.Vector3(-2, 4.2, -1),
      new THREE.Vector3(-5, 3.8, 0),
      new THREE.Vector3(-7, 2.8, 0)
    );

    // Render static glowing conduit tubes
    const tubeGeo1 = new THREE.TubeGeometry(curveNasToCore, 64, 0.04, 8, false);
    const tubeMat1 = new THREE.MeshBasicMaterial({ color: 0x10b981, transparent: true, opacity: 0.35 });
    const tube1 = new THREE.Mesh(tubeGeo1, tubeMat1);
    scene.add(tube1);

    const tubeGeo2 = new THREE.TubeGeometry(curveCoreToWorkstation, 64, 0.04, 8, false);
    const tubeMat2 = new THREE.MeshBasicMaterial({ color: 0xd97706, transparent: true, opacity: 0.45 });
    const tube2 = new THREE.Mesh(tubeGeo2, tubeMat2);
    scene.add(tube2);

    // Animated Data Packets
    const packetGeo = new THREE.BoxGeometry(0.25, 0.25, 0.25);
    const packetMatNas = new THREE.MeshStandardMaterial({
      color: 0x34d399,
      emissive: 0x10b981,
      emissiveIntensity: 1.5,
    });
    const packetMatContra = new THREE.MeshStandardMaterial({
      color: 0xfbbf24,
      emissive: 0xd97706,
      emissiveIntensity: 2.0,
    });

    const dataPackets: Array<{ mesh: THREE.Mesh; progress: number; speed: number; curve: THREE.CubicBezierCurve3 }> = [];

    // 5 Packets from NAS to Core
    for (let i = 0; i < 5; i++) {
      const p = new THREE.Mesh(packetGeo, packetMatNas);
      scene.add(p);
      dataPackets.push({
        mesh: p,
        progress: i * 0.2,
        speed: 0.22,
        curve: curveNasToCore,
      });
    }

    // 5 Packets from Core to Clinical Workstation (Contradictions flagged in gold)
    for (let i = 0; i < 5; i++) {
      const p = new THREE.Mesh(packetGeo, packetMatContra);
      scene.add(p);
      dataPackets.push({
        mesh: p,
        progress: i * 0.2,
        speed: 0.28,
        curve: curveCoreToWorkstation,
      });
    }

    // Initialize state
    stateRef.current = {
      scene,
      camera,
      renderer,
      targetCamPos: new THREE.Vector3().copy(STAGES[0].camPos),
      targetLookAt: new THREE.Vector3().copy(STAGES[0].lookAt),
      currentLookAt: new THREE.Vector3().copy(STAGES[0].lookAt),
      prismCore,
      dataPackets,
      autoTimer: 0,
      clock: new THREE.Clock(),
      isSoftwareGl,
    };

    // Resize Handler
    const handleResize = () => {
      if (!mountRef.current || !stateRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Render / Animation Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (!stateRef.current) return;
      const { scene, camera, renderer, targetCamPos, targetLookAt, currentLookAt, prismCore, dataPackets, clock } =
        stateRef.current;

      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Damped camera position interpolation (Three.js exponential damping)
      camera.position.lerp(targetCamPos, 1.0 - Math.exp(-3.5 * delta));
      currentLookAt.lerp(targetLookAt, 1.0 - Math.exp(-3.5 * delta));
      camera.lookAt(currentLookAt);

      // Rotate prism core
      if (prismCore) {
        prismCore.rotation.y = elapsed * 0.4;
        crystal.rotation.x = Math.sin(elapsed * 0.8) * 0.25;
        ring1.rotation.z = elapsed * 0.6;
        ring2.rotation.y = -elapsed * 0.5;
        holoRing.rotation.z = elapsed * 0.35;
      }

      // Animate packet transmission
      dataPackets.forEach((p) => {
        p.progress += p.speed * delta;
        if (p.progress > 1) p.progress = 0;
        const pt = p.curve.getPoint(p.progress);
        p.mesh.position.copy(pt);
        p.mesh.rotation.x += delta * 2;
        p.mesh.rotation.y += delta * 3;
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Update camera targets on stage change
  useEffect(() => {
    if (!stateRef.current) return;
    const s = STAGES[currentStage];
    stateRef.current.targetCamPos.copy(s.camPos);
    stateRef.current.targetLookAt.copy(s.lookAt);
  }, [currentStage]);

  // Automated Tour Timer
  useEffect(() => {
    if (!isPlayingAuto) return;
    const interval = setInterval(() => {
      setCurrentStage((prev) => (prev + 1) % STAGES.length);
    }, 6500);
    return () => clearInterval(interval);
  }, [isPlayingAuto]);

  const activeStageData = STAGES[currentStage];

  return (
    <div className="relative w-full h-full min-h-[560px] bg-[#0a0e17] overflow-hidden rounded-xl border border-slate-800 shadow-2xl flex flex-col justify-between">
      {/* 3D Canvas Mount Point */}
      <div ref={mountRef} className="absolute inset-0 z-0 cursor-grab active:cursor-grabbing" />

      {/* Top Floating Telemetry & Stage Indicator */}
      <div className="relative z-10 p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4 pointer-events-none">
        <div className="space-y-1 bg-slate-900/85 border border-slate-700/60 p-4 rounded-xl shadow-lg max-w-xl pointer-events-auto backdrop-blur-md">
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="font-bold uppercase tracking-wider">Strategic NAS Workflow Architecture</span>
            <span className="text-slate-500">·</span>
            <span className="text-slate-400">Stage {currentStage} / {STAGES.length - 1}</span>
          </div>
          <h2 className="text-base font-bold text-white tracking-tight leading-snug">
            {activeStageData.title}
          </h2>
          <p className="text-xs text-amber-200/80 font-medium">
            {activeStageData.subtitle}
          </p>
          <p className="text-xs text-slate-300 leading-relaxed pt-1">
            {activeStageData.description}
          </p>
        </div>

        {/* Quick Action Pill */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            type="button"
            onClick={onAuditTrigger}
            disabled={isAuditing}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-bold transition-all shadow-md whitespace-nowrap"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>{isAuditing ? 'Auditing NAS Data...' : 'Execute Contradiction Audit'}</span>
          </button>
        </div>
      </div>

      {/* Bottom Collapsible HUD Dock (Three.js Skill Section 5 Ergonomic Bottom Dock) */}
      <div className="relative z-10 p-4 sm:p-5 flex flex-col items-center pointer-events-none">
        {/* Collapse / Expand Toggle */}
        <button
          type="button"
          onClick={() => setIsControlsCollapsed(!isControlsCollapsed)}
          className="pointer-events-auto text-[11px] font-mono text-slate-300 bg-slate-900/90 hover:bg-slate-800 border border-slate-700/70 px-3 py-1 rounded-t-lg transition-colors flex items-center gap-1.5 shadow-md"
        >
          <span>{isControlsCollapsed ? '▲ Show Stage Controls' : '▼ Hide Controls'}</span>
        </button>

        {/* Floating Glassmorphic Workflow Navigation Dock */}
        {!isControlsCollapsed && (
          <div className="w-full max-w-4xl bg-slate-900/95 border border-slate-700/80 rounded-xl p-3 shadow-2xl backdrop-blur-md pointer-events-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            {/* Play/Pause & Stage Stepper */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsPlayingAuto(!isPlayingAuto)}
                className={`p-2 rounded-lg transition-colors ${
                  isPlayingAuto
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
                title={isPlayingAuto ? 'Pause Automated Tour' : 'Play Automated Tour'}
              >
                {isPlayingAuto ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsPlayingAuto(false);
                  setCurrentStage(0);
                }}
                className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
                title="Reset to Overview"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Stages Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 overflow-x-auto py-1">
              {STAGES.map((s, idx) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    setIsPlayingAuto(false);
                    setCurrentStage(idx);
                  }}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all whitespace-nowrap ${
                    currentStage === idx
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  {idx === 0 ? 'Overview' : `Stage ${idx}`}
                </button>
              ))}
            </div>

            {/* Current Pipeline Status */}
            <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400 shrink-0">
              <Server className="w-3.5 h-3.5 text-emerald-400" />
              <span>UGOS NAS Server: Online</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
