import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { WhatsAppIcon } from './WhatsAppIcon';
import { SplitLines } from './SplitLines';
import { useToast } from './Toast';
import {
  ProjectBriefData,
  MeetingBookingData,
  formatBriefingWhatsappMessage,
  formatBookingWhatsappMessage,
  createGoogleCalendarUrl,
  generateIcsContent,
  whatsappUrl,
} from '../types';
import {
  FileText,
  Calendar,
  Clock,
  Video,
  Copy,
  Check,
  CalendarPlus,
  Download,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { shouldReduceMedia } from '../mediaPrefs';
import { getDynamicCardVariants } from '../motionVariants';
import confetti from 'canvas-confetti';

interface ProjectBriefBookingSectionProps {
  onOpenPrivacy?: () => void;
}

export const ProjectBriefBookingSection: React.FC<ProjectBriefBookingSectionProps> = ({
  onOpenPrivacy,
}) => {
  const [activeTab, setActiveTab] = useState<'briefing' | 'booking'>('briefing');
  const [copied, setCopied] = useState(false);
  const { success, error } = useToast();
  const prefersReducedMotion = useReducedMotion();
  const prefersReduced = Boolean(prefersReducedMotion || shouldReduceMedia());
  const cardVariants = getDynamicCardVariants(prefersReduced);

  // Briefing form state
  const [briefingData, setBriefingData] = useState<ProjectBriefData>({
    contactName: '',
    businessName: '',
    segment: 'Barbearia',
    projectType: 'Landing Page de Conversão (Foco em WhatsApp)',
    description: '',
    whatsappContact: '',
    agreedToLgpd: true,
  });

  // Booking form state
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDateStr = tomorrow.toISOString().split('T')[0];

  const [bookingData, setBookingData] = useState<MeetingBookingData>({
    name: '',
    businessName: '',
    whatsappOrEmail: '',
    preferredDate: defaultDateStr,
    preferredTimeSlot: 'Tarde (14h às 18h)',
    platform: 'Google Meet',
    meetingTopic: 'Orçamento, formato ideal e próximos passos',
    agreedToLgpd: true,
  });

  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  const segmentsList = [
    'Barbearia',
    'Salão de Beleza & Estética',
    'Personal Trainer & Academia',
    'Clínica / Terapeuta / Nutricionista',
    'Serviços Gerais & Manutenção',
    'Comércio / Outro segmento',
  ];

  const projectTypesList = [
    'Landing Page de Conversão (Foco em WhatsApp)',
    'Site Institucional Completo (Sobre, Serviços, FAQ)',
    'Projeto Sob Medida / Personalizado',
  ];

  const timeSlotsList = [
    'Manhã (09h às 12h)',
    'Tarde (14h às 18h)',
    'Noite (19h às 21h)',
  ];

  const meetingTopicsList = [
    'Orçamento, formato ideal e próximos passos',
    'Estrutura de conteúdo e fotos necessárias',
    'Dúvidas sobre domínio, publicação e controle',
  ];

  // Briefing handlers
  const handleBriefingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: { [key: string]: string } = {};

    if (!briefingData.contactName.trim()) {
      errors.contactName = 'Informe seu nome para que possamos te chamar.';
    }
    if (!briefingData.businessName.trim()) {
      errors.businessName = 'Informe o nome do seu negócio ou empresa.';
    }
    if (!briefingData.whatsappContact.trim()) {
      errors.whatsappContact = 'Informe seu WhatsApp para envio da proposta.';
    }
    if (!briefingData.agreedToLgpd) {
      errors.agreedToLgpd = 'É necessário concordar com os termos de privacidade.';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      error('Preencha os campos obrigatórios', 'Verifique os dados destacados no formulário.');
      return;
    }

    setFormErrors({});
    const message = formatBriefingWhatsappMessage(briefingData);
    const targetUrl = whatsappUrl(message);

    try {
      confetti({
        particleCount: 65,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#06b6d4', '#6366f1', '#a855f7', '#10b981'],
      });
    } catch {}

    success('Briefing formatado com sucesso!', 'Abrindo seu WhatsApp com o resumo pronto para envio.');
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  const handleCopyBriefing = () => {
    const message = formatBriefingWhatsappMessage(briefingData);
    navigator.clipboard.writeText(message);
    setCopied(true);
    success('Resumo copiado!', 'Você pode colar diretamente em qualquer conversa.');
    window.setTimeout(() => setCopied(false), 2500);
  };

  // Booking handlers
  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: { [key: string]: string } = {};

    if (!bookingData.name.trim()) {
      errors.bookingName = 'Informe seu nome.';
    }
    if (!bookingData.whatsappOrEmail.trim()) {
      errors.bookingContact = 'Informe seu WhatsApp ou E-mail para contato.';
    }
    if (!bookingData.preferredDate) {
      errors.bookingDate = 'Selecione uma data para a reunião.';
    }
    if (!bookingData.agreedToLgpd) {
      errors.bookingAgreed = 'É necessário concordar com os termos de privacidade.';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      error('Preencha os dados de contato', 'Verifique as informações da reunião.');
      return;
    }

    setFormErrors({});
    const message = formatBookingWhatsappMessage(bookingData);
    const targetUrl = whatsappUrl(message);

    try {
      confetti({
        particleCount: 55,
        spread: 50,
        origin: { y: 0.7 },
        colors: ['#06b6d4', '#6366f1', '#a855f7', '#10b981'],
      });
    } catch {}

    success('Agendamento preparado!', 'Abrindo seu WhatsApp para confirmação do horário.');
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  const handleOpenGoogleCalendar = () => {
    if (!bookingData.name.trim()) {
      error('Preencha seu nome', 'Precisamos do seu nome para gerar o evento de calendário.');
      return;
    }
    const calendarUrl = createGoogleCalendarUrl(bookingData);
    window.open(calendarUrl, '_blank', 'noopener,noreferrer');
    success('Google Agenda aberto', 'Confira os detalhes e salve em seu calendário.');
  };

  const handleDownloadIcs = () => {
    if (!bookingData.name.trim()) {
      error('Preencha seu nome', 'Precisamos do seu nome para gerar o convite.');
      return;
    }
    const icsContent = generateIcsContent(bookingData);
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `reuniao-elosites-${bookingData.preferredDate}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    success('Convite baixado (.ics)', 'Abra o arquivo para adicionar ao Outlook ou Apple Calendar.');
  };

  return (
    <section
      id="briefing-agendamento"
      className="section-auto-contain pt-24 pb-16 sm:pt-28 sm:pb-20 lg:pt-32 lg:pb-20 bg-[#050814] relative border-t border-blue-500/15 overflow-x-clip"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[min(720px,100%)] h-[380px] bg-blue-600/[0.08] blur-[150px] rounded-full pointer-events-none" />

      <div className="page-shell page-x relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center space-y-4 mb-12 sm:mb-16">
            <div className="section-kicker inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-950/70 border border-blue-500/30 text-blue-300 text-xs font-semibold uppercase shadow-[0_0_15px_rgba(59,130,246,0.25)]">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" aria-hidden="true" />
              <span>Planejamento Estratégico & Agendamento</span>
            </div>

            <SplitLines
              as="h2"
              text="Dê o próximo passo para o seu site"
              className="font-display text-3xl sm:text-4xl lg:text-[2.85rem] font-bold tracking-[-0.03em] text-white text-balance leading-[1.15]"
            />

            <p className="text-base sm:text-lg text-slate-300/95 leading-relaxed max-w-2xl mx-auto">
              Preencha um briefing rápido para receber uma proposta personalizada ou escolha um horário para alinharmos tudo em uma chamada online de 30 minutos sem compromisso.
            </p>
          </div>

          {/* Segmented Control / Tabs (Emil Kowalski Sliding Pill Pattern) */}
          <div className="max-w-md mx-auto mb-10 p-1.5 rounded-2xl bg-slate-950/80 border border-blue-500/25 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] grid grid-cols-2 gap-1.5 relative">
            <button
              type="button"
              onClick={() => setActiveTab('briefing')}
              className={`relative z-10 py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-colors duration-160 flex items-center justify-center text-center gap-2 pressable ${
                activeTab === 'briefing' ? 'text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {activeTab === 'briefing' && (
                <motion.span
                  layoutId="active-tab-highlight"
                  transition={{ type: 'spring', duration: 0.35, bounce: 0.12 }}
                  className="absolute inset-0 rounded-xl bg-blue-600 shadow-[0_4px_16px_rgba(37,99,235,0.5)] border border-blue-400/50 z-[-1]"
                />
              )}
              <FileText className="w-4 h-4 shrink-0" />
              <span className="whitespace-nowrap text-center">1. Descrever Projeto</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('booking')}
              className={`relative z-10 py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-colors duration-160 flex items-center justify-center text-center gap-2 pressable ${
                activeTab === 'booking' ? 'text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {activeTab === 'booking' && (
                <motion.span
                  layoutId="active-tab-highlight"
                  transition={{ type: 'spring', duration: 0.35, bounce: 0.12 }}
                  className="absolute inset-0 rounded-xl bg-blue-600 shadow-[0_4px_16px_rgba(37,99,235,0.5)] border border-blue-400/50 z-[-1]"
                />
              )}
              <Calendar className="w-4 h-4 shrink-0" />
              <span className="whitespace-nowrap text-center">2. Reunião 30 min</span>
            </button>
          </div>

          {/* Tab Content */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.08, margin: '0px 0px -40px 0px' }}
            className="w-full"
          >
            <div className="surface-card rounded-3xl p-6 sm:p-10 relative overflow-hidden bracket-panel bg-[#090E23] border border-blue-500/25 shadow-2xl">
            <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/[0.05] blur-3xl pointer-events-none rounded-full" />

            <AnimatePresence mode="wait">
              {activeTab === 'briefing' ? (
                <motion.div
                  key="tab-briefing"
                  initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98, y: 10 }}
                  animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
                  exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98, y: -6 }}
                  transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
                >
                  <div className="mb-8">
                    <h3 className="font-display text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
                      <FileText className="w-5 h-5 text-blue-400" />
                      <span>Briefing Estratégico do Projeto</span>
                    </h3>
                    <p className="mt-1.5 text-sm text-slate-300/90 leading-relaxed">
                      Responda essas informações básicas para que possamos entender o seu negócio e preparar um orçamento sob medida.
                    </p>
                  </div>

                  <form onSubmit={handleBriefingSubmit} className="space-y-6">
                    {/* Linha 1: Dados de Contato Direto (Nome & WhatsApp) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                          Seu Nome *
                        </label>
                        <input
                          type="text"
                          required
                          value={briefingData.contactName}
                          onChange={(e) =>
                            setBriefingData({ ...briefingData, contactName: e.target.value })
                          }
                          placeholder="Ex: Carlos Eduardo"
                          className="w-full px-4 py-3 rounded-xl bg-slate-950/90 border border-blue-500/20 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-[color,background-color,border-color,box-shadow,opacity,transform,translate,scale,rotate,--tw-gradient-from,--tw-gradient-via,--tw-gradient-to,--tw-gradient-stops]"
                        />
                        {formErrors.contactName && (
                          <p className="mt-1 text-xs text-rose-400">{formErrors.contactName}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                          Seu WhatsApp para Retorno *
                        </label>
                        <input
                          type="tel"
                          required
                          value={briefingData.whatsappContact}
                          onChange={(e) =>
                            setBriefingData({ ...briefingData, whatsappContact: e.target.value })
                          }
                          placeholder="Ex: (11) 99999-9999"
                          className="w-full px-4 py-3 rounded-xl bg-slate-950/90 border border-blue-500/20 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-[color,background-color,border-color,box-shadow,opacity,transform,translate,scale,rotate,--tw-gradient-from,--tw-gradient-via,--tw-gradient-to,--tw-gradient-stops]"
                        />
                        {formErrors.whatsappContact && (
                          <p className="mt-1 text-xs text-rose-400">{formErrors.whatsappContact}</p>
                        )}
                      </div>
                    </div>

                    {/* Linha 2: Sobre a Empresa / Negócio (Nome do Negócio & Ramo de Atuação) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                          Nome do Negócio / Empresa *
                        </label>
                        <input
                          type="text"
                          required
                          value={briefingData.businessName}
                          onChange={(e) =>
                            setBriefingData({ ...briefingData, businessName: e.target.value })
                          }
                          placeholder="Ex: Barbearia Navalha & Estilo"
                          className="w-full px-4 py-3 rounded-xl bg-slate-950/90 border border-blue-500/20 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-[color,background-color,border-color,box-shadow,opacity,transform,translate,scale,rotate,--tw-gradient-from,--tw-gradient-via,--tw-gradient-to,--tw-gradient-stops]"
                        />
                        {formErrors.businessName && (
                          <p className="mt-1 text-xs text-rose-400">{formErrors.businessName}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                          Ramo de Atuação
                        </label>
                        <div className="relative">
                          <select
                            value={briefingData.segment}
                            onChange={(e) =>
                              setBriefingData({ ...briefingData, segment: e.target.value })
                            }
                            className="w-full px-4 py-3 rounded-xl bg-slate-950/90 border border-blue-500/20 text-white text-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-[color,background-color,border-color,box-shadow,opacity,transform,translate,scale,rotate,--tw-gradient-from,--tw-gradient-via,--tw-gradient-to,--tw-gradient-stops] appearance-none cursor-pointer"
                          >
                            {segmentsList.map((item) => (
                              <option key={item} value={item} className="bg-slate-900 text-white">
                                {item}
                              </option>
                            ))}
                          </select>
                          <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                            ▼
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Linha 3: Formato do Site Desejado */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                        Tipo de Site Desejado
                      </label>
                      <div className="relative">
                        <select
                          value={briefingData.projectType}
                          onChange={(e) =>
                            setBriefingData({ ...briefingData, projectType: e.target.value })
                          }
                          className="w-full px-4 py-3 rounded-xl bg-slate-950/90 border border-blue-500/20 text-white text-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-[color,background-color,border-color,box-shadow,opacity,transform,translate,scale,rotate,--tw-gradient-from,--tw-gradient-via,--tw-gradient-to,--tw-gradient-stops] appearance-none cursor-pointer"
                        >
                          {projectTypesList.map((item) => (
                            <option key={item} value={item} className="bg-slate-900 text-white">
                              {item}
                            </option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                          ▼
                        </div>
                      </div>
                    </div>

                    {/* Linha 4: Objetivos e Detalhes do Projeto */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                        Conte um pouco sobre o projeto e seus objetivos
                      </label>
                      <textarea
                        rows={4}
                        value={briefingData.description}
                        onChange={(e) =>
                          setBriefingData({ ...briefingData, description: e.target.value })
                        }
                        placeholder="Ex: Quero que os clientes vejam meus serviços, valores e chamem direto no WhatsApp para agendar. Já tenho fotos do espaço e logotipo..."
                        className="w-full px-4 py-3 rounded-xl bg-slate-950/90 border border-blue-500/20 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-[color,background-color,border-color,box-shadow,opacity,transform,translate,scale,rotate,--tw-gradient-from,--tw-gradient-via,--tw-gradient-to,--tw-gradient-stops] resize-y"
                      />
                    </div>

                    {/* LGPD Consent */}
                    <div className="flex items-start gap-3 pt-2">
                      <input
                        type="checkbox"
                        id="lgpd-consent-briefing"
                        checked={briefingData.agreedToLgpd}
                        onChange={(e) =>
                          setBriefingData({ ...briefingData, agreedToLgpd: e.target.checked })
                        }
                        className="mt-1 w-4 h-4 rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                      />
                      <label
                        htmlFor="lgpd-consent-briefing"
                        className="text-xs text-slate-400 leading-relaxed cursor-pointer"
                      >
                        Concordo com o uso dos dados informados para contato comercial e elaboração de orçamento pela ēloSites, de acordo com a{' '}
                        <button
                          type="button"
                          onClick={onOpenPrivacy}
                          className="text-blue-400 underline hover:text-indigo-300 inline"
                        >
                          Política de Privacidade
                        </button>
                        .
                      </label>
                    </div>
                    {formErrors.agreedToLgpd && (
                      <p className="text-xs text-rose-400">{formErrors.agreedToLgpd}</p>
                    )}

                    {/* Submit Actions */}
                    <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                      <button
                        type="submit"
                        className="cta-primary inline-flex items-center justify-center text-center gap-2.5 px-6 py-4 rounded-xl text-sm sm:text-base font-semibold text-white pressable min-h-12 flex-1"
                      >
                        <WhatsAppIcon className="w-5 h-5 shrink-0" />
                        <span className="text-center">Enviar Briefing pelo WhatsApp</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleCopyBriefing}
                        className="cta-secondary inline-flex items-center justify-center text-center gap-2 px-5 py-4 rounded-xl text-sm font-semibold border border-slate-700/80 text-slate-200 hover:text-white pressable min-h-12"
                      >
                        {copied ? (
                          <Check className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Copy className="w-4 h-4 text-blue-400" />
                        )}
                        <span className="text-center">{copied ? 'Copiado!' : 'Copiar Resumo'}</span>
                      </button>
                    </div>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="tab-booking"
                  initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98, y: 10 }}
                  animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
                  exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98, y: -6 }}
                  transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
                >
                  <div className="mb-8">
                    <h3 className="font-display text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
                      <Calendar className="w-5 h-5 text-blue-400" />
                      <span>Agendar Reunião Online (30 minutos)</span>
                    </h3>
                    <p className="mt-1.5 text-sm text-slate-300/90 leading-relaxed">
                      Uma conversa direta de 30 minutos com o fundador via Google Meet ou WhatsApp Vídeo para analisar o seu negócio, planejar a estrutura do site e responder dúvidas sobre investimento e cronograma.
                    </p>
                  </div>

                  <form onSubmit={handleBookingSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                          Seu Nome *
                        </label>
                        <input
                          type="text"
                          required
                          value={bookingData.name}
                          onChange={(e) =>
                            setBookingData({ ...bookingData, name: e.target.value })
                          }
                          placeholder="Ex: Juliana Mendes"
                          className="w-full px-4 py-3 rounded-xl bg-slate-950/90 border border-blue-500/20 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-[color,background-color,border-color,box-shadow,opacity,transform,translate,scale,rotate,--tw-gradient-from,--tw-gradient-via,--tw-gradient-to,--tw-gradient-stops]"
                        />
                        {formErrors.bookingName && (
                          <p className="mt-1 text-xs text-rose-400">{formErrors.bookingName}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                          Nome do Negócio / Empresa
                        </label>
                        <input
                          type="text"
                          value={bookingData.businessName}
                          onChange={(e) =>
                            setBookingData({ ...bookingData, businessName: e.target.value })
                          }
                          placeholder="Ex: Studio Bella Estética"
                          className="w-full px-4 py-3 rounded-xl bg-slate-950/90 border border-blue-500/20 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-[color,background-color,border-color,box-shadow,opacity,transform,translate,scale,rotate,--tw-gradient-from,--tw-gradient-via,--tw-gradient-to,--tw-gradient-stops]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                          WhatsApp / E-mail *
                        </label>
                        <input
                          type="text"
                          required
                          value={bookingData.whatsappOrEmail}
                          onChange={(e) =>
                            setBookingData({ ...bookingData, whatsappOrEmail: e.target.value })
                          }
                          placeholder="(11) 98888-8888"
                          className="w-full px-4 py-3 rounded-xl bg-slate-950/90 border border-blue-500/20 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-[color,background-color,border-color,box-shadow,opacity,transform,translate,scale,rotate,--tw-gradient-from,--tw-gradient-via,--tw-gradient-to,--tw-gradient-stops]"
                        />
                        {formErrors.bookingContact && (
                          <p className="mt-1 text-xs text-rose-400">{formErrors.bookingContact}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                          Data de Preferência *
                        </label>
                        <input
                          type="date"
                          required
                          value={bookingData.preferredDate}
                          min={defaultDateStr}
                          onChange={(e) =>
                            setBookingData({ ...bookingData, preferredDate: e.target.value })
                          }
                          className="w-full px-4 py-3 rounded-xl bg-slate-950/90 border border-blue-500/20 text-white text-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-[color,background-color,border-color,box-shadow,opacity,transform,translate,scale,rotate,--tw-gradient-from,--tw-gradient-via,--tw-gradient-to,--tw-gradient-stops] cursor-pointer"
                        />
                        {formErrors.bookingDate && (
                          <p className="mt-1 text-xs text-rose-400">{formErrors.bookingDate}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                          Turno Preferido
                        </label>
                        <div className="relative">
                          <select
                            value={bookingData.preferredTimeSlot}
                            onChange={(e) =>
                              setBookingData({ ...bookingData, preferredTimeSlot: e.target.value })
                            }
                            className="w-full px-4 py-3 rounded-xl bg-slate-950/90 border border-blue-500/20 text-white text-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-[color,background-color,border-color,box-shadow,opacity,transform,translate,scale,rotate,--tw-gradient-from,--tw-gradient-via,--tw-gradient-to,--tw-gradient-stops] appearance-none cursor-pointer"
                          >
                            {timeSlotsList.map((slot) => (
                              <option key={slot} value={slot} className="bg-slate-900 text-white">
                                {slot}
                              </option>
                            ))}
                          </select>
                          <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                            ▼
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                          Plataforma de Preferência
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              setBookingData({ ...bookingData, platform: 'Google Meet' })
                            }
                            className={`px-3.5 py-3 rounded-xl border text-xs sm:text-sm font-medium flex items-center justify-center gap-2 pressable ${
                              bookingData.platform === 'Google Meet'
                                ? 'bg-indigo-600/25 border-indigo-400 text-white shadow-sm'
                                : 'bg-slate-950/80 border-white/[0.08] text-slate-400 hover:text-white'
                            }`}
                          >
                            <Video className="w-4 h-4 text-indigo-400" />
                            <span>Google Meet</span>
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              setBookingData({ ...bookingData, platform: 'WhatsApp Vídeo' })
                            }
                            className={`px-3.5 py-3 rounded-xl border text-xs sm:text-sm font-medium flex items-center justify-center gap-2 pressable ${
                              bookingData.platform === 'WhatsApp Vídeo'
                                ? 'bg-emerald-600/25 border-emerald-400 text-white shadow-sm'
                                : 'bg-slate-950/80 border-white/[0.08] text-slate-400 hover:text-white'
                            }`}
                          >
                            <WhatsAppIcon className="w-4 h-4 text-emerald-400" />
                            <span>WhatsApp Vídeo</span>
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                          Foco Principal da Conversa
                        </label>
                        <div className="relative">
                          <select
                            value={bookingData.meetingTopic}
                            onChange={(e) =>
                              setBookingData({ ...bookingData, meetingTopic: e.target.value })
                            }
                            className="w-full px-4 py-3 rounded-xl bg-slate-950/90 border border-blue-500/20 text-white text-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-[color,background-color,border-color,box-shadow,opacity,transform,translate,scale,rotate,--tw-gradient-from,--tw-gradient-via,--tw-gradient-to,--tw-gradient-stops] appearance-none cursor-pointer"
                          >
                            {meetingTopicsList.map((topic) => (
                              <option key={topic} value={topic} className="bg-slate-900 text-white">
                                {topic}
                              </option>
                            ))}
                          </select>
                          <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                            ▼
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* LGPD Consent */}
                    <div className="flex items-start gap-3 pt-2">
                      <input
                        type="checkbox"
                        id="lgpd-consent-booking"
                        checked={bookingData.agreedToLgpd}
                        onChange={(e) =>
                          setBookingData({ ...bookingData, agreedToLgpd: e.target.checked })
                        }
                        className="mt-1 w-4 h-4 rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                      />
                      <label
                        htmlFor="lgpd-consent-booking"
                        className="text-xs text-slate-400 leading-relaxed cursor-pointer"
                      >
                        Concordo com o uso dos dados para agendamento da reunião e contato prévio pela ēloSites, conforme a{' '}
                        <button
                          type="button"
                          onClick={onOpenPrivacy}
                          className="text-indigo-400 underline hover:text-indigo-300 inline"
                        >
                          Política de Privacidade
                        </button>
                        .
                      </label>
                    </div>
                    {formErrors.bookingAgreed && (
                      <p className="text-xs text-rose-400">{formErrors.bookingAgreed}</p>
                    )}

                    {/* Booking Actions */}
                    <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                      <button
                        type="submit"
                        className="cta-primary inline-flex items-center justify-center text-center gap-2.5 px-6 py-4 rounded-xl text-sm sm:text-base font-semibold text-white pressable min-h-12 flex-1"
                      >
                        <WhatsAppIcon className="w-5 h-5 shrink-0" />
                        <span className="text-center">Confirmar Agendamento</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleOpenGoogleCalendar}
                        className="cta-secondary inline-flex items-center justify-center text-center gap-2 px-4 py-4 rounded-xl text-xs sm:text-sm font-semibold border border-slate-700/80 text-slate-200 hover:text-white pressable min-h-12"
                      >
                        <CalendarPlus className="w-4 h-4 text-indigo-400" />
                        <span className="text-center">Salvar no Google Agenda</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleDownloadIcs}
                        className="cta-secondary inline-flex items-center justify-center text-center gap-2 px-4 py-4 rounded-xl text-xs sm:text-sm font-semibold border border-slate-700/80 text-slate-200 hover:text-white pressable min-h-12"
                        title="Baixar arquivo .ics para Apple Calendar ou Outlook"
                      >
                        <Download className="w-4 h-4 text-slate-400" />
                        <span className="text-center">Baixar .ics</span>
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-8 pt-6 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" aria-hidden="true" />
                <span>Dados protegidos pela LGPD · Sem spam ou repasses</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-400" aria-hidden="true" />
                <span>Retorno em até 2 horas em horário comercial</span>
              </div>
            </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
