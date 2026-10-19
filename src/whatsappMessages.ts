/**
 * ēloSites — Utilitário Centralizado de Mensagens e URLs do WhatsApp
 *
 * Gerencia todas as mensagens pré-formatadas para o WhatsApp com emojis nativos,
 * quebras de linha e formatação em negrito. Garante codificação 100% segura
 * via encodeURIComponent diretamente para a API oficial do WhatsApp,
 * prevenindo qualquer corrupção de caracteres ou erro de interrogação (U+FFFD).
 */

import { ScreenId, ProjectBriefData, MeetingBookingData } from './types';

export const WHATSAPP_PHONE_NUMBER = '5511995722584';
export const WHATSAPP_PHONE_DISPLAY = '+55 (11) 99572-2584';

export type WhatsAppLocation =
  | 'header'
  | 'hero'
  | 'portfolio'
  | 'portfolio-card'
  | 'services'
  | 'service-landing'
  | 'service-institucional'
  | 'service-personalizado'
  | 'service-simulator'
  | 'process'
  | 'differentials'
  | 'briefing'
  | 'booking'
  | 'faq'
  | 'contact'
  | 'parceria-trafego'
  | 'partnership'
  | 'floating'
  | 'menu-modal'
  | 'footer';

export interface WhatsAppContextParams {
  screenId?: ScreenId | 'contato' | 'diferenciais';
  location?: WhatsAppLocation;
  projectName?: string;
  simulatedValue?: number;
  serviceTitle?: string;
  customText?: string;
}

/**
 * Retorna a mensagem pré-formatada adequada para o contexto informado,
 * utilizando quebras de linha reais (\n), negrito WhatsApp (*...*) e emojis consistentes.
 */
