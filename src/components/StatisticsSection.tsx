'use client';

interface StatisticsSectionProps {
  totalPosts: number;
  totalCategories: number;
  className?: string;
}

export default function StatisticsSection({ 
  totalPosts, 
  totalCategories, 
  className = '' 
}: StatisticsSectionProps) {
  return (
    <section className={`bg-gray-50 py-16 ${className}`}>
      <div className="container padding-responsive">
        <div className="text-center mb-12">
          <h2 className="text-section-header text-primary mb-4 font-heading">
            Nuestro Impacto
          </h2>
          <p className="text-body text-secondary max-w-2xl mx-auto">
            Construyendo una comunidad consciente sobre la ética digital
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="space-y-2 group">
            <div className="text-4xl font-bold text-primary transition-colors group-hover:text-purple-600">
              {totalPosts}+
            </div>
            <div className="text-secondary font-medium">Artículos Publicados</div>
            <div className="text-xs text-secondary font-body">
              Reflexiones profundas sobre ética digital
            </div>
          </div>
          
          <div className="space-y-2 group">
            <div className="text-4xl font-bold text-primary transition-colors group-hover:text-purple-600">
              {totalCategories}+
            </div>
            <div className="text-secondary font-medium">Temas Cubiertos</div>
            <div className="text-xs text-secondary font-body">
              Desde IA hasta privacidad de datos
            </div>
          </div>
          
          <div className="space-y-2 group">
            <div className="text-4xl font-bold text-primary transition-colors group-hover:text-purple-600">
              2024
            </div>
            <div className="text-secondary font-medium">Año de Fundación</div>
            <div className="text-xs text-secondary font-body">
              Comprometidos con la ética tecnológica
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}