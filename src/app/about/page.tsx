'use client';

import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import EthicsIconPattern from '@/components/ui/EthicsIconPattern';

export default function AboutPage(): JSX.Element {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const elementTop = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementTop - 100;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const focusAreas = [
    {
      icon: '🌐',
      title: 'Digitalización Consciente',
      description: 'Exploramos cómo la transformación digital redefine la experiencia humana y las estructuras sociales.',
      details: 'Analizamos la tensión entre eficiencia tecnológica y preservación de valores humanos fundamentales.'
    },
    {
      icon: '📖',
      title: 'Alfabetización Digital',
      description: 'Investigamos la brecha entre conocimiento técnico y comprensión crítica de la tecnología.',
      details: 'Examinamos cómo la capacidad de "leer" el mundo digital determina la participación social.'
    },
    {
      icon: '🤝',
      title: 'Cohesión Social',
      description: 'Estudiamos cómo la mediación tecnológica afecta el tejido social y las relaciones humanas.',
      details: 'Reflexionamos sobre la construcción de comunidades en espacios híbridos físico-digitales.'
    }
  ];

  const values = [
    {
      type: 'MISIÓN',
      icon: '🎯',
      items: [
        'Promover la reflexión crítica sobre tecnología',
        'Generar conciencia sobre decisiones digitales',
        'Construir un futuro tecnológico más ético'
      ]
    },
    {
      type: 'VISIÓN',
      icon: '🌟',
      items: [
        'Sociedad que comprende el impacto tecnológico',
        'Ciudadanos empoderados digitalmente',
        'Tecnología al servicio del bienestar humano'
      ]
    },
    {
      type: 'VALORES',
      icon: '⚖️',
      items: [
        'Transparencia en el análisis',
        'Rigor académico e investigación',
        'Accesibilidad del conocimiento'
      ]
    }
  ];

  const contentAreas = [
    {
      icon: '📊',
      title: 'INVESTIGACIÓN',
      items: [
        'Análisis de casos reales',
        'Estudios de impacto social',
        'Revisión de políticas digitales'
      ]
    },
    {
      icon: '📝',
      title: 'EDUCACIÓN',
      items: [
        'Artículos accesibles',
        'Guías prácticas',
        'Recursos educativos'
      ]
    },
    {
      icon: '🤝',
      title: 'COMUNIDAD',
      items: [
        'Fomento del diálogo',
        'Participación ciudadana',
        'Colaboración interdisciplinaria'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-50 via-white to-purple-50 py-20 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-[0.02] text-gray-800">
          <EthicsIconPattern />
        </div>
        
        {/* Geometric Background Elements */}
        <div className="absolute top-16 right-12 w-48 h-48 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-12 left-8 w-64 h-64 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full blur-3xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
        
        <div className="container padding-responsive relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            
            {/* Category Badge */}
            <div className="inline-flex items-center px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full border border-purple-100 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center space-x-3 text-sm font-medium text-gray-700">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">🔬</span>
                </div>
                <span>Sobre Nosotros</span>
              </div>
            </div>
            
            {/* Main Title */}
            <div className="space-y-6">
              <h1 className="text-4xl lg:text-6xl font-heading text-gray-900 leading-tight">
                DataÉtica:
                <span className="block bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 bg-clip-text text-transparent">
                  Navegando la Ética Digital
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 font-body leading-relaxed max-w-3xl mx-auto">
                Exploramos el impacto de la tecnología en nuestra sociedad, analizando cómo las decisiones digitales moldean nuestro futuro y construimos un mundo más consciente y ético.
              </p>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button 
                variant="primary" 
                size="lg"
                onClick={() => window.location.href = '/'}
                className="font-semibold px-8 py-4 group transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                <span className="flex items-center justify-center">
                  Explorar Artículos
                  <svg className="w-5 h-5 ml-3 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </Button>
              
              <Button 
                variant="secondary" 
                size="lg"
                onClick={() => scrollToSection('contact')}
                className="font-semibold px-8 py-4 group transition-all duration-300 hover:shadow-lg"
              >
                <span className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-3 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Contacto
                </span>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Focus Areas Section */}
      <section className="py-16 bg-white">
        <div className="container padding-responsive">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-heading text-gray-900 mb-4">
              Nuestras Áreas de Reflexión
            </h2>
            <p className="text-xl text-gray-600 font-body max-w-3xl mx-auto">
              Navegamos la compleja intersección entre transformación digital, capacidad crítica 
              y construcción social para entender cómo la tecnología redefine la condición humana.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {focusAreas.map((area, index) => (
              <Card key={index} variant="elevated" className="p-8 text-center hover:scale-105 transition-all duration-300 group">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">{area.icon}</span>
                </div>
                
                <h3 className="text-xl font-heading text-gray-900 mb-4">
                  {area.title}
                </h3>
                
                <p className="text-gray-600 font-body mb-4 leading-relaxed">
                  {area.description}
                </p>
                
                <p className="text-sm text-gray-500 font-body leading-relaxed">
                  {area.details}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-gray-50">
        <div className="container padding-responsive">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-heading text-gray-900 mb-4">
              Nuestros Fundamentos
            </h2>
            <p className="text-xl text-gray-600 font-body max-w-2xl mx-auto">
              Los principios que guían nuestro trabajo y nuestra visión del futuro digital.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div key={index} className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-xl">{value.icon}</span>
                  </div>
                  <h3 className="text-2xl font-heading text-gray-900">
                    {value.type}
                  </h3>
                </div>
                
                <div className="space-y-3 pl-16">
                  {value.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-purple-400 rounded-full mt-3 flex-shrink-0"></div>
                      <p className="text-gray-700 font-body leading-relaxed">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why DataEtica Section */}
      <section className="py-16 bg-white">
        <div className="container padding-responsive">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-heading text-gray-900 mb-4">
                ¿Por Qué DataÉtica?
              </h2>
              <p className="text-xl text-gray-600 font-body">
                Vivimos en un momento crucial de la historia humana.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xl">💡</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-heading text-gray-900 mb-2">
                      Decisiones Automatizadas
                    </h3>
                    <p className="text-gray-600 font-body leading-relaxed">
                      Vivimos en una era donde la tecnología toma decisiones que afectan nuestras vidas diariamente: qué vemos, qué oportunidades recibimos, cómo somos evaluados.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-pink-400 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xl">🚨</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-heading text-gray-900 mb-2">
                      Brecha de Comprensión
                    </h3>
                    <p className="text-gray-600 font-body leading-relaxed">
                      Muchas personas no comprenden cómo funcionan los algoritmos que los rodean, creando una desconexión peligrosa entre la tecnología y la sociedad.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-400 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xl">🔍</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-heading text-gray-900 mb-2">
                      Democratización del Conocimiento
                    </h3>
                    <p className="text-gray-600 font-body leading-relaxed">
                      Creamos contenido accesible para democratizar el conocimiento sobre ética digital, haciendo que conceptos complejos sean comprensibles para todos.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-400 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xl">🌱</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-heading text-gray-900 mb-2">
                      Futuro Consciente
                    </h3>
                    <p className="text-gray-600 font-body leading-relaxed">
                      Fomentamos el pensamiento crítico y la participación ciudadana para construir un futuro tecnológico más consciente y ético.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-extra-large p-8 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-white text-3xl">⚖️</span>
                </div>
                
                <blockquote className="text-lg font-body text-gray-700 leading-relaxed mb-6">
                  &ldquo;La ética digital no es solo responsabilidad de tecnólogos, es responsabilidad de todos nosotros como ciudadanos de la era digital.&rdquo;
                </blockquote>
                
                <div className="text-sm text-gray-600 font-semibold">
                  — Filosofía DataÉtica
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Areas Section */}
      <section className="py-16 bg-gray-50">
        <div className="container padding-responsive">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-heading text-gray-900 mb-4">
              Nuestros Enfoques
            </h2>
            <p className="text-xl text-gray-600 font-body max-w-2xl mx-auto">
              Combinamos rigor académico con accesibilidad para crear impacto real.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {contentAreas.map((area, index) => (
              <Card key={index} variant="elevated" className="p-8 group hover:shadow-xl transition-all duration-300">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <span className="text-xl">{area.icon}</span>
                  </div>
                  <h3 className="text-xl font-heading text-gray-900">
                    {area.title}
                  </h3>
                </div>
                
                <div className="space-y-3">
                  {area.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-purple-400 rounded-full flex-shrink-0"></div>
                      <p className="text-gray-700 font-body">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section id="contact" className="py-20 bg-gradient-to-br from-purple-600 via-indigo-600 to-purple-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <EthicsIconPattern />
        </div>
        
        <div className="container padding-responsive relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-4xl lg:text-5xl font-heading leading-tight">
              Únete a la Conversación
            </h2>
            
            <p className="text-xl font-body leading-relaxed opacity-90">
              La construcción de un futuro digital ético requiere la participación de todos. 
              Cada voz, cada perspectiva, cada pregunta es valiosa en esta conversación crucial.
            </p>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-extra-large p-8 max-w-2xl mx-auto">
              <p className="text-lg font-body leading-relaxed mb-6">
                &ldquo;El futuro no es algo que nos sucede, es algo que creamos juntos. 
                Participa en la construcción de un mundo digital más justo y consciente.&rdquo;
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button 
                variant="white" 
                size="lg"
                onClick={() => window.location.href = '/'}
                className="font-semibold px-8 py-4 group transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                <span className="flex items-center justify-center">
                  Explorar Artículos
                  <svg className="w-5 h-5 ml-3 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </Button>
              
              <Button 
                variant="white" 
                size="lg"
                onClick={() => window.location.href = '/test'}
                className="font-semibold px-8 py-4 group transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                <span className="flex items-center justify-center">
                  Test de Conocimiento
                  <svg className="w-5 h-5 ml-3 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </span>
              </Button>
            </div>
            
            <div className="pt-8 text-center">
              <p className="text-sm opacity-75 mb-2">¿Tienes preguntas o quieres colaborar?</p>
              <p className="text-lg font-semibold">admin@dataetica.info</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
