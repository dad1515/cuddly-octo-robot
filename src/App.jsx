import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  ArrowDown,
  ArrowUpRight,
  Bot,
  Building2,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Clapperboard,
  Mail,
  Menu,
  Phone,
  Play,
  Sparkles,
  UserRound,
  X,
} from 'lucide-react'
import SpecularSurface from './components/SpecularSurface'
import CurvedInput from './components/CurvedInput'
import BorderGlow from './components/BorderGlow'
import GradientText from './components/GradientText'

const projectGlowPalettes = [
  ['#baff28', '#dda85f', '#d7f5dc'],
  ['#8fd36a', '#e8f3df', '#baff28'],
  ['#dda85f', '#f3dfbd', '#85bf72'],
  ['#baff28', '#8ecf75', '#f1f6ed'],
  ['#d3bc83', '#7f9687', '#e6e1d5'],
  ['#c8b0a4', '#a6bc9b', '#ead7c4'],
  ['#92b875', '#d7a961', '#d8e0d2'],
]

const projects = [
  {
    number: '01',
    type: 'AI COMIC / PRODUCTION',
    title: 'AI 漫剧制作',
    description: '从叙事拆解、画面生成到动态呈现，探索 AI 参与影视内容生产的完整路径。',
    image:
      'https://images.unsplash.com/photo-1614728263952-84ea256f9679?auto=format&fit=crop&w=1800&q=88',
    className: 'project-featured',
    context: '个人创作实践',
    period: '持续更新',
    role: '内容策划 / AI 影像制作',
    details: [
      {
        label: '创作路径',
        title: '从叙事拆解到动态呈现',
        text: '围绕故事、镜头与画面连续性组织制作步骤，验证 AI 参与影视内容生产的完整路径。',
      },
      {
        label: '资料状态',
        title: '项目内容持续整理中',
        text: '后续将补充具体工具、制作周期、成片片段和个人职责。',
      },
    ],
    mediaNote: '成片片段、制作过程与画面对比将在后续补充。',
  },
  {
    number: '02',
    type: 'CODEX / WORKFLOW',
    title: 'Codex 全程托管',
    description: '把需求理解、任务拆解与落地执行串成可持续迭代的 AI 工作流。',
    image:
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1500&q=88',
    className: '',
    context: '个人工作流实践',
    period: '持续迭代',
    role: '流程设计 / Codex 托管',
    details: [
      {
        label: '实践重点',
        title: '让 AI 参与完整执行过程',
        text: '从需求理解、任务拆解到实现与验证，持续探索可复用、可沟通的 Codex 托管方式。',
      },
      {
        label: '资料状态',
        title: '案例与结果待整理',
        text: '后续将使用真实案例说明工作流结构、交付过程和实际成果。',
      },
    ],
    mediaNote: '工作流截图、过程记录和交付案例将在后续补充。',
  },
  {
    number: '03',
    type: 'LIVE PRODUCTION / FIELD PRACTICE',
    title: '春节联欢晚会制作',
    description: '连续参与 2024、2025 两届当地春晚，从现场执行逐步进入导播室与直播画面保障。',
    image:
      'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1500&q=88',
    className: '',
    context: '鸡泽县融媒体中心',
    period: '2024—2025',
    role: '编剧部门成员 / 节目制作实践',
    details: [
      {
        label: '2024 / 现场执行',
        title: '人员协调与现场管理',
        text: '负责参与人员协调、现场秩序管理与执行衔接，协助保障节目按照现场流程推进。',
      },
      {
        label: '2025 / 播出保障',
        title: '导播室与节目大屏协同',
        text: '进入导播室参与播出保障，负责节目大屏的使用配合，以及直播过程中的画面调整与现场协同。',
      },
      {
        label: '职责变化',
        title: '从现场支持走向关键技术环节',
        text: '工作重心由人员与现场执行，逐步转向导播系统和直播画面保障，承担更接近正式播出链路的任务。',
      },
    ],
    mediaNote: '已有播出画面、现场照片或署名资料，后续统一整理加入。',
  },
  {
    number: '04',
    type: 'EVENT / CONTENT PRODUCTION',
    title: '短视频大赛组织与执行',
    description: '参与当地短视频大赛等内容活动的组织与执行，连接内容、人员与现场流程。',
    image:
      'https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=1800&q=88',
    className: 'project-wide',
    context: '鸡泽县融媒体中心',
    period: '资料整理中',
    role: '举办方团队成员 / 活动协同',
    details: [
      {
        label: '项目定位',
        title: '以举办方团队成员身份参与',
        text: '这类经历将重点呈现活动组织、内容协同与执行能力，而不是按照参赛作品进行描述。',
      },
      {
        label: '待确认信息',
        title: '赛事名称与具体职责待补充',
        text: '确认项目年份、赛事名称、工作内容和成果后，再形成完整且可验证的项目记录。',
      },
    ],
    mediaNote: '赛事视觉、现场照片、工作记录与最终成果将在资料确认后补充。',
  },
  {
    number: '05',
    type: 'AI COMIC / URBAN SUSPENSE',
    title: '塔罗牌',
    description: '以塔罗意象与雨夜都市为视觉核心，完成角色设定、世界观画面与预告片制作。',
    image: '/media/projects/tarot-cover.jpg',
    className: 'project-series project-tarot',
    context: 'AI 漫剧个人创作',
    period: '预告片已完成',
    role: 'AI 漫剧创作 / 角色与影像制作',
    details: [
      {
        label: '视觉方向',
        title: '用雨夜都市建立悬疑基调',
        text: '以潮湿街道、历史建筑与现代都市并置，围绕塔罗牌这一核心意象建立具有辨识度的视觉世界。',
      },
      {
        label: '角色设定',
        title: '为主要角色建立统一视觉档案',
        text: '材料中包含多位角色的正侧背设定与面部特写，用于保持人物外形、服装和气质在后续镜头中的连续性。',
      },
      {
        label: '阶段成果',
        title: '从静态设定推进到动态预告',
        text: '项目已形成角色设定、核心场景图与预告片，呈现从视觉开发到动态叙事的阶段性成果。',
      },
    ],
    galleryIntro: '从角色档案到雨夜主视觉，展示人物连续性与都市悬疑氛围的建立过程。',
    gallery: [
      { src: '/media/projects/tarot-lead.jpg', label: '男主角色设定', meta: 'CHARACTER / 01' },
      { src: '/media/projects/tarot-character-02.jpg', label: '女性角色设定', meta: 'CHARACTER / 02' },
      { src: '/media/projects/tarot-character-03.jpg', label: '男性角色设定', meta: 'CHARACTER / 03' },
    ],
    mediaNote: '当前已整理角色设定、雨夜都市主视觉与预告片；正式片名和更完整剧情资料可继续补充。',
  },
  {
    number: '06',
    type: 'AI COMIC / FANTASY ROMANCE',
    title: '今夜替魔尊织梦',
    description: '玄幻仙侠爱情题材 AI 漫剧，以梦境、月色与婚服为视觉线索，推进角色设定与第一集制作。',
    image: '/media/projects/dream-cover.jpg',
    className: 'project-series project-dream',
    context: 'AI 漫剧个人创作',
    period: '第一集已完成',
    role: 'AI 漫剧创作 / 角色与影像制作',
    details: [
      {
        label: '题材定位',
        title: '玄幻仙侠中的梦境与情感关系',
        text: '围绕玄幻仙侠爱情题材建立视觉方向，以月色、梦境感场景和冷暖服装变化组织作品气质。',
      },
      {
        label: '造型体系',
        title: '用多套服装区分人物状态',
        text: '为男女主整理常服、深色造型与新婚服装设定，使角色在不同情节阶段具有清晰的视觉变化。',
      },
      {
        label: '阶段成果',
        title: '角色视觉已进入完整情节呈现',
        text: '现有材料包含男女主设定、婚服造型、情节画面与第一集成片，已完成从角色开发到单集制作的推进。',
      },
    ],
    galleryIntro: '以月色、黑红与婚服三组造型串联角色关系，呈现玄幻仙侠爱情题材的视觉变化。',
    gallery: [
      { src: '/media/projects/dream-heroine-dark.jpg', label: '女主深色造型', meta: 'CHARACTER / MOON' },
      { src: '/media/projects/dream-hero-dark.jpg', label: '男主魔尊造型', meta: 'CHARACTER / DEMON' },
      { src: '/media/projects/dream-heroine.jpg', label: '女主常服设定', meta: 'COSTUME / DAILY' },
      { src: '/media/projects/dream-wedding.jpg', label: '男女主新婚造型', meta: 'COSTUME / WEDDING' },
    ],
    mediaNote: '当前已整理角色设定、多套服装视觉与第一集成片；后续可加入剧情梗概、制作工具和具体周期。',
  },
  {
    number: '07',
    type: 'AI COMIC / APOCALYPSE',
    title: '屯粮小丧尸',
    description: '围绕末日来临前的物资储备与特殊空间设定，完成角色、居住环境和第一集成片。',
    image: '/media/projects/zombie-cover.jpg',
    className: 'project-series project-zombie project-wide',
    context: 'AI 漫剧个人创作',
    period: '第一集已完成',
    role: 'AI 漫剧创作 / 场景与影像制作',
    details: [
      {
        label: '场景叙事',
        title: '让“屯物资”成为可见的生活状态',
        text: '客厅、窗边与楼道场景都保留了成组物资和夜间照明，让末日前的准备不只停留在文字描述中。',
      },
      {
        label: '空间设定',
        title: '现实住宅与魔方空间形成对照',
        text: '普通居住空间使用克制的暖光与低饱和色调，魔方空间则采用冷色金属与碎片结构，形成现实和特殊能力之间的视觉区分。',
      },
      {
        label: '阶段成果',
        title: '从人物与场景设定推进到第一集',
        text: '现有材料包含女主角色设定、多个关键场景、末日主视觉与第一集成片，可较完整地展示单集制作过程。',
      },
    ],
    galleryIntro: '四张补充场景依次呈现居住环境、屯粮密度、楼道动线与魔方空间，是这一项目最有说服力的视觉证据。',
    gallery: [
      { src: '/media/projects/zombie-window.jpg', label: '窗边与夜间社区', meta: 'SCENE / WINDOW' },
      { src: '/media/projects/zombie-living-room.jpg', label: '客厅物资储备', meta: 'SCENE / LIVING ROOM' },
      { src: '/media/projects/zombie-hallway.jpg', label: '楼道物资动线', meta: 'SCENE / HALLWAY' },
      { src: '/media/projects/zombie-cube-space.jpg', label: '魔方空间设定', meta: 'WORLD / CUBE SPACE' },
      { src: '/media/projects/zombie-heroine.jpg', label: '女主角色设定', meta: 'CHARACTER / HEROINE' },
    ],
    mediaNote: '当前已整理角色设定、四组场景与第一集成片；后续可补充完整剧情梗概、工作流程和制作周期。',
  },
]

