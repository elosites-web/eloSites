import { ArrowUpRight, Check, Infinity as MetaIcon, Music2, Search } from 'lucide-react';
import { whatsappUrl } from '../types';
import { WhatsAppIcon } from './WhatsAppIcon';
import logo from '../assets/truethomaz/truethomaz-bm.svg';
import './PaidTrafficPartnershipSection.css';

const [portrait] = Object.values(import.meta.glob<string>('../assets/truethomaz/thomaz-perfil.webp', {
  eager: true,
  import: 'default',
}));

const platforms = [
  { name: 'Meta Ads', channel: 'Instagram e Facebook', icon: MetaIcon,
    description: 'Apresente seus produtos ou serviços no feed, nos Stories e nos Reels de quem pode se interessar.' },
  { name: 'Google Ads', channel: 'Pesquisa no Google', icon: Search,
    description: 'Apareça para quem já está procurando por um serviço ou produto como o seu.' },
  { name: 'TikTok Ads', channel: 'Vídeos no TikTok', icon: Music2,
    description: 'Mostre seu negócio em vídeos curtos para pessoas que estão descobrindo novidades.' },
];

const services = [
  'Planejamento e gestão de anúncios',
  'Criação e testes de anúncios e criativos',
  'Acompanhamento e melhorias das campanhas',
  'Consultoria comercial',
  'Orientações e treinamento de atendimento pelo WhatsApp',
];

const siteAndAds = whatsappUrl('Olá, ēloSites! Quero um site e gostaria de conhecer a gestão de anúncios em uma plataforma com a TrueThomaz.BM.');
const adsOnly = whatsappUrl('Olá, ēloSites! Já tenho um site e gostaria de um orçamento para anunciar com a TrueThomaz.BM.');

export function PaidTrafficPartnershipSection({ id = 'parceria-trafego' }: { id?: string }) {
  return (
    <section id={id} tabIndex={-1} aria-labelledby="tt-title" className="tt-partnership">
      <div className="tt-inner">
        <div className="tt-intro">
          <div className="tt-lead">
            <p className="tt-label">Parceria de tráfego pago</p>
            <h1 id="tt-title">Seu site.<br /><mark>Novos públicos.</mark></h1>
            <p>Seu site apresenta o que você faz. Os anúncios ajudam novas pessoas a conhecer seu negócio.</p>
            <p>A <strong>ēloSites</strong> desenvolve o site. A <strong>TrueThomaz.BM</strong> cuida dos anúncios. São serviços complementares, contratados de forma independente.</p>
          </div>

          <aside className="tt-partner" aria-label="Conheça o parceiro">
            <img className="tt-logo" src={logo} alt="TrueThomaz.BM" width="539" height="76" />
            <div className="tt-profile">
              {portrait && (
                <img className="tt-portrait" src={portrait} alt="Retrato de Thomaz" width="112" height="112" decoding="async" />
              )}
              <div>
                <h2>Thomaz</h2>
                <p>Profissional parceiro de tráfego pago</p>
              </div>
            </div>
          </aside>
        </div>

        <section aria-labelledby="tt-platforms" className="tt-platforms">
          <div className="tt-section-head">
            <h2 id="tt-platforms">Onde anunciar?</h2>
            <p>Na condição especial, você escolhe <strong>uma plataforma.</strong></p>
          </div>
          <div className="tt-platform-grid">
            {platforms.map(({ name, channel, icon: Icon, description }) => (
              <article className="tt-platform" key={name}>
                <div className="tt-platform-top"><Icon aria-hidden="true" /><span>{channel}</span></div>
                <h3>{name}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </section>

        <div className="tt-details">
          <section className="tt-services" aria-labelledby="tt-services">
            <p className="tt-label">Serviços de tráfego pago</p>
            <h2 id="tt-services">Como a <span className="tt-brand">TrueThomaz.BM</span> pode ajudar</h2>
            <ul>{services.map(service => <li key={service}><Check aria-hidden="true" />{service}</li>)}</ul>
            <p>Antes de contratar, combine com a TrueThomaz.BM as entregas e os limites de cada serviço. A parceria não garante vendas, clientes, faturamento ou posições em buscadores.</p>
          </section>

          <section className="tt-offer" aria-labelledby="tt-offer">
            <h2 id="tt-offer" className="tt-label">Condição especial</h2>
            <p className="tt-price">R$ 500<span>/mês</span></p>
            <p className="tt-period">Nos 3 primeiros meses</p>
            <h3>Escolha 1 plataforma: Meta Ads, Google Ads ou TikTok Ads</h3>
            <p>Condição exclusiva para clientes que contratam um site com a ēloSites.</p>
            <p className="tt-terms">*O investimento nos anúncios é pago separadamente. Após os três primeiros meses, condições e valores são negociados diretamente com a TrueThomaz.BM. Mais plataformas ou operações maiores exigem orçamento individual.</p>
            <a id="cta-parceria-trafego-whatsapp" className="tt-cta" href={siteAndAds} target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon /><span>Quero um site + anúncios</span><ArrowUpRight aria-hidden="true" />
            </a>
          </section>
        </div>

        <section className="tt-existing" aria-labelledby="tt-existing">
          <div>
            <h2 id="tt-existing">Já tem um site e precisa apenas de anúncios?</h2>
            <p>Fale com a ēloSites para solicitar atendimento. Você negocia o orçamento diretamente com a TrueThomaz.BM. A condição de R$ 500/mês é exclusiva para quem contrata um site com a ēloSites.</p>
          </div>
          <a className="tt-cta tt-secondary" href={adsOnly} target="_blank" rel="noopener noreferrer">
            <WhatsAppIcon /><span>Já tenho site e quero anunciar</span><ArrowUpRight aria-hidden="true" />
          </a>
        </section>
      </div>
    </section>
  );
}
