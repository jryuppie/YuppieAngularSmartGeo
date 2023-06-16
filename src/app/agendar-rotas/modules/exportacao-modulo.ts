import { gerarDataHoraString } from './utilidade-modulo';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
const headerCSV: any[] = ['SequenciaOriginal', 'NomeFuncionario', 'PartidaDestino', 'Latitude', 'Longitude', 'Cidade', 'Estado', 'CEP', 'SequenciaOtimizada', 'DataHoraConsulta'];

export function criarVariavelExportacao(rotasImportadas: any, listaPontos: any) {
    let rotasParaExport: any[] = []
    //CRIAR A LOGICA PARA REDUZIR A LISTA APENAS A LISTA DE PONTOS CAPTURADOS
    for (let index = 0; index < rotasImportadas.length; index++) {
        const element = rotasImportadas[index];
        element.SequenciaOriginal = index
        for (let index = 0; index < listaPontos.length; index++) {
            const ponto = listaPontos[index];
            let cepTratado = ponto.a.replace(/[^0-9]/g, '')!
            if (cepTratado === element.CEP && !rotasParaExport.some((pt: any) => pt.SequenciaOriginal === element.SequenciaOriginal)) {
                element.DataHoraConsulta = gerarDataHoraString();
                element.SequenciaOtimizada = ponto.d;
                rotasParaExport.push(element);
            }
        }
    }
    let destinoPonto = { ...rotasParaExport[0] }
    destinoPonto.SequenciaOtimizada = (rotasParaExport.length + 1).toString()
    rotasParaExport.unshift(destinoPonto)  
    return rotasParaExport;
}


export function exportarRotaModule(rotasParaExport: any) {
    let ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(rotasParaExport, { header: headerCSV, skipHeader: false });
    let wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Rotas');
    const nomeArquivo = `LuksMove_Rotas_${gerarDataHoraString()}.csv`;
    XLSX.writeFile(wb, nomeArquivo, { bookType: 'csv' });
}