const strengths = [
  {
    icon: Clapperboard,
    index: '01',
    title: '从想法到成片',
    text: '能把一个初步想法拆成叙事、画面与制作步骤，并持续推进到可展示的内容成果。',
    proof: '内容落地能力',
  },
  {
    icon: Bot,
    index: '02',
    title: 'AI 工作流搭建',
    text: '围绕任务组合 Codex、图像与视频生成工具，让分散步骤形成更清晰的执行流程。',
    proof: '工具组合与流程设计',
  },
  {
    icon: Check,
    index: '03',
    title: '影视表达基础',
    text: '影视技术专业训练让我关注镜头、节奏与叙事，使 AI 技术最终服务于内容表达。',
    proof: '专业背景支撑',
  },
  {
    icon: Sparkles,
    index: '04',
    title: '快速验证与交付',
    text: '面对新工具先动手验证，再依据结果调整路径，把探索转化为可以沟通和继续迭代的成果。',
    proof: '以结果推动迭代',
  },
]

const practiceTools = ['Codex', 'AI 图像生成', 'AI 视频生成', '影视剪辑', '提示词与流程设计']

const practiceMilestones = [
  {
    time: '2024',
    label: '现场执行',
    title: '第一次进入大型节目现场',
    text: '参与鸡泽县融媒体中心春节联欢晚会，负责人员管理与现场秩序协调。',
  },
  {
    time: '2025',
    label: '导播协同',
    title: '从现场走进导播室',
    text: '继续参与当地春晚，在导播室承担节目大屏使用与直播画面调整等工作。',
  },
  {
    time: '持续',
    label: '内容实验',
    title: '把 AI 放进影像流程',
    text: '围绕 AI 漫剧与 AI 影像，持续验证从叙事拆解到动态呈现的制作路径。',
  },
  {
    time: '当前',
    label: '工作流实践',
    title: '让工具形成执行系统',
    text: '尝试使用 Codex 承接需求理解、任务拆解和落地执行，形成可迭代的工作流。',
  },
]

