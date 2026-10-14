# Órbita Solar

Site em português sobre energia solar fotovoltaica, com sistema solar 3D interativo, oito planetas, conteúdo educativo e simulador ilustrativo de economia. PHP e HTML renderizam a página; JavaScript/WebGL executam o 3D no Chrome e em outros navegadores modernos.

## Instalação no WordPress

1. No painel, acesse **Plugins → Adicionar plugin → Enviar plugin**.
2. Envie `orbita-solar-wordpress.zip`, instale e ative **Órbita Solar — Universo 3D**.
3. Crie uma página e adicione um bloco **Shortcode** com `[orbita_solar]`.
4. Escolha um modelo de página de largura total, sem barra lateral. Se seu construtor permitir, escolha uma página em branco/Canvas para evitar cabeçalho e rodapé duplicados.
5. Publique a página e abra seu endereço no Chrome.

O menu flutuante permanece fixo na parte inferior da tela, em computadores e celulares. No WordPress, ele aparece em todas as páginas públicas servidas pelo tema com `wp_footer()`, inclusive páginas sem o shortcode, e aponta para a página publicada que contém `[orbita_solar]`. Se houver várias páginas com esse shortcode, cada uma usa seus próprios atalhos; nas demais páginas, o menu aponta para a primeira publicada encontrada. Antes de publicar a página com o shortcode, os atalhos apontam para a página inicial. Páginas feitas exclusivamente em construtores, sem o shortcode no conteúdo da página, devem incluir `[orbita_solar]` no conteúdo para a descoberta automática.

O plugin inclui HTML, CSS, fontes locais e o JavaScript compilado. A hospedagem precisa de WordPress 6.0+ e PHP 7.4+. Não precisa de Node.js, APIs, banco de dados adicional ou chaves. O shortcode deve aparecer uma vez por página. Os estilos da aplicação são delimitados pela classe `.orbita-solar`; o tema ainda pode aplicar regras de alta especificidade, portanto confira o resultado com o seu tema.

## PHP independente

Extraia o ZIP e envie a pasta `orbita-solar` para o diretório público da hospedagem. Abra `/orbita-solar/index.php`. Mantenha as pastas `dist/`, `public/` e `templates/` junto ao PHP. Não abra `orbita-solar.php` diretamente: esse é o arquivo do plugin.

## Demo HTML

`index.html` é a página inicial com o banner **GSE SOLAR ENERGY**. `index2.html` contém a experiência completa, com sistema solar 3D, zoom exclusivo na Terra, simulador e menu flutuante. Mantenha os dois arquivos na mesma pasta: os links da página inicial abrem `index2.html` e suas seções. Os dois arquivos são autocontidos e podem ser publicados em hospedagem estática; no pacote WordPress eles também ficam disponíveis dentro da pasta do plugin. Isso não altera automaticamente a página inicial configurada no painel WordPress.

`orbita-solar-demo.html` é uma demo autocontida: salve e abra no Chrome, sem instalação. Você também pode enviá-la para uma hospedagem estática. O pacote do plugin contém a mesma demo com o nome `demo-autocontida.html`, além de `demo.html`, que precisa ficar ao lado de `dist/` e `public/` e deve ser servido por HTTP/HTTPS. Navegadores gerenciados por empresas podem bloquear arquivos locais; nesse caso, envie a demo à sua hospedagem.

`orbita-solar-completo.zip` inclui os fontes, testes, arquivos PHP, assets compilados e a demo. Use `orbita-solar-wordpress.zip` para instalar como plugin. O pacote não é um arquivo de migração de banco de dados/temas de ferramentas como All-in-One WP Migration; a integração é feita por plugin e shortcode.

## Controles

