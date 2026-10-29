// Script vinculado à planilha de destino. Publicar como aplicativo da Web,
// executar como proprietário, permitir acesso aos convidados.
function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    var data = JSON.parse(e.postData.contents);
    if (!['rsvp', 'message'].includes(data.type)) throw new Error('Tipo inválido');
    function clean(value, limit) {
      var text = String(value || '').trim().slice(0, limit);
      return /^[=+@-]/.test(text) ? "'" + text : text;
    }
    var row, headers, title;
    if (data.type === 'rsvp') {
      if (!Array.isArray(data.names) || !data.names.length || !String(data.names[0]).trim() || !data.phone) throw new Error('Campos obrigatórios');
      title = 'Presenças';
      headers = ['Data', 'Convidado 1', 'Convidado 2', 'Demais convidados', 'Telefone'];
      row = [new Date(), clean(data.names[0],150), clean(data.names[1],150), clean(data.names.slice(2).join(' | '),3000), clean(data.phone,22)];
    } else {
      if (!String(data.name||'').trim() || !String(data.message||'').trim()) throw new Error('Campos obrigatórios');
      title = 'Mensagens'; headers = ['Data', 'Nome', 'Mensagem'];
      row = [new Date(), clean(data.name,150), clean(data.message,3000)];
    }
    lock.waitLock(15000);
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = spreadsheet.getSheetByName(title) || spreadsheet.insertSheet(title);
    if (!sheet.getLastRow()) sheet.appendRow(headers);
    sheet.appendRow(row);
    return ContentService.createTextOutput(JSON.stringify({ok:true})).setMimeType(ContentService.MimeType.JSON);
  } catch(error) {
    return ContentService.createTextOutput(JSON.stringify({ok:false,error:'Não foi possível salvar.'})).setMimeType(ContentService.MimeType.JSON);
  } finally { if (lock.hasLock()) lock.releaseLock(); }
}