const heroSignals = [
  { id: 'image', label: 'AI IMAGE', title: '画面生成', detail: '把想法转译成可见的视觉素材' },
  { id: 'film', label: 'FILM TECH', title: '影视表达', detail: '用镜头、节奏与叙事组织内容' },
  { id: 'workflow', label: 'WORKFLOW', title: '智能工作流', detail: '让创作步骤形成可执行的流程' },
]

const rotatingDirections = ['AI 内容创作', 'AI 影像叙事', '智能工作流']

const navItems = [
  ['个人经历', 'about'],
  ['精选作品', 'projects'],
  ['个人优势', 'strengths'],
]

const heroScenes = ['mist', 'forest', 'gold']
const sceneParticles = Array.from({ length: 14 }, (_, index) => index)

function RotatingText({ items }) {
  const [index, setIndex] = useState(0)
  const [phase, setPhase] = useState('is-entering')
  const timeoutRef = useRef(null)

  useEffect(() => {
    const interval = window.setInterval(() => {
      setPhase('is-leaving')
      timeoutRef.current = window.setTimeout(() => {
        setIndex((current) => (current + 1) % items.length)
        setPhase('is-entering')
      }, 420)
    }, 2600)

    return () => {
      window.clearInterval(interval)
      window.clearTimeout(timeoutRef.current)
    }
  }, [items.length])

  const currentText = items[index]

  return (
    <span className="rotating-text" aria-live="polite">
      <span className={`rotating-word ${phase}`} aria-hidden="true" key={`${index}-${phase}`}>
        {Array.from(currentText).map((character, characterIndex) => (
          <span
            className="rotating-character"
            style={{ '--character-index': characterIndex }}
            key={`${character}-${characterIndex}`}
          >
            {character === ' ' ? '\u00a0' : character}
          </span>
        ))}
      </span>
      <span className="sr-only">{currentText}</span>
    </span>
  )
}

function IntroSequence({ onDone }) {
  const [revealing, setRevealing] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      onDone(true)
      return undefined
    }

    const revealTimer = window.setTimeout(() => setRevealing(true), 520)
    const doneTimer = window.setTimeout(() => onDone(true), 1180)
    return () => {
      window.clearTimeout(revealTimer)
      window.clearTimeout(doneTimer)
    }
  }, [onDone])

  return (
    <div className={`intro-sequence ${revealing ? 'is-revealing' : ''}`} aria-label="ADL 作品集开场">
      <div className="intro-panel intro-panel-top" />
      <div className="intro-panel intro-panel-bottom" />
      <div className="intro-scan" aria-hidden="true" />
      <div className="intro-mark">
        <span>FILM TECH × AI CREATION</span>
        <strong>ADL<i>.</i></strong>
        <em>IDEA / IMAGE / ACTION</em>
      </div>
    </div>
  )
}

function CursorFeedback() {
  const coreRef = useRef(null)
  const ringRef = useRef(null)

  useEffect(() => {
    const disabled = window.matchMedia('(pointer: coarse), (prefers-reduced-motion: reduce)').matches
    if (disabled) return undefined

    const coreX = gsap.quickTo(coreRef.current, 'x', { duration: 0.12, ease: 'power3.out' })
    const coreY = gsap.quickTo(coreRef.current, 'y', { duration: 0.12, ease: 'power3.out' })
    const ringX = gsap.quickTo(ringRef.current, 'x', { duration: 0.42, ease: 'power3.out' })
    const ringY = gsap.quickTo(ringRef.current, 'y', { duration: 0.42, ease: 'power3.out' })

    const moveCursor = (event) => {
      coreX(event.clientX)
      coreY(event.clientY)
      ringX(event.clientX)
      ringY(event.clientY)

      const interactive = event.target.closest('button, a, .project-card')
      ringRef.current?.classList.toggle('is-hovering', Boolean(interactive))

      const magnetic = event.target.closest('.magnetic')
      if (magnetic) {
        const rect = magnetic.getBoundingClientRect()
        gsap.to(magnetic, {
          x: (event.clientX - rect.left - rect.width / 2) * 0.16,
          y: (event.clientY - rect.top - rect.height / 2) * 0.16,
          duration: 0.35,
          ease: 'power3.out',
          overwrite: true,
        })
      }
    }

    const releaseMagnet = (event) => {
      const magnetic = event.target.closest?.('.magnetic')
      if (magnetic && !magnetic.contains(event.relatedTarget)) {
        gsap.to(magnetic, { x: 0, y: 0, duration: 0.55, ease: 'elastic.out(1, .45)' })
      }
    }

    window.addEventListener('pointermove', moveCursor, { passive: true })
    document.addEventListener('pointerout', releaseMagnet)
    return () => {
      window.removeEventListener('pointermove', moveCursor)
      document.removeEventListener('pointerout', releaseMagnet)
    }
  }, [])

  return (
    <div className="cursor-feedback" aria-hidden="true">
      <span className="cursor-core" ref={coreRef} />
      <span className="cursor-ring" ref={ringRef} />
    </div>
  )
}

