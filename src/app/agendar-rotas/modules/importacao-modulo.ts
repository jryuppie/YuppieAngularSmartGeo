import { csvRotas, Localizacao, RotasMaps } from '../../models/csvRotas';

const headerCSV: any[] = ['SequenciaOriginal', 'NomeFuncionario', 'PartidaDestino', 'Latitude', 'Longitude', 'Cidade', 'Estado', 'CEP', 'SequenciaOtimizada', 'DataHoraConsulta'];
//#region <Manipulacao do arquivo importado>
export async function importarArquivoSelecionado(event: Event, parsedData: any, papa: any): Promise<any> {
  let rotasImportadas: any[] = [];
  let rotasMapa = new RotasMaps();
  let valorFileText = undefined;
  let fileName = '';
  let exibirRotas: Boolean = false
  let objetoRetorno = {
    rotasImportadas,
    rotasMapa,
    exibirRotas
  }
  const result = (event.target as HTMLInputElement).files;

  if (result != null) {
    const file: File = result[0];
    if (file) {
      fileName = file.name;
      let fileReader = new FileReader();
      fileReader.onload = (e) => {
        const csv = fileReader.result;
        if (typeof csv === 'string') {
          parsedData = papa.parse(csv, {
            header: true
          }).data;
          if (parsedData.length > 0)
            removerCampos(parsedData)
          rotasImportadas = [...parsedData]
          if (rotasImportadas.length > 0) {
            objetoRetorno.rotasImportadas = rotasImportadas
            objetoRetorno.exibirRotas = true
          }
        }
      }
      fileReader.readAsText(file);
     return await new Promise(resolve => {
        fileReader.onloadend = () => {
          resolve(objetoRetorno)          
        }
      });     
    }
  } 
}





export function removerCampos(data: any) {
  data.forEach((linha: { [x: string]: any; }) => {
    for (const property in linha) {
      if (!headerCSV.includes(property))
        delete linha[property]
    }
    return linha
  });
}


export function leituraArquivoRotas(reader: FileReader, rotasImportadas: any, ambienteProd: boolean) {
  let exibirRotas: Boolean = false
  let objetoRetorno = {
    rotasImportadas,
    exibirRotas
  }
  try {
    let separador = ';'
    let csv: any = reader.result;
    let allTextLines = [];
    allTextLines = csv.split(/\r|\n|\r/);

    //header tabela
    let headers = allTextLines[0].split(separador);
    let data = headers;
    let tarr = [];
    for (let j = 0; j < headers.length; j++) {
      tarr.push(data[j]);
    }
    let tarrR = [];
    let arrl = allTextLines.length;
    let rows = [];
    for (let i = 1; i < arrl; i++) {
      if (allTextLines[i] != '') {
        let campos = allTextLines[i].split(separador)
        let rotaRow: csvRotas = {
          SequenciaOriginal: campos[0],
          NomeFuncionario: campos[1],
          // PartidaDestino: campos[2] === "SIM" ? true : false,
          PartidaDestino: campos[2] === "SIM" ? 'SIM' : 'NAO',
          Latitude: campos[3],
          Longitude: campos[4],
          Cidade: campos[5],
          Estado: campos[6],
          CEP: campos[7].length == 7 ? '0'.concat(campos[7]) : campos[7],
        };
        rotasImportadas?.push(rotaRow);

      }
    }
    if (rotasImportadas.length > 0) {
      //CHAMAR A FUNÇÃO DE MOSTRAR ROTAS NA TELA
      objetoRetorno.exibirRotas = true
    }
  }
  catch (e) {
    if (!ambienteProd) console.log(e)
    //   this.messageService.add({ sticky: true, severity: 'error', summary: 'Erro de leitura', detail: 'Erro na leiturado arquivo, verifique o modelo de importação' });
  }
}