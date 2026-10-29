# Integração pendente

Na planilha de destino, abra Extensões > Apps Script e cole GoogleAppsScript.gs.
Publique como aplicativo da Web executando como proprietário e com acesso aos convidados. Copie o endereço de implantação terminado em /exec para sheetsEndpoint em dist/config.js. O link de edição da planilha, sozinho, não é um endpoint de formulário.

Antes de liberar para convidados, valide um envio de presença e um de mensagem no endereço do site, confirmando a resposta JSON e as linhas nas abas Presenças e Mensagens. O envio só exibe sucesso após receber {ok:true}. Se o ambiente de publicação bloquear a resposta por CORS, será necessário um endpoint intermediário no site; nunca use no-cors como confirmação de gravação.

Preencha pixQrImage, pixCopyPaste e creditCardUrl no mesmo arquivo quando disponíveis. Substitua hero.webp, photo1.webp, photo2.webp e photo3.webp e o texto de história quando forem definidos.

O mapa incorporado usa o endereço da referência; o botão Como chegar conserva o link exato fornecido. Conferir visualmente o marcador antes da abertura aos convidados.