function ChapterCut({ index, title, tone = 'light' }) {
  return (
    <div className={`chapter-cut chapter-cut-${tone}`} data-chapter-cut aria-hidden="true">
      <div className="shell">
        <span>{index}</span>
        <i />
        <strong>{title}</strong>
      </div>
    </div>
  )
}

function ProjectDetail({ project, origin, onClose }) {
  const [galleryIndex, setGalleryIndex] = useState(null)
  const backdropRef = useRef(null)
  const detailRef = useRef(null)
  const coverRef = useRef(null)
  const sharedCoverRef = useRef(null)
  const closingRef = useRef(false)

  const closeDetail = () => {
    if (closingRef.current) return
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion || !origin || !sharedCoverRef.current || !coverRef.current) {
      onClose()
      return
    }

    closingRef.current = true
    const target = coverRef.current.getBoundingClientRect()
    gsap.set(sharedCoverRef.current, {
      display: 'block',
      opacity: 1,
      left: target.left,
      top: target.top,
      width: target.width,
      height: target.height,
      borderRadius: 0,
    })
    gsap.timeline({ onComplete: onClose })
      .to(detailRef.current, { opacity: 0, y: 18, duration: 0.28, ease: 'power2.in' }, 0)
      .to(backdropRef.current, { backgroundColor: 'rgba(4,14,9,0)', backdropFilter: 'blur(0px)', duration: 0.45 }, 0)
      .to(sharedCoverRef.current, {
        left: origin.left,
        top: origin.top,
        width: origin.width,
        height: origin.height,
        borderRadius: origin.radius || 0,
        duration: 0.58,
        ease: 'power4.inOut',
      }, 0.04)
      .to(sharedCoverRef.current, { opacity: 0, duration: 0.12 }, 0.52)
  }

  useLayoutEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion) return undefined
    const context = gsap.context(() => {
      if (origin && sharedCoverRef.current && coverRef.current) {
        const target = coverRef.current.getBoundingClientRect()
        gsap.set(backdropRef.current, { opacity: 0 })
        gsap.set(detailRef.current, { opacity: 0, y: 22 })
        gsap.set(coverRef.current, { visibility: 'hidden' })
        gsap.set(sharedCoverRef.current, {
          display: 'block',
          opacity: 1,
          left: origin.left,
          top: origin.top,
          width: origin.width,
          height: origin.height,
          borderRadius: origin.radius || 0,
        })
        gsap.timeline()
          .to(backdropRef.current, { opacity: 1, duration: 0.24, ease: 'power2.out' }, 0)
          .to(sharedCoverRef.current, {
            left: target.left,
            top: target.top,
            width: target.width,
            height: target.height,
            borderRadius: 0,
            duration: 0.68,
            ease: 'power4.inOut',
          }, 0)
          .to(detailRef.current, { opacity: 1, y: 0, duration: 0.38, ease: 'power3.out' }, 0.38)
          .set(coverRef.current, { visibility: 'visible' }, 0.58)
          .to(sharedCoverRef.current, { opacity: 0, duration: 0.16 }, 0.58)
      } else {
        gsap.from(backdropRef.current, { opacity: 0, duration: 0.28, ease: 'power2.out' })
        gsap.from(detailRef.current, { opacity: 0, y: 28, scale: 0.985, duration: 0.48, ease: 'power3.out' })
      }

      gsap.from('.project-detail-facts > div', {
        y: 30,
        opacity: 0,
        duration: 0.65,
        stagger: 0.1,
        delay: origin ? 0.62 : 0.22,
        ease: 'power3.out',
      })
      gsap.from('.project-detail-timeline > article', {
        x: 36,
        opacity: 0,
        duration: 0.72,
        stagger: 0.12,
        delay: origin ? 0.72 : 0.35,
        ease: 'power3.out',
      })
      if (project.gallery?.length) {
        gsap.from('.project-gallery-item', {
          y: 42,
          opacity: 0,
          duration: 0.78,
          stagger: 0.08,
          delay: origin ? 0.86 : 0.48,
          ease: 'power3.out',
        })
      }
    }, backdropRef)
    return () => context.revert()
  }, [origin, project])

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    const closeOnEscape = (event) => {
      if (event.key !== 'Escape') return
      if (galleryIndex !== null) {
        setGalleryIndex(null)
        return
      }
      closeDetail()
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', closeOnEscape)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [onClose, origin, galleryIndex])

  const showPreviousImage = () => {
    setGalleryIndex((current) => (current - 1 + project.gallery.length) % project.gallery.length)
  }

  const showNextImage = () => {
    setGalleryIndex((current) => (current + 1) % project.gallery.length)
  }

  return (
    <div
      className="project-detail-backdrop"
      ref={backdropRef}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) closeDetail()
      }}
    >
      <article
        className="project-detail"
        ref={detailRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-detail-title"
      >
        <header className="project-detail-header">
          <div>
            <span>{project.number} / PROJECT ARCHIVE</span>
            <strong>ADL SELECTED WORK</strong>
          </div>
          <button className="magnetic" onClick={closeDetail} aria-label="关闭项目详情">
            <X />
          </button>
        </header>

        <div className="project-detail-cover" ref={coverRef}>
          <img src={project.image} alt={`${project.title}主视觉`} />
          <div>
            <span>{project.type}</span>
            <h2 id="project-detail-title">{project.title}</h2>
          </div>
        </div>

        <div className="project-detail-content">
          <div className="project-detail-intro">
            <p className="eyebrow">PROJECT OVERVIEW</p>
            <p>{project.description}</p>
          </div>

          <dl className="project-detail-facts">
            <div>
              <Building2 />
              <dt>项目背景</dt>
              <dd>{project.context}</dd>
            </div>
            <div>
              <CalendarDays />
              <dt>时间</dt>
              <dd>{project.period}</dd>
            </div>
            <div>
              <UserRound />
              <dt>我的身份</dt>
              <dd>{project.role}</dd>
            </div>
          </dl>

          <section className="project-detail-timeline" aria-label={`${project.title}详细经历`}>
            {project.details.map((detail, index) => (
              <article key={detail.label}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <small>{detail.label}</small>
                  <h3>{detail.title}</h3>
                  <p>{detail.text}</p>
                </div>
              </article>
            ))}
          </section>

          {project.gallery?.length > 0 && (
            <section className={`project-gallery project-gallery-${project.number}`} aria-labelledby={`gallery-title-${project.number}`}>
              <header className="project-gallery-header">
                <div>
                  <span>VISUAL ARCHIVE / {String(project.gallery.length).padStart(2, '0')}</span>
                  <h3 id={`gallery-title-${project.number}`}>视觉档案</h3>
                </div>
                <p>{project.galleryIntro}</p>
              </header>
              <div className="project-gallery-grid">
                {project.gallery.map((item, index) => (
                  <button
                    className="project-gallery-item"
                    key={item.src}
                    onClick={() => setGalleryIndex(index)}
                    aria-label={`放大查看${item.label}`}
                  >
                    <img src={item.src} alt={item.label} loading="lazy" />
                    <span><small>{item.meta}</small><strong>{item.label}</strong></span>
                    <i aria-hidden="true"><ArrowUpRight /></i>
                  </button>
                ))}
              </div>
            </section>
          )}

          <footer className="project-detail-media">
            <span>VISUAL MATERIALS</span>
            <p>{project.mediaNote}</p>
          </footer>
        </div>
      </article>
      <div className="project-shared-cover" ref={sharedCoverRef} aria-hidden="true">
        <img src={project.image} alt="" />
        <span />
      </div>
      {galleryIndex !== null && (
        <div
          className="project-gallery-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`${project.gallery[galleryIndex].label}大图预览`}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setGalleryIndex(null)
          }}
        >
          <div className="project-gallery-lightbox-bar">
            <div>
              <span>{project.gallery[galleryIndex].meta}</span>
              <strong>{project.gallery[galleryIndex].label}</strong>
            </div>
            <button onClick={() => setGalleryIndex(null)} aria-label="关闭图片预览"><X /></button>
          </div>
          <img src={project.gallery[galleryIndex].src} alt={project.gallery[galleryIndex].label} />
          {project.gallery.length > 1 && (
            <>
              <button className="project-gallery-lightbox-previous" onClick={showPreviousImage} aria-label="上一张图片"><ChevronLeft /></button>
              <button className="project-gallery-lightbox-next" onClick={showNextImage} aria-label="下一张图片"><ChevronRight /></button>
            </>
          )}
          <span className="project-gallery-lightbox-count">
            {String(galleryIndex + 1).padStart(2, '0')} / {String(project.gallery.length).padStart(2, '0')}
          </span>
        </div>
      )}
    </div>
  )
}