- O menu flutuante acompanha a rolagem e permite acessar as cinco áreas do site a qualquer momento. Ele não se oculta ao rolar; a seção atual fica destacada. Há espaço no final da página para que ele não cubra o rodapé.
- Arraste com o mouse para girar a visão; no celular, arraste com um dedo.
- Use os botões `+` e `−` ou `Ctrl + scroll` para aproximar/afastar. O scroll comum continua rolando a página.
- Clique em **Zoom na Terra** (ou diretamente na Terra na cena 3D) para explorar somente esse planeta. Arraste para girar ao redor dele e ajuste a distância no controle **Zoom manual da Terra**, com `+`/`−` ou `Ctrl + scroll`. O foco acompanha a Terra durante sua órbita; os demais astros ficam ocultos nesse modo.
- Clique em **Voltar ao sistema** ou **Restaurar visão** para retornar ao sistema solar completo. O controle deslizante também funciona no celular e com as setas do teclado.
- Pause ou retome as órbitas; o botão circular restaura a visão inicial.
- O sistema solar inteiro gira automaticamente bem devagar no sentido anti-horário, visto de cima do plano das órbitas. Os planetas também percorrem suas órbitas suavemente no mesmo sentido. A pausa interrompe ambos os movimentos; a câmera acompanha a Terra no modo de zoom mesmo durante esse giro.
- Clique no Sol/planeta ou use os botões com nomes para ler informações. Os botões também permitem navegação por teclado.
- O modo de movimento reduzido do sistema pausa as órbitas inicialmente.
- Sem WebGL, a página apresenta uma ilustração estática e mantém as informações e o simulador disponíveis.

## Simulador

A simulação usa conta mensal em reais, tarifa assumida de R$ 1/kWh, economia de 80% na parcela de energia, 30 dias por mês, horas de sol pleno ajustáveis e eficiência de 80%. Potência estimada = consumo mensal × 80% ÷ (30 × horas de sol × 80%). Quantidade de painéis = potência estimada ÷ 0,55 kWp, arredondada para cima. Economia anual = conta × 80% × 12.

É uma demonstração educativa. O modelo não considera investimento, impostos, custo mínimo de disponibilidade, sombreamento, orientação do telhado, degradação ou regras de compensação da distribuidora. Tamanhos, distâncias e velocidades na cena 3D são artísticos e estão fora de escala. As superfícies dos astros são texturas procedurais, não fotografias astronômicas.

## Desenvolvimento

```bash
cd /workspace/solarenergy
npm --cache /workspace/.cache/npm ci --no-audit --no-fund
npm run dev
```

No desenvolvimento, `/` mostra a página inicial GSE; `/dev.html` carrega o site 3D a partir dos fontes com atualização automática. `index2.html` é a versão compilada: execute a compilação e o empacotamento abaixo para atualizá-la após mudar os fontes. Edite `templates/home.html` para alterar o banner; o empacotamento gera `index.html` a partir desse modelo.

Para gerar os arquivos PHP/WordPress:

```bash
npm run build
node scripts/package.mjs
```

Servidor PHP de teste:

```bash
bash scripts/install-php.sh
/workspace/bin/php -S 0.0.0.0:8080 -t /workspace/solarenergy
```

O instalador PHP isola o runtime em `/workspace/.tools` e foi feito para a imagem Debian 13 deste ambiente. Não execute esse instalador na hospedagem WordPress; utilize o PHP que a hospedagem já oferece.

Testes automatizados do navegador e da integração PHP:

```bash
npm test
/workspace/bin/php tests/wordpress-harness.php
```

O harness verifica registro de shortcode, renderização, isolamento de scripts e carregamento de assets com a API WordPress simulada. Ele não substitui a validação em uma instalação WordPress real com seu tema e plugins. Os testes de navegador usam Chromium disponível em `/usr/bin/chromium` neste ambiente.

## Estrutura

- `orbita-solar.php`: plugin WordPress e shortcode.
- `index.php`: entrada PHP independente.
- `templates/landing.html`: conteúdo HTML compartilhado, renderizado pelo PHP.
- `src/main.js`: navegação, seleção dos planetas, simulador e controles.
- `src/solar-scene.js`: geometria 3D, iluminação, órbitas e texturas locais.
- `src/style.css`: layout responsivo e estilos delimitados para WordPress.
- `dist/`: assets compilados para a hospedagem.

Para personalizar textos, edite `templates/landing.html`; para identidade visual, edite `src/style.css`. Compile novamente e gere o ZIP para manter as versões HTML, PHP e WordPress sincronizadas.
