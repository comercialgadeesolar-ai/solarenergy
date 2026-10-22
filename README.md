# GSE SOLAR ENERGY

Site responsivo sobre energia solar fotovoltaica, com banner GSE, sistema solar 3D girando lentamente no sentido anti-horário, zoom exclusivo na Terra, menu flutuante e simulador ilustrativo.

## Site no navegador

[Abrir a página inicial](https://comercialgadeesolar-ai.github.io/solarenergy/) · [Abrir o sistema solar 3D](https://comercialgadeesolar-ai.github.io/solarenergy/index2.html)

O código no GitHub e os ZIPs para download não equivalem a uma hospedagem. A versão estática é preparada por `node scripts/prepare-pages.mjs` e publicada na branch `gh-pages`.

Para habilitar a hospedagem, acesse [Settings → Pages](https://github.com/comercialgadeesolar-ai/solarenergy/settings/pages), escolha **Deploy from a branch**, selecione **gh-pages** e **/ (root)** e clique em **Save**. É necessário ter acesso de administração ao repositório. Acompanhe a execução **pages build and deployment** na aba Actions.

A primeira implantação da branch `gh-pages` foi confirmada pelo GitHub com sucesso na [execução de publicação](https://github.com/comercialgadeesolar-ai/solarenergy/actions/runs/39780990336). O workflow **Verify live solar demo** verifica por HTTPS a homepage e a presença dos recursos na experiência 3D. O site pode ser aberto em outra aba do navegador; o chat não executa o HTML dentro da conversa.

## Downloads

- [Site HTML pronto (index.html e index2.html)](https://github.com/comercialgadeesolar-ai/solarenergy/raw/refs/heads/main/downloads/gse-solar-site-html.zip)
- [Plugin instalável no WordPress](https://github.com/comercialgadeesolar-ai/solarenergy/raw/refs/heads/main/downloads/orbita-solar-wordpress.zip)
- [Projeto completo com os fontes](https://github.com/comercialgadeesolar-ai/solarenergy/raw/refs/heads/main/downloads/orbita-solar-completo.zip)
- [Extensão do Chrome para visualizar e compactar ZIPs](https://github.com/comercialgadeesolar-ai/solarenergy/raw/refs/heads/main/downloads/visualizador-zip-chrome.zip)

Os links funcionam após a publicação destes arquivos na branch `main`. Se o repositório for privado, entre na conta GitHub que tem acesso. Na tela de um arquivo ZIP do GitHub, o botão **Download raw file** também baixa o arquivo.

## Onde salvar no computador

No Chrome, abra `chrome://settings/downloads` e ative **Perguntar onde salvar cada arquivo antes de fazer download**. No Firefox, em **Configurações → Geral → Arquivos e aplicativos → Downloads**, marque a opção para sempre perguntar onde salvar os arquivos.

Para o site estático, extraia `gse-solar-site-html.zip`, mantenha os dois HTMLs na mesma pasta e abra `index.html`. Na hospedagem, publique os dois arquivos juntos. O banner abre a experiência completa em `index2.html`.

Para WordPress, instale `orbita-solar-wordpress.zip` em **Plugins → Adicionar plugin → Enviar plugin**, ative e adicione `[orbita_solar]` em uma página publicada de largura total.

Veja [LEIA-ME.md](LEIA-ME.md) para instruções completas de desenvolvimento, PHP, WordPress e limitações do simulador.
