import * as dotenv from 'dotenv';
dotenv.config();
const veriphone_api_key = process.env.VERIPHONE_API;


const resultado = document.getElementById('resultado');
const countrySelect = document.getElementById('country-select');
const typeSelect = document.getElementById('type-select')
const geraAleButton = document.getElementById('gerar-ale');
const telefone = document.getElementById('telefone');
const getVerifica = document.getElementById('verificar-num');

function url(api_key, telefone) {
    return `https://api.veriphone.io/v2/verify?phone=${encodeURIComponent(telefone)}&key=${api_key}`;
}
function urlAleatorio(api_key, type, country) {
    return `https://api.veriphone.io/v2/example?type=${type}&country_code=${country}&key=${api_key}`;
}

async function getNumber(telefone) {

    try {
        const response = await fetch(url(veriphone_api_key, telefone));
        if (!response.ok) { // Status 200-299: Sucesso
            let errorMessage = `Erro HTTP ${response.status}: ${response.statusText}`;
            if (response.status === 400) errorMessage = "Erro 400: Requisição Inválida.";
            else if (response.status === 401) errorMessage = "Erro 401: Não Autorizado. Chave de API inválida.";
            else if (response.status === 402) errorMessage = "Erro 402: Pagamento Necessário. Créditos insuficientes.";
            else if (response.status === 403) errorMessage = "Erro 403: Proibido. Acesso negado.";
            else if (response.status === 500) errorMessage = "Erro 500: Erro no Servidor Veriphone.";
            throw new Error(errorMessage);
        }
        const data = await response.json();
        resultado.prepend(createMapTelefone(data));

    } catch (error) {
        alert(`Ocorreu um erro ao verificar o número: ${error.message}`);
    }
}

async function numAleatorio(type, country) {
    fetch(urlAleatorio(veriphone_api_key, type, country), {
        method: 'POST',//Para fazer o post, porém não passa mais nada.
    })
        .then(response => {
            if (!response.ok) { // Status 200-299: Sucesso
                let errorMessage = `Erro HTTP ${response.status}: ${response.statusText}`;
                if (response.status === 400) errorMessage = "Erro 400: Requisição Inválida.";
                else if (response.status === 401) errorMessage = "Erro 401: Não Autorizado. Chave de API inválida.";
                else if (response.status === 402) errorMessage = "Erro 402: Pagamento Necessário. Créditos insuficientes.";
                else if (response.status === 403) errorMessage = "Erro 403: Proibido. Acesso negado.";
                else if (response.status === 500) errorMessage = "Erro 500: Erro no Servidor Veriphone.";
                throw new Error(errorMessage);
            }
            return response.json();
        }
        )
        .then(data => {
            const div = document.createElement("div");
            const divPrefix = document.createElement("div");
            divPrefix.classList.add("prefix");
            const country_flag = document.createElement("img");
            const prefix = document.createElement("p");
            const local_number = document.createElement("p");
            const internacional_number = document.createElement("a");

            internacional_number.setAttribute("href", `tel:${data.international_number}`);
            internacional_number.textContent = `Tel: ${data.international_number}`
            prefix.textContent = `Prefixo: ${data.country_prefix} `;
            country_flag.src = `https://veriphone.io/svg/${data.country_code.toLowerCase()}.svg`;
            local_number.textContent = `Número local: ${data.local_number}`;

            div.appendChild(internacional_number);
            divPrefix.appendChild(prefix);
            divPrefix.appendChild(country_flag);
            divPrefix.appendChild(local_number);
            div.appendChild(divPrefix);
            div.classList.add("card");
            resultado.prepend(div);
        });
}

