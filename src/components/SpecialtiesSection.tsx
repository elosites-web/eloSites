import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  Code2,
  Layout,
  Sparkles,
  Cpu,
  CheckCircle2,
  ArrowRight,
  Info,
  ShieldCheck,
  Smartphone,
  Zap,
} from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';
import { SplitLines } from './SplitLines';
import { Interactive3DCard } from './Interactive3DCard';
import { BiReveal } from './BiReveal';
import { shouldReduceMedia } from '../mediaPrefs';
import { SITE_CONFIG, whatsappUrl } from '../types';
import { FounderCard } from './FounderCard';
import { TechStackCard } from './TechStackCard';
import { InfiniteMarquee } from './InfiniteMarquee';

interface SpecialtyItem {
  id: string;
  category: string;
  badge: string;
  icon: React.ComponentType<{ className?: string }>;
  iconAlt: string;
  iconGlow: string;
  highlight: string;
  items: string[];
  technicalClarification: string;
  tagColor: string;
}

const SPECIALTIES: SpecialtyItem[] = [
  {
    id: 'desenvolvimento-web',
    category: 'Desenvolvimento Web',
    badge: 'Sites sob Medida',
    icon: Code2,
    iconAlt: 'Desenvolvimento de sites responsivos sob medida',
    iconGlow: 'shadow-[0_0_20px_rgba(34,211,238,0.35)] border-cyan-500/40 text-cyan-400',
    highlight: 'Crio sites que se adaptam ao celular e ao computador, com botões, formulários e outros recursos que ajudam o visitante a encontrar informações e entrar em contato.',
    items: [
      'Landing pages diretas e focadas em apresentar seus serviços e levar o cliente ao WhatsApp',
      'Sites institucionais para empresas que precisam de várias seções e apresentação detalhada',
      'Navegação adaptada com perfeição para telas de celulares, tablets e computadores',
      'Recursos e seções planejados sob medida para a realidade do seu negócio',
    ],
    technicalClarification:
      'Desenvolvo o código do zero com componentes modernos, sem modelos pré-fabricados pesados. Isso garante um site muito mais leve, rápido e fácil de manter.',
    tagColor: 'from-blue-500/20 to-cyan-500/10 text-cyan-300 border-cyan-500/30',
  },
  {
    id: 'ui-ux-design',
    category: 'UI/UX e Design de Interfaces',
    badge: 'Visual & Leitura',
    icon: Layout,
    iconAlt: 'Interface de usuário e experiência de navegação',
    iconGlow: 'shadow-[0_0_20px_rgba(168,85,247,0.35)] border-purple-500/40 text-purple-400',
    highlight: 'Organizo as informações com visual limpo e profissional, para que seu cliente compreenda o seu trabalho em poucos segundos.',
    items: [
      'Títulos, textos e imagens dispostos na ordem certa para prender a atenção',
      'Menus claros e botões de contato destacados em locais estratégicos',
      'Visual alinhado às cores e à identidade da sua marca',
      'Pequenas animações e respostas visuais que tornam a navegação agradável',
    ],
    technicalClarification:
      'Um design bem pensado faz o visitante encontrar o que precisa com facilidade e sentir confiança imediata para entrar em contato.',
    tagColor: 'from-purple-500/20 to-indigo-500/10 text-purple-300 border-purple-500/30',
  },
  {
    id: 'funcionalidades-interatividade',
    category: 'Funcionalidades e Interatividade',
    badge: 'Recursos Práticos',
    icon: Sparkles,
    iconAlt: 'Botões inteligentes e recursos práticos',
    iconGlow: 'shadow-[0_0_20px_rgba(52,211,153,0.35)] border-emerald-500/40 text-emerald-400',
    highlight: 'Botões práticos, formulários inteligentes e recursos que facilitam a vida de quem visita o seu site.',
    items: [
      'Formulários que conferem os dados na hora e avisam se algo estiver incompleto',
      'Botões de WhatsApp com mensagens já iniciadas para agilizar o atendimento',
      'Simuladores interativos para o cliente calcular condições de pagamento na tela',
      'Galerias de fotos, ampliações e recursos visuais fáceis de navegar',
    ],
    technicalClarification:
      'Tudo é programado para funcionar de forma imediata na tela, economizando tempo do seu cliente e gerando contatos mais qualificados.',
    tagColor: 'from-emerald-500/20 to-teal-500/10 text-emerald-300 border-emerald-500/30',
  },
  {
    id: 'seo-tecnico-performance',
    category: 'SEO Técnico e Performance',
    badge: 'Presença no Google',
    icon: ShieldCheck,
    iconAlt: 'Otimização para buscas locais no Google',
    iconGlow: 'shadow-[0_0_20px_rgba(251,191,36,0.35)] border-amber-500/40 text-amber-400',
    highlight: 'Organizo as informações do site para que ferramentas como o Google compreendam melhor o conteúdo das suas páginas e o negócio que você oferece.',
    items: [
      'Textos e títulos organizados na hierarquia correta para facilitar a leitura',
      'Descrições claras para que o Google saiba exatamente o que sua empresa oferece',
      'Pré-visualização com título e imagem bonita ao compartilhar links no WhatsApp e redes sociais',
      'Dados estruturados que ajudam os buscadores a identificar serviços, empresa e localização',
      'Imagens otimizadas em formato leve (WebP) para o site abrir sem travar',
      'Estrutura técnica limpa e revisada para boa visibilidade nos buscadores',
    ],
    technicalClarification:
      'Boas práticas de organização e código ajudam o Google a entender o que seu negócio faz, sem promessas falsas de primeiro lugar milagroso.',
    tagColor: 'from-amber-500/20 to-yellow-500/10 text-amber-300 border-amber-500/30',
  },
  {
    id: 'integracoes-mensuracao',
    category: 'Integrações e Mensuração',
    badge: 'Acompanhamento',
    icon: Zap,
    iconAlt: 'Métricas e conexões com plataformas de anúncios',
    iconGlow: 'shadow-[0_0_20px_rgba(56,189,248,0.35)] border-sky-500/40 text-sky-400',
    highlight: 'Quando contratado e configurado, o site pode usar ferramentas que ajudam a acompanhar as visitas e ações dos usuários, respeitando as regras de consentimento e privacidade aplicáveis.',
    items: [
      'Google Analytics para saber quantas pessoas visitam seu site e quais páginas acessam',
      'Google Tag Manager para organizar códigos e ferramentas de medição em um só lugar',
      'Meta Pixel para ajudar em campanhas de anúncios no Instagram e Facebook',
      'Links de WhatsApp específicos para saber de qual parte do site o cliente veio',
    ],
    technicalClarification:
      'A ativação de ferramentas requer as contas fornecidas pelo cliente e segue boas práticas de privacidade quando dados de navegação são coletados.',
    tagColor: 'from-sky-500/20 to-blue-500/10 text-sky-300 border-sky-500/30',
  },
  {
    id: 'tecnologias-stack',
    category: 'Tecnologias & Base Técnica',
    badge: 'Tecnologia Segura',
    icon: Cpu,
    iconAlt: 'Arquitetura tecnológica moderna de alta performance',
    iconGlow: 'shadow-[0_0_20px_rgba(129,140,248,0.35)] border-indigo-500/40 text-indigo-400',
    highlight: 'Tecnologia moderna e confiável para o seu site carregar rápido e ficar no ar com segurança.',
    items: [
      'React e TypeScript para criar páginas modernas, estáveis e livres de falhas',
      'HTML e CSS limpos para garantir visual moderno e carregamento veloz',
      'Tailwind CSS para um acabamento visual consistente e leve',
      'Vite para gerar páginas otimizadas e com abertura ágil',
      'Ícones e animações sutis que deixam o site elegante sem pesar no celular',
    ],
    technicalClarification:
      'Usamos a mesma base tecnológica moderna adotada pelas maiores empresas de internet, trazendo rapidez, segurança e longevidade para o seu site.',
    tagColor: 'from-indigo-500/20 to-violet-500/10 text-indigo-300 border-indigo-500/30',
  },
];

