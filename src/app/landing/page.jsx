"use client"

import { useState } from "react"
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
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function ChontaTokenLanding() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
    setIsMenuOpen(false)
  }

  return (
    <div className="min-h-screen bg-white ">
      {/* Navbar */}
      <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">ChontaCoin</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              <button
                onClick={() => scrollToSection("inicio")}
                className="text-gray-600 hover:text-green-600 transition-colors"
              >
                Inicio
              </button>
              <button
                onClick={() => scrollToSection("que-es")}
                className="text-gray-600 hover:text-green-600 transition-colors"
              >
                ¿Qué es Chonta Token?
              </button>
              <button
                onClick={() => scrollToSection("como-funciona")}
                className="text-gray-600 hover:text-green-600 transition-colors"
              >
                ¿Cómo funciona?
              </button>
              <button
                onClick={() => scrollToSection("actividades")}
                className="text-gray-600 hover:text-green-600 transition-colors"
              >
                Actividades
              </button>
              <button
                onClick={() => scrollToSection("recompensas")}
                className="text-gray-600 hover:text-green-600 transition-colors"
              >
                Recompensas
              </button>
              <button
                onClick={() => scrollToSection("mapa")}
                className="text-gray-600 hover:text-green-600 transition-colors"
              >
                Mapa de Impacto
              </button>
              <button
                onClick={() => scrollToSection("faq")}
                className="text-gray-600 hover:text-green-600 transition-colors"
              >
                FAQ
              </button>
              <button
                onClick={() => scrollToSection("contacto")}
                className="text-gray-600 hover:text-green-600 transition-colors"
              >
                Contacto
              </button>
            </nav>

            {/* Connect Wallet Button */}
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
                  Conectar Wallet
                </Button>
              </Link>

              {/* Mobile menu button */}
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden p-2">
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="lg:hidden py-4 border-t">
              <nav className="flex flex-col space-y-4">
                <button
                  onClick={() => scrollToSection("inicio")}
                  className="text-left text-gray-600 hover:text-green-600 transition-colors"
                >
                  Inicio
                </button>
                <button
                  onClick={() => scrollToSection("que-es")}
                  className="text-left text-gray-600 hover:text-green-600 transition-colors"
                >
                  ¿Qué es Chonta Token?
                </button>
                <button
                  onClick={() => scrollToSection("como-funciona")}
                  className="text-left text-gray-600 hover:text-green-600 transition-colors"
                >
                  ¿Cómo funciona?
                </button>
                <button
                  onClick={() => scrollToSection("actividades")}
                  className="text-left text-gray-600 hover:text-green-600 transition-colors"
                >
                  Actividades
                </button>
                <button
                  onClick={() => scrollToSection("recompensas")}
                  className="text-left text-gray-600 hover:text-green-600 transition-colors"
                >
                  Recompensas
                </button>
                <button
                  onClick={() => scrollToSection("mapa")}
                  className="text-left text-gray-600 hover:text-green-600 transition-colors"
                >
                  Mapa de Impacto
                </button>
                <button
                  onClick={() => scrollToSection("faq")}
                  className="text-left text-gray-600 hover:text-green-600 transition-colors"
                >
                  FAQ
                </button>
                <button
                  onClick={() => scrollToSection("contacto")}
                  className="text-left text-gray-600 hover:text-green-600 transition-colors"
                >
                  Contacto
                </button>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section id="inicio" className="py-20 lg:py-32 bg-gradient-to-br from-green-50 via-blue-50 to-white mx-4 sm:mx-6 lg:mx-12 rounded-3xl ">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Texto y botones */}
            <div className="space-y-8">
                  <div className="space-y-6">
                    <Badge
                      variant="secondary"
                      className="w-fit bg-green-100 text-green-800"
                    >
                      🌱 Revolución Ambiental Blockchain
                    </Badge>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                      Transforma tu ciudad,
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">
                        {" "}
                        gana recompensas
                      </span>
                    </h1>
                    <p className="text-xl text-gray-600 leading-relaxed">
                      Únete a la revolución ambiental con Chonta Token. Un proyecto
                      blockchain que premia a los ciudadanos comprometidos con el cambio
                      social y ambiental en Cali.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      size="lg"
                      className="text-lg px-8 py-6 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                      onClick={() => scrollToSection("como-funciona")}
                    >
                      Participa Ahora
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      className="text-lg px-8 py-6 border-green-600 text-green-600 hover:bg-green-50"
                    >
                      Ver Video
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>100% Gratuito</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Impacto Real</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Recompensas Inmediatas</span>
                    </div>
                  </div>
                </div>

                {/* Imagen */}
                <div className="relative w-full">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-500 rounded-3xl blur-3xl opacity-20"></div>
                  <Image
                    src="/placeholder.svg?height=600&width=800"
                    alt="Cali Ciudad Sostenible"
                    width={800}
                    height={600}
                    className="relative w-full h-auto rounded-2xl shadow-2xl"
                  />
                </div>
              </div>
            </div>
          </section>


      {/* ¿Qué es Chonta Token? */}
      <section id="que-es" className="py-20 bg-white m-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <Badge variant="secondary" className="w-fit mx-auto bg-blue-100 text-blue-800">
                Sobre el Proyecto
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">¿Qué es Chonta Token?</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                    <Leaf className="w-6 h-6 text-green-600" />
                  </div>
                  <CardTitle className="text-center">Blockchain Ambiental</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-center">
                    Una plataforma descentralizada que utiliza tecnología blockchain para incentivar acciones
                    ambientales positivas en la ciudad de Cali.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                    <Coins className="w-6 h-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-center">Tokens de Recompensa</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-center">
                    Gana Chonta Tokens por participar en actividades de limpieza, reciclaje y mejoramiento urbano
                    verificadas por la comunidad.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                  <CardTitle className="text-center">Comunidad Activa</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-center">
                    Únete a una comunidad de ciudadanos comprometidos que trabajan juntos para transformar Cali en una
                    ciudad más sostenible.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8 mt-12">
              <p className="text-lg text-gray-700 leading-relaxed">
                <strong>Chonta Token</strong> es más que una criptomoneda: es un movimiento social que conecta la
                tecnología blockchain con el activismo ambiental. Cada token representa una acción concreta hacia un
                futuro más sostenible para nuestra ciudad.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ¿Cómo funciona? */}
      <section id="como-funciona" className="py-20 bg-gray-50 m-12 rounded-3xl">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <Badge variant="secondary" className="w-fit mx-auto bg-green-100 text-green-800">
              Proceso Simple
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">¿Cómo funciona Chonta Token?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Participar es fácil y cada acción cuenta para transformar nuestra ciudad
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Regístrate</h3>
              <p className="text-gray-600">Conecta tu wallet y únete a la plataforma Chonta Token de forma gratuita</p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Participa</h3>
              <p className="text-gray-600">
                Únete a actividades de limpieza, reciclaje y mejoramiento urbano en tu zona
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Verifica</h3>
              <p className="text-gray-600">La comunidad verifica tu participación usando fotos y geolocalización</p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-white">4</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Recibe Tokens</h3>
              <p className="text-gray-600">Gana Chonta Tokens que puedes canjear por recompensas locales</p>
            </div>
          </div>
        </div>
      </section>

      {/* Actividades */}
      <section id="actividades" className="py-20 bg-white m-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <Badge variant="secondary" className="w-fit mx-auto bg-blue-100 text-blue-800">
              Actividades
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Actividades que Generan Tokens</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Cada acción positiva es recompensada con Chonta Tokens
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Recycle className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle>Jornadas de Reciclaje</CardTitle>
                <CardDescription>Recompensa: 50-100 CHT</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Participa en jornadas de reciclaje comunitario y separación de residuos en tu barrio.
                </p>
                <Badge variant="outline" className="text-green-600 border-green-600">
                  Próxima: 15 Enero
                </Badge>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <TreePine className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle>Siembra de Árboles</CardTitle>
                <CardDescription>Recompensa: 75-150 CHT</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Ayuda a reforestar espacios públicos y crear pulmones verdes en la ciudad.
                </p>
                <Badge variant="outline" className="text-blue-600 border-blue-600">
                  Próxima: 20 Enero
                </Badge>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Heart className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle>Limpieza de Espacios</CardTitle>
                <CardDescription>Recompensa: 25-75 CHT</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Limpia parques, calles y espacios públicos para mantener nuestra ciudad hermosa.
                </p>
                <Badge variant="outline" className="text-purple-600 border-purple-600">
                  Próxima: 18 Enero
                </Badge>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-orange-600" />
                </div>
                <CardTitle>Ahorro Energético</CardTitle>
                <CardDescription>Recompensa: 30-60 CHT</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Implementa prácticas de ahorro energético y compártelas con la comunidad.
                </p>
                <Badge variant="outline" className="text-orange-600 border-orange-600">
                  Continua
                </Badge>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                  <Globe className="w-6 h-6 text-teal-600" />
                </div>
                <CardTitle>Educación Ambiental</CardTitle>
                <CardDescription>Recompensa: 40-80 CHT</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Organiza o participa en talleres de educación ambiental en colegios y comunidades.
                </p>
                <Badge variant="outline" className="text-teal-600 border-teal-600">
                  Próxima: 25 Enero
                </Badge>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-pink-600" />
                </div>
                <CardTitle>Voluntariado Social</CardTitle>
                <CardDescription>Recompensa: 60-120 CHT</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Participa en actividades de voluntariado que beneficien a comunidades vulnerables.
                </p>
                <Badge variant="outline" className="text-pink-600 border-pink-600">
                  Próxima: 22 Enero
                </Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Recompensas */}
      <section id="recompensas" className="py-20 bg-gradient-to-br from-green-50 to-blue-50 m-12 rounded-3xl">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <Badge variant="secondary" className="w-fit mx-auto bg-green-100 text-green-800">
              Recompensas
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Canjea tus Chonta Tokens</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Usa tus tokens para obtener beneficios reales en comercios locales
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <CardTitle>Descuentos Comerciales</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-2xl font-bold text-green-600 mb-2">100 CHT</p>
                <p className="text-gray-600">10% de descuento en comercios aliados</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Coins className="w-8 h-8 text-white" />
                </div>
                <CardTitle>Transporte Público</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-2xl font-bold text-blue-600 mb-2">50 CHT</p>
                <p className="text-gray-600">1 viaje gratis en MIO</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TreePine className="w-8 h-8 text-white" />
                </div>
                <CardTitle>Productos Ecológicos</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-2xl font-bold text-purple-600 mb-2">200 CHT</p>
                <p className="text-gray-600">Kit de productos sostenibles</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <CardTitle>Experiencias</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-2xl font-bold text-orange-600 mb-2">300 CHT</p>
                <p className="text-gray-600">Tours ecológicos en Cali</p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 text-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
            >
              Ver Todas las Recompensas
              <ExternalLink className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Mapa de Impacto */}
      <section id="mapa" className="py-20 bg-white m-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <Badge variant="secondary" className="w-fit mx-auto bg-blue-100 text-blue-800">
              Impacto Real
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Mapa de Impacto en Cali</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Visualiza el impacto positivo que estamos generando juntos en nuestra ciudad
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-6 bg-green-50 rounded-2xl">
                  <div className="text-3xl font-bold text-green-600 mb-2">2,450</div>
                  <div className="text-gray-600">Árboles Plantados</div>
                </div>
                <div className="text-center p-6 bg-blue-50 rounded-2xl">
                  <div className="text-3xl font-bold text-blue-600 mb-2">15.2</div>
                  <div className="text-gray-600">Toneladas Recicladas</div>
                </div>
                <div className="text-center p-6 bg-purple-50 rounded-2xl">
                  <div className="text-3xl font-bold text-purple-600 mb-2">89</div>
                  <div className="text-gray-600">Espacios Limpiados</div>
                </div>
                <div className="text-center p-6 bg-orange-50 rounded-2xl">
                  <div className="text-3xl font-bold text-orange-600 mb-2">1,200</div>
                  <div className="text-gray-600">Participantes Activos</div>
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
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-5 h-5 text-purple-600" />
                      <span className="font-medium">Comuna 22 - Montebello</span>
                    </div>
                    <Badge className="bg-purple-100 text-purple-800">Creciendo</Badge>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-green-100 to-blue-100 rounded-2xl flex items-center justify-center">
                <div className="text-center space-y-4">
                  <MapPin className="w-16 h-16 text-green-600 mx-auto" />
                  <h3 className="text-2xl font-semibold text-gray-900">Mapa Interactivo</h3>
                  <p className="text-gray-600 max-w-sm">
                    Próximamente: Mapa interactivo en tiempo real mostrando todas las actividades y su impacto en Cali
                  </p>
                  <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
                    Ver Mapa Completo
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 bg-gray-50 m-12 rounded-3xl">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <Badge variant="secondary" className="w-fit mx-auto bg-green-100 text-green-800">
              Preguntas Frecuentes
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">¿Tienes dudas sobre Chonta Token?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Aquí encontrarás respuestas a las preguntas más comunes
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="item-1" className="bg-white rounded-lg px-6">
                <AccordionTrigger className="text-left">¿Qué es exactamente un Chonta Token?</AccordionTrigger>
                <AccordionContent>
                  Un Chonta Token (CHT) es una criptomoneda basada en blockchain Ethereum que se otorga como recompensa
                  por participar en actividades ambientales y sociales verificadas en Cali. Cada token representa una
                  contribución real al mejoramiento de nuestra ciudad.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="bg-white rounded-lg px-6">
                <AccordionTrigger className="text-left">
                  ¿Cómo se verifica mi participación en las actividades?
                </AccordionTrigger>
                <AccordionContent>
                  Utilizamos un sistema de verificación comunitaria que incluye fotos con geolocalización, testimonios
                  de otros participantes y validación por parte de organizadores locales. Todo esto se registra de forma
                  transparente en la blockchain.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="bg-white rounded-lg px-6">
                <AccordionTrigger className="text-left">
                  ¿Necesito conocimientos técnicos para participar?
                </AccordionTrigger>
                <AccordionContent>
                  No necesitas conocimientos técnicos. Nuestra plataforma está diseñada para ser fácil de usar. Solo
                  necesitas un smartphone y seguir las instrucciones paso a paso. Te ayudamos a configurar tu wallet
                  digital de forma sencilla.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="bg-white rounded-lg px-6">
                <AccordionTrigger className="text-left">¿Los tokens tienen valor monetario real?</AccordionTrigger>
                <AccordionContent>
                  Los Chonta Tokens están diseñados principalmente para canjearse por recompensas locales (descuentos,
                  productos, servicios). Su valor se basa en el impacto social y ambiental que representan, no en
                  especulación financiera.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5" className="bg-white rounded-lg px-6">
                <AccordionTrigger className="text-left">
                  ¿Qué pasa si no puedo asistir a una actividad programada?
                </AccordionTrigger>
                <AccordionContent>
                  No hay problema. Las actividades son voluntarias y hay múltiples oportunidades cada semana. También
                  puedes proponer nuevas actividades o participar en acciones individuales que luego pueden ser
                  verificadas por la comunidad.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6" className="bg-white rounded-lg px-6">
                <AccordionTrigger className="text-left">
                  ¿Cómo puedo convertirme en verificador de actividades?
                </AccordionTrigger>
                <AccordionContent>
                  Después de participar activamente durante un mes y acumular al menos 200 CHT, puedes aplicar para ser
                  verificador. Los verificadores reciben tokens adicionales por validar las actividades de otros
                  participantes de manera justa y precisa.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* Contacto */}
      <section id="contacto" className="py-20 bg-white m-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <Badge variant="secondary" className="w-fit mx-auto bg-blue-100 text-blue-800">
              Contacto
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">¿Tienes más preguntas?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Estamos aquí para ayudarte. Contáctanos por cualquiera de estos medios
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <Mail className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle>Email</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Escríbenos y te responderemos en menos de 24 horas</p>
                <a href="mailto:hola@chontatoken.com" className="text-green-600 hover:text-green-700 font-medium">
                  hola@chontatoken.com
                </a>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <MessageCircle className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle>WhatsApp</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Chatea con nosotros para resolver dudas rápidamente</p>
                <a href="https://wa.me/573001234567" className="text-blue-600 hover:text-blue-700 font-medium">
                  +57 300 123 4567
                </a>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle>Comunidad</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Únete a nuestro grupo de Telegram</p>
                <a href="https://t.me/chontatoken" className="text-purple-600 hover:text-purple-700 font-medium">
                  @chontatoken
                </a>
              </CardContent>
            </Card>
          </div>

          <div className="mt-16 text-center">
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8 max-w-2xl mx-auto">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">¿Listo para empezar?</h3>
              <p className="text-gray-600 mb-6">
                Únete hoy a la revolución ambiental de Cali y comienza a ganar tokens por hacer el bien
              </p>
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                >
                  Conectar Wallet y Empezar
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">ChontaToken</span>
              </div>
              <p className="text-gray-400">
                Una ciudad, un cambio. Transformando Cali a través de la tecnología blockchain y el compromiso
                ciudadano.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Enlaces Rápidos</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <button onClick={() => scrollToSection("que-es")} className="hover:text-white transition-colors">
                    ¿Qué es Chonta Token?
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection("como-funciona")}
                    className="hover:text-white transition-colors"
                  >
                    ¿Cómo funciona?
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
                  <Link href="/comunidad" className="hover:text-white transition-colors">
                    Reglas de Comunidad
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Aliados</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Alcaldía de Cali</li>
                <li>Universidad del Valle</li>
                <li>Fundación Carvajal</li>
                <li>CVC</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} ChontaToken. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
