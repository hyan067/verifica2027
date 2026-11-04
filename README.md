# Verifica 2027 — orientação independente

Landing page e fluxo demonstrativo em React/Vite, Tailwind, Zustand, Lucide e qrcode.react.

**Importante:** a ferramenta **não tem vínculo com o governo**, **não consulta CadÚnico** e **não concede Bolsa Família**. Referência utilizada: página oficial do Bolsa Família com limite geral de entrada de **R$ 218 por pessoa**, consultada em **04/11/2026**. Critérios específicos de 2027 ainda precisam ser confirmados e revisados antes de qualquer lançamento comercial. Não há base oficial verificada para apresentar "R$ 4.000" como nova regra geral.

## Executar

```bash
npm install
cp .env.example .env
npm run dev
```

No Windows, substitua `cp` por `copy`. Depois abra o endereço mostrado pelo Vite.

```bash
npm test
npm run build
npm run preview
```

## Recursos

- Página inicial responsiva, metodologia, preços e FAQ.
- Formulário de renda e composição familiar sem CPF, com validações.
- Relatório básico gratuito com conta explícita e fonte pública.
- Relatório expandido (passos e motivos) em **modo demonstração**.
- Checkout opcional de R$ 15, com CPF **opcional**, validação algorítmica e apagamento do CPF ao avançar.
- QR **fictício** na demonstração, que **não pode receber pagamentos**.
- Zustand sem `persist`, sem `localStorage`, sem envio do perfil ao servidor.
- Botão “Apagar meus dados” que limpa o estado local (memória da aba).
- HashRouter, compatível com hospedagem estática como GitHub Pages.

## Estrutura

```text
src/
  main.jsx
  index.css
  App.jsx
  store/useAssessmentStore.js
  components/
    Header.jsx
    Hero.jsx
    Methodology.jsx
    FAQ.jsx
    QuestionnaireModal.jsx
    CheckoutModal.jsx
  pages/ResultPage.jsx
  lib/
    eligibilityLogic.js
    validation.js
```

## Pix real: não está implementado (exige backend)

A aplicação inicia com `VITE_PAYMENT_MODE=demo`, em que nenhum pagamento acontece e a entrega do relatório é liberada *apenas para visualizar a demonstração*.

Para um ambiente comercial, implemente **backend próprio** e integração com um PSP/provedor Pix autorizado. Contrato mínimo esperado pelo frontend:

- `POST /api/pix/create` (criar cobrança de valor fixo e produto `relatorio-15`; não aceitar valor arbitrário do cliente), resposta `{ "chargeId": "...", "brCode": "000201..." }`.
- `GET /api/pix/status?chargeId=...` para consultar o estado validado no servidor; resposta `{ "status": "pending" | "paid" | "expired" }`.
- Receber, autenticar e validar **webhook** do PSP para associar cobrança ao comprador, conferir moeda/valor/expiração e liberar o relatório no servidor. Não confiar em `reportUnlocked` do Zustand para proteger conteúdo comprado.
- Aplicar controle de autenticação/autorização, rate-limit, HTTPS, proteção CSRF/CORS, antifraude e idempotência. Não armazenar segredos em `VITE_*`.
- Enviar dados essenciais do comprador ao backend somente quando houver base legal, aviso de privacidade e necessidade real. Este protótipo **não envia CPF, nome ou e-mail para o servidor**, mesmo no modo live.
- Adicionar identificação do fornecedor (CNPJ/CPF empresarial adequado, contato), termo de serviço, política de privacidade, condições de entrega, suporte, reembolso e direitos do consumidor antes do lançamento.

Depois de ter o servidor funcional, defina `VITE_PAYMENT_MODE=live` e `VITE_PAYMENT_API_URL=https://...`. O sistema mostra o Pix retornado pelo servidor e consulta o status; **o acesso pago ainda deve ser protegido no backend**. Não use a marca “pagamento seguro” sem implementação real, documentação e contrato com o provedor.

## Fontes para revisão das regras

- [Bolsa Família — gov.br](https://www.gov.br/pt-br/servicos/receber-o-bolsa-familia)
- [Bolsa Família — MDS](https://www.gov.br/mds/pt-br/acoes-e-programas/bolsa-familia/bolsa-familia/)
- [Cadastro Único — MDS](https://www.gov.br/mds/pt-br/acoes-e-programas/cadastro-unico/Cadastro-unico/)

## Avisos sobre critérios

O mecanismo é **educativo**: utiliza o limite geral de renda por pessoa como um dos dados disponíveis e sinaliza necessidade de revisão cadastral. Não usa limiares artificiais por tamanho da família, não promete aprovação e não interpreta a Regra de Proteção de beneficiários existentes como critério geral de entrada. Regras podem mudar e devem ser versionadas/atualizadas com fontes e datas antes do uso em produção.

## Publicar no GitHub Pages

O projeto inclui `.github/workflows/deploy.yml`. Crie um repositório GitHub, envie todos os arquivos, mantenha a branch `main` e, nas configurações de **Pages**, escolha **GitHub Actions** como origem. O workflow executa testes, compila e publica `dist/`. O roteamento utiliza hash (`/#/resultado`), evitando problemas de caminhos no Pages.

**Atenção:** publicar o protótipo deixa apenas o diagnóstico gratuito e a simulação, sem cobranças. Antes de usar nomes, marcas, preço real ou coletar dados, identifique o fornecedor e adapte o aviso de privacidade e as regras ao contexto jurídico real.