function App() {
  const [introDone, setIntroDone] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeSignal, setActiveSignal] = useState(heroSignals[0])
  const [activeProject, setActiveProject] = useState(null)
  const [heroScene, setHeroScene] = useState(0)
  const [contactDraft, setContactDraft] = useState({ status: 'idle', value: '' })
  const appRef = useRef(null)
  const heroRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    const interval = window.setInterval(() => {
      setHeroScene((current) => {
        const next = (current + 1) % heroScenes.length
        setActiveSignal(heroSignals[next])
        return next
      })
    }, 6200)
    return () => window.clearInterval(interval)
  }, [])

  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    gsap.registerPlugin(ScrollTrigger)

    const context = gsap.context(() => {
      gsap.timeline({ delay: 0.62 })
        .from('.hero-kicker, .hero-role', { y: 22, opacity: 0, duration: 0.62, stagger: 0.1, ease: 'power3.out' })
        .from('.hero h1 > *', { yPercent: 115, opacity: 0, duration: 0.86, stagger: 0.1, ease: 'power4.out' }, '-=.35')
        .from('.hero-intro', { y: 24, opacity: 0, duration: 0.62, ease: 'power3.out' }, '-=.44')
        .from('.hero-character', { xPercent: 7, opacity: 0, duration: 1.05, ease: 'power3.out' }, '-=.92')
        .from('.hero-projects', { y: 36, opacity: 0, duration: 0.72, ease: 'power3.out' }, '-=.45')

      gsap.to('.world-bridge video', {
        yPercent: 18,
        ease: 'none',
        scrollTrigger: { trigger: '.world-bridge', start: 'top bottom', end: 'bottom top', scrub: 1 },
      })

      gsap.utils.toArray('[data-reveal]').forEach((section) => {
        const headings = section.querySelectorAll('.section-label, .eyebrow, .section-heading h2, .section-heading > p')
        if (headings.length) {
          gsap.from(headings, {
            y: 52,
            opacity: 0,
            duration: 0.82,
            stagger: 0.09,
            ease: 'power3.out',
            scrollTrigger: { trigger: section, start: 'top 78%', once: true },
          })
        }
      })

      gsap.from('.portrait-wrap', {
        clipPath: 'inset(0 0 100% 0)',
        y: 50,
        duration: 1.15,
        ease: 'power4.inOut',
        scrollTrigger: { trigger: '.about-grid', start: 'top 76%', once: true },
      })
      gsap.from('.about-copy > *', {
        y: 42,
        opacity: 0,
        duration: 0.72,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.about-copy', start: 'top 76%', once: true },
      })
      gsap.from('.profile-facts article, .practice-tools span', {
        y: 34,
        opacity: 0,
        duration: 0.68,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.profile-panel', start: 'top 78%', once: true },
      })
      gsap.from('.journey-line', {
        scaleX: 0,
        duration: 1.25,
        ease: 'power3.inOut',
        transformOrigin: 'left center',
        scrollTrigger: { trigger: '.practice-journey', start: 'top 78%', once: true },
      })
      gsap.from('.journey-node', {
        y: 38,
        opacity: 0,
        duration: 0.72,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.practice-journey', start: 'top 76%', once: true },
      })
      gsap.from('.project-card', {
        y: 90,
        opacity: 0,
        duration: 0.95,
        stagger: 0.14,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.project-grid', start: 'top 82%', once: true },
      })
      gsap.from('.strength-item', {
        y: 72,
        opacity: 0,
        duration: 0.82,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.strength-grid', start: 'top 80%', once: true },
      })
      gsap.from('.contact-main > *, .contact-intent > *, .contact-actions > *', {
        y: 58,
        opacity: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.contact-main', start: 'top 80%', once: true },
      })
      gsap.utils.toArray('[data-chapter-cut]').forEach((cut) => {
        gsap.from(cut.querySelector('i'), {
          scaleX: 0,
          duration: 1.1,
          ease: 'power3.inOut',
          scrollTrigger: { trigger: cut, start: 'top 88%', once: true },
        })
        gsap.from(cut.querySelectorAll('span, strong'), {
          y: 18,
          opacity: 0,
          duration: 0.55,
          stagger: 0.12,
          scrollTrigger: { trigger: cut, start: 'top 88%', once: true },
        })
      })

      const counter = document.querySelector('[data-project-count]')
      if (counter) {
        gsap.fromTo(counter, { textContent: 0 }, {
          textContent: projects.length,
          duration: 1.25,
          snap: { textContent: 1 },
          ease: 'power2.out',
          onUpdate: () => {
            counter.textContent = String(Math.round(Number(counter.textContent))).padStart(2, '0')
          },
          scrollTrigger: { trigger: '.projects .section-heading', start: 'top 78%', once: true },
        })
      }
    }, appRef)

    const tiltCard = (event) => {
      if (event.pointerType === 'touch') return
      const card = event.target.closest('.project-card')
      if (!card) return
      const rect = card.getBoundingClientRect()
      const rotateY = ((event.clientX - rect.left) / rect.width - 0.5) * 3.8
      const rotateX = -((event.clientY - rect.top) / rect.height - 0.5) * 3.8
      gsap.to(card, { rotateX, rotateY, transformPerspective: 1000, duration: 0.45, ease: 'power3.out', overwrite: 'auto' })
    }
    const resetCard = (event) => {
      const card = event.target.closest?.('.project-card')
      if (card && !card.contains(event.relatedTarget)) {
        gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.65, ease: 'power3.out' })
      }
    }
    document.addEventListener('pointermove', tiltCard, { passive: true })
    document.addEventListener('pointerout', resetCard)
    ScrollTrigger.refresh()

    return () => {
      document.removeEventListener('pointermove', tiltCard)
      document.removeEventListener('pointerout', resetCard)
      context.revert()
    }
  }, [])

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  const moveHero = (event) => {
    if (!heroRef.current || event.pointerType === 'touch') return
    const rect = heroRef.current.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width - 0.5
    const y = (event.clientY - rect.top) / rect.height - 0.5
    heroRef.current.style.setProperty('--bg-x', `${x * 14}px`)
    heroRef.current.style.setProperty('--bg-y', `${y * 10}px`)
    heroRef.current.style.setProperty('--char-x', `${x * -18}px`)
    heroRef.current.style.setProperty('--char-y', `${y * -12}px`)
    heroRef.current.style.setProperty('--ring-x', `${x * 28}px`)
    heroRef.current.style.setProperty('--ring-y', `${y * 20}px`)
    heroRef.current.style.setProperty('--rail-x', `${x * 24}px`)
    heroRef.current.style.setProperty('--rail-y', `${y * 10}px`)
  }

  const resetHero = () => {
    if (!heroRef.current) return
    ;['--bg-x', '--bg-y', '--char-x', '--char-y', '--ring-x', '--ring-y', '--rail-x', '--rail-y'].forEach((property) => {
      heroRef.current.style.setProperty(property, '0px')
    })
  }

  const openProject = (project, event) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const radius = Number.parseFloat(window.getComputedStyle(event.currentTarget).borderRadius) || 0
    setActiveProject({
      project,
      origin: { left: rect.left, top: rect.top, width: rect.width, height: rect.height, radius },
    })
  }

  const prepareContactDraft = (value) => {
    const nextValue = value.trim()
    setContactDraft(nextValue
      ? { status: 'ready', value: nextValue }
      : { status: 'empty', value: '' })
  }

  return (
    <main ref={appRef}>
      {!introDone && <IntroSequence onDone={setIntroDone} />}
      <CursorFeedback />
      <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
        <button className="wordmark magnetic" onClick={() => scrollTo('home')} aria-label="返回首页">
          ADL<span>.</span>
        </button>

        <nav className="desktop-nav" aria-label="主导航">
          {navItems.map(([label, id]) => (
            <button key={id} onClick={() => scrollTo(id)}>{label}</button>
          ))}
        </nav>

        <button className="header-contact magnetic" onClick={() => scrollTo('contact')}>
          联系合作 <ArrowUpRight size={17} />
        </button>
        <button
          className="menu-button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? '关闭菜单' : '打开菜单'}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X /> : <Menu />}
        </button>
      </header>

      <div className={`mobile-menu ${menuOpen ? 'is-open' : ''}`}>
        {navItems.map(([label, id]) => (
          <button key={id} onClick={() => scrollTo(id)}>{label}</button>
        ))}
        <button onClick={() => scrollTo('contact')}>联系合作</button>
      </div>

      <section
        className="hero"
        id="home"
        ref={heroRef}
        data-signal={activeSignal.id}
        data-scene={heroScenes[heroScene]}
        onPointerMove={moveHero}
        onPointerLeave={resetHero}
      >
        <video
          className="hero-video"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=2200&q=90"
        >
          <source
            src="/media/hero-clouds.mp4"
            type="video/mp4"
          />
        </video>
        <div className="hero-scene-layer" aria-hidden="true" />
        <div className="scene-particles" aria-hidden="true">
          {sceneParticles.map((particle) => (
            <i
              key={particle}
              style={{
                '--particle': particle,
                '--particle-x': `${(particle * 37 + 9) % 96}%`,
                '--particle-drift': `${36 + (particle % 5) * 18}px`,
              }}
            />
          ))}
        </div>
        <div className="hero-wash" />
        <div className="hero-content shell">
          <div className="hero-copy">
            <div className="hero-kicker">
              <span className="status-dot" />
              <GradientText
                className="hero-gradient-label"
                colors={['#baff28', '#f4f7f2', '#dda85f']}
                animationSpeed={7}
                pauseOnHover
              >
                FILM TECH × AI CREATION
              </GradientText>
            </div>
            <div className="hero-role">
              <span>专注</span>
              <RotatingText items={rotatingDirections} />
            </div>
            <h1>
              <strong>ADL</strong>
              <span>PORTFOLIO</span>
            </h1>
            <p className="hero-intro">
              影视技术专业本科在读，专注 AI 影像内容、<br />
              AI 漫剧与智能工作流实践。
            </p>
          </div>
          <figure className="hero-character">
            <img className="character-base" src="/media/adl-character.png" alt="ADL 的动画人物形象" />
            <img className="character-color" src="/media/adl-character.png" alt="" aria-hidden="true" />
            <span className="character-aura" aria-hidden="true" />
            <span className="character-core" aria-hidden="true" />
            <figcaption><span>ADL ALTER EGO</span><strong>01</strong></figcaption>
          </figure>
          <div className="hero-signal" aria-label="人物能力互动">
            {heroSignals.map((signal, index) => (
              <button
                key={signal.id}
                className={activeSignal.id === signal.id ? 'is-active' : ''}
                onClick={() => {
                  setActiveSignal(signal)
                  setHeroScene(index)
                }}
                aria-pressed={activeSignal.id === signal.id}
              >
                {signal.label}
              </button>
            ))}
          </div>
          <div className="signal-readout" aria-live="polite">
            <span>{activeSignal.label}</span>
            <strong>{activeSignal.title}</strong>
            <p>{activeSignal.detail}</p>
          </div>
          <button className="hero-play magnetic" onClick={() => scrollTo('projects')} aria-label="查看精选项目">
            <Play fill="currentColor" />
          </button>
        </div>

        <div className="hero-projects shell">
          <div className="hero-projects-label">
            <span>SELECTED WORK</span>
            <strong>先看作品</strong>
          </div>
          <div className="hero-project-marquee">
            <div className="hero-project-track">
              {[0, 1].map((copy) => (
                <div className="hero-project-group" aria-hidden={copy === 1 ? 'true' : undefined} key={copy}>
                  {projects.map((project) => (
                    <button
                      className="hero-project-preview"
                      key={`${copy}-${project.number}`}
                      onClick={(event) => openProject(project, event)}
                      aria-label={`查看${project.title}`}
                      tabIndex={copy === 1 ? -1 : undefined}
                    >
                      <img src={project.image} alt="" />
                      <span>{project.number}</span>
                      <strong>{project.title}</strong>
                      <ArrowUpRight />
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <button className="hero-next magnetic" onClick={() => scrollTo('about')} aria-label="继续浏览">
            <ArrowDown />
          </button>
        </div>
      </section>

      <section className="world-bridge" data-reveal aria-label="从想象进入实践">
        <video autoPlay muted loop playsInline preload="metadata" aria-hidden="true">
          <source src="/media/hero-clouds.mp4" type="video/mp4" />
        </video>
        <div className="world-bridge-shade" />
        <div className="world-bridge-content shell">
          <span>FROM IMAGINATION</span>
          <i />
          <strong>TO PRACTICE</strong>
        </div>
      </section>

      <section className="about section" id="about" data-reveal>
        <div className="about-inner shell">
        <div className="section-label"><span>01</span> 个人经历</div>
        <div className="about-grid">
          <div className="portrait-wrap">
            <img
              src="/media/adl-character.png"
              alt="ADL 的动画人物形象"
            />
            <span className="image-note">ADL / ALTER EGO</span>
          </div>

          <div className="about-copy">
            <p className="eyebrow">ABOUT ADL</p>
            <h2>
              专业是起点，<br />
              <GradientText
                className="about-gradient-line"
                colors={['#baff28', '#f4f7f2', '#dda85f', '#7fbd62']}
                animationSpeed={9}
              >
                作品才是回答。
              </GradientText>
            </h2>
            <div className="about-text">
              <p>
                我目前是影视技术专业本科生，发展方向聚焦 AI 内容创作与智能工作流。
              </p>
              <p>
                从 AI 漫剧、AI 影像到 Codex 工作流，我更在意如何把工具真正用于创作和交付，而不只是讨论技术的可能性。
              </p>
            </div>
            <button className="text-link magnetic" onClick={() => scrollTo('contact')}>
              和我聊聊 <ArrowUpRight size={18} />
            </button>
          </div>
        </div>

        <div className="profile-panel">
          <div className="profile-facts">
            <article>
              <span>01 / 当前身份</span>
              <strong>影视技术专业<br />本科在读</strong>
            </article>
            <article>
              <span>02 / 发展方向</span>
              <strong>AI 内容创作<br />智能工作流</strong>
            </article>
            <article>
              <span>03 / 实践重点</span>
              <strong>AI 漫剧 · AI 影像<br />Codex 工作流</strong>
            </article>
          </div>
          <section className="practice-journey" aria-labelledby="practice-journey-title">
            <header>
              <span>PRACTICE JOURNEY</span>
              <strong id="practice-journey-title">实践节点，不是学习曲线</strong>
              <p>每一步都对应真实参与过的现场、内容或工作流实践。</p>
            </header>
            <div className="journey-track">
              <i className="journey-line" aria-hidden="true" />
              {practiceMilestones.map((milestone, index) => (
                <article className="journey-node" key={`${milestone.time}-${milestone.label}`}>
                  <div><span>{milestone.time}</span><small>{String(index + 1).padStart(2, '0')}</small></div>
                  <em>{milestone.label}</em>
                  <h3>{milestone.title}</h3>
                  <p>{milestone.text}</p>
                </article>
              ))}
            </div>
          </section>
          <div className="practice-stack">
            <div className="practice-heading">
              <span>CURRENT PRACTICE</span>
              <strong>正在使用与持续验证</strong>
            </div>
            <div className="practice-tools">
              {practiceTools.map((tool, index) => (
                <span key={tool}><i>{String(index + 1).padStart(2, '0')}</i>{tool}</span>
              ))}
            </div>
          </div>
        </div>
        </div>
      </section>

      <ChapterCut index="02" title="SELECTED WORK / 项目档案" />

      <section className="projects section" id="projects" data-reveal>
        <div className="shell">
          <div className="section-heading">
            <div className="section-label"><span>02</span> 精选作品</div>
            <h2>做过，才算数。</h2>
            <p>这里将持续记录我的代表性实践与作品。</p>
            <div className="heading-counter"><strong data-project-count>{String(projects.length).padStart(2, '0')}</strong><span>WORKS<br />IN VIEW</span></div>
          </div>

          <div className="project-grid">
            {projects.map((project, index) => (
              <article className={`project-card ${project.className}`} key={project.number}>
                <BorderGlow
                  className="project-glow"
                  glowColor={index === 2 ? '38 62 62' : '84 100 58'}
                  colors={projectGlowPalettes[index]}
                  animated={index === 0}
                >
                  <button
                    className="project-image"
                    onClick={(event) => openProject(project, event)}
                    aria-label={`查看${project.title}详情`}
                  >
                    <img src={project.image} alt="" />
                    <div className="project-number">{project.number}</div>
                    <div className="project-cover-brand">
                      <span>ADL / SELECTED WORK</span>
                      <strong>{project.title}</strong>
                    </div>
                    <span className="project-open" aria-hidden="true">
                      <ArrowUpRight />
                    </span>
                  </button>
                </BorderGlow>
                <div className="project-meta">
                  <span>{project.type}</span>
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <ChapterCut index="03" title="CORE STRENGTHS / 能力证据" tone="dark" />

      <section className="strengths section" id="strengths" data-reveal>
        <div className="strengths-inner shell">
        <div className="section-heading split-heading">
          <div className="section-label"><span>03</span> 个人优势</div>
          <h2>技术会更新，<br />行动力不会过时。</h2>
        </div>
        <div className="strength-grid">
          {strengths.map(({ icon: Icon, index, title, text, proof }) => (
            <SpecularSurface
              as="article"
              className={`strength-item strength-item-${index}`}
              key={index}
              lineColor={index === '02' || index === '03' ? '#83bd32' : '#dda85f'}
              baseColor={index === '02' || index === '03' ? '#9bb09c' : '#52685a'}
              intensity={1.42}
              shineSize={16}
              thickness={1.35}
              proximity={260}
            >
              <div className="strength-top">
                <Icon strokeWidth={1.5} />
                <span>{index}</span>
              </div>
              <div>
                <span className="strength-proof">{proof}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            </SpecularSurface>
          ))}
        </div>
        </div>
      </section>

      <ChapterCut index="04" title="CONTACT / 建立连接" tone="deep" />

      <section className="contact" id="contact" data-reveal>
        <div className="contact-ambient" />
        <div className="contact-inner shell">
          <div className="section-label light"><span>04</span> 联系我</div>
          <div className="contact-main">
            <p>有一个想法，或一次合作？</p>
            <h2>
              一起把它<br />
              <em>
                <GradientText
                  className="contact-gradient-line"
                  colors={['#baff28', '#f4f7f2', '#dda85f', '#baff28']}
                  animationSpeed={8}
                >
                  做出来。
                </GradientText>
              </em>
            </h2>
          </div>
          <div className="contact-intent">
            <div className="contact-intent-copy">
              <span>QUICK BRIEF / 合作方向</span>
              <p
                className={contactDraft.status === 'ready' ? 'is-ready' : ''}
                aria-live="polite"
              >
                {contactDraft.status === 'ready' && <>待沟通：<strong>{contactDraft.value}</strong></>}
                {contactDraft.status === 'empty' && '请先写下一个合作方向'}
                {contactDraft.status === 'idle' && 'AI 内容 · 影像制作 · 智能工作流'}
              </p>
            </div>
            <CurvedInput
              className="contact-curved-input"
              type="text"
              width="min(760px, 100%)"
              height={68}
              bend={22}
              cornerRadius={16}
              fontSize={15}
              placeholder="写下你想合作的方向"
              ariaLabel="合作方向"
              buttonText="整理想法"
              backgroundColor="#10251a"
              textColor="#f4f7f2"
              placeholderColor="#94a198"
              borderColor="#557060"
              buttonColor="#baff28"
              buttonTextColor="#102117"
              shadowSize="lg"
              onSubmit={prepareContactDraft}
            />
          </div>
          <div className="contact-actions">
            <a
              className="contact-primary magnetic"
              href="mailto:15232888622@163.com"
              aria-label="发送邮件至 15232888622@163.com"
            >
              <Mail />
              <span><small>邮箱</small>15232888622@163.com</span>
              <ArrowUpRight />
            </a>
            <a
              className="social-button magnetic"
              href="tel:15232888622"
              aria-label="拨打电话 15232888622"
            >
              <Phone />
              <span><small>电话</small>15232888622</span>
              <ArrowUpRight />
            </a>
          </div>
          <footer>
            <span>ADL © 2026</span>
            <span>STUDENT · CREATOR · DOER</span>
            <button onClick={() => scrollTo('home')}>回到顶部 <ArrowUpRight /></button>
          </footer>
        </div>
      </section>
      {activeProject && (
        <ProjectDetail
          project={activeProject.project}
          origin={activeProject.origin}
          onClose={() => setActiveProject(null)}
        />
      )}
    </main>
  )
}

export default App
