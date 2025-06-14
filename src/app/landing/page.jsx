// /app/landing/page.jsx
"use client"

import { useState, useEffect } from "react"
import { useRouter } from 'next/navigation'
import { useAccount } from 'wagmi'
import ConnectWalletModal from '@/components/ConnectWalletModal'
import ClientOnly from '@/components/ClientOnly'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  Leaf,
  Coins,
  Users,
  MapPin,
  Recycle,
  Award,
  Menu,
  X,
  ExternalLink,
  TreePine,
  Heart,
  Zap,
  Globe,
  CheckCircle,
  ArrowRight,
  Mail,
  MessageCircle,
  Sparkles,
  Shield,
  TrendingUp,
  Clock,
  Target,
  BarChart3,
  Wallet,
  ChevronRight,
  Star,
  Play,
  Info,
  Activity,
  ActivityIcon,
  Gift,
  HelpCircle,
  Microscope,
  Trash2,
  GraduationCap,
  Droplets,
  Building2,
  Calendar,
  MapPinIcon,
  UsersIcon,
  Link as LinkIcon,
  Blocks,
  RefreshCw,
  Cpu,
  Database
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { formatAddress } from '@/lib/web3'

export default function ChontaTokenLanding() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('inicio')
  const [isMounted, setIsMounted] = useState(false)
  const [showActivityModal, setShowActivityModal] = useState(false)
  const [selectedActivity, setSelectedActivity] = useState(null)
  const [showInfografia, setShowInfografia] = useState(false)
  
  const router = useRouter()
  const { isConnected, address } = useAccount()
  
  useEffect(() => {
    setIsMounted(true)
    
    // Limpiar estado si no hay wallet conectada
    if (!isConnected && typeof window !== 'undefined') {
      const storage = window.localStorage.getItem('chonta-user-storage')
      if (storage) {
        try {
          const data = JSON.parse(storage)
          if (data.state?.user) {
            window.localStorage.setItem('chonta-user-storage', JSON.stringify({
              ...data,
              state: {
                ...data.state,
                user: null,
                tokens: 0,
                activities: []
              }
            }))
          }
        } catch (e) {
          console.error('Error clearing user state:', e)
        }
      }
    }
    
    // Manejar scroll para navbar
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
      
      // Detectar sección activa
      const sections = ['Inicio', 'que-es', 'como-funciona', 'Actividades', 'Recompensas', 'Mapa', 'FAQ']
      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section)
            break
          }
        }
      }
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isConnected])
  
  useEffect(() => {
    // Redirigir si ya está conectado
    if (isMounted && isConnected) {
      router.push('/dashboard/overview')
    }
  }, [isConnected, router, isMounted])

  // Efecto para cerrar modal de actividad cuando se conecta wallet
  useEffect(() => {
    if (isConnected && showActivityModal) {
      setShowActivityModal(false)
      setShowInfografia(false)
    }
  }, [isConnected, showActivityModal])
  
  const handleConnectWallet = () => {
    if (isConnected) {
      router.push('/dashboard/overview')
    } else {
      setShowModal(true)
    }
    // Cerrar modal de actividad si está abierto
    if (showActivityModal) {
      setShowActivityModal(false)
    }
  }

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      const offset = 80 // Altura del navbar
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - offset
      
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      })
    }
    setIsMenuOpen(false)
  }

  // Estadísticas animadas con iconos mejorados
  const stats = [
    { 
      value: "", 
      label: "Cultivo de microalgas", 
      icon: Microscope,
      description: "Contribución al río Cauca"
    },
    { 
      value: "", 
      label: "Reducción de CO₂", 
      icon: Globe,
      description: "Impacto ambiental medible"
    },
    { 
      value: "", 
      label: "Participación ciudadana", 
      icon: Users,
      description: "Comunidad activa"
    },
    { 
      value: "", 
      label: "Recuperación de espacios", 
      icon: TreePine,
      description: "Transformación urbana"
    }
  ]

  const navigationItems = [
    { id: 'Inicio', label: 'Inicio' },
    { id: 'que-es', label: '¿Qué es?' },
    { id: 'como-funciona', label: '¿Cómo funciona?' },
    { id: 'Actividades', label: 'Actividades' },
    { id: 'Recompensas', label: 'Recompensas' },
    { id: 'Mapa', label: 'Mapa' },
    { id: 'FAQ', label: 'FAQ' }
  ]

  // Datos completos de actividades con iconos Lucide
  const activitiesData = [
    {
      id: 1,
      title: "Cultivo de microalgas",
      description: "Participa en jornadas de cultivo de microalgas para contribuir en el mantenimiento del río cauca.",
      detailedDescription: "Las microalgas son organismos microscópicos que juegan un papel crucial en la purificación del agua y la reducción de CO₂. En estas jornadas aprenderás sobre técnicas de cultivo sostenible, el impacto ambiental positivo de las microalgas, y contribuirás directamente a la mejora de la calidad del agua del río Cauca. Cada sesión incluye capacitación técnica, trabajo práctico en laboratorio y actividades de campo.",
      reward: "75-150 CHT",
      color: "green",
      difficulty: "Media",
      time: "4 horas",
      next: "Sábados",
      location: "Laboratorio de Biotecnología - Universidad del Valle",
      requirements: "No se requiere experiencia previa. Se proporcionará todo el material necesario.",
      schedule: "8:00 AM - 12:00 PM",
      maxParticipants: "15 personas por sesión",
      icon: Microscope, // Icono Lucide para microalgas/laboratorio
      iconColor: "text-green-600",
      iconBg: "bg-green-100"
    },
    {
      id: 2,
      title: "Limpieza Comunitaria",
      description: "Únete a la limpieza de zonas alrededor del río Cauca y parques",
      detailedDescription: "Actividad comunitaria que busca recuperar y mantener limpios los espacios públicos de nuestra ciudad. Trabajamos en equipo para recolectar residuos, clasificar materiales reciclables y crear conciencia ambiental. Cada jornada incluye herramientas de trabajo, refrigerio y certificado de participación. Es una excelente oportunidad para conocer personas comprometidas con el medio ambiente y hacer networking verde.",
      reward: "25-75 CHT",
      color: "orange",
      difficulty: "Fácil",
      time: "3 horas",
      next: "Domingos",
      location: "Malecón del río Cauca - Parque de la Caña",
      requirements: "Ropa cómoda, zapatos cerrados, protector solar. Se proporciona guantes y bolsas.",
      schedule: "7:00 AM - 10:00 AM",
      maxParticipants: "50 personas por jornada",
      icon: Trash2, // Icono Lucide para limpieza
      iconColor: "text-orange-600",
      iconBg: "bg-orange-100"
    },
    {
      id: 3,
      title: "Educación Ambiental",
      description: "Asiste a talleres y charlas sobre sostenibilidad y medio ambiente.",
      detailedDescription: "Programa educativo integral que abarca temas como cambio climático, economía circular, tecnologías verdes y desarrollo sostenible. Cada sesión incluye conferencias magistrales, talleres prácticos, estudios de caso y debates grupales. Los participantes recibirán material didáctico digital, acceso a biblioteca virtual y certificado de asistencia. Ideal para estudiantes, profesionales y cualquier persona interesada en ampliar sus conocimientos ambientales.",
      reward: "40-80 CHT",
      color: "green",
      difficulty: "Media",
      time: "2 horas",
      next: "Martes y Jueves",
      location: "Auditorio Central - Cámara de Comercio de Cali",
      requirements: "Cuaderno para notas, interés por aprender. Material digital incluido.",
      schedule: "6:00 PM - 8:00 PM",
      maxParticipants: "100 personas por sesión",
      icon: GraduationCap, // Icono Lucide para educación
      iconColor: "text-blue-600",
      iconBg: "bg-blue-100"
    }
  ]

  const handleActivityClick = (activity) => {
    setSelectedActivity(activity)
    setShowActivityModal(true)
  }

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Navbar Mejorado */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-lg shadow-lg' 
          : 'bg-transparent'
      }`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3 md:py-4">
            {/* Logo - Optimizado para móviles */}
            <div className="flex items-center space-x-2 flex-shrink-0">
              <div className="relative">
                <Image
                  src="/Logo.png"
                  alt="Logo ChontaToken"
                  width={140}
                  height={50}
                  className="object-contain md:w-[180px] md:h-[75px]"
                  priority
                />
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
                    activeSection === item.id
                      ? 'text-green-600'
                      : scrolled ? 'text-gray-600 hover:text-green-600' : 'text-gray-700 hover:text-green-600'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* CTA Buttons - Mejorados para responsive */}
            <div className="flex items-center space-x-2 md:space-x-4">
              <ClientOnly>
                {isConnected ? (
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="hidden sm:flex items-center gap-2 px-2 md:px-3 py-1 md:py-2 bg-green-50 rounded-lg">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-xs md:text-sm font-medium text-green-700">{formatAddress(address)}</span>
                    </div>
                    <Button 
                      onClick={() => router.push('/dashboard/overview')}
                      className="cursor-pointer bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg text-xs md:text-sm px-3 md:px-4 py-2"
                      size="sm"
                    >
                      <span className="hidden sm:inline">Ir al Dashboard</span>
                      <span className="sm:hidden">Dashboard</span>
                      <ArrowRight className="ml-1 md:ml-2 w-3 h-3 md:w-4 md:h-4" />
                    </Button>
                  </div>
                ) : (
                  <>
                    {/* Botón completo en desktop y tablet */}
                    <Button 
                      onClick={handleConnectWallet}
                      className="hidden sm:flex bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg cursor-pointer text-sm px-4 py-2"
                      size="sm"
                    >
                      <Wallet className="mr-2 w-4 h-4" />
                      Conectar Wallet
                    </Button>

                    {/* Solo ícono en móviles */}
                    <button
                      onClick={handleConnectWallet}
                      className="cursor-pointer flex sm:hidden items-center justify-center p-2 rounded-lg bg-green-600 text-white shadow-lg"
                    >
                      <Wallet className="w-4 h-4" />
                    </button>
                  </>
                )}
              </ClientOnly>

              {/* Mobile menu button */}
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)} 
                className={`lg:hidden p-2 rounded-lg transition-colors cursor-pointer ${
                  scrolled ? 'hover:bg-gray-100' : 'hover:bg-white/10'
                }`}
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation - Mejorado */}
          {isMenuOpen && (
            <div className="lg:hidden absolute top-full left-0 right-0 bg-white shadow-lg border-t z-40">
              <nav className="px-4 py-4">
                <div className="space-y-1">
                  {navigationItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-colors cursor-pointer ${
                        activeSection === item.id
                          ? 'bg-green-50 text-green-600'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-green-600'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section Mejorado */}
      <section id="Inicio" className="relative pt-16 pb-12 md:pt-20 md:pb-20 lg:pt-32 lg:pb-32 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-emerald-50/50 to-white"></div>
        <div className="absolute top-10 md:top-20 right-0 w-48 h-48 md:w-96 md:h-96 bg-green-200 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 md:w-96 md:h-96 bg-emerald-200 rounded-full blur-3xl opacity-20"></div>
        
        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Texto y botones */}
            <div className="space-y-6 md:space-y-8 text-center lg:text-left">
              <div className="space-y-4 md:space-y-6">
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
                  <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">
                    <Sparkles className="mr-1 w-3 h-3" />
                    Revolución Ambiental Blockchain
                  </Badge>
                  <Badge variant="outline" className="border-green-600 text-green-600 text-xs">
                    <Shield className="mr-1 w-3 h-3" />
                    100% Seguro
                  </Badge>
                </div>
                
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Transforma a Cali en una ciudad <span className="text-green-600">más verde y sostenible</span>
                </h1>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center lg:justify-start">
                <Button
                  size="lg"
                  onClick={handleConnectWallet}
                  className="text-base md:text-lg px-6 md:px-8 py-4 md:py-6 bg-gradient-to-r from-yellow-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg transform hover:scale-105 transition-all cursor-pointer w-full sm:w-auto"
                >
                  {isConnected ? 'Ir al Dashboard' : 'Comenzar Ahora'}
                  <ArrowRight className="ml-2 w-4 h-4 md:w-5 md:h-5" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => scrollToSection('como-funciona')}
                  className="text-base md:text-lg px-6 md:px-8 py-4 md:py-6 border-green-600 text-green-600 hover:bg-green-50 w-full sm:w-auto"
                >
                  <Play className="mr-2 w-4 h-4 md:w-5 md:h-5" />
                  Ver Cómo Funciona
                </Button>
              </div>

              {/* Trust Indicators - Mejorados para responsive */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 pt-6 md:pt-8 border-t">
                {stats.map((stat, index) => {
                  const IconComponent = stat.icon
                  return (
                    <div key={index} className="flex flex-col items-center justify-center text-center p-2">
                      <div className="flex justify-center mb-2 md:mb-3">
                        <div className="relative w-10 h-10 md:w-12 md:h-12 bg-white rounded-full shadow-sm flex items-center justify-center">
                          <IconComponent className="w-6 h-6 md:w-8 md:h-8 text-green-600" />
                        </div>
                      </div>
                      <p className="text-xs md:text-sm font-bold text-gray-900 leading-tight">{stat.label}</p>
                      <p className="text-xs text-gray-600 mt-1 hidden md:block">{stat.description}</p>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Hero Image/Animation - Mejorado */}
            <div className="relative mt-8 lg:mt-0">
              <div className="relative mx-auto max-w-sm md:max-w-md lg:max-w-lg">
                <Image
                  src="/Colombia.jpg"
                  alt="Ilustración Cali"
                  width={500}
                  height={300}
                  className="w-full h-auto object-contain rounded-2xl shadow-2xl"
                />

                {/* Floating Cards - Ajustados para responsive */}
                <div className="absolute -top-2 -right-2 md:-top-4 md:-right-4 bg-white rounded-lg shadow-lg p-2 md:p-3 animate-float max-w-[120px] md:max-w-none">
                  <div className="flex items-center gap-1 md:gap-2">
                    <div className="w-6 h-6 md:w-8 md:h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-3 h-3 md:w-4 md:h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Líderes ambientales</p>
                    </div>
                  </div>
                </div>
                
                <div className="absolute -bottom-2 -left-2 md:-bottom-4 md:-left-4 bg-white rounded-lg shadow-lg p-2 md:p-3 animate-float-delayed max-w-[120px] md:max-w-none">
                  <div className="flex items-center gap-1 md:gap-2">
                    <div className="w-6 h-6 md:w-8 md:h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="w-3 h-3 md:w-4 md:h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Participantes</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ¿Qué es? - Mejorado */}
      <section id="que-es" className="py-12 md:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center space-y-4 mb-12 md:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
                ¿Qué es Chontacoin?
              </h2>
              <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
                La primera plataforma blockchain que promueve el activismo ambiental en Colombia 
              </p>
            </div>

            {/* Cards Grid - Mejorado para responsive */}
            <div className="grid md:grid-cols-3 gap-6 mb-12 md:mb-16">
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center mb-4 mx-auto">
                    {/* Icono Blockchain/Cadena */}
                    <div className="relative">
                      <LinkIcon className="w-10 h-10 text-green-600 animate-pulse" />
                      <div className="absolute -top-1 -right-1">
                        <Leaf className="w-4 h-4 text-emerald-500" />
                      </div>
                    </div>
                  </div>
                  <CardTitle className="text-lg md:text-xl">Blockchain Verde</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-center text-sm md:text-base">
                    Tecnología descentralizada que garantiza transparencia total en cada recompensa ambiental otorgada.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center mb-4 mx-auto">
                    {/* Icono Economía Circular con animación */}
                    <div className="relative">
                      <RefreshCw className="w-10 h-10 text-blue-600 animate-spin-slow" />
                      <Coins className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 text-indigo-600" />
                    </div>
                  </div>
                  <CardTitle className="text-lg md:text-xl">Economía Circular</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-center text-sm md:text-base">
                    Tokens que puedes canjear por beneficios reales en comercios locales comprometidos.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-pink-100 rounded-xl flex items-center justify-center mb-4 mx-auto">
                    {/* Icono Impacto Colectivo */}
                    <div className="relative">
                      <div className="relative flex h-10 w-10">
                        <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></div>
                        <div className="relative inline-flex rounded-full h-10 w-10 bg-green-600 items-center justify-center">
                          <Users className="w-5 h-5 text-white" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <CardTitle className="text-lg md:text-xl">Impacto Colectivo</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-center text-sm md:text-base">
                    Una comunidad activa que trabaja unida para transformar Cali en una ciudad modelo.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Feature Highlights - Mejorado */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 md:p-8">
              <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-center">
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                    Más que una criptomoneda
                  </h3>
                  <ul className="space-y-3">
                    {[
                      "Verificación comunitaria de todas las actividades",
                      "Smart contracts auditados y seguros",
                      "Impacto medible y transparente",
                      "Recompensas inmediatas y tangibles"
                    ].map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 text-sm md:text-base">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-24 h-24 md:w-32 md:h-32 bg-white rounded-full shadow-lg">
                    <Shield className="w-12 h-12 md:w-16 md:h-16 text-green-600" />
                  </div>
                  <p className="mt-4 text-base md:text-lg font-semibold text-gray-900">
                    100% Transparente
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ¿Cómo funciona? - Mejorado */}
      <section id="como-funciona" className="py-12 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
              ¿Cómo funciona Chontacoin?
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              4 pasos simples para comenzar a ganar mientras cuidas a Cali
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {[
                {
                  step: 1,
                  title: "Conecta tu Wallet",
                  description: "Usa MetaMask o cualquier wallet compatible. Es gratis y toma menos de 2 minutos.",
                  color: "green"
                },
                {
                  step: 2,
                  title: "Únete a Actividades",
                  description: "Elige entre las actividades ambientales que tenemos disponibles.",
                  color: "orange"
                },
                {
                  step: 3,
                  title: "Participa y Verifica",
                  description: "Completa actividades y súbelas con foto, ubicación para verificación.",
                  color: "orange"
                },
                {
                  step: 4,
                  title: "Gana Tokens",
                  description: "Recibe CHT tokens instantáneamente y canjéalos por recompensas reales.",
                  color: "green"
                }
              ].map((item, index) => (
                <div key={index} className="relative">
                  {/* Connector Line - Solo en desktop */}
                  {index < 3 && (
                    <div className="hidden lg:block absolute top-12 left-full w-full z-10">
                      <ChevronRight className="w-6 h-6 text-gray-300 -ml-3" />
                    </div>
                  )}
                  
                  <div className="text-center space-y-4 group h-full">
                    <div className={`
                      w-20 h-20 md:w-24 md:h-24 mx-auto rounded-2xl flex items-center justify-center
                      bg-gradient-to-br shadow-lg transform transition-all group-hover:scale-110
                      ${item.color === 'green' ? 'from-green-400 to-emerald-500' : ''}
                      ${item.color === 'orange' ? 'from-orange-400 to-red-500' : ''}
                    `}>
                      <span className="text-2xl md:text-3xl font-bold text-white">{item.step}</span>
                    </div>
                    <h3 className="text-lg md:text-xl font-semibold text-gray-900">{item.title}</h3>
                    <p className="text-gray-600 text-sm md:text-base leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-12 md:mt-16 text-center">
              <Button
                size="lg"
                onClick={handleConnectWallet}
                className="px-6 md:px-8 py-4 md:py-6 text-base md:text-lg bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg cursor-pointer"
              >
                Comenzar Ahora
                <ArrowRight className="ml-2 w-4 h-4 md:w-5 md:h-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Actividades - Mejorado */}
      <section id="Actividades" className="py-12 md:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
              Gana Tokens con cada acción
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Múltiples formas de contribuir y ganar recompensas todos los días
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activitiesData.map((activity, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 overflow-hidden h-full flex flex-col">
                <div className={`h-2 bg-gradient-to-r ${
                  activity.color === 'green' ? 'from-green-400 to-emerald-500' : ''
                } ${
                  activity.color === 'orange' ? 'from-orange-400 to-red-500' : ''
                }`}></div>
                
                <CardHeader className="flex-grow">
                  <div className="flex justify-between items-start mb-4">
                    <div className={`w-12 h-12 md:w-14 md:h-14 rounded-lg flex items-center justify-center ${activity.iconBg}`}>
                      <activity.icon className={`w-6 h-6 md:w-8 md:h-8 ${activity.iconColor}`} />
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                      {activity.reward}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg md:text-xl mb-2">{activity.title}</CardTitle>
                  <CardDescription className="text-sm md:text-base leading-relaxed">{activity.description}</CardDescription>
                </CardHeader>
                
                <CardContent className="pt-0 space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-xs">
                      <Clock className="mr-1 w-3 h-3" />
                      {activity.time}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {activity.difficulty}
                    </Badge>
                    <Badge variant="outline" className="text-xs text-green-600 border-green-600">
                      {activity.next}
                    </Badge>
                  </div>
                  
                  {/* Botón Ver Detalles */}
                  <Button
                    onClick={() => handleActivityClick(activity)}
                    variant="outline"
                    className="w-full border-green-600 text-green-600 hover:bg-green-50 transition-colors"
                    size="sm"
                  >
                    <Info className="mr-2 w-4 h-4" />
                    Ver Detalles
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Recompensas - Mejorado */}
      <section id="Recompensas" className="py-12 md:py-20 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-12 md:mb-16">
            <Badge className="bg-green-100 text-green-800 border-green-200">
              <Gift className="mr-1 w-3 h-3" />
              Marketplace de Recompensas
            </Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
              Convierte tus Tokens en beneficios reales
            </h2>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6 md:gap-8">
              {[
                {
                  title: "Descuentos Comerciales",
                  description: "10-30% de descuento en tiendas y restaurantes aliados",
                  cost: "100 CHT",
                  icon: Award,
                  available: true,
                  popular: true
                },
                {
                  title: "Transporte Gratuito",
                  description: "Viajes gratis en MIO",
                  cost: "50 CHT",
                  icon: MapPin,
                  available: true,
                  popular: false
                }
              ].map((reward, index) => (
                <Card key={index} className="relative border-0 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 h-full flex flex-col">
                  {reward.popular && (
                    <div className="absolute -top-3 right-4 z-10">
                      <Badge className="bg-orange-500 text-white">
                        <Star className="mr-1 w-3 h-3" />
                        Popular
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="text-center pt-8 flex-grow">
                    <div className={`w-16 h-16 md:w-20 md:h-20 mx-auto rounded-full flex items-center justify-center shadow-lg ${
                      reward.available 
                        ? 'bg-gradient-to-br from-green-400 to-emerald-500' 
                        : 'bg-gray-300'
                    }`}>
                      <reward.icon className="w-8 h-8 md:w-10 md:h-10 text-white" />
                    </div>
                    <CardTitle className="mt-4 text-lg md:text-xl">{reward.title}</CardTitle>
                    <p className="text-gray-600 text-sm md:text-base mt-2">{reward.description}</p>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="space-y-3">
                      <p className="text-xl md:text-2xl font-bold text-green-600">{reward.cost}</p>
                      <Button 
                        className={`w-full ${
                          reward.available
                            ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700'
                            : 'bg-gray-400 cursor-not-allowed'
                        }`}
                        disabled={!reward.available}
                      >
                        {reward.available ? 'Canjear Ahora' : 'Próximamente'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

       {/* Mapa de Impacto - Mejorado */}
      <section id="Mapa" className="py-12 md:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">Mapa de Impacto en Cali</h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Visualiza las áreas en las que queremos generar un impacto positivo en nuestra ciudad
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div className="space-y-6 md:space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                  {[
                    { icon: "/microalga1.png", label: "Cultivos de microalgas", bg: "bg-green-50" },
                    { icon: "/limpieza comunitaria1.png", label: "Limpieza comunitaria", bg: "bg-blue-50" },
                    { icon: "/Ciudadana.png", label: "Participación ciudadana", bg: "bg-orange-50" }
                  ].map((item, index) => (
                    <div key={index} className={`text-center p-4 md:p-6 ${item.bg} rounded-2xl flex flex-col items-center justify-center`}>
                      <div className="relative w-16 h-16 md:w-20 md:h-20 mb-3">
                        <Image
                          src={item.icon}
                          alt={item.label}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <p className="text-sm md:text-base font-semibold text-gray-700">{item.label}</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl md:text-2xl font-semibold text-gray-900">Zonas de Mayor Impacto</h3>
                  <div className="space-y-3">
                    {[
                      { name: "Comuna 2 - Centro", activity: "Alta Actividad", color: "green" },
                      { name: "Comuna 19 - Meléndez", activity: "Media Actividad", color: "blue" }
                    ].map((zone, index) => (
                      <div key={index} className="flex items-center justify-between p-3 md:p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <MapPin className={`w-5 h-5 ${zone.color === 'green' ? 'text-green-600' : 'text-blue-600'}`} />
                          <span className="font-medium text-sm md:text-base">{zone.name}</span>
                        </div>
                        <Badge className={`${zone.color === 'green' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'} text-xs`}>
                          {zone.activity}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="aspect-square bg-gradient-to-br from-green-100 to-blue-100 rounded-2xl flex items-center justify-center overflow-hidden shadow-lg min-h-[300px] md:min-h-[400px]">
                  {/* Mapa Interactivo */}
                  <iframe
                    title="Mapa de Impacto Chontacoin"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3976.870167944447!2d-76.5320066846757!3d3.451646497495384!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e30a6e5e5e5e5e5%3A0x1234567890abcdef!2sCali%2C%20Valle%20del%20Cauca!5e0!3m2!1ses!2sco!4v1717777777777!5m2!1ses!2sco"
                    width="100%"
                    height="100%"
                    style={{ border: 0, minHeight: 300 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="rounded-2xl"
                  ></iframe>
                </div>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none bg-black/20 rounded-2xl">
                  <MapPin className="w-12 h-12 md:w-16 md:h-16 text-white mb-2 drop-shadow-lg" />
                  <h3 className="text-lg md:text-2xl font-semibold text-white bg-black/50 px-4 py-2 rounded-lg mb-2 text-center">
                    Mapa Interactivo de Impacto
                  </h3>
                  <p className="text-sm md:text-base text-white bg-black/50 px-4 py-2 rounded-lg text-center max-w-xs">
                    Explora en tiempo real las zonas y actividades de Chontacoin.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ - Mejorado */}
      <section id="FAQ" className="py-12 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
              Todo lo que necesitas saber
            </h2>
          </div>

          <div className="max-w-4xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {[
                {
                  question: "¿Necesito saber de criptomonedas para participar?",
                  answer: "No, nuestra plataforma está diseñada para ser simple. Solo necesitas un smartphone y seguir los pasos. Te guiamos en todo el proceso de configuración de tu wallet digital."
                },
                {
                  question: "¿Cuánto valen los Chonta Tokens?",
                  answer: "Los CHT están diseñados para canjearse por recompensas locales. Su valor está respaldado por los comercios aliados y el impacto ambiental que representan, no por especulación."
                },
                {
                  question: "¿Cómo se verifican las actividades?",
                  answer: "Usamos un sistema triple: fotos con geolocalización, verificación comunitaria y validación de organizadores. Todo queda registrado en la blockchain para máxima transparencia."
                },
                {
                  question: "¿Puedo participar si soy menor de edad?",
                  answer: "Sí, los menores pueden participar con autorización de sus padres o tutores. Es una excelente forma de involucrar a toda la familia en el cuidado ambiental."
                },
                {
                  question: "¿Qué pasa si pierdo acceso a mi wallet?",
                  answer: "Es importante guardar tu frase de recuperación en un lugar seguro. Si la pierdes, no podremos recuperar tu acceso. Por eso ofrecemos guías detalladas de seguridad."
                },
              ].map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="bg-white rounded-lg px-4 md:px-6 border shadow-sm">
                  <AccordionTrigger className="text-left hover:no-underline text-sm md:text-base py-4">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 text-sm md:text-base">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA Final - Mejorado */}
      <section className="py-12 md:py-20 bg-gradient-to-br from-green-600 to-emerald-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 md:mb-6">
              ¿Listo para Transformar tu Ciudad?
            </h2>
            <p className="text-lg md:text-xl text-green-50 mb-6 md:mb-8">
              Únete a la revolución ambiental de Cali. Comienza a ganar tokens hoy mismo.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8 md:mb-12">
              <Button
                size="lg"
                onClick={handleConnectWallet}
                className="px-6 md:px-8 py-4 md:py-6 text-base md:text-lg bg-white text-green-600 hover:bg-gray-100 shadow-lg cursor-pointer w-full sm:w-auto"
              >
                <Wallet className="mr-2 w-4 h-4 md:w-5 md:h-5" />
                {isConnected ? 'Ir al Dashboard' : 'Conectar Wallet Ahora'}
              </Button>
            </div>
            
            {/* Stats - Mejorado para responsive */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
              {stats.map((stat, index) => {
                const IconComponent = stat.icon
                return (
                  <div key={index} className="text-center">
                    <div className="flex justify-center mb-2">
                      <div className="w-8 h-8 md:w-12 md:h-12 flex items-center justify-center">
                        <IconComponent className="w-6 h-6 md:w-8 md:h-8 text-white" />
                      </div>
                    </div>
                    <p className="text-xs md:text-sm text-green-100 leading-tight">{stat.label}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Footer Mejorado */}
      <footer className="bg-gray-900 text-white py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-8 md:mb-12">
            <div className="sm:col-span-2 md:col-span-1 space-y-4">
              <div className="flex items-center space-x-3">
                <Image
                  src="/recurso 2logo.png"
                  alt="Logo ChontaToken"
                  width={140}
                  height={44}
                  className="object-contain"
                />
              </div>
              <p className="text-gray-400 text-sm md:text-base">
                Transformando Cali a través de la tecnología blockchain y el compromiso ciudadano.
              </p>
              <div className="flex gap-3">
                <button className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors">
                  <MessageCircle className="w-5 h-5" />
                </button>
                <button className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors">
                  <Mail className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-sm md:text-base">Plataforma</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <button onClick={() => scrollToSection("como-funciona")} className="hover:text-white transition-colors">
                    Cómo Funciona
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection("Actividades")} className="hover:text-white transition-colors">
                    Actividades
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection("Recompensas")} className="hover:text-white transition-colors">
                    Recompensas
                  </button>
                </li>
                <li>
                  <Link href="/whitepaper" className="hover:text-white transition-colors">
                    Whitepaper
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-sm md:text-base">Comunidad</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <Link href="/blog" className="hover:text-white transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/eventos" className="hover:text-white transition-colors">
                    Eventos
                  </Link>
                </li>
                <li>
                  <Link href="/voluntarios" className="hover:text-white transition-colors">
                    Voluntarios
                  </Link>
                </li>
                <li>
                  <Link href="/comercios" className="hover:text-white transition-colors">
                    Comercios Aliados
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-sm md:text-base">Legal</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <Link href="/terminos" className="hover:text-white transition-colors">
                    Términos y Condiciones
                  </Link>
                </li>
                <li>
                  <Link href="/privacidad" className="hover:text-white transition-colors">
                    Política de Privacidad
                  </Link>
                </li>
                <li>
                  <Link href="/cookies" className="hover:text-white transition-colors">
                    Política de Cookies
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-6 md:pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-400 text-center md:text-left text-sm">
                &copy; {new Date().getFullYear()} Chontacoin. Todos los derechos reservados.
              </p>
              <div className="flex items-center gap-4 md:gap-6 text-xs md:text-sm text-gray-400">
                <span>Hecho con 💚 en Cali, Colombia</span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Modal de conexión de wallet */}
      <ClientOnly>
        <ConnectWalletModal 
          isOpen={showModal} 
          onClose={() => setShowModal(false)} 
        />
      </ClientOnly>

      {/* Modal de Detalles de Actividad */}
      {showActivityModal && selectedActivity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header del Modal */}
            <div className="relative">
              <div className={`h-2 bg-gradient-to-r ${
                selectedActivity.color === 'green' ? 'from-green-400 to-emerald-500' : 'from-orange-400 to-red-500'
              }`}></div>
              
              <div className="p-6 pb-0">
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-4">
                    <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${
                      selectedActivity.color === 'green' ? 'bg-green-100' : 'bg-orange-100'
                    }`}>
                      <div className="relative w-12 h-12">
                        <Image
                          src={selectedActivity.customIcon}
                          alt={selectedActivity.title}
                          fill
                          className="object-contain"
                        />
                      </div>
                    </div>
                    <div>
                      <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{selectedActivity.title}</h2>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          {selectedActivity.reward}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {selectedActivity.difficulty}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowActivityModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6 text-gray-500" />
                  </button>
                </div>
              </div>
            </div>

            {/* Contenido del Modal */}
            <div className="p-6 space-y-6">
              {/* Imagen Principal o Infografía */}
              {showInfografia ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-gray-900">Infografía Informativa</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowInfografia(false)}
                      className="border-gray-300"
                    >
                      <ArrowRight className="w-4 h-4 mr-1 transform rotate-180" />
                      Volver
                    </Button>
                  </div>
                  
                  {/* Contenedor de Infografía */}
                  <div className="relative bg-white rounded-xl border-2 border-gray-100 overflow-hidden">
                    <div className="aspect-[3/4] relative bg-gradient-to-br from-green-50 to-blue-50">
                      {/* Placeholder para la infografía */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
                        <div className="text-center space-y-6 max-w-md">
                          <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center ${selectedActivity.iconBg}`}>
                            <selectedActivity.icon className={`w-12 h-12 ${selectedActivity.iconColor}`} />
                          </div>
                          
                          <div>
                            <h4 className="text-2xl font-bold text-gray-800 mb-2">
                              {selectedActivity.title}
                            </h4>
                            <p className="text-gray-600 mb-4">Guía Visual Completa</p>
                          </div>
                          
                          {/* Elementos informativos de la infografía */}
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="bg-white/80 rounded-lg p-3 text-center">
                              <Clock className="w-6 h-6 mx-auto mb-1 text-green-600" />
                              <p className="font-medium">{selectedActivity.time}</p>
                              <p className="text-gray-600 text-xs">Duración</p>
                            </div>
                            <div className="bg-white/80 rounded-lg p-3 text-center">
                              <Users className="w-6 h-6 mx-auto mb-1 text-blue-600" />
                              <p className="font-medium">{selectedActivity.maxParticipants.split(' ')[0]}</p>
                              <p className="text-gray-600 text-xs">Participantes</p>
                            </div>
                            <div className="bg-white/80 rounded-lg p-3 text-center">
                              <Target className="w-6 h-6 mx-auto mb-1 text-orange-600" />
                              <p className="font-medium">{selectedActivity.difficulty}</p>
                              <p className="text-gray-600 text-xs">Dificultad</p>
                            </div>
                            <div className="bg-white/80 rounded-lg p-3 text-center">
                              <Coins className="w-6 h-6 mx-auto mb-1 text-yellow-600" />
                              <p className="font-medium">{selectedActivity.reward}</p>
                              <p className="text-gray-600 text-xs">Recompensa</p>
                            </div>
                          </div>
                          
                          {/* Pasos o información clave */}
                          <div className="bg-white/90 rounded-lg p-4 text-left">
                            <h5 className="font-semibold text-gray-800 mb-2">Pasos Principales:</h5>
                            <ul className="space-y-1 text-sm text-gray-700">
                              <li className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-full bg-green-500 text-white text-xs flex items-center justify-center font-bold">1</div>
                                Registro y preparación
                              </li>
                              <li className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-full bg-green-500 text-white text-xs flex items-center justify-center font-bold">2</div>
                                Participación activa
                              </li>
                              <li className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-full bg-green-500 text-white text-xs flex items-center justify-center font-bold">3</div>
                                Verificación y tokens
                              </li>
                            </ul>
                          </div>
                        </div>
                        
                        {/* Decoraciones */}
                        <div className="absolute top-4 right-4 opacity-20">
                          <Sparkles className="w-8 h-8 text-green-600" />
                        </div>
                        <div className="absolute bottom-4 left-4 opacity-20">
                          <Heart className="w-6 h-6 text-orange-600" />
                        </div>
                        <div className="absolute top-1/2 left-4 opacity-10">
                          <TreePine className="w-12 h-12 text-green-600" />
                        </div>
                        <div className="absolute top-1/3 right-4 opacity-10">
                          <Globe className="w-10 h-10 text-blue-600" />
                        </div>
                      </div>
                    </div>
                    
                    {/* Footer de la infografía */}
                    <div className="bg-gray-50 px-6 py-3 border-t">
                      <p className="text-xs text-gray-600 text-center">
                        📍 {selectedActivity.location} • 📅 {selectedActivity.next} • ⏰ {selectedActivity.schedule}
                      </p>
                    </div>
                  </div>
                  
                  {/* Botón de descarga (opcional) */}
                  <div className="text-center">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-green-600 text-green-600 hover:bg-green-50"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Descargar PDF
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Vista Normal - Imagen Principal */}
                  <div className="relative h-64 md:h-80 bg-gradient-to-br from-green-50 to-blue-50 rounded-xl overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center space-y-4">
                        <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center ${
                          selectedActivity.color === 'green' ? 'bg-green-100' : 'bg-orange-100'
                        }`}>
                          <div className="relative w-16 h-16">
                            <Image
                              src={selectedActivity.customIcon}
                              alt={selectedActivity.title}
                              fill
                              className="object-contain"
                            />
                          </div>
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-800">Imagen Representativa</h3>
                          <p className="text-gray-600">Actividad: {selectedActivity.title}</p>
                        </div>
                      </div>
                      
                      {/* Decoración */}
                      <div className="absolute top-4 right-4 opacity-20">
                        <Sparkles className="w-8 h-8 text-green-600" />
                      </div>
                      <div className="absolute bottom-4 left-4 opacity-20">
                        <Heart className="w-6 h-6 text-orange-600" />
                      </div>
                    </div>
                    
                    {/* Botón Ver Infografía sobrepuesto */}
                    <div className="absolute bottom-4 right-4">
                      <Button
                        onClick={() => setShowInfografia(true)}
                        size="sm"
                        className="bg-white/90 hover:bg-white text-gray-700 border border-gray-200 shadow-lg"
                      >
                        <BarChart3 className="w-4 h-4 mr-2" />
                        Ver Infografía
                      </Button>
                    </div>
                  </div>

                  {/* Información Detallada */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Descripción</h3>
                        <p className="text-gray-600 leading-relaxed">{selectedActivity.detailedDescription}</p>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Detalles de la Actividad</h3>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <Clock className="w-5 h-5 text-gray-400" />
                            <div>
                              <span className="font-medium">Horario:</span>
                              <span className="text-gray-600 ml-2">{selectedActivity.schedule}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <MapPin className="w-5 h-5 text-gray-400" />
                            <div>
                              <span className="font-medium">Ubicación:</span>
                              <span className="text-gray-600 ml-2">{selectedActivity.location}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Users className="w-5 h-5 text-gray-400" />
                            <div>
                              <span className="font-medium">Participantes:</span>
                              <span className="text-gray-600 ml-2">{selectedActivity.maxParticipants}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Requisitos</h3>
                        <p className="text-gray-600">{selectedActivity.requirements}</p>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Información Adicional</h3>
                        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Próxima sesión:</span>
                            <span className="font-medium text-gray-900">{selectedActivity.next}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Duración:</span>
                            <span className="font-medium text-gray-900">{selectedActivity.time}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Dificultad:</span>
                            <span className="font-medium text-gray-900">{selectedActivity.difficulty}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Recompensa:</span>
                            <Badge className="bg-green-100 text-green-800 font-bold">
                              {selectedActivity.reward}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Botones de Acción */}
              {!showInfografia && (
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                  <Button
                    onClick={handleConnectWallet}
                    className={`flex-1 ${
                      selectedActivity.color === 'green' 
                        ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700' 
                        : 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700'
                    } text-white shadow-lg cursor-pointer`}
                    size="lg"
                  >
                    <Wallet className="mr-2 w-5 h-5" />
                    {isConnected ? 'Inscribirse Ahora' : 'Conectar Wallet para Participar'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowActivityModal(false)}
                    className="sm:w-auto px-6"
                    size="lg"
                  >
                    Cerrar
                  </Button>
                </div>
              )}

              {/* Footer del Modal */}
              {!showInfografia && (
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <p className="text-sm text-green-700">
                    <Shield className="inline w-4 h-4 mr-1" />
                    Todas las actividades están verificadas y son 100% seguras
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Styles for animations - Optimizados */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 3s ease-in-out infinite;
          animation-delay: 1.5s;
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
        
        /* Responsive adjustments */
        @media (max-width: 640px) {
          .animate-spin-slow {
            animation: spin-slow 4s linear infinite;
          }
        }
      `}</style>
    </div>
  )
}