function createMapTelefone(tel) {
    const div = document.createElement("div");
    const divFlag = document.createElement("div");
    divFlag.classList.add("flag")
    const phone = document.createElement("a");
    const tipo = document.createElement("p");
    const region = document.createElement("p");
    const country = document.createElement("p");
    const flag = document.createElement("img");
    const internation_number = document.createElement("p");
    const local_number = document.createElement("p");
    const carrier = document.createElement("p");

    phone.setAttribute("href", `tel:${tel.phone}`);
    phone.textContent = tel.phone;
    tipo.innerText = `Tipo: ${tel.phone_type}`;
    region.innerText = `Região: ${tel.phone_region}, `;
    country.innerText = `${tel.country} `;
    flag.src = `https://veriphone.io/svg/${tel.country_code.toLowerCase()}.svg`;
    flag.alt = `${tel.country}`;
    internation_number.innerText = `Número Internacional: ${tel.international_number}`;
    local_number.innerText = `Número Local: ${tel.local_number}`;
    carrier.innerText = `Operadora: ${tel.carrier}`;

    div.appendChild(phone);
    div.appendChild(tipo);
    div.appendChild(region);
    divFlag.appendChild(region);
    divFlag.appendChild(country)
    divFlag.appendChild(flag);
    div.appendChild(divFlag);
    div.appendChild(internation_number);
    div.appendChild(local_number);
    div.appendChild(carrier);
    div.classList.add("card");

    return div;
}

function popularSelect(list, selectElement) {
    list.forEach(list => {
        const option = document.createElement("option");
        option.value = list.value;
        option.textContent = list.name;
        selectElement.appendChild(option);
    });
}
if (geraAleButton) {
    geraAleButton.addEventListener('click', (e) => {
        e.preventDefault();

        const selectedCoutryCode = countrySelect.value;
        const selectType = typeSelect.value;

        if (!selectType && !selectedCoutryCode) {
            alert("Selecione um pais e um tipo de telefone para gerar.");
            return;
        } else if (!selectedCoutryCode) {
            alert("Selecione um país para gerar um número aleatório.");
            return;
        } else if (!selectType) {
            alert("Selecione um tipo de telefone para gerar um numero!");
            return;
        }

        numAleatorio(selectType, selectedCoutryCode);
    });
}

if (getVerifica) {
    getVerifica.addEventListener('click', (e) => {
        e.preventDefault();

        const inputTel = telefone.value;

        if (!inputTel) {
            alert = "Insira um numero de telefone válido!";
            return;
        }
        getNumber(inputTel);
    });
}