export function formatWhatsAppMessage(params?: WhatsAppContextParams | string): string {
  if (!params) {
    return 'Olá! 👋 Gostaria de saber mais sobre a criação de sites profissionais da *ēloSites*.';
  }

  if (typeof params === 'string') {
    return params;
  }

  if (params.customText) {
    return params.customText;
  }

  // 1) Mensagens por localização explícita
  if (params.location === 'header') {
    return 'Olá! 👋 Acessei o site da *ēloSites* através do cabeçalho.\n\nGostaria de conversar diretamente com o desenvolvedor sobre a criação de um *site profissional* para o meu negócio.';
  }

  if (params.location === 'hero') {
    return 'Olá! 🚀 Conheci a *ēloSites* pela página inicial.\n\nQuero solicitar um *orçamento sob medida* para desenvolver um site profissional com foco em *conversão no WhatsApp* e *SEO técnico* para minha marca.';
  }

  if (params.location === 'portfolio-card') {
    const project = params.projectName || 'visualizado';
    return `Olá! 💻 Vi o projeto *${project}* no portfólio da *ēloSites*.\n\nGostei muito do resultado e gostaria de solicitar um orçamento para desenvolver um site similar para o meu negócio!`;
  }

  if (params.location === 'portfolio') {
    return 'Olá! 💻 Estive analisando o *portfólio de projetos reais* no site da *ēloSites*.\n\nGostei muito do padrão de acabamento, velocidade e responsividade. Gostaria de solicitar uma proposta comercial para um projeto com esse nível de qualidade!';
  }

  if (params.location === 'service-landing') {
    return 'Olá! 🎯 Tenho interesse no formato *Landing Page de Alta Conversão* da *ēloSites*.\n\nPreciso de uma página única estratégica, veloz e otimizada para campanhas e captação de clientes no WhatsApp. Como podemos iniciar?';
  }

  if (params.location === 'service-institucional') {
    return 'Olá! 🏢 Tenho interesse no formato *Site Institucional Completo* da *ēloSites*.\n\nQuero fortalecer a autoridade da minha empresa no Google com *SEO técnico*, apresentação completa de serviços e credibilidade corporativa. Poderia me enviar uma proposta?';
  }

  if (params.location === 'service-personalizado') {
    return 'Olá! ⚡ Gostaria de conversar sobre um *Projeto Sob Medida / Personalizado* com a *ēloSites*.\n\nTenho requisitos específicos para o meu negócio e busco uma solução web exclusiva de alta performance.';
  }

  if (params.location === 'service-simulator') {
    const val = params.simulatedValue ? `R$ ${params.simulatedValue.toLocaleString('pt-BR')},00` : 'sob medida';
    return `Olá! 💰 Simulei uma condição de pagamento no site da *ēloSites* (valor base estimado em *${val}*).\n\nGostaria de receber um orçamento oficial com o escopo detalhado para o meu projeto!`;
  }

  if (params.location === 'process') {
    return 'Olá! 📋 Conheci o *processo ágil em 4 etapas* da *ēloSites*.\n\nGostei da transparência e do contato direto com quem desenvolve. Gostaria de entender os prazos para iniciar o meu site!';
  }

  if (params.location === 'differentials') {
    return 'Olá! ✨ Li os *diferenciais estratégicos* da *ēloSites* (código autoral limpo, sem intermediários e foco total em conversão no WhatsApp).\n\nQuero entender como podemos aplicar esses diferenciais no site do meu negócio!';
  }

  if (params.location === 'faq') {
    return 'Olá! 💡 Estive lendo a seção de *Perguntas Frequentes (FAQ)* no site da *ēloSites*.\n\nAinda fiquei com algumas dúvidas sobre domínio, hospedagem ou prazos e gostaria de falar diretamente com o desenvolvedor.';
  }

  if (params.location === 'contact') {
    return 'Olá! 💬 Gostaria de dar o próximo passo e iniciar o projeto do meu *site profissional* com a *ēloSites*.\n\nPodemos conversar sobre o escopo, formato e orçamento?';
  }

  if (params.location === 'floating') {
    return 'Olá! 🚀 Preciso de um site profissional para o meu negócio.\n\nGostaria de tirar algumas dúvidas rápidas diretamente com a equipe da *ēloSites*!';
  }

  if (params.location === 'menu-modal') {
    return 'Olá! 📱 Estive navegando pelo menu da *ēloSites* e gostaria de receber mais informações sobre o desenvolvimento de sites profissionais.';
  }

  if (params.location === 'footer') {
    return 'Olá! 👋 Conheci o trabalho da *ēloSites* pelo rodapé do site.\n\nGostaria de solicitar uma análise e um orçamento personalizado para o meu projeto!';
  }

  if (params.location === 'partnership' || params.location === 'parceria-trafego') {
    return 'Olá! Vim pelo site da ēloSites e gostaria de conhecer a condição especial da parceria de tráfego pago. Gostaria de receber mais informações.';
  }

  // 2) Mensagens pelo ID da tela ativa caso location não tenha sido especificado
  switch (params.screenId) {
    case 'inicio':
      return 'Olá! 🚀 Conheci a *ēloSites* pela página inicial.\n\nQuero solicitar um *orçamento sob medida* para desenvolver um site profissional com foco em *conversão no WhatsApp* e *SEO técnico* para minha marca.';
    case 'portfolio':
      return 'Olá! 💻 Estive analisando o *portfólio de projetos reais* no site da *ēloSites*.\n\nGostei muito do padrão de acabamento, velocidade e responsividade. Gostaria de solicitar uma proposta comercial para um projeto com esse nível de qualidade!';
    case 'servicos':
      return 'Olá! 💼 Estive analisando a seção de *Serviços & Condições Comerciais* da *ēloSites*.\n\nGostaria de entender melhor as opções de pagamento e o formato mais indicado para o meu negócio.';
    case 'processo':
      return 'Olá! 📋 Conheci o *processo ágil em 4 etapas* da *ēloSites*.\n\nGostei da transparência e do contato direto com quem desenvolve. Gostaria de entender os prazos para iniciar o meu site!';
    case 'diferenciais':
      return 'Olá! ✨ Li os *diferenciais estratégicos* da *ēloSites* (código autoral limpo, sem intermediários e foco total em conversão no WhatsApp).\n\nQuero entender como podemos aplicar esses diferenciais no site do meu negócio!';
    case 'orcamento':
      return 'Olá! 📋 Estive na seção de *Briefing & Agendamento* da *ēloSites*.\n\nGostaria de alinhar os detalhes e dar início à proposta do meu projeto.';
    case 'faq':
      return 'Olá! 💡 Estive lendo a seção de *Perguntas Frequentes (FAQ)* no site da *ēloSites*.\n\nAinda fiquei com algumas dúvidas sobre domínio, hospedagem ou prazos e gostaria de falar diretamente com o desenvolvedor.';
    case 'contato':
      return 'Olá! 💬 Gostaria de dar o próximo passo e iniciar o projeto do meu *site profissional* com a *ēloSites*.\n\nPodemos conversar sobre o escopo, formato e orçamento?';
    case 'parceria-trafego':
      return 'Olá! Vim pelo site da ēloSites e gostaria de conhecer a condição especial da parceria de tráfego pago. Gostaria de receber mais informações.';
    default:
      return 'Olá! 👋 Gostaria de saber mais sobre a criação de sites profissionais da *ēloSites*.';
  }
}