interface SpecialtiesSectionProps {
  onNavigateToContact?: () => void;
  onNavigateToCartao?: () => void;
}

export const SpecialtiesSection: React.FC<SpecialtiesSectionProps> = ({ onNavigateToContact, onNavigateToCartao }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const systemPrefersReduced = useReducedMotion();
  const prefersReduced = Boolean(systemPrefersReduced || shouldReduceMedia());

  const filteredSpecialties =
    activeCategory === 'all'
      ? SPECIALTIES
      : SPECIALTIES.filter((s) => s.id === activeCategory);

  useEffect(() => {
    if (window.location.hash !== '#fundador') return;

    let cancelled = false;
    const scrollToFounder = () => {
      if (cancelled) return;
      const element = document.getElementById('fundador');
      if (!element) return;
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.setTimeout(() => {
        if (!cancelled) {
          document.getElementById('fundador')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 600);
    };

    const frame = window.requestAnimationFrame(scrollToFounder);
    const timer = window.setTimeout(scrollToFounder, 400);

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timer);
    };
  }, []);

  const specialtiesWhatsappMessage =
    'Olá! ⚡ Estive analisando a seção de *Especialidades e Soluções Web* da *ēloSites*.\n\nGostaria de entender como essas soluções em desenvolvimento frontend, SEO técnico e integração com WhatsApp podem ser aplicadas ao meu negócio!';

  const ctaUrl = whatsappUrl(specialtiesWhatsappMessage);

  return (
    <section
      id="solucoes-web"
      aria-labelledby="specialties-heading"
      className="section-auto-contain pt-24 pb-16 sm:pt-28 sm:pb-20 lg:pt-32 lg:pb-24 min-h-[90vh] bg-[#050814]/70 border-t border-blue-500/15 relative overflow-hidden"
    >
      {/* Luz ambiente de fundo */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-600/[0.08] blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-600/[0.08] blur-[140px] rounded-full pointer-events-none" />

      <div className="page-shell page-x max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Cabeçalho da Seção */}
        <BiReveal direction="up">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-12 sm:mb-16">
            <div className="section-kicker inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-blue-500/30 text-cyan-300 text-xs sm:text-sm font-semibold uppercase shadow-[0_0_15px_rgba(34,211,238,0.2)]">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" aria-hidden="true" />
              <span>Soluções Web & Especialidades</span>
            </div>

            <SplitLines
              as="h2"
              id="specialties-heading"
              text="Tecnologia, design e estratégia para transformar sua presença digital."
              className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] font-bold tracking-[-0.03em] text-white text-balance leading-tight"
            />

            <p className="text-base sm:text-lg text-slate-300/95 leading-relaxed">
              Criamos sites que se adaptam com perfeição ao celular e ao computador. Combinamos visual moderno, textos bem organizados e botões de contato direto para que seus clientes encontrem o que precisam e conversem com você pelo WhatsApp.
            </p>
          </div>
        </BiReveal>

        {/* Filtro Rápido de Categorias (Desktop / Tablet) */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          <button
            type="button"
            onClick={() => setActiveCategory('all')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeCategory === 'all'
                ? 'bg-blue-600 text-white shadow-[0_0_14px_rgba(59,130,246,0.5)] border border-blue-400/40'
                : 'bg-slate-900/80 text-slate-400 hover:text-white border border-white/[0.08]'
            }`}
          >
            Todas as especialidades ({SPECIALTIES.length})
          </button>
          {SPECIALTIES.map((spec) => (
            <button
              key={spec.id}
              type="button"
              onClick={() => setActiveCategory(spec.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer hidden md:inline-flex items-center gap-1.5 ${
                activeCategory === spec.id
                  ? 'bg-blue-600 text-white shadow-[0_0_14px_rgba(59,130,246,0.5)] border border-blue-400/40'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white border border-white/[0.08]'
              }`}
            >
              <span>{spec.category}</span>
            </button>
          ))}
        </div>

        {/* Grade das 6 Especialidades */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 items-stretch">
          {filteredSpecialties.map((spec, index) => {
            return (
              <BiReveal
                key={spec.id}
                direction={index % 2 === 0 ? 'left' : 'right'}
                index={index}
                className="h-full"
              >
                <Interactive3DCard maxTilt={1.5} className="h-full">
                  <article
                    className="glass-card-interactive surface-card service-card relative rounded-2xl bg-[#090E23]/95 border border-blue-500/20 hover:border-blue-400/50 p-6 sm:p-7 flex flex-col justify-between h-full shadow-2xl shadow-black/80 bracket-panel transition-all duration-300 group"
                  >
                    {/* Linha superior: Ícone 3D Exclusivo e Badge */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between gap-3">
                        <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl p-2 bg-[#050814]/90 border border-blue-500/25 flex items-center justify-center shrink-0 shadow-[0_4px_20px_rgba(0,0,0,0.6)] group-hover:scale-108 group-hover:border-blue-400/50 transition-all duration-300">
                          <spec.icon className="w-7 h-7 sm:w-8 sm:h-8" />
                          <div
                            className={`absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-300 opacity-70 group-hover:opacity-100 ${spec.iconGlow}`}
                          />
                        </div>
                        <span
                          className={`text-[11px] font-mono px-3 py-1 rounded-full border bg-gradient-to-r font-medium ${spec.tagColor}`}
                        >
                          {spec.badge}
                        </span>
                      </div>

                      {/* Título e Destaque */}
                      <div>
                        <h3 className="font-display text-xl font-bold text-white tracking-tight mb-2 group-hover:text-cyan-300 transition-colors">
                          {spec.category}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                          {spec.highlight}
                        </p>
                      </div>

                      {/* Lista de Entregáveis / Capacidades */}
                      <div className="pt-3 border-t border-white/[0.08] space-y-2">
                        <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold block">
                          Escopo e entregáveis:
                        </span>
                        <ul className="space-y-2 text-xs sm:text-[13px] text-slate-200">
                          {spec.items.map((item, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <CheckCircle2
                                className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5"
                                aria-hidden="true"
                              />
                              <span className="leading-snug">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Nota de Esclarecimento Técnico e Transparência Comercial */}
                    <div className="mt-5 pt-4 border-t border-white/[0.06] bg-slate-950/60 rounded-xl p-3 border border-white/[0.05]">
                      <div className="flex items-start gap-2 text-[11px] text-slate-300 leading-relaxed">
                        <Info className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" aria-hidden="true" />
                        <span>{spec.technicalClarification}</span>
                      </div>
                    </div>
                  </article>
                </Interactive3DCard>
              </BiReveal>
            );
          })}
        </div>

        {/* Card Premium da Base Tecnológica Oficial */}
        <div className="mt-12 sm:mt-16 lg:mt-20">
          <TechStackCard />
        </div>

        {/* Card Oficial do Fundador (Everton Lopes) posicionado abaixo do conteúdo das especialidades */}
        <div id="fundador" className="mt-12 sm:mt-16 lg:mt-20 scroll-mt-24">
          <FounderCard onNavigateToCartao={onNavigateToCartao} />
        </div>

        {/* Banner Deslizante Interativo das Especialidades (Abaixo do Card do Fundador e antes do CTA) */}
        <div className="mt-8 sm:mt-10 py-1">
          <InfiniteMarquee
            items={[
              { text: 'React 19 & TypeScript', icon: <Code2 className="w-3.5 h-3.5 text-cyan-400" />, badge: 'Core' },
              { text: 'Vite & Tailwind CSS', icon: <Zap className="w-3.5 h-3.5 text-sky-400" />, badge: 'Frontend' },
              { text: 'SEO Técnico & Schema.org', icon: <Sparkles className="w-3.5 h-3.5 text-indigo-400" />, badge: 'Estrutura' },
              { text: 'Google Analytics 4 & GTM', icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />, badge: 'Tracking' },
              { text: 'Boas Práticas de Carregamento', icon: <Zap className="w-3.5 h-3.5 text-amber-300" />, badge: 'Otimização' },
              { text: 'Arquitetura Semântica', icon: <Code2 className="w-3.5 h-3.5 text-teal-400" />, badge: 'Clean Code' },
              { text: 'Mobile-First Responsivo', icon: <Smartphone className="w-3.5 h-3.5 text-fuchsia-400" />, badge: '360px-4K' },
              { text: 'Canal Direto no WhatsApp', icon: <WhatsAppIcon className="w-3.5 h-3.5 text-emerald-400" />, badge: 'Contato' },
              { text: 'Landing Pages de Conversão', icon: <Layout className="w-3.5 h-3.5 text-cyan-400" />, badge: 'Conversão' },
              { text: 'Sites Institucionais', icon: <Cpu className="w-3.5 h-3.5 text-blue-400" />, badge: 'Autoridade' },
            ]}
            speed={85}
            reverse={false}
            ariaLabel="Banner deslizante interativo das especialidades e tecnologias web"
          />
        </div>

        {/* CTA para Alinhamento Comercial */}
        <div className="mt-8 sm:mt-10 text-center flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={ctaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-white bg-[#25D366] hover:bg-[#20bd5a] border border-emerald-300/40 shadow-lg shadow-emerald-950/50 hover:shadow-[0_0_24px_rgba(37,211,102,0.6)] transition-all cursor-pointer text-sm sm:text-base group"
          >
            <WhatsAppIcon className="w-4 h-4 text-white" />
            <span>Conversar sobre meu projeto</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </a>

          {onNavigateToContact && (
            <button
              type="button"
              onClick={onNavigateToContact}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-medium text-slate-200 bg-slate-900/90 hover:text-white border border-white/[0.1] hover:border-blue-400/40 transition-all text-sm sm:text-base cursor-pointer"
            >
              <span>Ver portfólio de projetos</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