const countries = [
    { "name": "Afeganistão", "value": "AF" },
    { "name": "África do Sul", "value": "ZA" },
    { "name": "Albânia", "value": "AL" },
    { "name": "Alemanha", "value": "DE" },
    { "name": "Samoa Americana", "value": "AS" },
    { "name": "Andorra", "value": "AD" },
    { "name": "Angola", "value": "AO" },
    { "name": "Anguilla", "value": "AI" },
    { "name": "Antártida", "value": "AQ" },
    { "name": "Antígua e Barbuda", "value": "AG" },
    { "name": "Arábia Saudita", "value": "SA" },
    { "name": "Argélia", "value": "DZ" },
    { "name": "Argentina", "value": "AR" },
    { "name": "Armênia", "value": "AM" },
    { "name": "Aruba", "value": "AW" },
    { "name": "Austrália", "value": "AU" },
    { "name": "Áustria", "value": "AT" },
    { "name": "Azerbaijão", "value": "AZ" },
    { "name": "Bahamas", "value": "BS" },
    { "name": "Bahrein", "value": "BH" },
    { "name": "Bangladesh", "value": "BD" },
    { "name": "Barbados", "value": "BB" },
    { "name": "Países Baixos Caribenhos", "value": "BQ" },
    { "name": "Bélgica", "value": "BE" },
    { "name": "Belize", "value": "BZ" },
    { "name": "Bielorrússia", "value": "BY" },
    { "name": "Benin", "value": "BJ" },
    { "name": "Bermudas", "value": "BM" },
    { "name": "Butão", "value": "BT" },
    { "name": "Bolívia", "value": "BO" },
    { "name": "Bósnia", "value": "BA" },
    { "name": "Botsuana", "value": "BW" },
    { "name": "Ilha Bouvet", "value": "BV" },
    { "name": "Brasil", "value": "BR" },
    { "name": "Congo - Brazzaville", "value": "CG" },
    { "name": "Território Britânico do Oceano Índico", "value": "IO" },
    { "name": "Ilhas Virgens Britânicas", "value": "VG" },
    { "name": "Brunei", "value": "BN" },
    { "name": "Bulgária", "value": "BG" },
    { "name": "Burkina Faso", "value": "BF" },
    { "name": "Burundi", "value": "BI" },
    { "name": "Cabo Verde", "value": "CV" },
    { "name": "Camboja", "value": "KH" },
    { "name": "Camarões", "value": "CM" },
    { "name": "Canadá", "value": "CA" },
    { "name": "Ilhas Cayman", "value": "KY" },
    { "name": "República Centro-Africana", "value": "CF" },
    { "name": "Chade", "value": "TD" },
    { "name": "Chéquia", "value": "CZ" },
    { "name": "Chile", "value": "CL" },
    { "name": "China", "value": "CN" },
    { "name": "Chipre", "value": "CY" },
    { "name": "Ilha Christmas", "value": "CX" },
    { "name": "Ilhas Cocos (Keeling)", "value": "CC" },
    { "name": "Colômbia", "value": "CO" },
    { "name": "Comores", "value": "KM" },
    { "name": "Congo - Kinshasa", "value": "CD" },
    { "name": "Ilhas Cook", "value": "CK" },
    { "name": "Coreia do Norte", "value": "KP" },
    { "name": "Coreia do Sul", "value": "KR" },
    { "name": "Costa do Marfim", "value": "CI" },
    { "name": "Costa Rica", "value": "CR" },
    { "name": "Croácia", "value": "HR" },
    { "name": "Cuba", "value": "CU" },
    { "name": "Curaçao", "value": "CW" },
    { "name": "Dinamarca", "value": "DK" },
    { "name": "Djibouti", "value": "DJ" },
    { "name": "Dominica", "value": "DM" },
    { "name": "República Dominicana", "value": "DO" },
    { "name": "Egito", "value": "EG" },
    { "name": "Guiné Equatorial", "value": "GQ" },
    { "name": "Equador", "value": "EC" },
    { "name": "El Salvador", "value": "SV" },
    { "name": "Emirados Árabes Unidos", "value": "AE" },
    { "name": "Eritreia", "value": "ER" },
    { "name": "Eslováquia", "value": "SK" },
    { "name": "Eslovênia", "value": "SI" },
    { "name": "Espanha", "value": "ES" },
    { "name": "Estados Unidos", "value": "US" },
    { "name": "Estônia", "value": "EE" },
    { "name": "Etiópia", "value": "ET" },
    { "name": "Ilhas Falkland", "value": "FK" },
    { "name": "Ilhas Faroe", "value": "FO" },
    { "name": "Fiji", "value": "FJ" },
    { "name": "Filipinas", "value": "PH" },
    { "name": "Finlândia", "value": "FI" },
    { "name": "França", "value": "FR" },
    { "name": "Gabão", "value": "GA" },
    { "name": "Gâmbia", "value": "GM" },
    { "name": "Gana", "value": "GH" },
    { "name": "Geórgia", "value": "GE" },
    { "name": "Geórgia do Sul e Ilhas Sandwich do Sul", "value": "GS" },
    { "name": "Gibraltar", "value": "GI" },
    { "name": "Granada", "value": "GD" },
    { "name": "Grécia", "value": "GR" },
    { "name": "Groenlândia", "value": "GL" },
    { "name": "Guadalupe", "value": "GP" },
    { "name": "Guam", "value": "GU" },
    { "name": "Guatemala", "value": "GT" },
    { "name": "Guernsey", "value": "GG" },
    { "name": "Guiana", "value": "GY" },
    { "name": "Guiana Francesa", "value": "GF" },
    { "name": "Guiné", "value": "GN" },
    { "name": "Guiné-Bissau", "value": "GW" },
    { "name": "Haiti", "value": "HT" },
    { "name": "Ilhas Heard e McDonald", "value": "HM" },
    { "name": "Honduras", "value": "HN" },
    { "name": "Hong Kong", "value": "HK" },
    { "name": "Hungria", "value": "HU" },
    { "name": "Iêmen", "value": "YE" },
    { "name": "Ilha de Man", "value": "IM" },
    { "name": "Índia", "value": "IN" },
    { "name": "Indonésia", "value": "ID" },
    { "name": "Irã", "value": "IR" },
    { "name": "Iraque", "value": "IQ" },
    { "name": "Irlanda", "value": "IE" },
    { "name": "Islândia", "value": "IS" },
    { "name": "Israel", "value": "IL" },
    { "name": "Itália", "value": "IT" },
    { "name": "Jamaica", "value": "JM" },
    { "name": "Japão", "value": "JP" },
    { "name": "Jersey", "value": "JE" },
    { "name": "Jordânia", "value": "JO" },
    { "name": "Cazaquistão", "value": "KZ" },
    { "name": "Quênia", "value": "KE" },
    { "name": "Quirguistão", "value": "KG" },
    { "name": "Kiribati", "value": "KI" },
    { "name": "Kuwait", "value": "KW" },
    { "name": "Laos", "value": "LA" },
    { "name": "Lesoto", "value": "LS" },
    { "name": "Letônia", "value": "LV" },
    { "name": "Líbano", "value": "LB" },
    { "name": "Libéria", "value": "LR" },
    { "name": "Líbia", "value": "LY" },
    { "name": "Liechtenstein", "value": "LI" },
    { "name": "Lituânia", "value": "LT" },
    { "name": "Luxemburgo", "value": "LU" },
    { "name": "Macau", "value": "MO" },
    { "name": "Macedônia", "value": "MK" },
    { "name": "Madagascar", "value": "MG" },
    { "name": "Malásia", "value": "MY" },
    { "name": "Malawi", "value": "MW" },
    { "name": "Maldivas", "value": "MV" },
    { "name": "Mali", "value": "ML" },
    { "name": "Malta", "value": "MT" },
    { "name": "Ilhas Marianas do Norte", "value": "MP" },
    { "name": "Ilhas Marshall", "value": "MH" },
    { "name": "Martinica", "value": "MQ" },
    { "name": "Marrocos", "value": "MA" },
    { "name": "Maurício", "value": "MU" },
    { "name": "Mauritânia", "value": "MR" },
    { "name": "Mayotte", "value": "YT" },
    { "name": "México", "value": "MX" },
    { "name": "Micronésia", "value": "FM" },
    { "name": "Mianmar", "value": "MM" },
    { "name": "Moldávia", "value": "MD" },
    { "name": "Mônaco", "value": "MC" },
    { "name": "Mongólia", "value": "MN" },
    { "name": "Montenegro", "value": "ME" },
    { "name": "Montserrat", "value": "MS" },
    { "name": "Moçambique", "value": "MZ" },
    { "name": "Namíbia", "value": "NA" },
    { "name": "Nauru", "value": "NR" },
    { "name": "Nepal", "value": "NP" },
    { "name": "Nicarágua", "value": "NI" },
    { "name": "Níger", "value": "NE" },
    { "name": "Nigéria", "value": "NG" },
    { "name": "Niue", "value": "NU" },
    { "name": "Ilha Norfolk", "value": "NF" },
    { "name": "Noruega", "value": "NO" },
    { "name": "Nova Caledônia", "value": "NC" },
    { "name": "Nova Zelândia", "value": "NZ" },
    { "name": "Omã", "value": "OM" },
    { "name": "Países Baixos", "value": "NL" },
    { "name": "Paquistão", "value": "PK" },
    { "name": "Palau", "value": "PW" },
    { "name": "Palestina", "value": "PS" },
    { "name": "Panamá", "value": "PA" },
    { "name": "Papua Nova Guiné", "value": "PG" },
    { "name": "Paraguai", "value": "PY" },
    { "name": "Peru", "value": "PE" },
    { "name": "Ilhas Pitcairn", "value": "PN" },
    { "name": "Polinésia Francesa", "value": "PF" },
    { "name": "Polônia", "value": "PL" },
    { "name": "Portugal", "value": "PT" },
    { "name": "Porto Rico", "value": "PR" },
    { "name": "Catar", "value": "QA" },
    { "name": "Quirguistão", "value": "KG" },
    { "name": "Reino Unido", "value": "GB" },
    { "name": "Reunião", "value": "RE" },
    { "name": "República Dominicana", "value": "DO" },
    { "name": "Romênia", "value": "RO" },
    { "name": "Ruanda", "value": "RW" },
    { "name": "Rússia", "value": "RU" },
    { "name": "São Bartolomeu", "value": "BL" },
    { "name": "Santa Helena", "value": "SH" },
    { "name": "Santa Lúcia", "value": "LC" },
    { "name": "San Marino", "value": "SM" },
    { "name": "São Martinho", "value": "MF" },
    { "name": "São Martinho", "value": "SX" },
    { "name": "São Pedro e Miquelão", "value": "PM" },
    { "name": "São Tomé e Príncipe", "value": "ST" },
    { "name": "São Vicente e Granadinas", "value": "VC" },
    { "name": "Samoa", "value": "WS" },
    { "name": "Seicheles", "value": "SC" },
    { "name": "Senegal", "value": "SN" },
    { "name": "Sérvia", "value": "RS" },
    { "name": "Serra Leoa", "value": "SL" },
    { "name": "Singapura", "value": "SG" },
    { "name": "Síria", "value": "SY" },
    { "name": "Somália", "value": "SO" },
    { "name": "Sri Lanka", "value": "LK" },
    { "name": "Sudão", "value": "SD" },
    { "name": "Sudão do Sul", "value": "SS" },
    { "name": "Suazilândia", "value": "SZ" },
    { "name": "Suécia", "value": "SE" },
    { "name": "Suíça", "value": "CH" },
    { "name": "Suriname", "value": "SR" },
    { "name": "Svalbard e Jan Mayen", "value": "SJ" },
    { "name": "Taiwan", "value": "TW" },
    { "name": "Tajiquistão", "value": "TJ" },
    { "name": "Tailândia", "value": "TH" },
    { "name": "Tanzânia", "value": "TZ" },
    { "name": "Terras Austrais e Antárticas Francesas", "value": "TF" },
    { "name": "Timor-Leste", "value": "TL" },
    { "name": "Togo", "value": "TG" },
    { "name": "Tokelau", "value": "TK" },
    { "name": "Tonga", "value": "TO" },
    { "name": "Trinidad e Tobago", "value": "TT" },
    { "name": "Tunísia", "value": "TN" },
    { "name": "Turcas e Caicos", "value": "TC" },
    { "name": "Turcomenistão", "value": "TM" },
    { "name": "Turquia", "value": "TR" },
    { "name": "Tuvalu", "value": "TV" },
    { "name": "Ucrânia", "value": "UA" },
    { "name": "Uganda", "value": "UG" },
    { "name": "Uruguai", "value": "UY" },
    { "name": "Uzbequistão", "value": "UZ" },
    { "name": "Vanuatu", "value": "VU" },
    { "name": "Cidade do Vaticano", "value": "VA" },
    { "name": "Venezuela", "value": "VE" },
    { "name": "Vietnã", "value": "VN" },
    { "name": "Ilhas Virgens Americanas", "value": "VI" },
    { "name": "Wallis e Futuna", "value": "WF" },
    { "name": "Zâmbia", "value": "ZM" },
    { "name": "Zimbábue", "value": "ZW" },
    { "name": "Ilhas Åland", "value": "AX" }
]

const types = [
    { name: 'Telefone fixo', value: 'fixed_line' },
    { name: 'Número de celular', value: 'mobile' },
    { name: 'Televendas', value: 'premium_rate' },
    { name: 'Número de ligação gratuita', value: 'toll_free' },
    { name: 'VoIP' },
];
if(countrySelect && typeSelect){
    popularSelect(countries, countrySelect);
    popularSelect(types, typeSelect);
}