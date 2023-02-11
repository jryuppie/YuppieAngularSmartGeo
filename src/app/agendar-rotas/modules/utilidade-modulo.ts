export function dividirLista(itens: any, maximo: any) {
    return itens.reduce((acumulador: any, item: any, indice: any) => {
      const grupo = Math.floor(indice / maximo);
      acumulador[grupo] = [...(acumulador[grupo] || []), item];
      return acumulador;
    }, []);
  };

  export function gerarDataHoraString() {
    let dataAtual = new Date()
    let datahora = dataAtual.toLocaleDateString();
    let horario = dataAtual.getHours() + ":" + dataAtual.getMinutes() + ":" + dataAtual.getSeconds();
    return datahora + ' ' + horario
  }

