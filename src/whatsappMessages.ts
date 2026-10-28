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
    return 'Olá! 🚀 Conheci a *ēloSites* pela página inicial.\n\nQuero solicitar um *orçamento sob medida* para desenvolver um site profissional para o meu negócio, estruturado para o Google e com contato no WhatsApp.';
  }

  if (params.location === 'portfolio-card') {
    const project = params.projectName || 'visualizado';
    return `Olá! 💻 Vi o projeto *${project}* no portfólio da *ēloSites*.\n\nGostei muito do resultado e gostaria de solicitar um orçamento para desenvolver um site similar para o meu negócio!`;
  }

  if (params.location === 'portfolio') {
    return 'Olá! 💻 Estive analisando o *portfólio de projetos reais* no site da *ēloSites*.\n\nGostei muito do padrão de acabamento, velocidade e facilidade de navegação no celular. Gostaria de solicitar uma proposta comercial para um projeto para o meu negócio!';
  }

  if (params.location === 'service-landing') {
    return 'Olá! 🎯 Tenho interesse no formato *Site de uma página* da *ēloSites*.\n\nPreciso de uma página direta, ágil e focada em apresentar meus serviços e levar os clientes para o WhatsApp. Como podemos iniciar?';
  }

  if (params.location === 'service-institucional') {
    return 'Olá! 🏢 Tenho interesse no formato *Site completo* da *ēloSites*.\n\nQuero apresentar minha empresa com estrutura adequada para indexação no Google, detalhes dos serviços, fotos reais e localização. Poderia me enviar uma proposta?';
  }

  if (params.location === 'process') {
    return 'Olá! 📋 Conheci o *processo em 4 etapas* da *ēloSites*.\n\nGostei da clareza e do contato direto com quem desenvolve. Gostaria de entender os prazos para iniciar o meu site!';
  }

  if (params.location === 'differentials') {
    return 'Olá! ✨ Li as *vantagens* de criar um site com a *ēloSites* (atendimento direto com o desenvolvedor, carregamento rápido e foco em WhatsApp).\n\nQuero entender como podemos aplicar esses benefícios no site do meu negócio!';
  }

  if (params.location === 'faq') {
    return 'Olá! 💡 Estive lendo a seção de *Perguntas Frequentes (FAQ)* no site da *ēloSites*.\n\nAinda fiquei com algumas dúvidas sobre domínio, publicação ou pagamentos e gostaria de falar diretamente com o desenvolvedor.';
  }

  if (params.location === 'contact') {
    return 'Olá! 💬 Gostaria de dar o próximo passo e iniciar o projeto do meu *site profissional* com a *ēloSites*.\n\nPodemos conversar sobre o formato ideal e o orçamento?';
  }

  if (params.location === 'floating') {
    return 'Olá! 🚀 Preciso de um site profissional para o meu negócio.\n\nGostaria de tirar algumas dúvidas rápidas diretamente com o desenvolvedor da *ēloSites*!';
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
      return 'Olá! 🚀 Conheci a *ēloSites* pela página inicial.\n\nQuero solicitar um *orçamento sob medida* para desenvolver um site profissional para o meu negócio, estruturado para o Google e com contato no WhatsApp.';
    case 'portfolio':
      return 'Olá! 💻 Estive analisando o *portfólio de projetos reais* no site da *ēloSites*.\n\nGostei muito do padrão de acabamento, velocidade e facilidade de navegação no celular. Gostaria de solicitar uma proposta comercial para um projeto para o meu negócio!';
    case 'servicos':
      return 'Olá! 💼 Estive analisando a seção de *Formatos & Valores* da *ēloSites*.\n\nGostaria de entender melhor as opções de pagamento e o formato mais indicado para o meu negócio.';
    case 'processo':
      return 'Olá! 📋 Conheci o *processo em 4 etapas* da *ēloSites*.\n\nGostei da clareza e do contato direto com quem desenvolve. Gostaria de entender os prazos para iniciar o meu site!';
    case 'diferenciais':
      return 'Olá! ✨ Li as *vantagens* de criar um site com a *ēloSites* (atendimento direto com o desenvolvedor, carregamento rápido e foco em WhatsApp).\n\nQuero entender como podemos aplicar esses benefícios no site do meu negócio!';
    case 'orcamento':
      return 'Olá! 📋 Estive na seção de *Orçamento & Contato* da *ēloSites*.\n\nGostaria de alinhar os detalhes e dar início à proposta do meu projeto.';
    case 'faq':
      return 'Olá! 💡 Estive lendo a seção de *Perguntas Frequentes (FAQ)* no site da *ēloSites*.\n\nAinda fiquei com algumas dúvidas sobre domínio, publicação ou pagamentos e gostaria de falar diretamente com o desenvolvedor.';
    case 'contato':
      return 'Olá! 💬 Gostaria de dar o próximo passo e iniciar o projeto do meu *site profissional* com a *ēloSites*.\n\nPodemos conversar sobre o formato ideal e o orçamento?';
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
    `*💻 Formato Desejado:* ${data.projectType}`,
    data.investmentRange ? `*💰 Faixa de Investimento:* ${data.investmentRange}` : '',
    `*📱 WhatsApp do Cliente:* ${data.whatsappContact.trim()}`,
    data.description.trim() ? `*📝 Detalhes e Objetivos:*\n${data.description.trim()}` : '',
    ``,
    `Gostaria de receber uma proposta comercial personalizada considerando as opções de pagamento (PIX 50/50, 20% à vista no PIX ou cartão de crédito em até 5x sem juros).`,
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