/**
 * Constrói a URL direta e oficial do WhatsApp garantindo encodeURIComponent UTF-8.
 * Evita o redirecionador 302 do wa.me que corrompe emojis gerando o erro de ponto de interrogação (U+FFFD).
 */
export function buildWhatsAppUrl(paramsOrMessage?: WhatsAppContextParams | string): string {
  const message = formatWhatsAppMessage(paramsOrMessage);
  // encodeURIComponent codifica perfeitamente todos os caracteres multibyte UTF-8 e quebras de linha (%0A)
  const encodedText = encodeURIComponent(message);
  return `https://api.whatsapp.com/send?phone=${WHATSAPP_PHONE_NUMBER}&text=${encodedText}`;
}

/**
 * Formata os dados de Briefing em mensagem estruturada para o WhatsApp
 */
export function formatBriefingWhatsappMessage(data: ProjectBriefData): string {
  return [
    `*📋 NOVO BRIEFING — ēloSites*`,
    ``,
    `*👤 Nome:* ${data.contactName.trim()}`,
    `*🏢 Negócio:* ${data.businessName.trim()}`,
    `*🏷️ Segmento:* ${data.segment}`,
    `*💻 Tipo de Projeto:* ${data.projectType}`,
    `*📱 WhatsApp do Cliente:* ${data.whatsappContact.trim()}`,
    data.description.trim() ? `*📝 Detalhes e Objetivos:*\n${data.description.trim()}` : '',
    ``,
    `Gostaria de receber uma proposta comercial personalizada considerando as opções de pagamento (PIX 50/50, 20% à vista ou cartão em até 5x sem juros).`,
  ]
    .filter(Boolean)
    .join('\n');
}

/**
 * Formata os dados de Agendamento em mensagem estruturada para o WhatsApp
 */
export function formatBookingWhatsappMessage(data: MeetingBookingData): string {
  return [
    `*📅 SOLICITAÇÃO DE REUNIÃO — ēloSites*`,
    ``,
    `*👤 Nome:* ${data.name.trim()}`,
    `*🏢 Empresa:* ${data.businessName.trim()}`,
    `*📞 Contato:* ${data.whatsappOrEmail.trim()}`,
    `*🗓️ Data Sugerida:* ${data.preferredDate}`,
    `*⏰ Horário:* ${data.preferredTimeSlot}`,
    `*💻 Plataforma:* ${data.platform}`,
    `*🎯 Pauta:* ${data.meetingTopic}`,
    data.notes?.trim() ? `*📌 Observações:* ${data.notes.trim()}` : '',
    ``,
    `Gostaria de confirmar a disponibilidade para esta reunião e alinharmos o projeto!`,
  ]
    .filter(Boolean)
    .join('\n');
}
