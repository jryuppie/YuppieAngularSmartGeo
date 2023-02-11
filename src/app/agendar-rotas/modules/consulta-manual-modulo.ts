
//FUNÇÃO EM DESUSO
export function manipuladorCamposConsultaManual(input1: any, input2: any, input3: any, input4: any, input5: any, input6: any) {
    //OPÇÕES DE INICIALIZAÇÃO DO MAPS - GOOGLE MAPS PLACE
    var options = {
        componentRestrictions: { country: "BR" },
        fields: ["address_components"],
        strictBounds: true,
        types: ['(cities)']
    }

    //MANIPUALÇÃO DOS CAMPOS PARA AUTOCOMPLETE - GOOGLE MAPS PLACE
    input1 = document.getElementById("partida");
    if (input1 !== null) {
        var autocomplete1 = new google.maps.places.Autocomplete(input1, options);
    }

    input2 = document.getElementById("destino");
    if (input2 !== null) {
        var autocomplete1 = new google.maps.places.Autocomplete(input2, options);
    }
    input3 = document.getElementById("parada");
    if (input3 !== null) {
        var autocomplete1 = new google.maps.places.Autocomplete(input3, options);
    }

    input4 = document.getElementById("parada2");
    if (input4 !== null) {
        var autocomplete1 = new google.maps.places.Autocomplete(input4, options);
    }
    input5 = document.getElementById("parada3");
    if (input5 !== null) {
        var autocomplete1 = new google.maps.places.Autocomplete(input5, options);
    }
    input6 = document.getElementById("parada4");
    if (input6 !== null) {
        var autocomplete1 = new google.maps.places.Autocomplete(input6, options);
    }
    //FIM DE MANIPUALÇÃO DOS CAMPOS PARA CONSULTA MANUAL
}

export function adicionarParadaTela(isAdd: boolean, parada2show: boolean, parada3show: boolean, parada4show: boolean) {
    isAdd = true;
    if (parada2show === false) {
        parada2show = true;
        isAdd = false;
        return;
    }

    if (parada3show === false) {
        parada3show = true;
        isAdd = false;
        return;
    }

    if (parada4show === false) {
        parada4show = true;
        isAdd = false;
        return;
    }
    isAdd = false;
}