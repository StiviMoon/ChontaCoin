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
      const sections = ['Inicio', '¿Que es?', '¿Funciona?', 'Actividades', 'Recompensas', 'Mapa', 'FAQ',]
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
  
  const handleConnectWallet = () => {
    if (isConnected) {
      router.push('/dashboard/overview')
    } else {
      setShowModal(true)
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

  // Estadísticas animadas
  const stats = [
    { value: "", label: "Cultivo de microalgas", icon: TreePine },
    { value: "", label: " Reducción de CO₂ ", icon: Globe },
    { value: "", label: "Participación ciudadana", icon: Users },
    { value: "", label: " Recuperación de espacios", icon: MapPin }
  ]



  return (
    <div className="min-h-screen bg-white">
      {/* Navbar Mejorado */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-lg shadow-lg' 
          : 'bg-transparent'
      }`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <Image
                src="/recurso 2logo.png"
                alt="Logo ChontaToken"
                width={180}
                height={56}
                className="object-contain"
                priority
              />
              
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {['Inicio', '¿Que es?', '¿Funciona?', 'Actividades', 'Recompensas', 'Mapa', 'FAQ'].map((section) => (
                <button
                  key={section}
                  onClick={() => scrollToSection(section)}
                  className={`text-sm font-medium transition-colors cursor-pointer ${
                    activeSection === section
                      ? 'text-green-600'
                      : scrolled ? 'text-gray-600 hover:text-green-600' : 'text-gray-700 hover:text-green-600'
                  }`}
                >
                  {section.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </button>
              ))}
            </nav>

            {/* CTA Buttons */}
            <div className="flex items-center space-x-4">
              <ClientOnly>
                {isConnected ? (
                  <div className="flex items-center gap-3">
                    <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-green-50 rounded-lg">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium text-green-700">{formatAddress(address)}</span>
                    </div>
                    <Button 
                      onClick={() => router.push('/dashboard/overview')}
                      className="cursor-pointer bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg"
                    >
                      Ir al Dashboard
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <>
                    {/* Botón completo en desktop y tablet */}
                    <Button 
                      onClick={handleConnectWallet}
                      className="hidden sm:flex bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg cursor-pointer"
                    >
                      <Wallet className="mr-2 w-4 h-4" />
                      Conectar Wallet
                    </Button>

                    {/* Solo ícono en móviles */}
                    <button
                      onClick={handleConnectWallet}
                      className="cursor-pointer flex sm:hidden items-center justify-center p-2 rounded-lg bg-green-600 text-white shadow-lg"
                    >
                      <Wallet className="w-5 h-5" />
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
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="fixed top-[64px] left-0 right-0 z-50 bg-white shadow-md lg:hidden">
              <nav className="flex flex-col space-y-2 ">
                {['Inicio', '¿Que es?', '¿Funciona?', 'Actividades', 'Recompensas', 'Mapa', 'FAQ'].map((section) => (
                  <button
                    key={section}
                    onClick={() => scrollToSection(section)}
                    className={`text-left px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                      activeSection === section
                        ? 'bg-green-50 text-green-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-green-600'
                    }`}
                  >
                    {section.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </button>
                ))}
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section Mejorado */}
      <section id="Inicio" className="relative pt-20 pb-20 lg:pt-32 lg:pb-32 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-emerald-50/50 to-white"></div>
        <div className="absolute top-20 right-0 w-96 h-96 bg-green-200 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-200 rounded-full blur-3xl opacity-20"></div>
        
        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Texto y botones */}
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    <Sparkles className="mr-1 w-3 h-3" />
                    Revolución Ambiental Blockchain
                  </Badge>
                  <Badge variant="outline" className="border-green-600 text-green-600">
                    <Shield className="mr-1 w-3 h-3" />
                    100% Seguro
                  </Badge>
                </div>
                
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Transforma a Cali en una ciudad <span className="text-green-600">más verde y sostenible</span>
                </h1>
                
                
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  onClick={handleConnectWallet}
                  className="text-lg px-8 py-6 bg-gradient-to-r from-yellow-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg transform hover:scale-105 transition-all cursor-pointer"
                >
                  {isConnected ? 'Ir al Dashboard' : 'Comenzar Ahora'}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => scrollToSection('como-funciona')}
                  className="text-lg px-8 py-6 border-green-600 text-green-600 hover:bg-green-50"
                >
                  <Play className="mr-2 w-5 h-5" />
                  Ver Cómo Funciona
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t">
                {stats.map((stat, index) => {
                  if (stat.label.trim().toLowerCase() === "cultivo de microalgas") {
                    return (
                      <div key={index} className="flex flex-col items-center justify-center text-center">
                        <div className="flex justify-center mb-2">
                          <Image
                            src="/microalga1.png"
                            alt="Cultivo de microalgas"
                            width={50}
                            height={50}
                            className="object-contain rounded-full"
                          />
                        </div>
                        <p className="text-base font-bold text-gray-900">{stat.label.trim()}</p>
                      </div>
                    )
                  }

                  if (stat.label.trim().toLowerCase() === "participación ciudadana") {
                    return (
                      <div key={index} className="flex flex-col items-center justify-center text-center">
                        <div className="flex justify-center mb-2">
                          <Image
                            src="/sociedad.png"
                            alt="Participación ciudadana"
                            width={50}
                            height={50}
                            className="object-contain rounded-full"
                          />
                        </div>
                        <p className="text-base font-bold text-gray-900">{stat.label.trim()}</p>
                      </div>
                    )
                  }

                  if (stat.label.trim().toLowerCase() === "recuperación de espacios") {
                    return (
                      <div key={index} className="flex flex-col items-center justify-center text-center">
                        <div className="flex justify-center mb-2">
                          <div
                            style={{
                              width: 50,
                              height: 50,
                              background: "#fff",
                              borderRadius: "50%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              overflow: "hidden",
                              border: "2px " // opcional: borde gris claro
                            }}
                          >
                            <Image
                              src="/cambio.png"
                              alt="Recuperación de espacios"
                              width={44}
                              height={44}
                              style={{ objectFit: "contain", objectPosition: "center" }}
                            />
                          </div>
                        </div>
                        <p className="text-base font-bold text-gray-900">{stat.label.trim()}</p>
                      </div>
                    )
                  }

                  if (stat.label.trim().toLowerCase() === "reducción de co₂") {
                    return (
                      <div key={index} className="flex flex-col items-center justify-center text-center">
                        <div className="flex justify-center mb-2">
                          <Image
                            src="/Co.png"
                            alt="Reducción de CO₂"
                            width={50}
                            height={50}
                            className="object-contain rounded-full"
                          />
                        </div>
                        <p className="text-base font-bold text-gray-900">{stat.label.trim()}</p>
                      </div>
                    )
                  }

                  // Otros stats igual que antes
                  const Icon = stat.icon
                  return (
                    <div key={index} className="flex flex-col items-center justify-center text-center">
                      <div className="flex justify-center mb-2">
                        <Icon className="w-5 h-5 text-green-600" />
                      </div>
                      <p className="text-base font-bold text-gray-900">{stat.label.trim()}</p>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Hero Image/Animation */}
            <div className="relative">
              {/* Solo la ilustración, sin caja verde */}
              <Image
                src="/Cali.tiff"
                alt="Ilustración ChontaToken"
                width={320}
                height={180}
                className="mx-auto object-contain rounded-2xl shadow-2xl"
              />

              {/* Floating Cards */}
              <div className="absolute -top-4 -right-4 bg-white rounded-lg shadow-lg p-3 animate-float">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Lideres en proyectos ambientales</p>
                  </div>
                </div>
              </div>
              
              <div className="absolute -bottom-4 -left-4 bg-white rounded-lg shadow-lg p-3 animate-float-delayed">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Image
                      src="/sociedad.png"
                      alt="Participación ciudadana"
                      width={24}
                      height={24}
                      className="object-contain"
                    />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Participantes</p>
                    {/* <p className="font-bold text-blue-600">200+</p> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

     

      
      <section id="¿Que es?" className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center space-y-4 mb-16">
              {/* <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                <Info className="mr-1 w-3 h-3" />
                Sobre el Proyecto
              </Badge> */}
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
                ¿Qué es Chontacoin?
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                La primera plataforma blockchain que promueve el activismo ambiental en Colombia 
              </p>
            </div>

            {/* Cards Grid */}
            <div className="grid md:grid-cols-3 gap-6 mb-16">
             <Card className="border-0 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
  <CardHeader>
    <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center mb-4">
      {/* Microalga animada */}
      <span className="relative block w-10 h-10">
        {/* Cuerpo */}
        <span
          className="absolute left-0 top-0 w-10 h-10 rounded-full border-4 border-[#168aad] bg-[#76c893] shadow-inner"
          style={{
            boxShadow: "inset 0 0 10px rgba(0,0,0,0.2)",
            animation: "microalga-rotar 12s linear infinite"
          }}
        >
          {/* Cloroplastos */}
          <span className="absolute w-3.5 h-2.5 bg-[#b5e48c] rounded-full" style={{ top: "20px", left: "10px", transform: "rotate(15deg)" }} />
          <span className="absolute w-3.5 h-2.5 bg-[#b5e48c] rounded-full" style={{ top: "30px", left: "28px", transform: "rotate(15deg)" }} />
          <span className="absolute w-3.5 h-2.5 bg-[#b5e48c] rounded-full" style={{ top: "40px", left: "16px", transform: "rotate(15deg)" }} />
          {/* Núcleo */}
          <span className="absolute w-5 h-5 bg-[#52b788] rounded-full" style={{
            top: "18px",
            left: "18px",
            boxShadow: "inset 0 0 5px rgba(0,0,0,0.2)"
          }} />
        </span>
        {/* Flagelo eliminado */}
      </span>
    </div>
    <CardTitle>Blockchain Verde</CardTitle>
  </CardHeader>
  <CardContent>
  <p className="text-gray-600 text-left">
    Tecnología descentralizada que garantiza transparencia total en cada recompensa ambiental otorgada.
  </p>
</CardContent>
              </Card>

             <Card className="border-0 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
  <CardHeader>
    <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center mb-4">
 {/* Ícono animado economía circular */}
    <div className="circular-icon" aria-label="Economía circular" role="img">
      <span className="flecha flecha1"></span>
      <span className="flecha flecha2"></span>
      <span className="flecha flecha3"></span>
    </div>
    </div>
    <CardTitle>Economía Circular</CardTitle>
  </CardHeader>
  <CardContent>
  <p className="text-gray-600 text-left">
    Tokens que puedes canjear por beneficios reales en comercios locales comprometidos.
  </p>
   
  </CardContent>
</Card>
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                <CardHeader>
<div className="w-14 h-14 bg-gradient-to-br from-green-100 to-pink-100 rounded-xl flex items-center justify-center mb-4">
  <span className="relative flex h-8 w-8">
    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
    <span className="relative inline-flex rounded-full h-8 w-8 bg-green-600"></span>
  </span>
</div>
                  <CardTitle>Impacto Colectivo</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-left">
                    Una comunidad activa que trabaja unida para transformar Cali en una ciudad modelo.
                  </p>
                </CardContent>
              </Card>
            </div>
            {/* Feature Highlights */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Más que una criptomoneda
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                      <span className="text-gray-700">Verificación comunitaria de todas las actividades</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                      <span className="text-gray-700">Smart contracts auditados y seguros</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                      <span className="text-gray-700">Impacto medible y transparente</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                      <span className="text-gray-700">Recompensas inmediatas y tangibles</span>
                    </li>
                  </ul>
                </div>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-32 h-32 bg-white rounded-full shadow-lg">
                    <Image
                      src="/transparencia.png"
                      alt="100% Transparente"
                      width={80}
                      height={80}
                      className="object-contain"
                    />
                  </div>
                  <p className="mt-4 text-lg font-semibold text-gray-900">
                    100% Transparente
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ¿Cómo funciona? - Mejorado */}
      <section id="¿Funciona?" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
           
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              ¿Cómo funciona Chontacoin?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              4 pasos simples para comenzar a ganar mientras cuidas a Cali
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  step: 1,
                  title: "Conecta tu Wallet",
                  description: "Usa MetaMask o cualquier wallet compatible. Es gratis y toma menos de 2 minutos.",
                  icon: Wallet,
                  color: "green"
                },
                {
                  step: 2,
                  title: "Únete a Actividades",
                  description: "Elige entre las actividades ambientales que tenemos disponibles.",
                  icon: Users,
                  color: "orange"
                },
                {
                  step: 3,
                  title: "Participa y Verifica",
                  description: "Completa actividades y súbelas con foto, ubicación  para verificación.",
                  icon: CheckCircle,
                  color: "orange"
                },
                {
                  step: 4,
                  title: "Gana Tokens",
                  description: "Recibe CHT tokens instantáneamente y canjéalos por recompensas reales.",
                  icon: Coins,
                  color: "green"
                }
              ].map((item, index) => (
                <div key={index} className="relative">
                  {/* Connector Line */}
                  {index < 3 && (
                    <div className="hidden lg:block absolute top-12 left-full w-full">
                      <ChevronRight className="w-6 h-6 text-gray-300 -ml-3" />
                    </div>
                  )}
                  
                  <div className="text-center space-y-4 group">
                    <div className={`
                      w-24 h-24 mx-auto rounded-2xl flex items-center justify-center
                      bg-gradient-to-br shadow-lg transform transition-all group-hover:scale-110
                      ${item.color === 'green' && 'from-green-400 to-emerald-500'}
                      ${item.color === 'blue' && 'from-blue-400 to-indigo-500'}
                      ${item.color === 'purple' && 'from-purple-400 to-pink-500'}
                      ${item.color === 'orange' && 'from-orange-400 to-red-500'}
                    `}>
                      <span className="text-3xl font-bold text-white">{item.step}</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-16 text-center">
              <Button
                size="lg"
                onClick={handleConnectWallet}
                className="px-8 py-6 text-lg bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg cursor-pointer"
              >
                Comenzar Ahora
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
             
      
            </div>
          </div>
        </div>
      </section>

      {/* Actividades - Mejorado */}
      <section id="Actividades" className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Gana Tokens con cada acción
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Múltiples formas de contribuir y ganar recompensas todos los días
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Cultivo de microalgas",
                description: "Participa en jornadas de cultivo de microalgas para contribuir en el mantenimiento del río cauca.",
                reward: "75-150 CHT",
              
                color: "green",
                difficulty: "Media",
                time: "4 horas",
                next: "Sábados",
                customIcon: "/microalga1.png" 
              },
              {
                title: "Limpieza Comunitaria",
                description: "Únete a la limpieza de zonas alrededor del río Cauca y parques",
                reward: "25-75 CHT",
                icon: Heart,
                color: "orange",
                difficulty: "Fácil",
                time: "3 horas",
                next: "Domingos",
                customIcon: "/limpieza comunitaria.png"
              },
              {
                title: "Educación Ambiental",
                description: "Asiste a talleres y charlas sobre sostenibilidad y medio ambiente.",
                reward: "40-80 CHT",
              
                color: "green",
                difficulty: "Media",
                time: "2 horas",
                next: "Martes y Jueves",
                customIcon: "/educacion.png"
              },
              
            ].map((activity, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 overflow-hidden">
                <div className={`h-2 bg-gradient-to-r ${
                  activity.color === 'green' && 'from-green-400 to-emerald-500'
                } ${
                  activity.color === 'blue' && 'from-blue-400 to-indigo-500'
                } ${
                  activity.color === 'purple' && 'from-purple-400 to-pink-500'
                } ${
                  activity.color === 'orange' && 'from-orange-400 to-red-500'
                } ${
                  activity.color === 'teal' && 'from-teal-400 to-cyan-500'
                } ${
                  activity.color === 'pink' && 'from-pink-400 to-rose-500'
                }`}></div>
                
                <CardHeader>
                  <div className="flex justify-between items-start mb-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center bg-${activity.color}-100`}>
                      {activity.customIcon ? (
                        <Image
                          src={activity.customIcon}
                          alt={activity.title}
                          width={45}
                          height={45}
                          className="object-contain"
                        />
                      ) : (
                        <activity.icon className={`w-6 h-6 text-${activity.color}-600`} />
                      )}
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {activity.reward}
                    </Badge>
                  </div>
                  <CardTitle>{activity.title}</CardTitle>
                  <CardDescription>{activity.description}</CardDescription>
                </CardHeader>
                
                <CardContent>
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
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Recompensas - Mejorado */}
      <section id="Recompensas" className="py-20 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <Badge className="bg-green-100 text-green-800 border-green-200">
              <Gift className="mr-1 w-3 h-3" />
              Marketplace de Recompensas
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Convierte tus Tokens en beneficios reales
            </h2>
          </div>

          <div className="flex flex-wrap justify-center gap-6 mb-12">
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
                description: "Viajes gratis en MIO ",
                cost: "50 CHT",
                icon: MapPin,
                available: true,
                popular: false
              }
            ].map((reward, index) => (
              <div
                key={index}
                className="flex justify-center w-full md:w-auto"
                style={{ minWidth: 288, maxWidth: 320, flex: "1 1 320px" }} // Fuerza mismo ancho mínimo/máximo
              >
                <Card className="relative border-0 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 w-full max-w-xs mx-auto flex flex-col h-full">
                  {reward.popular && (
                    <div className="absolute -top-3 right-4 z-10">
                      <Badge className="bg-orange-500 text-white">
                        <Star className="mr-1 w-3 h-3" />
                        Popular
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="text-center pt-8">
                    <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center shadow-lg ${
                      reward.available 
                        ? 'bg-gradient-to-br from-green-400 to-emerald-500' 
                        : 'bg-gray-300'
                    }`}>
                      <reward.icon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="mt-4">{reward.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center flex-1 flex flex-col justify-between">
                    <p className="text-gray-600 mb-4">{reward.description}</p>
                    <div className="space-y-2">
                      <p className="text-2xl font-bold text-green-600">{reward.cost}</p>
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
              </div>
            ))}
          </div>

         
        </div>
      </section>

       {/* Mapa de Impacto */}
      <section id="Mapa" className="py-20 bg-white m-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
          
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Mapa de Impacto en Cali</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Visualiza las áreas en las que queremos generar un impacto positivo en nuestra ciudad
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-6 bg-green-50 rounded-2xl flex flex-col items-center justify-center">
                  <Image
                    src="/microalga1.png"
                    alt="Microalga"
                    width={100}
                    height={100}
                    className="object-contain mx-auto"
                  />
                  <p className="mt-3 text-green-700 font-semibold text-lg">Cultivos de microalgas</p>
                </div>
                <div className="text-center p-6 bg-blue-50 rounded-2xl flex flex-col items-center justify-center">
                  <Image
                    src="/limpieza comunitaria1.png"
                    alt="Limpieza comunitaria"
                    width={80}
                    height={80}
                    className="object-contain mx-auto"
                  />
                  <div className="text-green-700 font-semibold text-lg mt-3">Limpieza comunitaria</div>
                </div>
                
                <div className="text-center p-6 bg-orange-50 rounded-2xl">
                 
                  <Image
                    src="/Ciudadana.png"
                    alt="Participación ciudadana"
                    width={80}
                    height={80}
                    className="object-contain mx-auto"
                  />
                   <p className="mt-3 text-orange-700 font-semibold text-lg">Participación ciudadana</p>
              </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-2xl font-semibold text-gray-900">Zonas de Mayor Impacto</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-5 h-5 text-green-600" />
                      <span className="font-medium">Comuna 2 - Centro</span>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Alta Actividad</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-5 h-5 text-blue-600" />
                      <span className="font-medium">Comuna 19 - Meléndez</span>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">Media Actividad</Badge>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-green-100 to-blue-100 rounded-2xl flex items-center justify-center overflow-hidden shadow-lg">
                {/* Mapa Interactivo real (puedes cambiar el src por tu propio mapa) */}
                <iframe
                  title="Mapa de Impacto Chontacoin"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3976.870167944447!2d-76.5320066846757!3d3.451646497495384!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e30a6e5e5e5e5e5%3A0x1234567890abcdef!2sCali%2C%20Valle%20del%20Cauca!5e0!3m2!1ses!2sco!4v1717777777777!5m2!1ses!2sco"
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: 320, minWidth: 320 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="rounded-2xl"
                ></iframe>
              </div>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <MapPin className="w-16 h-16 text-green-600 mb-2 drop-shadow-lg" />
                <h3 className="text-2xl font-semibold text-gray-900 bg-white/80 px-4 py-1 rounded-lg mb-2">
                  Mapa Interactivo de Impacto
                </h3>
                <p className="text-gray-700 bg-white/80 px-4 py-1 rounded-lg text-center max-w-xs">
                  Explora en tiempo real las zonas y actividades que se piensan llevar a cabo en Chontacoin.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ - Mejorado */}
      <section id="FAQ" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Todo lo que necesitas saber
            </h2>
          </div>

          <div className="max-w-3xl mx-auto">
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
                <AccordionItem key={index} value={`item-${index}`} className="bg-white rounded-lg px-6 border shadow-sm">
                  <AccordionTrigger className="text-left hover:no-underline">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-gradient-to-br from-green-600 to-emerald-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              ¿Listo para Transformar tu Ciudad?
            </h2>
            <p className="text-xl text-green-50 mb-8">
              Únete a la revolución ambiental de Cali. Comienza a ganar tokens hoy mismo.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button
                size="lg"
                onClick={handleConnectWallet}
                className="px-8 py-6 text-lg bg-white text-green-600 hover:bg-gray-100 shadow-lg cursor-pointer"
              >
                <Wallet className="mr-2 w-5 h-5" />
                {isConnected ? 'Ir al Dashboard' : 'Conectar Wallet Ahora'}
              </Button>
             
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                  <p className="text-green-100">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer Mejorado */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                {/* Cambia el texto y/o agrega un logo aquí */}
                <Image
                  src="/recurso 2logo.png"
                  alt="Logo ChontaToken"
                  width={160}
                  height={160}
                  className="object-contain"
                />
                <span className="text-xl font-bold text-green-400"></span>
              </div>
              <p className="text-gray-400">
                Transformando Cali a través de la tecnología blockchain y el compromiso ciudadano.
              </p>
              <div className="flex gap-4">
                {/* Social Icons */}
                <button className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors">
                  <MessageCircle className="w-5 h-5" />
                </button>
                <button className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors">
                  <Mail className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Plataforma</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <button onClick={() => scrollToSection("como-funciona")} className="hover:text-white transition-colors">
                    Cómo Funciona
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection("actividades")} className="hover:text-white transition-colors">
                    Actividades
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection("recompensas")} className="hover:text-white transition-colors">
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
              <h3 className="font-semibold mb-4">Comunidad</h3>
              <ul className="space-y-2 text-gray-400">
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
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400">
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

          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-400 text-center md:text-left">
                &copy; {new Date().getFullYear()} Chontacoin. Todos los derechos reservados.
              </p>
              <div className="flex items-center gap-6 text-sm text-gray-400">
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

      {/* Styles for animations */}
      <style jsx global>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        @keyframes float-delayed {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        @keyframes microalga-rotar {
          0% { transform: rotate(0deg);}
          100% { transform: rotate(360deg);}
        }
        @keyframes microalga-ondear {
          0% { transform: rotate(10deg);}
          100% { transform: rotate(-10deg);}
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 3s ease-in-out infinite;
          animation-delay: 1.5s;
        }
        .circular-icon {
          position: relative;
          width: 80px;
          height: 80px;
          margin: 16px auto 0;
          animation: girar 10s linear infinite;
        }
        .flecha {
          position: absolute;
          width: 28px;
          height: 28px;
          border: 4px solid #52b788;
          border-radius: 50%;
          border-right: 4px solid transparent;
          border-bottom: 4px solid transparent;
        }
        .flecha1 { top: 0; left: 26px; transform: rotate(0deg);}
        .flecha2 { top: 26px; right: 0; transform: rotate(120deg);}
        .flecha3 { bottom: 0; left: 26px; transform: rotate(240deg);}
        @keyframes girar {
          0% { transform: rotate(0deg);}
          100% { transform: rotate(360deg);}
        }
      `}</style>
    </div>
  )
}