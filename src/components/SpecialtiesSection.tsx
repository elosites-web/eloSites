import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  Code2,
  Layout,
  Sparkles,
  Search,
  BarChart3,
  Cpu,
  CheckCircle2,
  ArrowRight,
  Info,
  ShieldCheck,
  Smartphone,
  ExternalLink,
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
  icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean | 'true' | 'false' }>;
  highlight: string;
  items: string[];
  technicalClarification: string;
  tagColor: string;
}

const SPECIALTIES: SpecialtyItem[] = [
  {
    id: 'desenvolvimento-web',
    category: 'Criação de Sites',
    badge: 'Sob Medida',
    icon: Code2,
    highlight: 'Páginas pensadas para apresentar o seu trabalho com clareza e levar o cliente direto ao WhatsApp.',
    items: [
      'Site de uma página focado em explicar seu serviço e gerar contatos',
      'Site completo com catálogo de serviços, fotos reais e localização',
      'Visual perfeito no celular, no tablet e no computador',
      'Feito sob medida para você, sem templates copiados',
    ],
    technicalClarification:
      'Desenvolvimento próprio, leve e limpo, sem temas genéricos ou ferramentas pesadas que deixam o carregamento lento.',
    tagColor: 'from-blue-500/20 to-cyan-500/10 text-cyan-300 border-cyan-500/30',
  },
  {
    id: 'ui-ux-design',
    category: 'Visual e Facilidade de Uso',
    badge: 'Fácil de Navegar',
    icon: Layout,
    highlight: 'Organização visual limpa para o cliente ler sem esforço e encontrar tudo rápido.',
    items: [
      'Informações organizadas na ordem certa para o visitante entender',
      'Menus e botões de contato sempre visíveis e fáceis de clicar',
      'Adaptação automática para qualquer tamanho de tela de celular',
      'Transições suaves e visual moderno que passa credibilidade',
    ],
    technicalClarification:
      'Design focado em valorizar seus serviços e deixar o caminho até a conversa no WhatsApp o mais simples possível.',
    tagColor: 'from-purple-500/20 to-indigo-500/10 text-purple-300 border-purple-500/30',
  },
  {
    id: 'funcionalidades-interatividade',
    category: 'Recursos e Botões Práticos',
    badge: 'Praticidade',
    icon: Sparkles,
    highlight: 'Funções práticas na página que facilitam o contato e tiram dúvidas do cliente.',
    items: [
      'Botões para chamar no WhatsApp com mensagens iniciais prontas',
      'Formulários simples para o cliente mandar mensagem ou pedir proposta',
      'Simuladores interativos de pagamento e condições financeiras',
      'Galeria com fotos reais do seu trabalho com ampliação ao clicar',
    ],
    technicalClarification:
      'Recursos rápidos que funcionam direto no navegador do celular, com agilidade e sem travamentos.',
    tagColor: 'from-emerald-500/20 to-teal-500/10 text-emerald-300 border-emerald-500/30',
  },
  {
    id: 'seo-tecnico-performance',
    category: 'Preparado para o Google',
    badge: 'Buscas Locais',
    icon: Search,
    highlight: 'Estruturação técnica para ajudar o seu negócio a ser encontrado nas pesquisas do Google.',
    items: [
      'Títulos e descrições otimizados com os serviços que você oferece',
      'Estrutura correta para os buscadores entenderem sua cidade e atuação',
      'Cartões bonitos para quando seu link for compartilhado no WhatsApp',
      'Fotos leves em formato moderno (WebP) que abrem sem demora no 4G',
      'Página rápida para o cliente não desistir antes de carregar',
      'Endereço e dados sincronizados com o seu Perfil no Google',
    ],
    technicalClarification:
      'Boas práticas estruturais para facilitar a leitura e indexação pelos mecanismos de busca, com transparência.',
    tagColor: 'from-amber-500/20 to-yellow-500/10 text-amber-300 border-amber-500/30',
  },
  {
    id: 'integracoes-mensuracao',
    category: 'Acompanhamento e Anúncios',
    badge: 'Pronto para Crescer',
    icon: BarChart3,
    highlight: 'Conexão preparada para ferramentas de anúncios e contagem de acessos.',
    items: [
      'Pronto para Google Analytics 4 (para ver quantas pessoas visitam o site)',
      'Pronto para Meta Pixel (se você for anunciar no Instagram e Facebook)',
      'Links de WhatsApp identificados para saber de onde o cliente veio',
      'Estrutura preparada para tráfego pago quando você quiser anunciar',
    ],
    technicalClarification:
      'Ferramentas configuradas com os códigos fornecidos por você ou pelo gestor de tráfego, respeitando a privacidade dos visitantes.',
    tagColor: 'from-sky-500/20 to-blue-500/10 text-sky-300 border-sky-500/30',
  },
  {
    id: 'tecnologias-stack',
    category: 'Base Técnica Moderna',
    badge: 'Feito para Durar',
    icon: Cpu,
    highlight: 'Construído com tecnologia atual que garante estabilidade e rapidez.',
    items: [
      'Código moderno que não quebra e não fica lento com o tempo',
      'Sem plugins pesados ou plataformas lentas que travam o celular',
      'Visual leve e consistente em qualquer tamanho de tela',
      'Carregamento rápido até em conexões 4G no telefone',
      'Segurança e tranquilidade para o seu negócio',
    ],
    technicalClarification:
      'A base técnica ideal para o seu projeto, garantindo um site leve, ágil e fácil de manter.',
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
              <span>Soluções Web & Diferenciais</span>
            </div>

            <SplitLines
              as="h2"
              id="specialties-heading"
              text="Como criamos o site ideal para o seu negócio"
              className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] font-bold tracking-[-0.03em] text-white text-balance leading-tight"
            />

            <p className="text-base sm:text-lg text-slate-300/95 leading-relaxed">
              A <strong>ēloSites</strong> desenvolve sites de uma página, sites completos e projetos sob medida para pequenos negócios e profissionais liberais. Tudo pensado para valorizar seus serviços e levar o cliente até o seu WhatsApp.
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
            const Icon = spec.icon;

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
                    {/* Linha superior: Ícone e Badge */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between gap-3">
                        <div className="w-12 h-12 rounded-xl bg-blue-950/80 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-[0_0_14px_rgba(59,130,246,0.25)] group-hover:scale-105 transition-transform">
                          <Icon className="w-6 h-6 text-cyan-400" aria-hidden="true" />
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
